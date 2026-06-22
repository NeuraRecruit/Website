"use server";

import { createHash, randomInt } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { createSessionToken } from "@/lib/admin-session";
import { getTrustedIp } from "@/lib/request-ip";
import { sendAdminLoginCode } from "@/lib/email";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour

const CHALLENGE_COOKIE = "admin_login_challenge";
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CODE_ATTEMPTS = 5;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

// Constant-time string comparison to avoid timing attacks.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    redirect("/admin/login?error=config");
  }

  const ip = await getTrustedIp();
  const supabase = createSupabaseAdmin();

  // Per-IP lockout check (this only locks the attacker's own IP, not admins)
  const { data: existing } = await supabase
    .from("admin_login_attempts")
    .select("attempts, locked_until")
    .eq("ip", ip)
    .single();

  if (existing?.locked_until) {
    const lockedUntil = new Date(existing.locked_until).getTime();
    if (Date.now() < lockedUntil) {
      redirect(`/admin/login?error=locked&until=${lockedUntil}`);
    }
    // Lock has expired — reset the record
    await supabase.from("admin_login_attempts").delete().eq("ip", ip);
  }

  // Check password
  if (password !== adminPassword) {
    const currentAttempts = (existing?.locked_until ? 0 : (existing?.attempts ?? 0)) + 1;

    if (currentAttempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
      await supabase
        .from("admin_login_attempts")
        .upsert({ ip, attempts: currentAttempts, locked_until: lockedUntil });
      redirect(`/admin/login?error=locked&until=${new Date(lockedUntil).getTime()}`);
    }

    await supabase
      .from("admin_login_attempts")
      .upsert({ ip, attempts: currentAttempts, locked_until: null });

    const remaining = MAX_ATTEMPTS - currentAttempts;
    redirect(`/admin/login?error=1&remaining=${remaining}`);
  }

  // Correct password — clear attempt record, then issue an email code (step 2)
  await supabase.from("admin_login_attempts").delete().eq("ip", ip);

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  const { data: challenge, error: insertError } = await supabase
    .from("admin_login_codes")
    .insert({ code_hash: hashCode(code), expires_at: expiresAt })
    .select("id")
    .single();

  if (insertError || !challenge) {
    redirect("/admin/login?error=config");
  }

  await sendAdminLoginCode(code);

  const cookieStore = await cookies();
  cookieStore.set(CHALLENGE_COOKIE, challenge.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CODE_TTL_MS / 1000,
    path: "/",
  });

  redirect("/admin/login?step=code");
}

export async function verifyAdminCode(formData: FormData) {
  const code = (formData.get("code") as string | null)?.trim() ?? "";

  const cookieStore = await cookies();
  const challengeId = cookieStore.get(CHALLENGE_COOKIE)?.value;
  if (!challengeId) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseAdmin();
  const { data: row } = await supabase
    .from("admin_login_codes")
    .select("id, code_hash, attempts, expires_at")
    .eq("id", challengeId)
    .single();

  // Missing or expired — force a restart
  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    if (row) await supabase.from("admin_login_codes").delete().eq("id", row.id);
    cookieStore.delete(CHALLENGE_COOKIE);
    redirect("/admin/login?error=code_expired");
  }

  // Too many code attempts — invalidate and restart
  if (row.attempts >= MAX_CODE_ATTEMPTS) {
    await supabase.from("admin_login_codes").delete().eq("id", row.id);
    cookieStore.delete(CHALLENGE_COOKIE);
    redirect("/admin/login?error=code_expired");
  }

  // Verify code
  if (!timingSafeEqual(hashCode(code), row.code_hash)) {
    const nextAttempts = row.attempts + 1;
    await supabase
      .from("admin_login_codes")
      .update({ attempts: nextAttempts })
      .eq("id", row.id);
    const remaining = MAX_CODE_ATTEMPTS - nextAttempts;
    redirect(`/admin/login?step=code&error=code&remaining=${remaining}`);
  }

  // Valid — clean up and set the session
  await supabase.from("admin_login_codes").delete().eq("id", row.id);
  cookieStore.delete(CHALLENGE_COOKIE);

  const token = await createSessionToken();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  redirect("/admin");
}

export async function restartAdminLogin(_formData: FormData) {
  const cookieStore = await cookies();
  const challengeId = cookieStore.get(CHALLENGE_COOKIE)?.value;
  if (challengeId) {
    const supabase = createSupabaseAdmin();
    await supabase.from("admin_login_codes").delete().eq("id", challengeId);
  }
  cookieStore.delete(CHALLENGE_COOKIE);
  redirect("/admin/login");
}

export async function adminLogout(_formData: FormData) {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

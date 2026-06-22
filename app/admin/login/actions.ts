"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { createSessionToken } from "@/lib/admin-session";
import { getTrustedIp } from "@/lib/request-ip";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Global brute-force cap across all IPs (defends against distributed attacks)
const GLOBAL_KEY = "__global__";
const GLOBAL_MAX_ATTEMPTS = 20;
const GLOBAL_LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    redirect("/admin/login?error=config");
  }

  const ip = await getTrustedIp();
  const supabase = createSupabaseAdmin();

  // Check for existing per-IP and global lockouts
  const { data: existing } = await supabase
    .from("admin_login_attempts")
    .select("attempts, locked_until")
    .eq("ip", ip)
    .single();

  const { data: globalRow } = await supabase
    .from("admin_login_attempts")
    .select("attempts, locked_until")
    .eq("ip", GLOBAL_KEY)
    .single();

  // Global cooldown takes precedence
  if (globalRow?.locked_until) {
    const globalLockedUntil = new Date(globalRow.locked_until).getTime();
    if (Date.now() < globalLockedUntil) {
      redirect(`/admin/login?error=locked&until=${globalLockedUntil}`);
    }
    await supabase.from("admin_login_attempts").delete().eq("ip", GLOBAL_KEY);
  }

  if (existing?.locked_until) {
    const lockedUntil = new Date(existing.locked_until).getTime();
    if (Date.now() < lockedUntil) {
      redirect(`/admin/login?error=locked&until=${lockedUntil}`);
    }
    // Lock has expired — reset the record
    await supabase
      .from("admin_login_attempts")
      .delete()
      .eq("ip", ip);
  }

  // Check password
  if (password !== adminPassword) {
    // Increment global failure counter
    const globalAttempts = (globalRow?.locked_until ? 0 : (globalRow?.attempts ?? 0)) + 1;
    if (globalAttempts >= GLOBAL_MAX_ATTEMPTS) {
      const globalLockedUntil = new Date(Date.now() + GLOBAL_LOCKOUT_DURATION_MS).toISOString();
      await supabase
        .from("admin_login_attempts")
        .upsert({ ip: GLOBAL_KEY, attempts: globalAttempts, locked_until: globalLockedUntil });
      redirect(`/admin/login?error=locked&until=${new Date(globalLockedUntil).getTime()}`);
    }
    await supabase
      .from("admin_login_attempts")
      .upsert({ ip: GLOBAL_KEY, attempts: globalAttempts, locked_until: null });

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

  // Correct password — clear per-IP and global counters, then set session
  await supabase.from("admin_login_attempts").delete().eq("ip", ip);
  await supabase.from("admin_login_attempts").delete().eq("ip", GLOBAL_KEY);

  const cookieStore = await cookies();
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

export async function adminLogout(_formData: FormData) {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

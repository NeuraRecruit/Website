"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    redirect("/admin/login?error=config");
  }

  const ip = await getClientIp();
  const supabase = createSupabaseAdmin();

  // Check for existing lockout
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
    await supabase
      .from("admin_login_attempts")
      .delete()
      .eq("ip", ip);
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

  // Correct password — clear any attempt record and set session
  await supabase
    .from("admin_login_attempts")
    .delete()
    .eq("ip", ip);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionSecret, {
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

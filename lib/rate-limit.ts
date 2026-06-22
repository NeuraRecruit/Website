import { createSupabaseAdmin } from "@/lib/supabase/server";

// Durable, fixed-window rate limiter backed by the `rate_limits` table.
// Shared across serverless instances (unlike an in-memory Map). Returns true
// when the caller is over the limit and should be blocked.
export async function isRateLimited(
  key: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const now = Date.now();

  const { data: row } = await supabase
    .from("rate_limits")
    .select("count, window_start")
    .eq("key", key)
    .single();

  // No record yet, or the window has expired — start a fresh window.
  if (!row || now - new Date(row.window_start).getTime() > windowMs) {
    await supabase
      .from("rate_limits")
      .upsert({ key, count: 1, window_start: new Date(now).toISOString() });
    return false;
  }

  const nextCount = row.count + 1;
  await supabase
    .from("rate_limits")
    .update({ count: nextCount })
    .eq("key", key);

  return nextCount > max;
}

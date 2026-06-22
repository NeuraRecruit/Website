import { headers } from "next/headers";

// Returns a trusted client IP. On Vercel, `x-real-ip` is set by the platform
// and is not client-controllable. `x-forwarded-for` can contain attacker-
// supplied entries on the left, so we only fall back to its LAST entry (the
// hop appended by the trusted proxy) rather than the leftmost value.
export async function getTrustedIp(): Promise<string> {
  const h = await headers();

  const realIp = h.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return "unknown";
}

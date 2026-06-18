import { adminLogin } from "./actions";

export const metadata = { title: "Admin Login — Neura Recruitment" };

function formatMinutes(ms: number): string {
  const totalMins = Math.ceil(ms / 1000 / 60);
  if (totalMins >= 60) return "1 hour";
  return `${totalMins} minute${totalMins !== 1 ? "s" : ""}`;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; remaining?: string; until?: string }>;
}) {
  const params = await searchParams;
  const { error, remaining, until } = params;

  const isLocked = error === "locked";
  const isWrongPassword = error === "1";
  const remainingAttempts = remaining ? parseInt(remaining, 10) : null;
  const lockedUntilMs = until ? parseInt(until, 10) : null;
  const lockTimeLeft =
    lockedUntilMs && lockedUntilMs > Date.now()
      ? lockedUntilMs - Date.now()
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Neura Recruitment
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-light">Admin access</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your admin password to continue.
        </p>

        <form action={adminLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-light"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={isLocked}
              className="mt-1.5 block w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text-light placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {isWrongPassword && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              Incorrect password.{" "}
              {remainingAttempts !== null && remainingAttempts > 0 ? (
                <>
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
                  before your account is locked for 1 hour.
                </>
              ) : (
                "Please try again."
              )}
            </p>
          )}

          {isLocked && lockTimeLeft && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Too many failed attempts. Try again in{" "}
              <span className="font-semibold">{formatMinutes(lockTimeLeft)}</span>.
            </p>
          )}

          {isLocked && !lockTimeLeft && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Your account was temporarily locked. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isLocked && !!lockTimeLeft}
            className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

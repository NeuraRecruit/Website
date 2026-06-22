import { adminLogin, verifyAdminCode, restartAdminLogin } from "./actions";

export const metadata = { title: "Admin Login — Neura Recruitment" };

function formatMinutes(ms: number): string {
  const totalMins = Math.ceil(ms / 1000 / 60);
  if (totalMins >= 60) return "1 hour";
  return `${totalMins} minute${totalMins !== 1 ? "s" : ""}`;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    step?: string;
    error?: string;
    remaining?: string;
    until?: string;
  }>;
}) {
  const params = await searchParams;
  const { step, error, remaining, until } = params;

  const isCodeStep = step === "code";
  const isLocked = error === "locked";
  const isWrongPassword = error === "1";
  const isWrongCode = error === "code";
  const isCodeExpired = error === "code_expired";
  const isConfigError = error === "config";
  const remainingAttempts = remaining ? parseInt(remaining, 10) : null;
  const lockedUntilMs = until ? parseInt(until, 10) : null;
  const lockTimeLeft =
    lockedUntilMs && lockedUntilMs > Date.now() ? lockedUntilMs - Date.now() : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Neura Recruitment
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-light">Admin access</h1>

        {isConfigError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Login is not configured. Please contact the site administrator.
          </p>
        )}

        {isCodeStep ? (
          <>
            <p className="mt-2 text-sm text-text-secondary">
              We&apos;ve emailed a 6-digit code to your team inbox. Enter it below to finish
              signing in. It expires in 10 minutes.
            </p>

            <form action={verifyAdminCode} className="mt-6 space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-text-light">
                  Login code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  className="mt-1.5 block w-full rounded-lg border border-border bg-white px-4 py-3 text-center text-lg tracking-[0.4em] text-text-light placeholder:tracking-normal placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="000000"
                />
              </div>

              {isWrongCode && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  Incorrect code.{" "}
                  {remainingAttempts !== null && remainingAttempts > 0
                    ? `${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`
                    : "Please request a new code."}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition-all hover:bg-accent/90"
              >
                Verify &amp; sign in
              </button>
            </form>

            <form action={restartAdminLogin} className="mt-3">
              <button
                type="submit"
                className="w-full text-center text-sm text-text-secondary transition-colors hover:text-text-light"
              >
                Start over
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-text-secondary">
              Enter your admin password to continue.
            </p>

            {isCodeExpired && (
              <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                That code expired or was entered incorrectly too many times. Please sign in again.
              </p>
            )}

            <form action={adminLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-light">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  disabled={isLocked && !!lockTimeLeft}
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
                Continue
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

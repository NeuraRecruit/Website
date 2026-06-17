import { adminLogin } from "./actions";

export const metadata = { title: "Admin Login — Neura Recruitment" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

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
              className="mt-1.5 block w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text-light placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="••••••••"
            />
          </div>

          {hasError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition-all hover:bg-accent/90"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

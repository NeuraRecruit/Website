const MIN_ELAPSED_MS = 3000;

export function checkSpam(formData: FormData): boolean {
  // Honeypot — bots fill hidden fields humans never see
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).trim().length > 0) return true;

  // Timing — bots submit instantly; require at least 3 seconds
  const loadedAt = Number(formData.get("form_loaded_at"));
  if (loadedAt && Date.now() - loadedAt < MIN_ELAPSED_MS) return true;

  return false;
}

import { resolveMx } from "dns/promises";

/**
 * Common disposable / temporary email domains.
 * Keep this list focused on high-signal providers — not every obscure domain.
 */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.de",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "throwaway.email",
  "yopmail.com",
  "yopmail.fr",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "spam4.me",
  "trashmail.com",
  "trashmail.me",
  "trashmail.net",
  "dispostable.com",
  "maildrop.cc",
  "getnada.com",
  "nada.email",
  "emailondeck.com",
  "fakeinbox.com",
  "mailnesia.com",
  "tempail.com",
  "mohmal.com",
  "discard.email",
  "discardmail.com",
  "mailcatch.com",
  "mailnull.com",
  "spamgourmet.com",
  "mintemail.com",
  "mytemp.email",
  "tmpmail.org",
  "tmpmail.net",
  "tempinbox.com",
  "burnermail.io",
  "mail.tm",
  "inboxkitten.com",
  "tempmailo.com",
  "emailfake.com",
  "crazymailing.com",
  "mailforspam.com",
]);

function getEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  return email.slice(at + 1).trim().toLowerCase();
}

export function isDisposableEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Returns true if the domain has MX records (can receive mail).
 * Transient DNS failures fail open so real users are not blocked by network blips.
 */
export async function hasMxRecords(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    // Domain missing / no MX → reject
    if (
      code === "ENOTFOUND" ||
      code === "ENODATA" ||
      code === "ESERVFAIL" ||
      code === "EREFUSED"
    ) {
      return false;
    }

    // Timeout / unexpected DNS issues → allow
    return true;
  }
}

/**
 * Validates that an email is not disposable and its domain can receive mail.
 * Returns a user-facing error message, or null if the email looks acceptable.
 */
export async function validateEmailDeliverability(
  email: string
): Promise<string | null> {
  const normalised = email.trim().toLowerCase();
  const domain = getEmailDomain(normalised);

  if (!domain) {
    return "Please enter a valid email address.";
  }

  if (isDisposableEmail(normalised)) {
    return "Please use a permanent email address, not a temporary one.";
  }

  const canReceiveMail = await hasMxRecords(domain);
  if (!canReceiveMail) {
    return "This email domain does not appear to accept mail. Please check and try again.";
  }

  return null;
}

import Link from "next/link";
import { CONTACT, NAV_LINKS, SITE_NAME, SOCIALS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 text-center lg:mb-12">
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-tight text-text-light"
          >
            Neura
          </Link>
          <p className="mt-4 text-sm text-text-secondary">
            Building the teams that build the future. Premium recruitment across the UK.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-light sm:text-sm">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 sm:space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-text-secondary transition-colors hover:text-text-light sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-light sm:text-sm">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-text-secondary sm:space-y-3 sm:text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all transition-colors hover:text-text-light"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>{CONTACT.address}</li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-right">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-light sm:text-sm">
              Social
            </h3>
            <ul className="mt-3 space-y-2 sm:space-y-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary transition-colors hover:text-text-light sm:text-sm"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-text-secondary">
            {SITE_NAME} Ltd. Company No. 17274084. Registered in England & Wales.
          </p>
          <p className="text-xs text-text-secondary">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

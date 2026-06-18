"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border bg-bg-primary/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Link href="/" className="shrink-0" style={{ marginLeft: "-12px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/neura-logo.png"
              alt="Neura Recruitment"
              style={{ height: "36px", width: "auto", display: "block" }}
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors hover:text-text-light",
                    pathname === link.href
                      ? "text-text-light"
                      : "text-text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button href="/apply" size="sm" className="hidden sm:inline-flex">
              Apply Now
            </Button>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-light lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="relative h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all",
                    mobileOpen ? "top-2 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-2 h-0.5 w-5 bg-current transition-all",
                    mobileOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-0.5 w-5 bg-current transition-all",
                    mobileOpen ? "top-2 -rotate-45" : "top-4"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg-primary/98 backdrop-blur-xl lg:hidden"
            style={{ paddingTop: "3.5rem" }}
          >
            <nav className="flex flex-col gap-2 px-6 py-8" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-4 py-4 text-lg font-medium",
                      pathname === link.href
                        ? "bg-accent/10 text-text-light"
                        : "text-text-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <Button href="/apply" className="w-full">
                  Apply Now
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

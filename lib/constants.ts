export const SITE_NAME = "Neura Recruitment";
export const SITE_TAGLINE = "Building the teams that build the future.";
export const SITE_DESCRIPTION =
  "A modern relationship-driven recruitment partner connecting professionals with exceptional opportunities in health & safety and construction across the UK.";

export const SPECIALISMS = "health & safety and construction recruitment";
export const SPECIALISMS_SHORT = "Health & Safety & Construction";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/blog", label: "Blog" },
  { href: "/employers", label: "Employers" },
  { href: "/candidates", label: "Candidates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const CONTACT = {
  email: "hello@neurarecruitment.com",
  phone: "+44 20 8059 6252",
  address: "London, United Kingdom",
};

export const FOUNDERS = {
  james: {
    name: "James Cox",
    phone: "0208 0596 252",
    phoneHref: "tel:+442080596252",
    linkedIn: "https://www.linkedin.com/in/jamescoxrecruitment",
  },
  deividas: {
    name: "Deividas Grigas",
    phone: "0208 0596 253",
    phoneHref: "tel:+442080596253",
    linkedIn: "https://www.linkedin.com/in/deividas-grigas-553225187",
  },
} as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/neura-recruitment/" },
  { label: "Instagram", href: "https://www.instagram.com/neurarecruitment" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/candidate-privacy", label: "Candidate Privacy" },
  { href: "/cookies", label: "Cookie Policy" },
] as const;

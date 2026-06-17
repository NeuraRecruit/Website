import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  CONTACT,
} from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neurarecruitment.com"),
  title: {
    default: `${SITE_NAME} | Construction Recruitment UK`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Construction Recruitment UK",
    "Construction Jobs UK",
    "Labourer Jobs",
    "Carpenter Jobs",
    "Construction Staffing",
    "Construction Recruitment Agency",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Construction Recruitment UK`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/hero-poster.webp", width: 1920, height: 1080, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Construction Recruitment UK`,
    description: SITE_DESCRIPTION,
    images: ["/images/hero-poster.webp"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://neurarecruitment.com",
      description: SITE_DESCRIPTION,
      email: CONTACT.email,
      telephone: CONTACT.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: "https://neurarecruitment.com",
      description: SITE_TAGLINE,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${interTight.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}

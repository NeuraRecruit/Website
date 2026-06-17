import type { Metadata } from "next";
import { JOBS } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Construction Jobs UK",
  description:
    "Browse construction job opportunities across the UK. Site managers, electricians, carpenters, engineers and more. Apply with Neura Recruitment.",
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: JOBS.map((job, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "JobPosting",
      title: job.role,
      hiringOrganization: {
        "@type": "Organization",
        name: "Neura Recruitment",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location,
          addressCountry: "GB",
        },
      },
    },
  })),
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {children}
    </>
  );
}

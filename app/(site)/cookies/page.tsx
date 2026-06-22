import type { Metadata } from "next";
import { CookiePolicyContent } from "@/content/legal/cookie-policy";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Neura Recruitment uses cookies on its website — what they are, why we use them, and how to manage them.",
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}

import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/content/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Neura Recruitment collects and uses your personal data when you visit our website or contact us.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}

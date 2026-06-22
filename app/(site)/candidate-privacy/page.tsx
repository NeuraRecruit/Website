import type { Metadata } from "next";
import { CandidatePrivacyPolicyContent } from "@/content/legal/candidate-privacy-policy";

export const metadata: Metadata = {
  title: "Candidate Privacy Policy",
  description:
    "How Neura Recruitment collects and uses personal data for job seekers, candidates, contractors and temporary workers.",
  robots: { index: true, follow: true },
};

export default function CandidatePrivacyPolicyPage() {
  return <CandidatePrivacyPolicyContent />;
}

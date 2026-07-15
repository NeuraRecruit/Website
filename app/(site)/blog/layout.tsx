import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical advice on health & safety and construction careers, qualifications, and hiring across the UK.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

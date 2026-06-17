export type PathType = "worker" | "client";

export const PATHS = [
  {
    type: "worker" as const,
    label: "Candidate",
    title: "I'm looking for work",
    description:
      "Apply for construction roles across the UK. Share your experience and we'll match you with the right opportunity.",
    cta: "Apply as a candidate",
  },
  {
    type: "client" as const,
    label: "Employer",
    title: "I'm hiring",
    description:
      "Tell us about your hiring needs. We'll connect you with skilled construction professionals quickly.",
    cta: "Enquire as an employer",
  },
] as const;

export function getPath(type: PathType) {
  return PATHS.find((p) => p.type === type)!;
}

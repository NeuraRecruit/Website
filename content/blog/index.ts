import type { ComponentType } from "react";
import { FtcVsDayRateContent } from "./ftc-vs-day-rate";
import { HealthSafetyCvGuideContent } from "./health-safety-cv-guide";
import { HealthSafetySalaryGuide2026Content } from "./health-safety-salary-guide-2026";
import { HireHseAdvisorContent } from "./hire-hse-advisor";
import { HseSkills2026Content } from "./hse-skills-2026";
import { InterviewPreparationContent } from "./interview-preparation";
import { InterviewQuestionsToAskContent } from "./interview-questions-to-ask";
import { NeboshVsIoshContent } from "./nebosh-vs-iosh";

export const BLOG_CONTENT: Record<string, ComponentType> = {
  "ftc-vs-day-rate": FtcVsDayRateContent,
  "health-safety-cv-guide": HealthSafetyCvGuideContent,
  "health-safety-salary-guide-2026": HealthSafetySalaryGuide2026Content,
  "hire-hse-advisor": HireHseAdvisorContent,
  "hse-skills-2026": HseSkills2026Content,
  "interview-preparation": InterviewPreparationContent,
  "interview-questions-to-ask": InterviewQuestionsToAskContent,
  "nebosh-vs-iosh": NeboshVsIoshContent,
};

export function getBlogContent(slug: string): ComponentType | undefined {
  return BLOG_CONTENT[slug];
}

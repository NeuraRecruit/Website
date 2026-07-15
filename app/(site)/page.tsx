import { Hero } from "@/components/home/Hero";
import { GetStarted } from "@/components/home/GetStarted";
import { TrustedAcrossConstruction } from "@/components/home/TrustedAcrossConstruction";
import { WhyNeura } from "@/components/home/WhyNeura";
import { CandidateJourney } from "@/components/home/CandidateJourney";
import { TypicalVacancies } from "@/components/home/TypicalVacancies";
import { FeaturedOpportunities } from "@/components/home/FeaturedOpportunities";
import { EmployerCTA } from "@/components/home/EmployerCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <GetStarted />
      <TrustedAcrossConstruction />
      <CandidateJourney />
      <WhyNeura />
      <EmployerCTA />
      <TypicalVacancies />
      <FeaturedOpportunities />
    </>
  );
}

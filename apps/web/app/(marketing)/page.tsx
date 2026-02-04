import {
  HeroSection,
  FactionWarsSection,
  YourStatsSection,
  CLISection,
  OpenSourceSection,
  FinalCTASection,
} from "./_components";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FactionWarsSection />
      <YourStatsSection />
      <CLISection />
      <OpenSourceSection />
      <FinalCTASection />
    </div>
  );
}

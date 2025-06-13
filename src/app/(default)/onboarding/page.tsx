import { OnboardingCarousel } from "@/components/onboarding/OnboardingCarousel";

export default function OnboardingPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <OnboardingCarousel />
    </div>
  );
}

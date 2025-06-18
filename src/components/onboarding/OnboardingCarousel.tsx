
"use client";
// This file is no longer used as the onboarding logic has been moved
// directly into src/app/(default)/onboarding/page.tsx.
// It can be safely deleted.

import * as React from "react";

export function OnboardingCarousel() {
  if (typeof window !== 'undefined') {
    console.warn("OnboardingCarousel.tsx is deprecated and can be removed. Onboarding logic is now in src/app/(default)/onboarding/page.tsx.");
  }
  return (
    <div>
      <p>Old Onboarding Carousel - This component is deprecated.</p>
    </div>
  );
}

    
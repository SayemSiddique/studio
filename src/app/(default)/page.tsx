
"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import MainLogo from '@/image/main_logo.png';


// SVG Icon Components (extracted for clarity, can be inlined or separate components)
const AllergenIcon = () => (
  <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-accent" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M11,7h2v6h-2V7z M11,15h2v2h-2V15z"/>
  </svg>
);

const NutritionIcon = () => (
  <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20,12c0,4.42-3.58,8-8,8s-8-3.58-8-8s3.58-8,8-8S20,7.58,20,12z M8.5,8C7.67,8,7,8.67,7,9.5 S7.67,11,8.5,11S10,10.33,10,9.5S9.33,8,8.5,8z M12,6c-0.83,0-1.5,0.67-1.5,1.5S11.17,9,12,9s1.5-0.67,1.5-1.5S12.83,6,12,6z M15.5,8C14.67,8,14,8.67,14,9.5s0.67,1.5,1.5,1.5S17,10.33,17,9.5S16.33,8,15.5,8z"/>
  </svg>
);

const WarningsIcon = () => (
  <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"/>
  </svg>
);


export default function SplashScreen() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress bar animation is 3s via CSS in tailwind.config.js
    // Start fade out after 3s, then navigate after 0.5s fade
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    const navigationTimer = setTimeout(() => {
      router.push('/onboarding');
    }, 3500); // Total 3.5s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigationTimer);
    }
  }, [router]);

  return (
    <div className="splash-background min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className={cn(
          "text-center max-w-md mx-auto transition-opacity duration-500 ease-in-out",
          fadeOut ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Logo */}
        <div className="mb-8 sm:mb-12 animate-fadeIn [animation-delay:0.5s]">
            <Image 
              src={MainLogo} 
              alt="Safora Logo" 
              width={96} 
              height={96} 
              className="mx-auto h-20 w-20 sm:h-24 sm:w-24 object-contain"
              priority // Preload logo image
            />
        </div>

        {/* Tagline */}
        <div className="text-center mb-8 sm:mb-12 animate-fadeIn [animation-delay:1s]">
          <p className="text-primary text-lg sm:text-xl font-medium">Know what's in your food</p>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">Scan • Analyze • Eat Smart</p>
        </div>

        {/* Food Icons */}
        <div className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8 mb-8 sm:mb-12">
          <div className="flex flex-col items-center animate-fadeIn [animation-delay:1.2s]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-full flex items-center justify-center shadow-lg border border-primary/10">
              <AllergenIcon />
            </div>
            <p className="text-xs text-center mt-2 text-foreground/80 font-medium">Allergens</p>
          </div>
          <div className="flex flex-col items-center animate-fadeIn [animation-delay:1.4s]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-full flex items-center justify-center shadow-lg border border-primary/10">
              <NutritionIcon />
            </div>
            <p className="text-xs text-center mt-2 text-foreground/80 font-medium">Nutrition</p>
          </div>
          <div className="flex flex-col items-center animate-fadeIn [animation-delay:1.6s]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-full flex items-center justify-center shadow-lg border border-primary/10">
              <WarningsIcon />
            </div>
            <p className="text-xs text-center mt-2 text-foreground/80 font-medium">Warnings</p>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 max-w-[90%] sm:w-72 bg-muted rounded-full h-3 overflow-hidden mx-auto mb-3 border border-border">
          <div className="h-full bg-primary rounded-full animate-progress"></div>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base animate-fadeIn [animation-delay:1.8s]">Loading your healthy future...</p>
      </div>
    </div>
  );
}

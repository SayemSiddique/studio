"use client";

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 3000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100/30; // 100% over 3 seconds at 100ms interval
      });
    }, 100);


    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <div className="text-center animate-fadeIn">
        <UtensilsCrossed className="mx-auto h-24 w-24 text-primary mb-6" />
        <h1 className="text-5xl font-bold text-primary font-headline mb-3">
          Safora
        </h1>
        <p className="text-xl text-foreground/80 mb-12">
          AI Food Insights. Your guide to smarter eating.
        </p>
        <div className="w-64 mx-auto">
          <Progress value={progress} className="h-2 [&>div]:bg-primary" />
        </div>
      </div>
    </div>
  );
}

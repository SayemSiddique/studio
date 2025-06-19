
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button'; // Using ShadCN button for consistency
import { Input } from '@/components/ui/input'; // Using ShadCN input
import { cn } from '@/lib/utils';
import styles from './Onboarding.module.css';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile } from '@/lib/types';

const TOTAL_SCREENS = 10; // As per your HTML structure

// Define the structure for formData to match UserProfile relevant fields
type OnboardingFormData = Pick<UserProfile, 
  'name' | 
  'dateOfBirth' | 
  'location' | 
  'selectedDiets' | 
  'ingredientsToAvoid' | 
  'customIngredientsToAvoid' |
  'knownAllergens' |
  'customAllergens' |
  'healthConditions' |
  'healthGoalsList'
>;

export default function NewOnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
    name: '',
    dateOfBirth: '',
    // Initialize other fields as needed, e.g., location: { region: '', country: '', city: '' }
  });

  useEffect(() => {
    // Pre-fill formData if profile exists (e.g., user returning to onboarding)
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        dateOfBirth: profile.dateOfBirth || '',
        location: profile.location || {},
        selectedDiets: profile.selectedDiets || [],
        ingredientsToAvoid: profile.ingredientsToAvoid || [],
        customIngredientsToAvoid: profile.customIngredientsToAvoid || '',
        knownAllergens: profile.knownAllergens || [],
        customAllergens: profile.customAllergens || '',
        healthConditions: profile.healthConditions || [],
        healthGoalsList: profile.healthGoalsList || [],
      }));
    }
  }, [profile]);


  const handleInputChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextScreen = useCallback(() => {
    if (currentScreen < TOTAL_SCREENS) {
      setCurrentScreen(prev => prev + 1);
    } else if (currentScreen === TOTAL_SCREENS) { // Screen 10: Account Prompt
      // This is where "Sign Up with Email/Google" or "Continue as Guest" would be handled.
      // For now, "Sign Up" buttons will lead to auth. "Continue as Guest" could save and go to home.
      // Let's assume all lead to auth for now.
      router.push('/auth');
    }
  }, [currentScreen, router]);

  const prevScreen = useCallback(() => {
    if (currentScreen > 1) {
      setCurrentScreen(prev => prev - 1);
    }
  }, [currentScreen]);

  // Swipe and Keyboard Navigation
  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    function handleSwipeGesture() {
        const deltaX = touchendX - touchstartX;
        const deltaY = touchendY - touchstartY;

        // Only trigger swipe if horizontal movement is dominant and significant
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 75) {
            if (deltaX < 0) { // Swipe Left
                nextScreen();
            }
            if (deltaX > 0) { // Swipe Right
                prevScreen();
            }
        }
    }

    const handleTouchStart = (e: TouchEvent) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextScreen();
        if (e.key === 'ArrowLeft') prevScreen();
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextScreen, prevScreen]);


  const progressPercentage = (currentScreen / TOTAL_SCREENS) * 100;

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 1: // Welcome Screen
        return (
          <div className={styles.screenContent}>
            <div className={styles.safAvatar}>😊</div>
            <h1 className={styles.screenTitle}>Hi there! I'm Saf</h1>
            <p className={styles.screenSubtitle}>Let's build your food profile so I can protect you from hidden risks.</p>
            <div className={styles.bottomActions}>
              <Button className={styles.btnPrimary} onClick={nextScreen}>Let's Begin</Button>
            </div>
          </div>
        );
      case 2: // Basic Info Screen
        return (
          <div className={styles.screenContent}>
            <div className={styles.safAvatar}>👋</div>
            <h1 className={styles.screenTitle}>First, what should I call you?</h1>
            <Input
              type="text"
              className={styles.inputField}
              placeholder="Your name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            
            <h2 className={styles.fieldLabel}>When were you born?</h2>
            {/* Simple text input for DOB for now. Will replace with DatePicker later. */}
            <Input
              type="date" // Using HTML5 date input for now
              className={styles.inputField}
              placeholder="YYYY-MM-DD"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
            <p className={styles.infoText}>This helps me personalize your health insights.</p>
            <div className={styles.bottomActions}>
              <Button className={styles.btnPrimary} onClick={nextScreen}>Continue</Button>
            </div>
          </div>
        );
      // Cases for screens 3-10 will be added in subsequent phases
      default:
        return <div>Screen {currentScreen} - Content TBD</div>;
    }
  };

  return (
    <div className={styles.onboardingRoot}>
        <div className={styles.onboardingContainer}>
            <div className={styles.logoContainer}>
                <Logo />
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
            </div>

            {[...Array(TOTAL_SCREENS)].map((_, i) => (
                <div
                key={i + 1}
                id={`screen-${i + 1}`}
                className={cn(
                    styles.screen,
                    currentScreen === i + 1 ? styles.screenActive : 
                    currentScreen > i + 1 ? styles.screenInactiveLeft : styles.screenInactiveRight
                )}
                >
                {currentScreen === i + 1 && renderScreenContent()}
                </div>
            ))}
        </div>
    </div>
  );
}

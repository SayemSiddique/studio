
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import styles from './Onboarding.module.css'; // Existing styles for visual slides
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile, UserProfileLocation } from '@/lib/types';
import { HeartHandshake, ScanSearch, ShieldCheck, Sparkles, Apple, Leaf, Carrot, Wheat, Info } from 'lucide-react';
import Image from 'next/image';
import SecondOnboardingSlideImage from '@/image/2ndOnboardingSlide.png';

// Constants for the visual slides
const TOTAL_VISUAL_SLIDES = 4;

// Constants for the new data collection screens from user's HTML
const TOTAL_DATA_COLLECTION_STEPS = 10;

// Define the structure for visual slides
interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  backgroundClass: string;
}

const OnboardingSlides: OnboardingSlide[] = [
  {
    id: 'slide-1',
    title: "Welcome to Safora!",
    description: "Your personal AI guide to smarter, safer food choices. Let's make every bite count.",
    illustration: (
      <div className={cn(styles.illustrationContainer, "animate-fadeIn")}>
        <HeartHandshake className="w-2/3 h-2/3 text-primary opacity-80" strokeWidth={1.5} />
      </div>
    ),
    backgroundClass: styles.slide1Bg,
  },
  {
    id: 'slide-2',
    title: "Scan & Discover",
    description: "Instantly analyze food products by scanning barcodes. Understand ingredients and their impact on your health.",
     illustration: (
      <div className={cn(styles.slide2IllustrationContainer, "animate-fadeIn")}>
        <Image
          src={SecondOnboardingSlideImage}
          alt="Product scanning illustration"
          width={160}
          height={133}
          className={styles.responsiveGif}
          priority
        />
      </div>
    ),
    backgroundClass: styles.slide2Bg,
  },
  {
    id: 'slide-3',
    title: "Personalized Dietary Protection",
    description: "Safora checks food against your unique dietary profile, allergies, and health goals.",
    illustration: (
      <div className={cn(styles.illustrationContainer, "animate-fadeIn")}>
        <div className={cn(styles.shieldOverlay, "animate-pulseSlow")}></div>
        <ShieldCheck className="w-1/2 h-1/2 text-primary" strokeWidth={1.5} />
        <div className={cn(styles.dietaryIcons, "animate-rotate")}>
          <Apple style={{ transform: 'translate(0, -40%)' }} />
          <Leaf style={{ transform: 'translate(35%, 15%) rotate(45deg)' }} />
          <Carrot style={{ transform: 'translate(-35%, 15%) rotate(-45deg)' }} />
        </div>
      </div>
    ),
    backgroundClass: styles.slide3Bg,
  },
  {
    id: 'slide-4',
    title: "Empower Your Health Journey",
    description: "Make confident food choices with AI-powered insights. Eat smarter, live healthier with Safora.",
    illustration: (
       <div className={cn(styles.illustrationContainer, "animate-fadeIn", "relative")}>
        <Sparkles className="w-1/2 h-1/2 text-primary opacity-80" strokeWidth={1.5} />
        {[
          { icon: <Apple size={20} className="text-green-500" />, text: "Fresh", delay: "0s", extraClass: styles.food1 },
          { icon: <Leaf size={20} className="text-emerald-500" />, text: "Natural", delay: "0.5s", extraClass: styles.food2 },
          { icon: <Carrot size={20} className="text-orange-500" />, text: "Organic", delay: "1s", extraClass: styles.food3 },
          { icon: <Wheat size={20} className="text-yellow-500" />, text: "Wholesome", delay: "1.5s", extraClass: styles.food4 },
        ].map(item => (
          <div key={item.text} className={cn(styles.floatingFood, item.extraClass, "animate-float")} style={{ animationDelay: item.delay }}>
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    ),
    backgroundClass: styles.slide4Bg,
  }
];


export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading: profileLoading } = useProfile();

  const [currentVisualSlide, setCurrentVisualSlide] = useState(0); // 0 to 3 for visual slides
  const [currentDataCollectionStep, setCurrentDataCollectionStep] = useState(0); // 0 if not started, 1-10 for new steps
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        dateOfBirth: profile.dateOfBirth || "",
        location: profile.location || {},
        selectedDiets: profile.selectedDiets || [],
        ingredientsToAvoid: profile.ingredientsToAvoid || [],
        customIngredientsToAvoid: profile.customIngredientsToAvoid || "",
        knownAllergens: profile.knownAllergens || [],
        customAllergens: profile.customAllergens || "",
        healthConditions: profile.healthConditions || [],
        healthGoalsList: profile.healthGoalsList || [],
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLocationChange = (part: keyof UserProfileLocation, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [part]: value,
      }
    }));
  };


  const handleNextVisualSlide = useCallback(async () => {
    if (currentVisualSlide < TOTAL_VISUAL_SLIDES - 1) {
      setCurrentVisualSlide(prev => prev + 1);
    } else {
      // Transition from visual slides to data collection
      await updateProfile({ profileCompletionStatus: 'visual_complete' });
      setCurrentDataCollectionStep(1); // Start data collection at step 1
    }
  }, [currentVisualSlide, updateProfile]);

  const handlePrevVisualSlide = useCallback(() => {
    if (currentVisualSlide > 0) {
      setCurrentVisualSlide(prev => prev - 1);
    }
  }, [currentVisualSlide]);

  const handleNextDataStep = useCallback(() => {
    if (currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS) {
      // Here you might want to save partial formData to ProfileContext
      // For simplicity now, we'll just navigate.
      // await updateProfile(formData); 
      setCurrentDataCollectionStep(prev => prev + 1);
    } else if (currentDataCollectionStep === TOTAL_DATA_COLLECTION_STEPS) {
      // This is the last data collection step (Account Creation Prompt)
      // Logic for "Sign Up" or "Continue as Guest"
      // For now, let's assume "Sign Up" buttons redirect to auth
      router.push('/auth');
    }
  }, [currentDataCollectionStep, router]);

  const handlePrevDataStep = useCallback(() => {
    if (currentDataCollectionStep > 1) {
      setCurrentDataCollectionStep(prev => prev - 1);
    } else if (currentDataCollectionStep === 1) {
      // Go back to visual slides
      setCurrentDataCollectionStep(0);
      // Optionally reset visual_complete status or handle as needed
    }
  }, [currentDataCollectionStep]);

  const skipToAuth = async () => {
    await updateProfile({ 
      ...formData, // save any data collected so far in data collection steps
      profileCompletionStatus: currentDataCollectionStep > 0 ? 'data_collection_started' : 'visual_complete' 
    });
    router.push('/auth');
  };

  // Combined Swipe and Keyboard Navigation
  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    function handleSwipeGesture() {
      const deltaX = touchendX - touchstartX;
      const deltaY = touchendY - touchstartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 75) {
        if (currentDataCollectionStep === 0) { // Visual slides
          if (deltaX < 0) handleNextVisualSlide();
          else handlePrevVisualSlide();
        } else { // Data collection steps
          if (deltaX < 0) handleNextDataStep();
          else handlePrevDataStep();
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
      if (currentDataCollectionStep === 0) { // Visual slides
        if (e.key === 'ArrowRight') handleNextVisualSlide();
        if (e.key === 'ArrowLeft') handlePrevVisualSlide();
      } else { // Data collection steps
         if (e.key === 'ArrowRight') handleNextDataStep();
         if (e.key === 'ArrowLeft') handlePrevDataStep();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextVisualSlide, handlePrevVisualSlide, handleNextDataStep, handlePrevDataStep, currentDataCollectionStep]);

  const visualProgressPercentage = ((currentVisualSlide + 1) / TOTAL_VISUAL_SLIDES) * 100;
  const dataCollectionProgressPercentage = (currentDataCollectionStep / TOTAL_DATA_COLLECTION_STEPS) * 100;

  const activeVisualSlide = OnboardingSlides[currentVisualSlide];


  // Render logic for Data Collection Step 1 (Welcome)
  const renderDataCollectionStep1 = () => (
    <div className={cn(styles.newData_screen, styles.active)} id="data-screen-1">
        <div className={styles.newData_progressBar}>
            <div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div>
        </div>
        <div className={styles.newData_screenContent}>
            <div className={styles.newData_safAvatar}>😊</div>
            <h1 className={cn(styles.newData_h1, "text-3xl font-bold mb-4")}>Hi there! I'm Saf</h1>
            <p className="text-gray-600 mb-8">Let's build your food profile so I can protect you from hidden risks.</p>
            <div className={styles.newData_bottomActions}>
                <button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Let's Begin</button>
            </div>
        </div>
    </div>
  );

  // Placeholder for Data Collection Step 2 (Basic Info - Name & DOB)
  // DOB will be a simple text input for now.
  const renderDataCollectionStep2 = () => (
    <div className={cn(styles.newData_screen, styles.active)} id="data-screen-2">
        <div className={styles.newData_progressBar}>
            <div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div>
        </div>
        <div className={styles.newData_screenContent}>
            <div className={styles.newData_safAvatar}>👋</div>
            <h1 className={cn(styles.newData_h1, "text-3xl font-bold mb-6")}>First, what should I call you?</h1>
            <Input 
              type="text" 
              className={styles.newData_inputField} 
              placeholder="Your name" 
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-700">When were you born?</h2>
            <Input 
              type="text" // Simple text input for DOB for Phase 1
              className={styles.newData_inputField} 
              placeholder="YYYY-MM-DD"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-6">This helps me personalize your health insights.</p>
            <div className={styles.newData_bottomActions}>
                <button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button>
            </div>
        </div>
    </div>
  );


  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Sparkles className="w-16 h-16 text-primary animate-ping" />
      </div>
    );
  }

  return (
    <div className={styles.onboardingRoot}>
      <div className={styles.onboardingContainer}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>

        {currentDataCollectionStep === 0 ? (
          // Render Visual Onboarding Slides
          <>
            {OnboardingSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={cn(
                  styles.visualScreen,
                  slide.backgroundClass,
                  currentVisualSlide === index ? styles.visualScreenActive :
                  currentVisualSlide > index ? styles.visualScreenInactiveLeft : styles.visualScreenInactiveRight
                )}
              >
                <div className={styles.slideContent}>
                  {slide.illustration}
                  <h2 className={styles.slideTitle}>{slide.title}</h2>
                  <p className={styles.slideDescription}>{slide.description}</p>
                </div>
                {currentVisualSlide === index && ( /* Show actions only for active visual slide */
                  <div className={styles.slideActions}>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-md w-full max-w-xs"
                      onClick={handleNextVisualSlide}
                    >
                      {currentVisualSlide === TOTAL_VISUAL_SLIDES - 1 ? "Get Started" : "Next"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className={styles.visualProgressBarContainer}>
              <div className={styles.visualProgressBar}>
                <div className={styles.visualProgressFill} style={{ width: `${visualProgressPercentage}%` }}></div>
              </div>
            </div>
            {currentVisualSlide < TOTAL_VISUAL_SLIDES -1 && (
                <Button variant="ghost" onClick={skipToAuth} className={styles.skipButton}>Skip</Button>
            )}
          </>
        ) : (
          // Render Data Collection Steps
          // This container will hold the new screens
          <div className={styles.newData_innerContainer}>
            {/* Conditionally render data collection steps based on currentDataCollectionStep */}
            {currentDataCollectionStep === 1 && renderDataCollectionStep1()}
            {currentDataCollectionStep === 2 && renderDataCollectionStep2()}
            {/* More steps will be added here in subsequent phases */}

            {/* Placeholder for other steps to show structure */}
            {currentDataCollectionStep > 2 && currentDataCollectionStep <= TOTAL_DATA_COLLECTION_STEPS && (
                 <div className={cn(styles.newData_screen, styles.active)}>
                    <div className={styles.newData_progressBar}>
                        <div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div>
                    </div>
                    <div className={styles.newData_screenContent}>
                        <h1 className={cn(styles.newData_h1, "text-2xl")}>Data Collection Step {currentDataCollectionStep}</h1>
                        <p>Content for step {currentDataCollectionStep} from your HTML will go here.</p>
                         <div className={styles.newData_bottomActions}>
                            <button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>
                                {currentDataCollectionStep === TOTAL_DATA_COLLECTION_STEPS ? "Finish" : "Continue"}
                            </button>
                            {currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS && // Show skip later only before the last "account prompt" screen
                                <button className={cn(styles.newData_btnSecondary, "mt-2")} onClick={skipToAuth}>
                                    I'll fill this later
                                </button>
                            }
                        </div>
                    </div>
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

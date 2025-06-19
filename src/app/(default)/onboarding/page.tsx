

"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import styles from './Onboarding.module.css';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile, UserProfileLocation } from '@/lib/types';
import { HeartHandshake, ScanSearch, ShieldCheck, Sparkles, Apple, Leaf, Carrot, Wheat, Info, ChevronDown, ChevronLeft, ChevronRight, Check, Circle, Mail, User, CalendarDays, MapPin, Utensils, Ban, AlertTriangleIcon, ListChecks, BarChart3, Briefcase, ShieldQuestion, Milestone, Edit3 } from 'lucide-react';
import Image from 'next/image';
import SecondOnboardingSlideImage from '@/image/2ndOnboardingSlide.png';
import { countryData, regions, dietaryPaths, ingredientsToAvoidOptions, commonAllergens, healthConditionsOptions, healthGoalsOptions } from '@/lib/onboardingOptions';

// Constants
const TOTAL_VISUAL_SLIDES = 4;
const TOTAL_DATA_COLLECTION_STEPS = 10; 

interface VisualSlide {
  id: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
  backgroundClass: string;
}

const VisualOnboardingSlides: VisualSlide[] = [
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

const GoogleIconSvg = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="white"/>
    </svg>
);


export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading: profileLoading } = useProfile();

  const [currentVisualSlide, setCurrentVisualSlide] = useState(0);
  const [currentDataCollectionStep, setCurrentDataCollectionStep] = useState(0); // 0 = visual, 1-10 = data collection
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    dateOfBirth: "",
    location: { region: "", country: "", city: "" },
    selectedDiets: [],
    ingredientsToAvoid: [],
    customIngredientsToAvoid: "",
    knownAllergens: [],
    customAllergens: "",
    healthConditions: [],
    healthGoalsList: [],
    profileCompletionStatus: 'initial',
  });

  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'region' | 'country' | 'city' | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        dateOfBirth: profile.dateOfBirth || "",
        location: profile.location || { region: "", country: "", city: "" },
        selectedDiets: profile.selectedDiets || [],
        ingredientsToAvoid: profile.ingredientsToAvoid || [],
        customIngredientsToAvoid: profile.customIngredientsToAvoid || "",
        knownAllergens: profile.knownAllergens || [],
        customAllergens: profile.customAllergens || "",
        healthConditions: profile.healthConditions || [],
        healthGoalsList: profile.healthGoalsList || [],
        profileCompletionStatus: profile.profileCompletionStatus || 'initial',
      }));
      if (profile.location?.region) setSelectedRegion(profile.location.region);
      if (profile.location?.country) {
         setSelectedCountry(profile.location.country);
         if (profile.location.country && countryData[profile.location.country]) {
            setAvailableCities(countryData[profile.location.country].sort() || []);
         } else {
            setAvailableCities([]);
         }
      }
      if (profile.location?.city) setSelectedCity(profile.location.city);
    }
  }, [profile]);

  const handleInputChange = (field: keyof Pick<UserProfile, 'name' | 'dateOfBirth' | 'customIngredientsToAvoid' | 'customAllergens'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLocationChange = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      location: {
        region: selectedRegion,
        country: selectedCountry,
        city: selectedCity,
      }
    }));
  }, [selectedRegion, selectedCountry, selectedCity]);

  useEffect(() => {
    handleLocationChange();
  }, [handleLocationChange]);

  const handleNextVisualSlide = useCallback(async () => {
    if (currentVisualSlide < TOTAL_VISUAL_SLIDES - 1) {
      setCurrentVisualSlide(prev => prev + 1);
    } else {
      await updateProfile({ ...formData, profileCompletionStatus: 'visual_complete' });
      setCurrentDataCollectionStep(1); // Start data collection
    }
  }, [currentVisualSlide, updateProfile, formData]);

  const handlePrevVisualSlide = useCallback(() => {
    if (currentVisualSlide > 0) {
      setCurrentVisualSlide(prev => prev - 1);
    }
  }, [currentVisualSlide]);

  const handleNextDataStep = useCallback(async () => {
    // Save current step's data before moving
    await updateProfile({ ...formData, profileCompletionStatus: 'data_collection_started' });
    if (currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS) {
      setCurrentDataCollectionStep(prev => prev + 1);
    }
  }, [currentDataCollectionStep, formData, updateProfile]);

  const handlePrevDataStep = useCallback(() => {
    if (currentDataCollectionStep > 1) {
      setCurrentDataCollectionStep(prev => prev - 1);
    } else if (currentDataCollectionStep === 1) { // Going from first data step back to visual
      setCurrentDataCollectionStep(0); 
    }
  }, [currentDataCollectionStep]);
  
  const skipToAuth = async () => {
    await updateProfile({ 
      ...formData, 
      profileCompletionStatus: 'data_partial' 
    });
    router.push('/auth');
  };

  const handleSaveProfileAndRedirect = async () => {
    await updateProfile({ ...formData, profileCompletionStatus: 'data_complete'});
    router.push('/auth');
  };
  
  const handleContinueAsGuest = async () => {
    await updateProfile({ ...formData, profileCompletionStatus: 'data_complete_guest'});
    router.push('/home');
  };

  useEffect(() => {
    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    function handleSwipeGesture() {
      const deltaX = touchendX - touchstartX;
      const deltaY = touchendY - touchstartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 75) { 
        if (currentDataCollectionStep === 0) { 
          if (deltaX < 0) handleNextVisualSlide(); else handlePrevVisualSlide();
        } else { 
          if (deltaX < 0) handleNextDataStep(); else handlePrevDataStep();
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => { touchstartX = e.changedTouches[0].screenX; touchstartY = e.changedTouches[0].screenY; };
    const handleTouchEnd = (e: TouchEvent) => { touchendX = e.changedTouches[0].screenX; touchendY = e.changedTouches[0].screenY; handleSwipeGesture(); };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (currentDataCollectionStep === 0) {
        if (e.key === 'ArrowRight') handleNextVisualSlide();
        if (e.key === 'ArrowLeft') handlePrevVisualSlide();
      } else {
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

  const toggleDropdown = (dropdownName: 'region' | 'country' | 'city' | null) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    const countriesForRegion = Object.keys(countryData).filter(country => {
      const regionForCountry = Object.entries(regions).find(([_, countries]) => countries.includes(country))?.[0];
      if (region === "All Regions") return true; // Show all if "All Regions" is selected
      return regionForCountry === region;
    });
    setAvailableCountries(countriesForRegion.length > 0 ? countriesForRegion.sort() : Object.keys(countryData).sort());
    setSelectedCountry(''); setAvailableCities([]); setSelectedCity('');
    setOpenDropdown(null);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setAvailableCities(countryData[country]?.sort() || []);
    setSelectedCity('');
    setOpenDropdown(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setOpenDropdown(null);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChipToggle = (
    itemValue: string, 
    fieldName: keyof Pick<UserProfile, 'selectedDiets' | 'ingredientsToAvoid' | 'knownAllergens' | 'healthConditions' | 'healthGoalsList'>
  ) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] as string[] || [];
      const newArray = currentArray.includes(itemValue)
        ? currentArray.filter(item => item !== itemValue)
        : [...currentArray, itemValue];
      return { ...prev, [fieldName]: newArray };
    });
  };

  const renderDataCollectionStep1 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 1 ? styles.active : styles.inactiveRight)} id="data-screen-1">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>😊</div>
        <h1 className={cn(styles.newData_h1, "text-3xl font-bold mb-4")}>Hi there! I'm Saf</h1>
        <p className="text-gray-600 mb-8 text-center">Let's build your food profile so I can protect you from hidden risks.</p>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Let's Begin</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep2 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 2 ? styles.active : (currentDataCollectionStep < 2 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-2">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>👋</div>
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
          type="text" 
          className={styles.newData_inputField} 
          placeholder="YYYY-MM-DD"
          value={formData.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        />
        <p className="text-gray-500 text-sm mt-6 text-center">This helps me personalize your health insights.</p>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep3 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 3 ? styles.active : (currentDataCollectionStep < 3 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-3" ref={dropdownRef}>
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🌎</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Where are you based?</h1>
        
        <div className={styles.newData_dropdownField}>
          <div className={cn(styles.newData_dropdownSelected, openDropdown === 'region' && styles.active)} onClick={() => toggleDropdown('region')}>
            <span>{selectedRegion || "Select your region"}</span> <ChevronDown />
          </div>
          <div className={cn(styles.newData_dropdownOptions, openDropdown === 'region' && styles.show)}>
            {Object.keys(regions).map(region => (
              <div key={region} className={cn(styles.newData_dropdownOption, selectedRegion === region && styles.selected)} onClick={() => handleRegionSelect(region)}>{region}</div>
            ))}
          </div>
        </div>

        <div className={styles.newData_dropdownField}>
          <div className={cn(styles.newData_dropdownSelected, openDropdown === 'country' && styles.active, !selectedRegion && "opacity-50 cursor-not-allowed")} onClick={() => selectedRegion && toggleDropdown('country')}>
            <span>{selectedCountry || "Select your country"}</span> <ChevronDown />
          </div>
          <div className={cn(styles.newData_dropdownOptions, openDropdown === 'country' && styles.show)}>
            {availableCountries.length > 0 ? availableCountries.map(country => (
              <div key={country} className={cn(styles.newData_dropdownOption, selectedCountry === country && styles.selected)} onClick={() => handleCountrySelect(country)}>{country}</div>
            )) : <div className={cn(styles.newData_dropdownOption, styles.disabled)}>Please select a region first</div>}
          </div>
        </div>

        <div className={styles.newData_dropdownField}>
          <div className={cn(styles.newData_dropdownSelected, openDropdown === 'city' && styles.active, !selectedCountry && "opacity-50 cursor-not-allowed")} onClick={() => selectedCountry && toggleDropdown('city')}>
            <span>{selectedCity || "Select your city"}</span> <ChevronDown />
          </div>
          <div className={cn(styles.newData_dropdownOptions, openDropdown === 'city' && styles.show)}>
            {availableCities.length > 0 ? availableCities.map(city => (
              <div key={city} className={cn(styles.newData_dropdownOption, selectedCity === city && styles.selected)} onClick={() => handleCitySelect(city)}>{city}</div>
            )) : <div className={cn(styles.newData_dropdownOption, styles.disabled)}>Please select a country first</div>}
          </div>
        </div>
        
        <button className={cn(styles.newData_btnSecondary, "mb-6 flex items-center justify-center")}>
            <Info size={20} className="mr-2"/> Auto-detect my location
        </button>
        
        <div className={styles.newData_safMessage}>
            I'll use this to match local food products and ingredients.
            <div className={styles.newData_tooltip}> <Info size={16}/> <span className={styles.newData_tooltipText}>Different regions have different food regulations and ingredients.</span> </div>
        </div>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep4 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 4 ? styles.active : (currentDataCollectionStep < 4 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-4">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🥗</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Do you follow any of these dietary paths?</h1>
        <div className={styles.newData_chipContainer}>
          {dietaryPaths.map(diet => (
            <div key={diet} className={cn(styles.newData_chip, formData.selectedDiets?.includes(diet) && styles.selected)} onClick={() => handleChipToggle(diet, 'selectedDiets')}>
              <span>{diet}</span>
            </div>
          ))}
        </div>
        <button className={cn(styles.newData_btnSecondary, "mt-4 text-sm")}>I'm not sure yet</button>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep5 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 5 ? styles.active : (currentDataCollectionStep < 5 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-5">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🚫</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Any ingredients you avoid for personal, religious, or ethical reasons?</h1>
        <div className={styles.newData_chipContainer}>
          {ingredientsToAvoidOptions.map(opt => (
            <div key={opt.name} className={cn(styles.newData_chip, formData.ingredientsToAvoid?.includes(opt.name) && styles.selected)}  onClick={() => handleChipToggle(opt.name, 'ingredientsToAvoid')}>
              {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
              <span>{opt.name}</span>
            </div>
          ))}
        </div>
        <Input type="text" className={cn(styles.newData_inputField, "mt-4")} placeholder="List other ingredients to avoid, separated by commas" value={formData.customIngredientsToAvoid || ''} onChange={(e) => handleInputChange('customIngredientsToAvoid', e.target.value)} />
        <p className="text-gray-500 text-sm mt-6 text-center">Don't worry, you can change this later.</p>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep6 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 6 ? styles.active : (currentDataCollectionStep < 6 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-6">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>⚠️</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Let's make sure you stay safe. Any known allergies?</h1>
        <div className={styles.newData_chipContainer}>
          {commonAllergens.map(allergen => (
            <div key={allergen.name} className={cn(styles.newData_chip, formData.knownAllergens?.includes(allergen.name) && styles.selected)} onClick={() => handleChipToggle(allergen.name, 'knownAllergens')}>
              {allergen.emoji && <span className="mr-1">{allergen.emoji}</span>}
              <span>{allergen.name}</span>
            </div>
          ))}
        </div>
        <Input type="text" className={cn(styles.newData_inputField, "mt-4")} placeholder="Add other allergies, separated by commas" value={formData.customAllergens || ''} onChange={(e) => handleInputChange('customAllergens', e.target.value)} />
        <div className={styles.newData_safMessage}>I'll make sure these ingredients are flagged in every scan.</div>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep7 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 7 ? styles.active : (currentDataCollectionStep < 7 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-7">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>❤️</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Any health conditions I should be aware of?</h1>
        <div className={styles.newData_chipContainer}>
          {healthConditionsOptions.map(condition => (
            <div key={condition} className={cn(styles.newData_chip, formData.healthConditions?.includes(condition) && styles.selected)} onClick={() => handleChipToggle(condition, 'healthConditions')}>
              <span>{condition}</span>
            </div>
          ))}
        </div>
        <button className={cn(styles.newData_btnSecondary, "mt-6")} onClick={skipToAuth}>I'll fill this later</button>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const renderDataCollectionStep8 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 8 ? styles.active : (currentDataCollectionStep < 8 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-8">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🎯</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>What are your current health goals?</h1>
        <div className={styles.newData_chipContainer}>
          {healthGoalsOptions.map(goal => (
            <div key={goal} className={cn(styles.newData_chip, formData.healthGoalsList?.includes(goal) && styles.selected)} onClick={() => handleChipToggle(goal, 'healthGoalsList')}>
              <span>{goal}</span>
            </div>
          ))}
        </div>
         <button className={cn(styles.newData_btnSecondary, "mt-6")} onClick={skipToAuth}>I'll fill this later</button>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</button></div>
      </div>
    </div>
  );

  const SummaryDisplayItem: React.FC<{icon: React.ReactNode; label: string; value?: string | string[] | null}> = ({icon, label, value}) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
      <div className={styles.newData_summaryItem}>
        <div className={styles.newData_summaryIcon}>{icon}</div>
        <div>
          <div className="font-medium text-gray-700">{label}</div>
          <div className="text-sm text-gray-500">{displayValue}</div>
        </div>
      </div>
    );
  };

  const renderDataCollectionStep9 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 9 ? styles.active : (currentDataCollectionStep < 9 ? styles.inactiveRight : styles.inactiveLeft) )} id="data-screen-9">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>📋</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Your Dietary Profile Summary</h1>
        <div className="bg-gray-50 p-4 rounded-xl mb-6 w-full max-w-md text-left overflow-y-auto max-h-[50vh]">
          <SummaryDisplayItem icon={<User size={18}/>} label="Name" value={formData.name} />
          <SummaryDisplayItem icon={<CalendarDays size={18}/>} label="Date of Birth" value={formData.dateOfBirth} />
          <SummaryDisplayItem icon={<MapPin size={18}/>} label="Location" value={`${formData.location?.city || ''}${formData.location?.city && (formData.location?.country || formData.location?.region) ? ', ' : ''}${formData.location?.country || ''}${formData.location?.country && formData.location?.region ? ', ' : ''}${formData.location?.region || ''}`} />
          <SummaryDisplayItem icon={<Utensils size={18}/>} label="Dietary Paths" value={formData.selectedDiets} />
          <SummaryDisplayItem icon={<Ban size={18}/>} label="Ingredients to Avoid" value={formData.ingredientsToAvoid} />
          {formData.customIngredientsToAvoid && <SummaryDisplayItem icon={<Edit3 size={18}/>} label="Custom Avoidances" value={formData.customIngredientsToAvoid} />}
          <SummaryDisplayItem icon={<AlertTriangleIcon size={18}/>} label="Allergies" value={formData.knownAllergens} />
           {formData.customAllergens && <SummaryDisplayItem icon={<Edit3 size={18}/>} label="Custom Allergies" value={formData.customAllergens} />}
          <SummaryDisplayItem icon={<ListChecks size={18}/>} label="Health Conditions" value={formData.healthConditions} />
          <SummaryDisplayItem icon={<BarChart3 size={18}/>} label="Health Goals" value={formData.healthGoalsList} />
        </div>
        <div className={styles.newData_safMessage}>Done! This helps me scan your food with your needs in mind.</div>
        <div className={styles.newData_bottomActions}><button className={styles.newData_btnPrimary} onClick={handleSaveProfileAndRedirect}>Save My Profile</button></div>
      </div>
    </div>
  );
  
  const renderDataCollectionStep10 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 10 ? styles.active : styles.inactiveLeft )} id="data-screen-10">
      <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🎉</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-4")}>You're all set!</h1>
        <p className="text-gray-600 mb-8 text-center">Create a free Safora account to save your profile and start scanning safely.</p>
        
        <button className={cn(styles.newData_btnPrimary, "mb-4 flex items-center justify-center")} onClick={() => router.push('/auth')}>
          <Mail size={20} className="mr-2"/> Sign Up with Email
        </button>
        
        <button 
          className={cn(styles.newData_btnPrimary, "mb-6 flex items-center justify-center")} 
          style={{background: 'linear-gradient(90deg, #4285F4, #3c78dc)'}}
          onClick={() => router.push('/auth?provider=google')}
        >
          <GoogleIconSvg /> Sign Up with Google
        </button>
        
        <button className={cn(styles.newData_btnSecondary, "w-full")} onClick={handleContinueAsGuest}>
          Continue as Guest
        </button>
        <p className="text-gray-500 text-xs text-center mt-2">Limited features available</p>
      </div>
    </div>
  );


  if (profileLoading && !profile) {
    return (
      <div className={styles.onboardingRoot}> 
        <div className="flex items-center justify-center min-h-screen">
          <Sparkles className="w-16 h-16 text-primary animate-ping" />
        </div>
      </div>
    );
  }
  
  const renderActiveDataCollectionScreen = () => {
    switch (currentDataCollectionStep) {
      case 1: return renderDataCollectionStep1();
      case 2: return renderDataCollectionStep2();
      case 3: return renderDataCollectionStep3();
      case 4: return renderDataCollectionStep4();
      case 5: return renderDataCollectionStep5();
      case 6: return renderDataCollectionStep6();
      case 7: return renderDataCollectionStep7();
      case 8: return renderDataCollectionStep8();
      case 9: return renderDataCollectionStep9();
      case 10: return renderDataCollectionStep10();
      default: return null;
    }
  };

  return (
    <div className={styles.onboardingRoot}>
      <div className={cn(styles.onboardingContainer, currentDataCollectionStep > 0 && styles.newData_onboardingContainer)}>
        <div className={cn(styles.logoContainer, currentDataCollectionStep > 0 && styles.newData_logoContainer)}>
          <Logo />
        </div>

        {currentDataCollectionStep === 0 ? (
          <>
            {VisualOnboardingSlides.map((slide, index) => (
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
                {currentVisualSlide === index && (
                  <div className={styles.slideActions}>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-md w-full max-w-xs"
                      onClick={handleNextVisualSlide}
                    >
                      {currentVisualSlide === TOTAL_VISUAL_SLIDES - 1 ? "Let's Begin Data Setup" : "Next"}
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
             {currentVisualSlide < TOTAL_VISUAL_SLIDES - 1 && (
              <Button variant="ghost" onClick={skipToAuth} className={styles.skipButton}>Skip Visual Intro</Button>
            )}
          </>
        ) : (
          <div className={cn(styles.newData_innerContainer)}>
            {renderActiveDataCollectionScreen()}
             {currentDataCollectionStep > 0 && currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS && (
              <button 
                onClick={handlePrevDataStep} 
                className="absolute top-4 left-4 p-2 bg-gray-200/50 hover:bg-gray-300/70 rounded-full z-20"
                aria-label="Go back"
              >
                <ChevronLeft size={24} className="text-gray-700"/>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


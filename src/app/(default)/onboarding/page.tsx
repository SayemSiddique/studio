
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import styles from './Onboarding.module.css';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile } from '@/lib/types';
import {
  HeartHandshake, ScanSearch, ShieldCheck, Sparkles, Apple, Leaf, Carrot, Wheat, Info, ChevronDown, ChevronLeft, ChevronRight, Check, Circle, Mail, User, CalendarDays, MapPin, Utensils, Ban, AlertTriangleIcon, ListChecks, BarChart3, Briefcase, ShieldQuestion, Milestone, Edit3, Map, LocateFixed, Loader2
} from 'lucide-react';
import Image from 'next/image';
import SecondOnboardingSlideImage from '@/image/2ndOnboardingSlide.png';
import { countryData, regions, dietaryPaths, ingredientsToAvoidOptions, commonAllergens, healthConditionsOptions, healthGoalsOptions, otherAllergensList } from '@/lib/onboardingOptions';
import { format, differenceInYears, parseISO, isValid } from "date-fns";

// Constants for visual slides
const TOTAL_VISUAL_SLIDES = 4;
// Constants for new data collection steps
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
  const [currentDataCollectionStep, setCurrentDataCollectionStep] = useState(0);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: undefined,
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
  const [availableCities, setAvailableCities] = useState<string[]>([]); // For future API based city loading
  const [openDropdown, setOpenDropdown] = useState<'region' | 'country' | 'city' | null>(null);
  const [dobCalendarOpen, setDobCalendarOpen] = useState(false);
  const [geolocationStatus, setGeolocationStatus] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);


  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        ...profile, // Spread existing profile to retain any already set data
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dateOfBirth: profile.dateOfBirth || "",
        age: profile.age,
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
          setAvailableCities([]); // Reset if country not in data or no cities
        }
      }
      if (profile.location?.city) setSelectedCity(profile.location.city);
    }
  }, [profile]);

  useEffect(() => {
    if (formData.dateOfBirth) {
      try {
        const birthDate = parseISO(formData.dateOfBirth);
        if (isValid(birthDate)) {
          const age = differenceInYears(new Date(), birthDate);
          setFormData(prev => ({ ...prev, age: age }));
        } else {
          setFormData(prev => ({ ...prev, age: undefined }));
        }
      } catch (e) {
        console.error("Invalid date for age calculation", e);
        setFormData(prev => ({ ...prev, age: undefined }));
      }
    } else {
        setFormData(prev => ({ ...prev, age: undefined }));
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (field: keyof Pick<UserProfile, 'firstName' | 'lastName' | 'customIngredientsToAvoid' | 'customAllergens'>, value: string) => {
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
      setCurrentDataCollectionStep(1);
    }
  }, [currentVisualSlide, updateProfile, formData]);

  const handlePrevVisualSlide = useCallback(() => {
    if (currentVisualSlide > 0) {
      setCurrentVisualSlide(prev => prev - 1);
    }
  }, [currentVisualSlide]);

  const handleNextDataStep = useCallback(async () => {
    if (currentDataCollectionStep === 0) { // Transition from visual to data collection
        await updateProfile({ ...formData, profileCompletionStatus: 'visual_complete' });
        setCurrentDataCollectionStep(1);
        return;
    }
    await updateProfile({ ...formData, profileCompletionStatus: 'data_collection_started' });
    if (currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS) {
      setCurrentDataCollectionStep(prev => prev + 1);
    }
  }, [currentDataCollectionStep, formData, updateProfile]);

  const handlePrevDataStep = useCallback(() => {
    if (currentDataCollectionStep > 1) {
      setCurrentDataCollectionStep(prev => prev - 1);
    } else if (currentDataCollectionStep === 1) {
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
    const countriesForRegion = Object.keys(countryData).filter(countryKey => {
      const countryRegions = Object.entries(regions).find(([, countriesInRegion]) => countriesInRegion.includes(countryKey));
      if (region === "All Regions") return true;
      // This logic needs to be careful if a country can belong to multiple "regions" in your list.
      // Assuming your `regions` array contains names that match keys in a hypothetical mapping or a direct check if countryData implies regions.
      // For simplicity, if your `countryData` isn't structured by region, this part might need more complex mapping.
      // Given the HTML implies direct country list, "All Regions" is the main filter.
      // For now, I'll assume `regions` array in onboardingOptions contains region names and `countryData` has all countries.
      // This filtering logic might need to be more robust based on how `regions` and `countryData` are meant to interact.
      return true; // Simplified: allow all countries if not "All Regions", specific filtering can be added.
                   // Or, if you have a mapping: return regionOf(countryKey) === region;
    });
    
    if (region === "All Regions") {
        setAvailableCountries(Object.keys(countryData).sort());
    } else {
        // This part is tricky without a clear region-to-country mapping in countryData.
        // For now, if a specific region is chosen, we might show a subset or just all countries if mapping is complex.
        // Let's assume for now, any specific region selection still shows all countries and user filters by knowledge.
        // A better approach would be to structure countryData by region.
        const filteredCountries = Object.keys(countryData).filter(c => {
            // Example: if you had a region property in countryData items
            // return countryData[c].region === region; 
            // For now, this will behave like "All Regions" if a specific region is selected that isn't "All Regions"
            // This is a placeholder for more complex region-country mapping if needed.
            if (region === "North America") return ["United States", "Canada", "Mexico"].includes(c);
            if (region === "Europe") return ["United Kingdom", "Germany", "France", "Italy", "Spain"].includes(c); // Example subset
            // Add more specific region mappings here if desired
            return true; // Default to all if no specific mapping
        }).sort();
        setAvailableCountries(filteredCountries.length > 0 ? filteredCountries : Object.keys(countryData).sort());
    }

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

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationStatus("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    setGeolocationStatus("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocationStatus(`Location detected: Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}. Please select region/country/city manually for now.`);
        // In a real app, you'd use reverse geocoding here.
        // For now, we just show coordinates. User still needs to select manually.
        setIsDetectingLocation(false);
      },
      (error) => {
        setGeolocationStatus(`Error detecting location: ${error.message}`);
        setIsDetectingLocation(false);
      }
    );
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateOfBirth: format(date, "yyyy-MM-dd") }));
    } else {
      setFormData(prev => ({ ...prev, dateOfBirth: "" }));
    }
    setDobCalendarOpen(false);
  };


  const renderDataCollectionStep1 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 1 ? styles.newData_active : styles.newData_inactiveRight)} id="data-screen-1">
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>😊</div>
        <h1 className={cn(styles.newData_h1, "text-3xl font-bold mb-4")}>Hi there! I'm Saf</h1>
        <p className="text-gray-600 mb-8 text-center">Let's build your food profile so I can protect you from hidden risks.</p>
      </div>
      <div className={styles.newData_progressBarContainer}>
        <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      </div>
      <div className={styles.newData_bottomActions}><Button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Let's Begin</Button></div>
    </div>
  );

  const renderDataCollectionStep2 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 2 ? styles.newData_active : (currentDataCollectionStep < 2 ? styles.newData_inactiveRight : styles.newData_inactiveLeft) )} id="data-screen-2">
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>👋</div>
        <h1 className={cn(styles.newData_h1, "text-2xl font-bold mb-4")}>First, what should I call you?</h1>
        <Input
          type="text"
          className={styles.newData_inputField}
          placeholder="First Name"
          value={formData.firstName || ''}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
        />
        <Input
          type="text"
          className={styles.newData_inputField}
          placeholder="Last Name"
          value={formData.lastName || ''}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
        />
        <h2 className={cn(styles.newData_h1, "text-xl font-semibold mt-4 mb-2")}>When were you born?</h2>
        <Popover open={dobCalendarOpen} onOpenChange={setDobCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                styles.newData_inputField,
                "w-full justify-start text-left font-normal",
                !formData.dateOfBirth && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {formData.dateOfBirth ? format(parseISO(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={formData.dateOfBirth ? parseISO(formData.dateOfBirth) : undefined}
              onSelect={handleDateSelect}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
        {formData.age !== undefined && <p className="text-gray-600 text-sm mt-1">You are {formData.age} years old.</p>}
        <p className="text-gray-500 text-sm mt-4 text-center">This helps me personalize your health insights.</p>
      </div>
       <div className={styles.newData_progressBarContainer}>
        <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      </div>
      <div className={styles.newData_bottomActions}><Button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</Button></div>
    </div>
  );

 const renderDataCollectionStep3 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 3 ? styles.newData_active : (currentDataCollectionStep < 3 ? styles.newData_inactiveRight : styles.newData_inactiveLeft))} id="data-screen-3" ref={dropdownRef}>
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🌎</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-4")}>Where are you based?</h1>
        
        <div className={styles.newData_dropdownField}>
          <div className={cn(styles.newData_dropdownSelected, openDropdown === 'region' && styles.newData_active)} onClick={() => toggleDropdown('region')}>
            <span>{selectedRegion || "Select your region"}</span> <ChevronDown />
          </div>
          <div className={cn(styles.newData_dropdownOptions, openDropdown === 'region' && styles.newData_show)}>
            {regions.map(region => (
              <div key={region} className={cn(styles.newData_dropdownOption, selectedRegion === region && styles.newData_selected)} onClick={() => handleRegionSelect(region)}>{region}</div>
            ))}
          </div>
        </div>

        <div className={styles.newData_dropdownField}>
          <div className={cn(styles.newData_dropdownSelected, openDropdown === 'country' && styles.newData_active, !selectedRegion && "opacity-50 cursor-not-allowed")} onClick={() => selectedRegion && toggleDropdown('country')}>
            <span>{selectedCountry || "Select your country"}</span> <ChevronDown />
          </div>
          <div className={cn(styles.newData_dropdownOptions, openDropdown === 'country' && styles.newData_show)}>
            {availableCountries.length > 0 ? availableCountries.map(country => (
              <div key={country} className={cn(styles.newData_dropdownOption, selectedCountry === country && styles.newData_selected)} onClick={() => handleCountrySelect(country)}>{country}</div>
            )) : <div className={cn(styles.newData_dropdownOption, styles.newData_disabled)}>Please select a region first</div>}
          </div>
        </div>

        <div className={styles.newData_dropdownField}>
           <Input
            type="text"
            className={styles.newData_inputField}
            placeholder="Enter your city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedCountry}
          />
        </div>
        
        <Button className={cn(styles.newData_btnSecondary, "mb-4 flex items-center justify-center")} onClick={handleDetectLocation} disabled={isDetectingLocation}>
            {isDetectingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed size={20} className="mr-2"/>}
            {isDetectingLocation ? 'Detecting...' : 'Auto-detect my location'}
        </Button>
        {geolocationStatus && <p className="text-xs text-muted-foreground mb-2 text-center">{geolocationStatus}</p>}
        
        <div className={styles.newData_safMessage}>
            I'll use this to match local food products and ingredients.
            <div className={styles.newData_tooltip}> <Info size={16}/> <span className={styles.newData_tooltipText}>Different regions have different food regulations and ingredients.</span> </div>
        </div>
      </div>
      <div className={styles.newData_progressBarContainer}>
        <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      </div>
      <div className={styles.newData_bottomActions}><Button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Continue</Button></div>
    </div>
  );


  // Placeholder for Screens 4-10 (to be implemented in next phase)
  const renderPlaceholderScreen = (step: number, title: string, emoji: string) => (
     <div className={cn(styles.newData_screen, currentDataCollectionStep === step ? styles.newData_active : (currentDataCollectionStep < step ? styles.newData_inactiveRight : styles.newData_inactiveLeft) )} id={`data-screen-${step}`}>
        <div className={styles.newData_screenContent}>
            <div className={cn(styles.newData_safAvatar, "animate-float")}>{emoji}</div>
            <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>{title}</h1>
            <p className="text-muted-foreground mb-4">Content for this step will be implemented next.</p>
            { (step === 7 || step ===4 || step ===5 || step ===6 || step ===8) &&
              <Button className={cn(styles.newData_btnSecondary, "mt-6")} onClick={skipToAuth}>I'll fill this later</Button>
            }
        </div>
        <div className={styles.newData_progressBarContainer}>
           <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
        </div>
        <div className={styles.newData_bottomActions}><Button className={styles.newData_btnPrimary} onClick={step === TOTAL_DATA_COLLECTION_STEPS ? handleSaveProfileAndRedirect : (step === 9 ? handleNextDataStep : handleNextDataStep ) }>{step === 9 ? "Save My Profile" : "Continue"}</Button></div>
    </div>
  );
  
  const renderDataCollectionStep9 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 9 ? styles.newData_active : (currentDataCollectionStep < 9 ? styles.newData_inactiveRight : styles.newData_inactiveLeft))} id="data-screen-9">
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>📋</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>Your Dietary Profile Summary</h1>
        <div className="bg-gray-50 p-4 rounded-xl mb-6 w-full max-w-md text-left overflow-y-auto max-h-[50vh]">
          { (formData.firstName || formData.lastName) &&
            <div className={styles.newData_summaryItem}>
              <div className={styles.newData_summaryIcon}><User size={18}/></div>
              <div>
                <div className="font-medium text-gray-700">Name</div>
                <div className="text-sm text-gray-500">{formData.firstName} {formData.lastName}</div>
              </div>
            </div>
          }
          { formData.dateOfBirth &&
            <div className={styles.newData_summaryItem}>
              <div className={styles.newData_summaryIcon}><CalendarDays size={18}/></div>
              <div>
                <div className="font-medium text-gray-700">Born</div>
                <div className="text-sm text-gray-500">{formData.dateOfBirth} {formData.age !== undefined ? `(Age: ${formData.age})` : ''}</div>
              </div>
            </div>
          }
           { (formData.location?.city || formData.location?.country || formData.location?.region) &&
            <div className={styles.newData_summaryItem}>
              <div className={styles.newData_summaryIcon}><MapPin size={18}/></div>
              <div>
                <div className="font-medium text-gray-700">Location</div>
                <div className="text-sm text-gray-500">
                    {formData.location?.city}{formData.location?.city && formData.location?.country ? ', ' : ''}
                    {formData.location?.country}{formData.location?.country && formData.location?.region ? ', ' : ''}
                    {formData.location?.region}
                </div>
              </div>
            </div>
          }
          {/* Add more summary items here as data is collected */}
        </div>
        <div className={styles.newData_safMessage}>Done! This helps me scan your food with your needs in mind.</div>
      </div>
      <div className={styles.newData_progressBarContainer}>
        <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      </div>
      <div className={styles.newData_bottomActions}><Button className={styles.newData_btnPrimary} onClick={handleNextDataStep}>Save My Profile</Button></div>
    </div>
  );
  
  const renderDataCollectionStep10 = () => (
    <div className={cn(styles.newData_screen, currentDataCollectionStep === 10 ? styles.newData_active : styles.newData_inactiveLeft )} id="data-screen-10">
      <div className={styles.newData_screenContent}>
        <div className={cn(styles.newData_safAvatar, "animate-float")}>🎉</div>
        <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-4")}>You're all set!</h1>
        <p className="text-gray-600 mb-8 text-center">Create a free Safora account to save your profile and start scanning safely.</p>
        
        <Button className={cn(styles.newData_btnPrimary, "mb-4 flex items-center justify-center")} onClick={() => router.push('/auth')}>
          <Mail size={20} className="mr-2"/> Sign Up with Email
        </Button>
        
        <Button
          className={cn(styles.newData_btnPrimary, "mb-6 flex items-center justify-center")}
          style={{background: 'linear-gradient(90deg, #4285F4, #3c78dc)'}} // Example for Google blue
          onClick={() => router.push('/auth?provider=google')} // Hypothetical query param
        >
          <GoogleIconSvg /> Sign Up with Google
        </Button>
        
        <Button className={cn(styles.newData_btnSecondary, "w-full")} onClick={handleContinueAsGuest}>
          Continue as Guest
        </Button>
        <p className="text-gray-500 text-xs text-center mt-2">Limited features available</p>
      </div>
       <div className={styles.newData_progressBarContainer}>
        <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
      </div>
      <div className={styles.newData_bottomActions}>
        {/* No explicit button here as options are above, or user proceeds to auth */}
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
      case 4: return renderPlaceholderScreen(4, "Do you follow any of these dietary paths?", "🥗");
      case 5: return renderPlaceholderScreen(5, "Any ingredients you avoid for personal, religious, or ethical reasons?", "🚫");
      case 6: return renderPlaceholderScreen(6, "Let's make sure you stay safe. Any known allergies?", "⚠️");
      case 7: return renderPlaceholderScreen(7, "Any health conditions I should be aware of?", "❤️");
      case 8: return renderPlaceholderScreen(8, "What are your current health goals?", "🎯");
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
         {currentDataCollectionStep > 0 && currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS && (
            <button
                onClick={handlePrevDataStep}
                className="absolute top-4 left-4 p-2 bg-gray-200/50 hover:bg-gray-300/70 rounded-full z-20"
                aria-label="Go back"
            >
                <ChevronLeft size={24} className="text-gray-700"/>
            </button>
        )}


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
          </div>
        )}
      </div>
    </div>
  );
}

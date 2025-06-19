
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import styles from './Onboarding.module.css';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile } from '@/lib/types';
import {
  HeartHandshake, ScanSearch, ShieldCheck, Sparkles, Apple, Leaf, Carrot, Wheat, Info, ChevronDown, ChevronLeft, ChevronRight, Check, Circle, Mail, User, CalendarDays, MapPin, Utensils, Ban, AlertTriangleIcon, ListChecks, BarChart3, Briefcase, ShieldQuestion, Milestone, Edit3, Map, LocateFixed, Loader2, ChevronsUpDown
} from 'lucide-react';
import Image from 'next/image';
import SecondOnboardingSlideImage from '@/image/2ndOnboardingSlide.png';
import { countryData, regions, dietaryPaths, ingredientsToAvoidOptions, commonAllergens, otherAllergensList, healthConditionsOptions, healthGoalsOptions } from '@/lib/onboardingOptions';
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

interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (newSelection: string[]) => void;
  placeholder: string;
  label?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedValues, onSelectionChange, placeholder, label }) => {
  const handleSelect = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onSelectionChange(newSelection);
  };

  const triggerLabel = selectedValues.length > 0
    ? `${selectedValues.length} selected`
    : placeholder;

  return (
    <div className="w-full max-w-md mx-auto">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1 text-left">{label}</label>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn(styles.newData_dropdownSelected, "w-full justify-between")}>
            <span>{triggerLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
          <DropdownMenuLabel>Select Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={() => handleSelect(option)}
              onSelect={(e) => e.preventDefault()} // Prevent closing on select
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading: profileLoading } = useProfile();

  const [currentVisualSlide, setCurrentVisualSlide] = useState(0);
  const [currentDataCollectionStep, setCurrentDataCollectionStep] = useState(0); // 0 means visual slides are active

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

  // Location specific states
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'region' | 'country' | 'city' | null>(null);
  const [dobCalendarOpen, setDobCalendarOpen] = useState(false);
  const [geolocationStatus, setGeolocationStatus] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev, ...profile,
        location: profile.location || { region: "", country: "", city: "" },
        selectedDiets: profile.selectedDiets || [],
        ingredientsToAvoid: profile.ingredientsToAvoid || [],
        knownAllergens: profile.knownAllergens || [],
        healthConditions: profile.healthConditions || [],
        healthGoalsList: profile.healthGoalsList || [],
      }));
      if (profile.location?.region) setSelectedRegion(profile.location.region);
      if (profile.location?.country) {
         setSelectedCountry(profile.location.country);
         setAvailableCountries(Object.keys(countryData).sort()); // Initialize with all countries
         if (countryData[profile.location.country]) {
            // In a real app, cities would likely come from an API or larger dataset
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
        } else { setFormData(prev => ({ ...prev, age: undefined })); }
      } catch (e) { setFormData(prev => ({ ...prev, age: undefined })); }
    } else { setFormData(prev => ({ ...prev, age: undefined })); }
  }, [formData.dateOfBirth]);

  const handleInputChange = useCallback((field: keyof Pick<UserProfile, 'firstName' | 'lastName' | 'customIngredientsToAvoid' | 'customAllergens'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleCityInputChange = useCallback((value: string) => {
    setSelectedCity(value);
    setFormData(prev => ({ ...prev, location: { ...prev.location, city: value } }));
  }, []);

  const handleLocationChange = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      location: { region: selectedRegion, country: selectedCountry, city: selectedCity }
    }));
  }, [selectedRegion, selectedCountry, selectedCity]);

  useEffect(() => { handleLocationChange(); }, [handleLocationChange]);

  const handleNextVisualSlide = useCallback(async () => {
    if (currentVisualSlide < TOTAL_VISUAL_SLIDES - 1) {
      setCurrentVisualSlide(prev => prev + 1);
    } else {
      await updateProfile({ ...formData, profileCompletionStatus: 'visual_complete' });
      setCurrentDataCollectionStep(1);
    }
  }, [currentVisualSlide, updateProfile, formData]);

  const handlePrevVisualSlide = useCallback(() => {
    if (currentVisualSlide > 0) setCurrentVisualSlide(prev => prev - 1);
  }, [currentVisualSlide]);

  const handleNextDataStep = useCallback(async () => {
    await updateProfile({ ...formData, profileCompletionStatus: 'data_collection_started' });
    if (currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS) {
      setCurrentDataCollectionStep(prev => prev + 1);
    }
  }, [currentDataCollectionStep, formData, updateProfile]);

  const handlePrevDataStep = useCallback(() => {
    if (currentDataCollectionStep > 1) {
      setCurrentDataCollectionStep(prev => prev - 1);
    } else if (currentDataCollectionStep === 1) { // Go back to visual slides
      setCurrentDataCollectionStep(0);
    }
  }, [currentDataCollectionStep]);

  const skipToAuth = async () => {
    await updateProfile({ ...formData, profileCompletionStatus: 'data_partial' });
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
  
  const handleMultiSelectionChange = useCallback((fieldName: keyof Pick<UserProfile, 'selectedDiets' | 'knownAllergens' | 'healthConditions' | 'healthGoalsList'>, newSelection: string[]) => {
    setFormData(prev => ({ ...prev, [fieldName]: newSelection }));
  }, []);

  useEffect(() => {
    let touchstartX = 0, touchendX = 0, touchstartY = 0, touchendY = 0;
    function handleSwipeGesture() {
      const deltaX = touchendX - touchstartX; const deltaY = touchendY - touchstartY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 75) {
        if (currentDataCollectionStep === 0) { if (deltaX < 0) handleNextVisualSlide(); else handlePrevVisualSlide(); }
        else { if (deltaX < 0) handleNextDataStep(); else handlePrevDataStep(); }
      }
    }
    const handleTouchStart = (e: TouchEvent) => { touchstartX = e.changedTouches[0].screenX; touchstartY = e.changedTouches[0].screenY; };
    const handleTouchEnd = (e: TouchEvent) => { touchendX = e.changedTouches[0].screenX; touchendY = e.changedTouches[0].screenY; handleSwipeGesture(); };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (currentDataCollectionStep === 0) { if (e.key === 'ArrowRight') handleNextVisualSlide(); if (e.key === 'ArrowLeft') handlePrevVisualSlide(); }
      else { if (e.key === 'ArrowRight') handleNextDataStep(); if (e.key === 'ArrowLeft') handlePrevDataStep(); }
    };
    document.addEventListener('touchstart', handleTouchStart); document.addEventListener('touchend', handleTouchEnd); document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('touchstart', handleTouchStart); document.removeEventListener('touchend', handleTouchEnd); document.removeEventListener('keydown', handleKeyDown); };
  }, [handleNextVisualSlide, handlePrevVisualSlide, handleNextDataStep, handlePrevDataStep, currentDataCollectionStep]);

  const visualProgressPercentage = ((currentVisualSlide + 1) / TOTAL_VISUAL_SLIDES) * 100;
  const dataCollectionProgressPercentage = (currentDataCollectionStep / TOTAL_DATA_COLLECTION_STEPS) * 100;

  const toggleDropdown = (dropdownName: 'region' | 'country' | 'city' | null) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setAvailableCountries(region === "All Regions" ? Object.keys(countryData).sort() : Object.keys(countryData).filter(cKey => {
        // This is a simplified mapping based on common knowledge for example.
        // A more robust solution would involve a proper region-country data structure.
        if (region === "North America") return ["United States", "Canada", "Mexico"].includes(cKey);
        if (region === "Europe") return ["United Kingdom", "Germany", "France", "Italy", "Spain"].includes(cKey); // Example subset
        // For other regions, or if "All Regions", show all or a broad list for now.
        return true; // Fallback, potentially needs better data structure
    }).sort());
    setSelectedCountry(''); setSelectedCity('');
    setOpenDropdown(null);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    // City population logic would go here if using an API or large local dataset.
    // For now, city is a text input.
    setSelectedCity('');
    setOpenDropdown(null);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) { setGeolocationStatus("Geolocation is not supported."); return; }
    setIsDetectingLocation(true); setGeolocationStatus("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocationStatus(`Location detected: Lat: ${position.coords.latitude.toFixed(2)}, Long: ${position.coords.longitude.toFixed(2)}. Please select region/country manually for now.`);
        setIsDetectingLocation(false);
      },
      (error) => { setGeolocationStatus(`Error: ${error.message}`); setIsDetectingLocation(false); }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { setOpenDropdown(null); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleChipToggle = useCallback((itemValue: string, fieldName: keyof Pick<UserProfile, 'ingredientsToAvoid' | 'knownAllergens'>) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] as string[] || [];
      const newArray = currentArray.includes(itemValue)
        ? currentArray.filter(item => item !== itemValue)
        : [...currentArray, itemValue];
      return { ...prev, [fieldName]: newArray };
    });
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) { setFormData(prev => ({ ...prev, dateOfBirth: format(date, "yyyy-MM-dd") })); }
    else { setFormData(prev => ({ ...prev, dateOfBirth: "" })); }
    setDobCalendarOpen(false);
  };

  const renderDataCollectionStep = (step: number) => {
    const screenClasses = cn(styles.newData_screen, currentDataCollectionStep === step ? styles.newData_active : (currentDataCollectionStep < step ? styles.newData_inactiveRight : styles.newData_inactiveLeft));
    const commonBottomActions = (
        <>
            <div className={styles.newData_progressBarContainer}>
                <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
            </div>
            <div className={styles.newData_bottomActions}>
                <Button className={styles.newData_btnPrimary} onClick={step === TOTAL_DATA_COLLECTION_STEPS ? handleSaveProfileAndRedirect : handleNextDataStep}>
                    {step === 9 ? "Save My Profile" : (step === TOTAL_DATA_COLLECTION_STEPS ? "Create Account" : "Continue")}
                </Button>
            </div>
        </>
    );
    
    const screenContentWrapper = (emoji: string, title: string, children: React.ReactNode, includeFillLaterButton?: boolean, fillLaterStep?: number) => (
        <div className={screenClasses} id={`data-screen-${step}`}>
            <div className={styles.newData_screenContent}>
                <div className={cn(styles.newData_safAvatar, "animate-float")}>{emoji}</div>
                <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-6")}>{title}</h1>
                {children}
                {includeFillLaterButton && (
                    <Button variant="link" className={cn(styles.newData_btnSecondary, "mt-6 bg-transparent border-none hover:underline")} onClick={skipToAuth}>
                        I'll fill this later
                    </Button>
                )}
            </div>
            {commonBottomActions}
        </div>
    );

    switch (step) {
      case 1: return screenContentWrapper("😊", "Hi there! I'm Saf", <p className="text-gray-600 mb-8 text-center">Let's build your food profile so I can protect you from hidden risks.</p>);
      case 2: return screenContentWrapper("👋", "First, what should I call you?",
        <>
          <Input type="text" className={styles.newData_inputField} placeholder="First Name" value={formData.firstName || ''} onChange={(e) => handleInputChange('firstName', e.target.value)} />
          <Input type="text" className={styles.newData_inputField} placeholder="Last Name" value={formData.lastName || ''} onChange={(e) => handleInputChange('lastName', e.target.value)} />
          <h2 className={cn(styles.newData_h1, "text-xl font-semibold mt-4 mb-2")}>When were you born?</h2>
          <Popover open={dobCalendarOpen} onOpenChange={setDobCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn(styles.newData_inputField, "w-full justify-start text-left font-normal", !formData.dateOfBirth && "text-muted-foreground")}>
                <CalendarDays className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? format(parseISO(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start"><Calendar mode="single" selected={formData.dateOfBirth ? parseISO(formData.dateOfBirth) : undefined} onSelect={handleDateSelect} initialFocus captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} /></PopoverContent>
          </Popover>
          {formData.age !== undefined && <p className="text-gray-600 text-sm mt-1">You are {formData.age} years old.</p>}
          <p className="text-gray-500 text-sm mt-4 text-center">This helps me personalize your health insights.</p>
        </>
      );
      case 3: return screenContentWrapper("🌎", "Where are you based?",
        <div className="w-full max-w-md mx-auto" ref={dropdownRef}>
            <div className={styles.newData_dropdownField}>
                <div className={cn(styles.newData_dropdownSelected, openDropdown === 'region' && styles.newData_active)} onClick={() => toggleDropdown('region')}><span>{selectedRegion || "Select your region"}</span> <ChevronDown /></div>
                <div className={cn(styles.newData_dropdownOptions, openDropdown === 'region' && styles.newData_show)}>{regions.map(region => (<div key={region} className={cn(styles.newData_dropdownOption, selectedRegion === region && styles.newData_selected)} onClick={() => handleRegionSelect(region)}>{region}</div>))}</div>
            </div>
            <div className={styles.newData_dropdownField}>
                <div className={cn(styles.newData_dropdownSelected, openDropdown === 'country' && styles.newData_active, !selectedRegion && "opacity-50 cursor-not-allowed")} onClick={() => selectedRegion && toggleDropdown('country')}><span>{selectedCountry || "Select your country"}</span> <ChevronDown /></div>
                <div className={cn(styles.newData_dropdownOptions, openDropdown === 'country' && styles.newData_show)}>{availableCountries.length > 0 ? availableCountries.map(country => (<div key={country} className={cn(styles.newData_dropdownOption, selectedCountry === country && styles.newData_selected)} onClick={() => handleCountrySelect(country)}>{country}</div>)) : <div className={cn(styles.newData_dropdownOption, styles.newData_disabled)}>Please select a region first</div>}</div>
            </div>
            <Input type="text" className={styles.newData_inputField} placeholder="Enter your city" value={selectedCity} onChange={(e) => handleCityInputChange(e.target.value)} disabled={!selectedCountry} />
            <Button className={cn(styles.newData_btnSecondary, "mb-4 flex items-center justify-center w-full")} onClick={handleDetectLocation} disabled={isDetectingLocation}>{isDetectingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed size={20} className="mr-2"/>}{isDetectingLocation ? 'Detecting...' : 'Auto-detect my location'}</Button>
            {geolocationStatus && <p className="text-xs text-muted-foreground mb-2 text-center">{geolocationStatus}</p>}
            <div className={styles.newData_safMessage}>I'll use this to match local food products. <div className={styles.newData_tooltip}> <Info size={16}/> <span className={styles.newData_tooltipText}>Regulations differ by region.</span> </div></div>
        </div>
      );
      case 4: return screenContentWrapper("🥗", "Do you follow any of these dietary paths?",
        <>
          <MultiSelectDropdown options={dietaryPaths} selectedValues={formData.selectedDiets || []} onSelectionChange={(newSelection) => handleMultiSelectionChange('selectedDiets', newSelection)} placeholder="Select dietary paths" />
          <Button variant="link" className={cn(styles.newData_btnSecondary, "mt-4 bg-transparent border-none hover:underline")} onClick={() => handleMultiSelectionChange('selectedDiets', [])}>I'm not sure / Clear selection</Button>
        </>
      );
      case 5: return screenContentWrapper("🚫", "Any ingredients you avoid for personal, religious, or ethical reasons?",
        <>
          <div className={cn(styles.newData_chipContainer, "justify-center mb-4")}>
            {ingredientsToAvoidOptions.map(opt => (<div key={opt.name} className={cn(styles.newData_chip, (formData.ingredientsToAvoid || []).includes(opt.name) && styles.newData_selected)} onClick={() => handleChipToggle(opt.name, 'ingredientsToAvoid')}>{opt.emoji && <span className="mr-2">{opt.emoji}</span>}{opt.name}</div>))}
          </div>
          <Input type="text" className={styles.newData_inputField} placeholder="Add other ingredients to avoid (comma-separated)" value={formData.customIngredientsToAvoid || ''} onChange={(e) => handleInputChange('customIngredientsToAvoid', e.target.value)} />
          <p className="text-gray-500 text-sm mt-4">Don't worry, you can change this later.</p>
        </>
      );
      case 6: return screenContentWrapper("⚠️", "Let's make sure you stay safe. Any known allergies?",
        <>
            <p className="text-sm text-muted-foreground mb-2 text-center">Select common allergies:</p>
            <div className={cn(styles.newData_chipContainer, "justify-center mb-4")}>
                {commonAllergens.map(opt => (<div key={opt.name} className={cn(styles.newData_chip, (formData.knownAllergens || []).includes(opt.name) && styles.newData_selected)} onClick={() => handleChipToggle(opt.name, 'knownAllergens')}>{opt.emoji && <span className="mr-2">{opt.emoji}</span>}{opt.name}</div>))}
            </div>
            <MultiSelectDropdown options={otherAllergensList} selectedValues={(formData.knownAllergens || []).filter(a => otherAllergensList.includes(a))} onSelectionChange={(newSelection) => {
                const commonSelected = (formData.knownAllergens || []).filter(a => !otherAllergensList.includes(a));
                handleMultiSelectionChange('knownAllergens', [...commonSelected, ...newSelection]);
            }} placeholder="Select other allergies" label="Other Less Common Allergies:" />
            <Input type="text" className={styles.newData_inputField} placeholder="List any other very specific allergies (comma-separated)" value={formData.customAllergens || ''} onChange={(e) => handleInputChange('customAllergens', e.target.value)} />
            <div className={styles.newData_safMessage}>I'll make sure these ingredients are flagged in every scan.</div>
        </>, true, 6
      );
      case 7: return screenContentWrapper("❤️", "Any health conditions I should be aware of?",
        <MultiSelectDropdown options={healthConditionsOptions} selectedValues={formData.healthConditions || []} onSelectionChange={(newSelection) => handleMultiSelectionChange('healthConditions', newSelection)} placeholder="Select health conditions" />, true, 7
      );
      case 8: return screenContentWrapper("🎯", "What are your current health goals?",
        <MultiSelectDropdown options={healthGoalsOptions} selectedValues={formData.healthGoalsList || []} onSelectionChange={(newSelection) => handleMultiSelectionChange('healthGoalsList', newSelection)} placeholder="Select health goals" />
      );
      case 9: return screenContentWrapper("📋", "Your Dietary Profile Summary",
        <div className={cn("bg-gray-50 p-4 rounded-xl mb-6 w-full max-w-md text-left overflow-y-auto", styles.newData_summaryContainerScrollable )}>
            {(formData.firstName || formData.lastName) && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><User size={18}/></div><div><div className="font-medium text-gray-700">Name</div><div className="text-sm text-gray-500">{formData.firstName} {formData.lastName}</div></div></div>}
            {formData.dateOfBirth && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><CalendarDays size={18}/></div><div><div className="font-medium text-gray-700">Born</div><div className="text-sm text-gray-500">{formData.dateOfBirth} {formData.age !== undefined ? `(Age: ${formData.age})` : ''}</div></div></div>}
            {(formData.location?.city || formData.location?.country || formData.location?.region) && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><MapPin size={18}/></div><div><div className="font-medium text-gray-700">Location</div><div className="text-sm text-gray-500">{[formData.location.city, formData.location.country, formData.location.region].filter(Boolean).join(', ')}</div></div></div>}
            {(formData.selectedDiets?.length || 0) > 0 && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><Utensils size={18}/></div><div><div className="font-medium text-gray-700">Dietary Paths</div><div className="text-sm text-gray-500">{(formData.selectedDiets || []).join(', ')}</div></div></div>}
            {((formData.ingredientsToAvoid?.length || 0) > 0 || formData.customIngredientsToAvoid) && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><Ban size={18}/></div><div><div className="font-medium text-gray-700">Ingredients to Avoid</div><div className="text-sm text-gray-500">{[...(formData.ingredientsToAvoid || []), formData.customIngredientsToAvoid].filter(Boolean).join(', ')}</div></div></div>}
            {((formData.knownAllergens?.length || 0) > 0 || formData.customAllergens) && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><AlertTriangleIcon size={18}/></div><div><div className="font-medium text-gray-700">Allergies</div><div className="text-sm text-gray-500">{[...(formData.knownAllergens || []), formData.customAllergens].filter(Boolean).join(', ')}</div></div></div>}
            {(formData.healthConditions?.length || 0) > 0 && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><ListChecks size={18}/></div><div><div className="font-medium text-gray-700">Health Conditions</div><div className="text-sm text-gray-500">{(formData.healthConditions || []).join(', ')}</div></div></div>}
            {(formData.healthGoalsList?.length || 0) > 0 && <div className={styles.newData_summaryItem}><div className={styles.newData_summaryIcon}><BarChart3 size={18}/></div><div><div className="font-medium text-gray-700">Health Goals</div><div className="text-sm text-gray-500">{(formData.healthGoalsList || []).join(', ')}</div></div></div>}
            <div className={styles.newData_safMessage}>Done! This helps me scan your food with your needs in mind.</div>
        </div>
      );
      case 10: return (
        <div className={screenClasses} id="data-screen-10">
            <div className={styles.newData_screenContent}>
                <div className={cn(styles.newData_safAvatar, "animate-float")}>🎉</div>
                <h1 className={cn(styles.newData_h1, "text-2xl sm:text-3xl font-bold mb-4")}>You're all set!</h1>
                <p className="text-gray-600 mb-8 text-center">Create a free Safora account to save your profile and start scanning safely.</p>
                <Button className={cn(styles.newData_btnPrimary, "mb-4 flex items-center justify-center w-full")} onClick={() => router.push('/auth')}><Mail size={20} className="mr-2"/> Sign Up with Email</Button>
                <Button className={cn(styles.newData_btnPrimary, "mb-6 flex items-center justify-center w-full")} style={{background: 'linear-gradient(90deg, #4285F4, #3c78dc)'}} onClick={() => router.push('/auth?provider=google')}><GoogleIconSvg /> Sign Up with Google</Button>
                <Button className={cn(styles.newData_btnSecondary, "w-full")} onClick={handleContinueAsGuest}>Continue as Guest</Button>
                <p className="text-gray-500 text-xs text-center mt-2">Limited features available</p>
            </div>
            {/* Progress bar is part of commonBottomActions, but step 10 doesn't use commonBottomActions directly due to different button structure */}
            <div className={styles.newData_progressBarContainer}>
                <div className={styles.newData_progressBar}><div className={styles.newData_progressFill} style={{ width: `${dataCollectionProgressPercentage}%` }}></div></div>
            </div>
        </div>
      );
      default: return null;
    }
  };
  
  if (profileLoading && !profile) {
    return (<div className={styles.onboardingRoot}><div className="flex items-center justify-center min-h-screen"><Sparkles className="w-16 h-16 text-primary animate-ping" /></div></div>);
  }

  return (
    <div className={styles.onboardingRoot}>
      <div className={cn(styles.onboardingContainer, currentDataCollectionStep > 0 && styles.newData_onboardingContainer)}>
         <div className={cn(styles.logoContainer, currentDataCollectionStep > 0 && styles.newData_logoContainer)}>
          <Logo />
        </div>
        {currentDataCollectionStep > 0 && currentDataCollectionStep < TOTAL_DATA_COLLECTION_STEPS && (
            <button onClick={handlePrevDataStep} className="absolute top-4 left-4 p-2 bg-gray-200/50 hover:bg-gray-300/70 rounded-full z-20" aria-label="Go back">
                <ChevronLeft size={24} className="text-gray-700"/>
            </button>
        )}

        {currentDataCollectionStep === 0 ? (
          <>
            {VisualOnboardingSlides.map((slide, index) => (
              <div key={slide.id} className={cn( styles.visualScreen, slide.backgroundClass, currentVisualSlide === index ? styles.visualScreenActive : currentVisualSlide > index ? styles.visualScreenInactiveLeft : styles.visualScreenInactiveRight )}>
                <div className={styles.slideContent}>
                  {slide.illustration}
                  <h2 className={styles.slideTitle}>{slide.title}</h2>
                  <p className={styles.slideDescription}>{slide.description}</p>
                </div>
                {currentVisualSlide === index && (
                  <div className={styles.slideActions}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-md w-full max-w-xs" onClick={handleNextVisualSlide}>
                      {currentVisualSlide === TOTAL_VISUAL_SLIDES - 1 ? "Let's Begin Data Setup" : "Next"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div className={styles.visualProgressBarContainer}><div className={styles.visualProgressBar}><div className={styles.visualProgressFill} style={{ width: `${visualProgressPercentage}%` }}></div></div></div>
            {currentVisualSlide < TOTAL_VISUAL_SLIDES - 1 && (<Button variant="ghost" onClick={skipToAuth} className={styles.skipButton}>Skip Visual Intro</Button>)}
          </>
        ) : (
           <div className={cn(styles.newData_innerContainer)}>
            {renderDataCollectionStep(currentDataCollectionStep)}
          </div>
        )}
      </div>
    </div>
  );
}

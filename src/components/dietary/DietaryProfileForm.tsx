
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile, UserProfileLocation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, User, CalendarDays, MapPin, Utensils, Ban, AlertTriangleIcon, ListChecks, Edit3, ChevronsUpDown, Check, Info, Circle, ChevronDown } from 'lucide-react';
import { parseISO, format, isValid, differenceInYears } from 'date-fns';
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
import styles from '@/app/(default)/onboarding/Onboarding.module.css'; // Import styles
import {
  countryData,
  regions,
  dietaryPaths,
  ingredientsToAvoidOptions,
  commonAllergens,
  otherAllergensList,
  healthConditionsOptions,
  healthGoalsOptions
} from '@/lib/onboardingOptions';

// Zod schema expecting arrays directly
const profileSchema = z.object({
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  dateOfBirth: z.string().optional().refine(val => !val || isValid(parseISO(val)), {
    message: "Invalid date format. Please use YYYY-MM-DD or select from calendar.",
  }).default(""),
  location: z.object({
    region: z.string().optional().default(""),
    country: z.string().optional().default(""),
    city: z.string().optional().default(""),
  }).optional().default({ region: "", country: "", city: "" }),
  
  selectedDiets: z.array(z.string()).optional().default([]),
  ingredientsToAvoid: z.array(z.string()).optional().default([]),
  customIngredientsToAvoid: z.string().optional().default(""),
  knownAllergens: z.array(z.string()).optional().default([]),
  customAllergens: z.string().optional().default(""),
  healthConditions: z.array(z.string()).optional().default([]),
  healthGoalsList: z.array(z.string()).optional().default([]),
  
  customRestrictions: z.string().optional().default(""),
});

type FormDataValidated = z.infer<typeof profileSchema>;

// Helper: Chip Component
interface ChipProps {
  label: string;
  emoji?: string;
  isSelected: boolean;
  onToggle: () => void;
}
const Chip: React.FC<ChipProps> = ({ label, emoji, isSelected, onToggle }) => (
  <div
    className={cn(styles.newData_chip, isSelected && styles.newData_selected)}
    onClick={onToggle}
  >
    {emoji && <span className="mr-2">{emoji}</span>}
    {label}
  </div>
);

// Helper: ControlledMultiSelectDropdown Component
interface ControlledMultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (newSelection: string[]) => void;
  placeholder: string;
  label?: string;
  fieldIcon?: React.ReactNode;
}
const ControlledMultiSelectDropdown: React.FC<ControlledMultiSelectDropdownProps> = ({
  options, selectedValues, onSelectionChange, placeholder, label, fieldIcon
}) => {
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
    <div className="space-y-2 w-full">
      {label && (
        <Label className="text-lg font-semibold flex items-center gap-2 text-foreground">
          {fieldIcon} {label}
        </Label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn(styles.newData_dropdownSelected, "w-full justify-between h-11")}>
            <span className="truncate">{triggerLabel}</span>
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

export function DietaryProfileForm() {
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormDataValidated>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "", lastName: "", dateOfBirth: "",
      location: { region: "", country: "", city: "" },
      selectedDiets: [], ingredientsToAvoid: [], customIngredientsToAvoid: "",
      knownAllergens: [], customAllergens: "", healthConditions: [],
      healthGoalsList: [], customRestrictions: "",
    },
  });

  // State for location dropdowns
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [openLocationDropdown, setOpenLocationDropdown] = useState<'region' | 'country' | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const [dobCalendarOpen, setDobCalendarOpen] = useState(false);


  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dateOfBirth: profile.dateOfBirth || "",
        location: profile.location || { region: "", country: "", city: "" },
        selectedDiets: profile.selectedDiets || [],
        ingredientsToAvoid: profile.ingredientsToAvoid || [],
        customIngredientsToAvoid: profile.customIngredientsToAvoid || "",
        knownAllergens: profile.knownAllergens || [],
        customAllergens: profile.customAllergens || "",
        healthConditions: profile.healthConditions || [],
        healthGoalsList: profile.healthGoalsList || [],
        customRestrictions: profile.customRestrictions || "",
      });
      // Initialize location dropdown states from profile
      if (profile.location?.region) {
        setSelectedRegion(profile.location.region);
        const countriesForRegion = countryData[profile.location.region as keyof typeof countryData] || Object.keys(countryData).filter(cKey => {
          // Simplified region to country mapping for initialization - ideally, countryData needs better structure or API
          if (profile.location?.region === "North America") return ["United States", "Canada", "Mexico"].includes(cKey);
          if (profile.location?.region === "Europe") return ["United Kingdom", "Germany", "France"].includes(cKey); // Example
          return true;
        }).sort();
        setAvailableCountries(countriesForRegion);
      } else {
        setAvailableCountries(Object.keys(countryData).sort());
      }
      if (profile.location?.country) setSelectedCountry(profile.location.country);
    }
  }, [profile, form]);

  const toggleLocationDropdown = (dropdownName: 'region' | 'country' | null) => {
    setOpenLocationDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    form.setValue('location.region', region, { shouldValidate: true });
    
    const countriesForRegion = countryData[region as keyof typeof countryData] || Object.keys(countryData).filter(cKey => {
        if (region === "North America") return ["United States", "Canada", "Mexico"].includes(cKey);
        if (region === "Europe") return ["United Kingdom", "Germany", "France", "Italy", "Spain"].includes(cKey);
         // Fallback for "All Regions" or other less defined regions to show all countries
        if (region === "All Regions" || !regions.includes(region) || regions.indexOf(region) > 6 ) return true;
        return true; 
    }).sort();
    setAvailableCountries(countriesForRegion);
    
    setSelectedCountry('');
    form.setValue('location.country', '', { shouldValidate: true });
    form.setValue('location.city', '', { shouldValidate: true });
    setOpenLocationDropdown(null);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    form.setValue('location.country', country, { shouldValidate: true });
    form.setValue('location.city', '', { shouldValidate: true });
    setOpenLocationDropdown(null);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setOpenLocationDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const onSubmit = async (data: FormDataValidated) => {
    let age;
    if(data.dateOfBirth && isValid(parseISO(data.dateOfBirth))) {
        age = differenceInYears(new Date(), parseISO(data.dateOfBirth));
    }

    const profileToSave: Partial<UserProfile> = {
      ...data,
      age: age,
      profileCompletionStatus: 'data_complete',
    };

    try {
      await updateProfile(profileToSave);
      toast({ title: "Profile Updated", description: "Your dietary profile has been saved successfully." });
      router.push('/profile'); 
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message || "Could not save profile.", variant: "destructive" });
    }
  };
  
  if (profileLoading && !form.formState.isDirty && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary flex items-center gap-3"><Edit3 /> Edit Your Dietary Profile</CardTitle>
        <CardDescription>Refine your preferences to get the most accurate food insights from Safora.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          <section className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted/20">
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2"><User />Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...form.register('firstName')} placeholder="e.g., Alex" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...form.register('lastName')} placeholder="e.g., Smith" />
              </div>
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field }) => (
                  <Popover open={dobCalendarOpen} onOpenChange={setDobCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn(styles.newData_inputField, "w-full justify-start text-left font-normal h-11", !field.value && "text-muted-foreground")}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          setDobCalendarOpen(false);
                        }}
                        initialFocus
                        captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {form.formState.errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{form.formState.errors.dateOfBirth.message}</p>}
            </div>
            
            <div ref={locationDropdownRef}>
                <Label className="text-md font-medium block mb-2">Location</Label>
                <div className="space-y-3">
                    <div className={styles.newData_dropdownField}>
                        <Label htmlFor="location.region" className="text-xs text-muted-foreground">Region</Label>
                        <div className={cn(styles.newData_dropdownSelected, openLocationDropdown === 'region' && styles.newData_active)} onClick={() => toggleLocationDropdown('region')}>
                            <span>{selectedRegion || "Select your region"}</span> <ChevronDown />
                        </div>
                        <div className={cn(styles.newData_dropdownOptions, openLocationDropdown === 'region' && styles.newData_show)}>
                            {regions.map(region => (<div key={region} className={cn(styles.newData_dropdownOption, selectedRegion === region && styles.newData_selected)} onClick={() => handleRegionSelect(region)}>{region}</div>))}
                        </div>
                    </div>
                    <div className={styles.newData_dropdownField}>
                        <Label htmlFor="location.country" className="text-xs text-muted-foreground">Country</Label>
                        <div className={cn(styles.newData_dropdownSelected, openLocationDropdown === 'country' && styles.newData_active, !selectedRegion && "opacity-50 cursor-not-allowed")} onClick={() => selectedRegion && toggleLocationDropdown('country')}>
                            <span>{selectedCountry || "Select your country"}</span> <ChevronDown />
                        </div>
                        <div className={cn(styles.newData_dropdownOptions, openLocationDropdown === 'country' && styles.newData_show)}>
                            {availableCountries.length > 0 ? availableCountries.map(country => (<div key={country} className={cn(styles.newData_dropdownOption, selectedCountry === country && styles.newData_selected)} onClick={() => handleCountrySelect(country)}>{country}</div>)) : <div className={cn(styles.newData_dropdownOption, styles.newData_disabled)}>Please select a region first</div>}
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="location.city" className="text-xs text-muted-foreground">City</Label>
                        <Input id="location.city" {...form.register('location.city')} placeholder="e.g., New York" disabled={!selectedCountry}/>
                    </div>
                </div>
            </div>
          </section>

          <Controller
            name="selectedDiets"
            control={form.control}
            render={({ field }) => (
              <ControlledMultiSelectDropdown
                options={dietaryPaths}
                selectedValues={field.value || []}
                onSelectionChange={field.onChange}
                placeholder="Select dietary paths"
                label="Dietary Paths"
                fieldIcon={<Utensils size={20} />}
              />
            )}
          />
        
          <section className="space-y-2">
            <Label className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Ban size={20} /> Specific Ingredients to Avoid (Non-Allergy)
            </Label>
            <Controller
              name="ingredientsToAvoid"
              control={form.control}
              render={({ field }) => (
                <div className={cn(styles.newData_chipContainer, "py-2")}>
                  {ingredientsToAvoidOptions.map(opt => (
                    <Chip
                      key={opt.name}
                      label={opt.name}
                      emoji={opt.emoji}
                      isSelected={(field.value || []).includes(opt.name)}
                      onToggle={() => {
                        const current = field.value || [];
                        const newValue = current.includes(opt.name)
                          ? current.filter(item => item !== opt.name)
                          : [...current, opt.name];
                        field.onChange(newValue);
                      }}
                    />
                  ))}
                </div>
              )}
            />
            <div>
              <Label htmlFor="customIngredientsToAvoid" className="text-sm">Other Specific Ingredients to Avoid (Custom)</Label>
              <Input id="customIngredientsToAvoid" {...form.register('customIngredientsToAvoid')} placeholder="List any other specific non-allergy ingredients" />
            </div>
          </section>

          <section className="space-y-2">
            <Label className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <AlertTriangleIcon size={20} /> Known Allergens
            </Label>
            <Controller
              name="knownAllergens"
              control={form.control}
              render={({ field }) => (
                <>
                  <p className="text-xs text-muted-foreground">Select common allergens:</p>
                  <div className={cn(styles.newData_chipContainer, "py-2")}>
                    {commonAllergens.map(opt => (
                      <Chip
                        key={opt.name}
                        label={opt.name}
                        emoji={opt.emoji}
                        isSelected={(field.value || []).includes(opt.name)}
                        onToggle={() => {
                          const current = field.value || [];
                          const newValue = current.includes(opt.name)
                            ? current.filter(item => item !== opt.name)
                            : [...current, opt.name];
                          field.onChange(newValue);
                        }}
                      />
                    ))}
                  </div>
                  <ControlledMultiSelectDropdown
                    options={otherAllergensList}
                    selectedValues={(field.value || []).filter(val => otherAllergensList.includes(val))}
                    onSelectionChange={(newSelection) => {
                       const commonSelected = (field.value || []).filter(val => !otherAllergensList.includes(val));
                       field.onChange([...commonSelected, ...newSelection]);
                    }}
                    placeholder="Select other/less common allergies"
                    label="Other/Less Common Allergies"
                  />
                </>
              )}
            />
            <div>
              <Label htmlFor="customAllergens" className="text-sm">Other Specific Allergies (Custom)</Label>
              <Input id="customAllergens" {...form.register('customAllergens')} placeholder="List any other specific allergies" />
            </div>
          </section>

          <Controller
            name="healthConditions"
            control={form.control}
            render={({ field }) => (
              <ControlledMultiSelectDropdown
                options={healthConditionsOptions}
                selectedValues={field.value || []}
                onSelectionChange={field.onChange}
                placeholder="Select health conditions"
                label="Health Conditions"
                fieldIcon={<ListChecks size={20} />}
              />
            )}
          />
          
          <Controller
            name="healthGoalsList"
            control={form.control}
            render={({ field }) => (
              <ControlledMultiSelectDropdown
                options={healthGoalsOptions}
                selectedValues={field.value || []}
                onSelectionChange={field.onChange}
                placeholder="Select health goals"
                label="Health Goals"
                fieldIcon={<Circle /* Placeholder, ideally BarChart3 */ size={20} />}
              />
            )}
          />

          <section className="space-y-2">
            <Label htmlFor="customRestrictions" className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Info size={20}/> Other General Notes or Restrictions
            </Label>
            <Controller
              control={form.control}
              name="customRestrictions"
              render={({ field }) => (
                 <Input id="customRestrictions" {...field} placeholder="e.g., avoid artificial sweeteners, prefer organic..." />
              )}
            />
          </section>

          <CardFooter className="p-0 pt-8 flex-col sm:flex-row items-center gap-4">
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8" disabled={profileLoading || form.formState.isSubmitting}>
              {profileLoading || form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
             <Button type="button" variant="outline" onClick={() => router.push('/profile')} className="w-full sm:w-auto">
                Cancel
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}


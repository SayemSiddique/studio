
"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfile, UserProfileLocation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, User, CalendarDays, MapPin, Utensils, Ban, AlertTriangleIcon, ListChecks, BarChart3, ShieldQuestion } from 'lucide-react';

// Helper to transform comma-separated string to array of strings
const stringToArray = (value?: string): string[] => {
  if (!value || typeof value !== 'string') return [];
  return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

// Helper to transform array of strings to comma-separated string
const arrayToString = (value?: string[]): string => {
  if (!value || !Array.isArray(value)) return "";
  return value.join(', ');
};

const profileSchema = z.object({
  name: z.string().optional().default(""),
  dateOfBirth: z.string().optional().default(""), // Consider a date-specific validation if using a date picker
  location: z.object({
    region: z.string().optional().default(""),
    country: z.string().optional().default(""),
    city: z.string().optional().default(""),
  }).optional().default({ region: "", country: "", city: "" }),
  
  selectedDiets: z.string().transform(stringToArray).optional().default([]),
  ingredientsToAvoid: z.string().transform(stringToArray).optional().default([]),
  customIngredientsToAvoid: z.string().optional().default(""),
  knownAllergens: z.string().transform(stringToArray).optional().default([]),
  customAllergens: z.string().optional().default(""),
  healthConditions: z.string().transform(stringToArray).optional().default([]),
  healthGoalsList: z.string().transform(stringToArray).optional().default([]),
  
  customRestrictions: z.string().optional().default(""), // Retain old general custom field if needed
});

type FormData = z.infer<typeof profileSchema>;

// Helper component for Textarea sections
const TextareaSection: React.FC<{
  control: any;
  name: keyof Pick<FormData, 'selectedDiets' | 'ingredientsToAvoid' | 'knownAllergens' | 'healthConditions' | 'healthGoalsList'>;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
}> = ({ control, name, label, icon, placeholder }) => (
  <section className="space-y-2">
    <Label htmlFor={name} className="text-lg font-semibold flex items-center gap-2 text-foreground">
      {icon} {label}
    </Label>
    <p className="text-xs text-muted-foreground">Enter items separated by commas (e.g., item1, item2, item3).</p>
    <Controller
      control={control}
      name={name as any} // Type assertion for Controller
      render={({ field }) => (
        <Textarea
          id={name}
          {...field}
          placeholder={placeholder}
          className="min-h-[80px] resize-y"
          value={field.value} // Ensure this is a string
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  </section>
);


export function DietaryProfileForm() {
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
      customRestrictions: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        dateOfBirth: profile.dateOfBirth || "",
        location: {
          region: profile.location?.region || "",
          country: profile.location?.country || "",
          city: profile.location?.city || "",
        },
        selectedDiets: arrayToString(profile.selectedDiets),
        ingredientsToAvoid: arrayToString(profile.ingredientsToAvoid),
        customIngredientsToAvoid: profile.customIngredientsToAvoid || "",
        knownAllergens: arrayToString(profile.knownAllergens),
        customAllergens: profile.customAllergens || "",
        healthConditions: arrayToString(profile.healthConditions),
        healthGoalsList: arrayToString(profile.healthGoalsList),
        customRestrictions: profile.customRestrictions || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: any) => { // data is initially string-based for Textareas
    const processedData: Partial<UserProfile> = {
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      location: data.location,
      selectedDiets: stringToArray(data.selectedDiets),
      ingredientsToAvoid: stringToArray(data.ingredientsToAvoid),
      customIngredientsToAvoid: data.customIngredientsToAvoid,
      knownAllergens: stringToArray(data.knownAllergens),
      customAllergens: data.customAllergens,
      healthConditions: stringToArray(data.healthConditions),
      healthGoalsList: stringToArray(data.healthGoalsList),
      customRestrictions: data.customRestrictions,
      profileCompletionStatus: 'data_complete', // Assume completing form means data is complete
    };

    try {
      await updateProfile(processedData);
      toast({ title: "Profile Updated", description: "Your dietary profile has been saved successfully." });
      router.push('/profile'); // Navigate to view profile page
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message || "Could not save profile.", variant: "destructive" });
    }
  };
  
  if (profileLoading && !form.formState.isDirty && !profile) { // Check if profile is null before rendering loader for initial load
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Edit Your Dietary Profile</CardTitle>
        <CardDescription>Refine your preferences to get the most accurate food insights from Safora.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          <section className="space-y-4 p-4 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center gap-2"><User />Personal Information</h3>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...form.register('name')} placeholder="e.g., Alex Smith" />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="text" {...form.register('dateOfBirth')} placeholder="YYYY-MM-DD" />
            </div>
             <Label>Location</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <Label htmlFor="location.region" className="text-xs text-muted-foreground">Region</Label>
                    <Input id="location.region" {...form.register('location.region')} placeholder="e.g., North America" />
                </div>
                <div>
                    <Label htmlFor="location.country" className="text-xs text-muted-foreground">Country</Label>
                    <Input id="location.country" {...form.register('location.country')} placeholder="e.g., United States" />
                </div>
                <div>
                     <Label htmlFor="location.city" className="text-xs text-muted-foreground">City</Label>
                    <Input id="location.city" {...form.register('location.city')} placeholder="e.g., New York" />
                </div>
            </div>
          </section>
          
          <TextareaSection
            control={form.control}
            name="selectedDiets"
            label="Dietary Paths"
            icon={<Utensils size={20} />}
            placeholder="e.g., Vegetarian, Vegan, Keto, Halal, Kosher"
          />

          <TextareaSection
            control={form.control}
            name="ingredientsToAvoid"
            label="Specific Ingredients to Avoid"
            icon={<Ban size={20}/>}
            placeholder="e.g., Pork, Alcohol, Artificial Sweeteners"
          />
           <div>
              <Label htmlFor="customIngredientsToAvoid">Other Ingredients to Avoid (Custom)</Label>
              <Input id="customIngredientsToAvoid" {...form.register('customIngredientsToAvoid')} placeholder="List any other specific ingredients" />
            </div>


          <TextareaSection
            control={form.control}
            name="knownAllergens"
            label="Known Allergens"
            icon={<AlertTriangleIcon size={20} />}
            placeholder="e.g., Peanuts, Milk, Soy, Gluten"
          />
          <div>
              <Label htmlFor="customAllergens">Other Allergens (Custom)</Label>
              <Input id="customAllergens" {...form.register('customAllergens')} placeholder="List any other specific allergies" />
            </div>

          <TextareaSection
            control={form.control}
            name="healthConditions"
            label="Health Conditions"
            icon={<ListChecks size={20} />}
            placeholder="e.g., Diabetes, High Blood Pressure, Celiac Disease"
          />

          <TextareaSection
            control={form.control}
            name="healthGoalsList"
            label="Health Goals"
            icon={<BarChart3 size={20} />}
            placeholder="e.g., Weight Loss, Muscle Gain, Gut Health"
          />

          <section className="space-y-2">
            <Label htmlFor="customRestrictions" className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <ShieldQuestion size={20}/> Other General Notes/Restrictions (Legacy Field)
            </Label>
             <p className="text-xs text-muted-foreground">This field is for any general notes not covered above. New details should be entered in the specific sections.</p>
            <Controller
              control={form.control}
              name="customRestrictions"
              render={({ field }) => (
                <Textarea
                  id="customRestrictions"
                  {...field}
                  placeholder="e.g., avoid artificial sweeteners, prefer organic, low sodium..."
                  className="min-h-[100px]"
                />
              )}
            />
          </section>


          <CardFooter className="p-0 pt-8">
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
             <Button type="button" variant="outline" onClick={() => router.push('/profile')} className="ml-4">
                Cancel
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

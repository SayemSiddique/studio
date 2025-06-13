"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const dietaryPreferencesSchema = z.object({
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isDairyFree: z.boolean().default(false),
  isLowCarb: z.boolean().default(false),
  isKeto: z.boolean().default(false),
  otherPreferences: z.array(z.string()).default([]),
}).default({});

const allergiesSchema = z.object({
  hasPeanuts: z.boolean().default(false),
  hasTreeNuts: z.boolean().default(false),
  hasMilk: z.boolean().default(false),
  hasEggs: z.boolean().default(false),
  hasWheat: z.boolean().default(false),
  hasSoy: z.boolean().default(false),
  hasFish: z.boolean().default(false),
  hasShellfish: z.boolean().default(false),
  otherAllergies: z.array(z.string()).default([]),
}).default({});

const healthGoalsSchema = z.object({
  wantsWeightLoss: z.boolean().default(false),
  wantsMuscleGain: z.boolean().default(false),
  wantsMaintainWeight: z.boolean().default(false),
  wantsImproveGutHealth: z.boolean().default(false),
  wantsLowerSugarIntake: z.boolean().default(false),
  otherGoals: z.array(z.string()).default([]),
}).default({});

const profileSchema = z.object({
  dietaryPreferences: dietaryPreferencesSchema,
  allergies: allergiesSchema,
  healthGoals: healthGoalsSchema,
  customRestrictions: z.string().optional().default(""),
});

type FormData = z.infer<typeof profileSchema>;

const CheckboxField: React.FC<{ control: any; name: string; label: string; parentKey: keyof UserProfile }> = ({ control, name, label, parentKey }) => (
  <Controller
    control={control}
    name={`${parentKey}.${name}` as any}
    render={({ field }) => (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${parentKey}-${name}`}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
        <Label htmlFor={`${parentKey}-${name}`} className="font-normal text-foreground/90">
          {label}
        </Label>
      </div>
    )}
  />
);


export function DietaryProfileForm() {
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || {
      dietaryPreferences: {},
      allergies: {},
      healthGoals: {},
      customRestrictions: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile as FormData); // Type assertion as profile can be null initially
    }
  }, [profile, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile(data);
      toast({ title: "Profile Updated", description: "Your dietary profile has been saved successfully." });
      router.push('/home');
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message || "Could not save profile.", variant: "destructive" });
    }
  };
  
  if (profileLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">Your Dietary Profile</CardTitle>
        <CardDescription>Help us understand your needs to provide personalized food insights. Select all that apply.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Dietary Preferences */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Dietary Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckboxField control={form.control} name="isVegetarian" label="Vegetarian" parentKey="dietaryPreferences" />
              <CheckboxField control={form.control} name="isVegan" label="Vegan" parentKey="dietaryPreferences" />
              <CheckboxField control={form.control} name="isGlutenFree" label="Gluten-Free" parentKey="dietaryPreferences" />
              <CheckboxField control={form.control} name="isDairyFree" label="Dairy-Free" parentKey="dietaryPreferences" />
              <CheckboxField control={form.control} name="isLowCarb" label="Low-Carb" parentKey="dietaryPreferences" />
              <CheckboxField control={form.control} name="isKeto" label="Keto" parentKey="dietaryPreferences" />
            </div>
            {/* Add "Other Preferences" input later if needed with array handling */}
          </section>

          {/* Allergies */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Allergies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckboxField control={form.control} name="hasPeanuts" label="Peanuts" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasTreeNuts" label="Tree Nuts" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasMilk" label="Milk" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasEggs" label="Eggs" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasWheat" label="Wheat" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasSoy" label="Soy" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasFish" label="Fish" parentKey="allergies" />
              <CheckboxField control={form.control} name="hasShellfish" label="Shellfish" parentKey="allergies" />
            </div>
            {/* Add "Other Allergies" input later if needed with array handling */}
          </section>

          {/* Health Goals */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Health Goals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CheckboxField control={form.control} name="wantsWeightLoss" label="Weight Loss" parentKey="healthGoals" />
              <CheckboxField control={form.control} name="wantsMuscleGain" label="Muscle Gain" parentKey="healthGoals" />
              <CheckboxField control={form.control} name="wantsMaintainWeight" label="Maintain Weight" parentKey="healthGoals" />
              <CheckboxField control={form.control} name="wantsImproveGutHealth" label="Improve Gut Health" parentKey="healthGoals" />
              <CheckboxField control={form.control} name="wantsLowerSugarIntake" label="Lower Sugar Intake" parentKey="healthGoals" />
            </div>
            {/* Add "Other Goals" input later if needed with array handling */}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Other Restrictions or Notes</h3>
             <Controller
                control={form.control}
                name="customRestrictions"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="e.g., avoid artificial sweeteners, prefer organic, low sodium..."
                    className="min-h-[100px]"
                  />
                )}
              />
          </section>

          <CardFooter className="p-0 pt-6">
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-8" disabled={profileLoading || form.formState.isSubmitting}>
              {profileLoading || form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

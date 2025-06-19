
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2, Edit3, ShieldCheck, HeartPulse, Utensils, Loader2, AlertTriangle, Settings, ListFilter, CalendarDays, MapPin, Ban, Info } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { format, parseISO, isValid } from 'date-fns';

const DetailItem: React.FC<{ label: string; value?: string | number | null; items?: string[], customItems?: string | null }> = ({ label, value, items, customItems }) => {
  const hasValue = value !== undefined && value !== null && String(value).trim() !== "";
  const hasItems = items && items.length > 0;
  const hasCustomItems = customItems && customItems.trim() !== "";

  if (!hasValue && !hasItems && !hasCustomItems) {
    return (
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
        <p className="text-foreground/70 italic text-sm">Not specified.</p>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
      {hasValue && <p className="text-foreground/90">{String(value)}</p>}
      {hasItems && (
        <ul className="list-disc list-inside text-foreground/90 space-y-1 ml-4 text-sm">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      )}
      {hasCustomItems && (
         <div className="mt-1">
            <p className="text-xs font-medium text-muted-foreground/80">Custom additions:</p>
            <p className="text-foreground/80 text-sm pl-2 border-l-2 border-primary/30 ml-2">{customItems}</p>
         </div>
      )}
       {!hasItems && !hasCustomItems && hasValue && String(value).trim() === "" && (
         <p className="text-foreground/70 italic text-sm">Not specified.</p>
       )}
    </div>
  );
};


export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
         <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <p className="text-xl text-destructive">User not found. Please log in.</p>
        <Button asChild className="mt-4"><Link href="/auth">Log In</Link></Button>
      </div>
    );
  }
  
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : (user.displayName ? user.displayName.charAt(0).toUpperCase() : (profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : "S"));
  const displayName = profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.firstName || profile?.name || user.displayName || user.email?.split('@')[0];

  const formattedDOB = profile?.dateOfBirth && isValid(parseISO(profile.dateOfBirth)) 
    ? format(parseISO(profile.dateOfBirth), "PPP") 
    : profile?.dateOfBirth || null;

  const locationString = [profile?.location?.city, profile?.location?.country, profile?.location?.region].filter(Boolean).join(', ');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b">
        <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
          <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png?text=${userInitial}`} alt={displayName || "User"} data-ai-hint="profile avatar large" />
          <AvatarFallback className="text-3xl bg-muted">{userInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">{displayName}</h1>
          <p className="text-lg text-muted-foreground">{user.email}</p>
        </div>
        <Button asChild variant="outline" className="ml-auto mt-4 sm:mt-0">
            <Link href="/dietary-profile">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <UserCircle2 className="h-7 w-7" /> Personal Information
          </CardTitle>
          <CardDescription>Your basic profile details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailItem label="First Name" value={profile?.firstName} />
          <DetailItem label="Last Name" value={profile?.lastName} />
          <DetailItem label="Date of Birth" value={formattedDOB} />
          {profile?.age !== undefined && <DetailItem label="Age" value={`${profile.age} years old`} />}
          <DetailItem label="Location" value={locationString} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <Utensils className="h-7 w-7" /> Dietary Paths
          </CardTitle>
          <CardDescription>Your chosen dietary lifestyles.</CardDescription>
        </CardHeader>
        <CardContent>
            <DetailItem items={profile?.selectedDiets} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <Ban className="h-7 w-7" /> Ingredients to Avoid (Non-Allergy)
          </CardTitle>
          <CardDescription>Specific ingredients you avoid for personal reasons.</CardDescription>
        </CardHeader>
        <CardContent>
            <DetailItem items={profile?.ingredientsToAvoid} customItems={profile?.customIngredientsToAvoid} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <ShieldCheck className="h-7 w-7" /> Allergies
          </CardTitle>
          <CardDescription>Allergens Safora helps you avoid.</CardDescription>
        </CardHeader>
        <CardContent>
          <DetailItem items={profile?.knownAllergens} customItems={profile?.customAllergens}/>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <HeartPulse className="h-7 w-7" /> Health Conditions
          </CardTitle>
          <CardDescription>Your health conditions Safora should be aware of.</CardDescription>
        </CardHeader>
        <CardContent>
          <DetailItem items={profile?.healthConditions} />
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-primary">
            <ListChecks className="h-7 w-7" /> Health Goals
          </CardTitle>
          <CardDescription>Your wellness objectives.</CardDescription>
        </CardHeader>
        <CardContent>
          <DetailItem items={profile?.healthGoalsList} />
        </CardContent>
      </Card>

      {profile?.customRestrictions && profile.customRestrictions.trim().length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <Info className="h-7 w-7" /> Other General Notes/Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-wrap">{profile.customRestrictions}</p>
          </CardContent>
        </Card>
      )}
      
      <CardFooter className="pt-6 border-t flex justify-center">
         <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dietary-profile">
              <Settings className="mr-2 h-5 w-5" /> Update My Dietary Profile
            </Link>
          </Button>
      </CardFooter>
    </div>
  );
}


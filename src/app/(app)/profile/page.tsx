"use client";

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2, Edit3, ShieldCheck, HeartPulse, UtensilsCrossed, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const DetailItem: React.FC<{ label: string; value?: string | null; items?: string[] }> = ({ label, value, items }) => {
  if (!value && (!items || items.length === 0)) return null;
  return (
    <div className="mb-3">
      <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
      {value && <p className="text-foreground/90">{value}</p>}
      {items && items.length > 0 && (
        <ul className="list-disc list-inside text-foreground/90">
          {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      )}
    </div>
  );
};

const formatBooleanArray = (data: Record<string, any> | undefined, prefix: string = ""): string[] => {
  if (!data) return [];
  return Object.entries(data)
    .filter(([, value]) => value === true)
    .map(([key]) => {
      const name = key.substring(key.startsWith("is") ? 2 : (key.startsWith("has") ? 3 : 5));
      return `${prefix}${name.replace(/([A-Z])/g, ' $1').trim()}`;
    });
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
  
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "S";

  const preferencesList = formatBooleanArray(profile?.dietaryPreferences);
  const allergiesList = formatBooleanArray(profile?.allergies);
  const goalsList = formatBooleanArray(profile?.healthGoals);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png?text=${userInitial}`} alt={user.displayName || user.email || "User"} data-ai-hint="profile avatar large" />
          <AvatarFallback className="text-3xl">{userInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">{user.displayName || user.email?.split('@')[0]}</h1>
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
          <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <UserCircle2 className="h-7 w-7" /> Account Information
          </CardTitle>
          <CardDescription>Your personal and login details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailItem label="Display Name" value={user.displayName || "Not set"} />
          <DetailItem label="Email Address" value={user.email} />
          {/* Add other user details if available, e.g., join date */}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <UtensilsCrossed className="h-7 w-7" /> Dietary Preferences
          </CardTitle>
          <CardDescription>How Safora tailors insights for you.</CardDescription>
        </CardHeader>
        <CardContent>
            {preferencesList.length > 0 ? <DetailItem items={preferencesList} /> : <p className="text-muted-foreground">No specific dietary preferences set.</p>}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <ShieldCheck className="h-7 w-7" /> Allergies
          </CardTitle>
          <CardDescription>Allergens Safora helps you avoid.</CardDescription>
        </CardHeader>
        <CardContent>
          {allergiesList.length > 0 ? <DetailItem items={allergiesList} /> : <p className="text-muted-foreground">No allergies specified.</p>}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-primary">
            <HeartPulse className="h-7 w-7" /> Health Goals
          </CardTitle>
          <CardDescription>Your wellness objectives.</CardDescription>
        </CardHeader>
        <CardContent>
          {goalsList.length > 0 ? <DetailItem items={goalsList} /> : <p className="text-muted-foreground">No health goals specified.</p>}
        </CardContent>
      </Card>

      {profile?.customRestrictions && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-primary">
              Other Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 whitespace-pre-wrap">{profile.customRestrictions}</p>
          </CardContent>
        </Card>
      )}
      
      <CardFooter className="pt-6 border-t">
         <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dietary-profile">
              <Edit3 className="mr-2 h-5 w-5" /> Update My Dietary Profile
            </Link>
          </Button>
      </CardFooter>
    </div>
  );
}

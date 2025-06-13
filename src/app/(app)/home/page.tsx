"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ArrowRight, CheckCircle, ListChecks, ScanLine, UserCircle2, UtensilsCrossed } from 'lucide-react';
import { ScanResult } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';
import * as React from 'react';


const mockRecentScans: ScanResult[] = [
  {
    barcode: '1234567890123',
    name: 'Organic Peanut Butter',
    brand: 'NatureNosh',
    imageUrl: 'https://placehold.co/300x200.png?text=Peanut+Butter',
    dataAiHint: "peanut butter",
    ingredients: ['Organic Peanuts', 'Salt'],
    compatibility: 'Safe',
    reason: 'Aligns with your preferences.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    barcode: '9876543210987',
    name: 'Whole Wheat Bread',
    brand: 'Bakery Co.',
    imageUrl: 'https://placehold.co/300x200.png?text=Wheat+Bread',
    dataAiHint: "wheat bread",
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
    compatibility: 'Not Recommended',
    reason: 'Contains wheat, which you are avoiding.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
   {
    barcode: '5432109876543',
    name: 'Almond Milk',
    brand: 'NutriMilks',
    imageUrl: 'https://placehold.co/300x200.png?text=Almond+Milk',
    dataAiHint: "almond milk",
    ingredients: ['Almonds', 'Water', 'Calcium Carbonate', 'Sea Salt'],
    compatibility: 'Safe',
    reason: 'Good dairy-free alternative.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];


export default function HomePage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [recentScans, setRecentScans] = React.useState<ScanResult[]>([]);

  React.useEffect(() => {
    // In a real app, fetch recent scans for the user
    // For now, use mock data and potentially filter/sort
    const storedHistory = localStorage.getItem('saforaScanHistory');
    if (storedHistory) {
      const history: ScanResult[] = JSON.parse(storedHistory);
      setRecentScans(history.slice(0,3)); // show latest 3
    } else {
       setRecentScans(mockRecentScans.slice(0,3));
    }

  }, []);


  const isProfileSetup = profile && (
    Object.keys(profile.dietaryPreferences).length > 0 ||
    Object.keys(profile.allergies).length > 0 ||
    Object.keys(profile.healthGoals).length > 0 ||
    (profile.customRestrictions && profile.customRestrictions.length > 0)
  );

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/20 p-8 md:p-12 rounded-xl shadow-lg">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
              Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-lg text-foreground/80 mb-8">
              Ready to make informed food choices? Safora helps you understand what's in your food and if it fits your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-md">
                <Link href="/scan">
                  <ScanLine className="mr-2 h-5 w-5" />
                  Scan New Product
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-primary text-primary hover:bg-primary/5 shadow-md">
                <Link href="/history">
                  <ListChecks className="mr-2 h-5 w-5" />
                  View Scan History
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block text-center">
             <Image src="https://images.unsplash.com/photo-1666493555974-5f248865fb99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoZWFsdGh5JTIwcGFja2FnZWQlMjBmb29kfGVufDB8fHx8MTc0OTgxNDYyM3ww&ixlib=rb-4.1.0&q=80&w=1080" alt="Healthy Eating" width={400} height={300} className="rounded-lg shadow-md mx-auto" data-ai-hint="healthy eating fruits" />
          </div>
        </div>
      </section>

      {!profileLoading && !isProfileSetup && (
        <Card className="bg-accent/20 border-accent shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-accent-foreground flex items-center gap-2">
              <UserCircle2 className="h-7 w-7 text-accent" />
              Complete Your Dietary Profile
            </CardTitle>
            <CardDescription className="text-accent-foreground/80">
              Personalize your experience by setting up your dietary preferences, allergies, and health goals. This will enable Safora to provide accurate insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/dietary-profile">
                Set Up Profile Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      
      {isProfileSetup && (
         <Card className="bg-green-50 border-green-300 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700 flex items-center gap-2">
              <CheckCircle className="h-7 w-7 text-green-600" />
              Dietary Profile Active
            </CardTitle>
            <CardDescription className="text-green-700/80">
              Your dietary profile is set up. Safora will now use this information to analyze food products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-600/10">
              <Link href="/profile">
                View or Edit Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="text-3xl font-bold font-headline text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ScanLine className="h-6 w-6 text-primary" />
                Scan Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Scan a barcode to get instant food insights.</p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/scan">Start Scanning</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ListChecks className="h-6 w-6 text-primary" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Review your previously scanned items.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/history">View History</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserCircle2 className="h-6 w-6 text-primary" />
                Manage Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Update your dietary preferences and goals.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {recentScans.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold font-headline text-primary mb-6">Recently Scanned</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentScans.map((item) => (
              <ProductCard key={item.barcode} product={item} />
            ))}
          </div>
           {recentScans.length >= 3 && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/history">
                  View All History <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

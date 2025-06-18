
"use client";

import Image from 'next/image';
import { ProductInfo, CompatibilityStatus, UserProfile, ScanResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, AlertTriangle, List, Brain, Lightbulb, Utensils, Loader2, Search, ScanLine } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analyzeFoodCompatibility, AnalyzeFoodCompatibilityOutput } from '@/ai/flows/analyze-food-compatibility';
import { summarizeIngredientInformation, SummarizeIngredientInformationOutput } from '@/ai/flows/summarize-ingredient-information';
import { suggestAlternatives, SuggestAlternativesOutput } from '@/ai/flows/suggest-alternatives';
import { useProfile } from '@/hooks/useProfile';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { addFavorite, removeFavorite, isFavorite } from '@/lib/favorites';
interface ScanResultDisplayProps {
  product: ProductInfo;
}

const getStatusVisuals = (status: CompatibilityStatus | undefined) => {
  switch (status) {
    case 'Safe':
      return { icon: <CheckCircle2 className="h-6 w-6 text-green-600" />, color: 'text-green-700 bg-green-100 border-green-300', badgeVariant: 'default' as const, badgeClass: 'bg-green-600 hover:bg-green-700' };
    case 'Contains Allergen':
      return { icon: <XCircle className="h-6 w-6 text-red-600" />, color: 'text-red-700 bg-red-100 border-red-300', badgeVariant: 'destructive' as const, badgeClass: '' };
    case 'Not Recommended':
      return { icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />, color: 'text-yellow-700 bg-yellow-100 border-yellow-300', badgeVariant: 'secondary' as const, badgeClass: 'bg-yellow-500 hover:bg-yellow-600 text-yellow-foreground' };
    default:
      return { icon: <Search className="h-6 w-6 text-gray-600" />, color: 'text-gray-700 bg-gray-100 border-gray-300', badgeVariant: 'outline' as const, badgeClass: '' };
  }
};

export function ScanResultDisplay({ product }: ScanResultDisplayProps) {
  const [compatibility, setCompatibility] = useState<AnalyzeFoodCompatibilityOutput | null>(null);
  const [summary, setSummary] = useState<SummarizeIngredientInformationOutput | null>(null);
  const [isProductFavorite, setIsProductFavorite] = useState(false);
  const [alternatives, setAlternatives] = useState<SuggestAlternativesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressValue, setProgressValue] = React.useState(0); // Renamed to avoid conflict with Progress component

  const { profile, getProfileForAI } = useProfile();

  useEffect(() => {
    const runAIAnalysis = async () => {
      if (!profile) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setProgressValue(10);

      const dietaryRestrictions = getProfileForAI();
      setProgressValue(20);

      try {
        const [compResult, summaryResult] = await Promise.all([
          analyzeFoodCompatibility({ ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients, dietaryRestrictions }),
          summarizeIngredientInformation({ ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients, productName: product.name })
        ]);
        setCompatibility(compResult);
        setProgressValue(60);
        setSummary(summaryResult);
        setProgressValue(80);

        if (compResult.compatibilityStatus === 'Contains Allergen' || compResult.compatibilityStatus === 'Not Recommended') {
          const userAllergies = Object.entries(profile.allergies || {})
            .filter(([, value]) => value === true)
            .map(([key]) => key.substring(3).replace(/([A-Z])/g, ' $1').trim().toLowerCase());
          
          const userPreferences = Object.entries(profile.dietaryPreferences || {})
            .filter(([, value]) => value === true)
            .map(([key]) => key.substring(2).replace(/([A-Z])/g, ' $1').trim().toLowerCase());

          const altResult = await suggestAlternatives({
            productName: product.name,
            allergies: userAllergies,
            dietaryPreferences: userPreferences,
          });
          setAlternatives(altResult);
        }
        setProgressValue(100);
      } catch (error) {
        console.error("AI Analysis Error:", error);
        // Set some error state to display to user
      } finally {
        setIsLoading(false);
      }
    };

    runAIAnalysis();
  }, [product, profile, getProfileForAI]);

  useEffect(() => {
    setIsProductFavorite(isFavorite(product.barcode));
  }, [product.barcode]);

  const statusVisuals = getStatusVisuals(compatibility?.compatibilityStatus as CompatibilityStatus);

  const saveToHistory = () => {
    const scanResult: ScanResult = {
      ...product,
      compatibility: compatibility?.compatibilityStatus as CompatibilityStatus || 'Unknown',
      reason: compatibility?.reason || 'Analysis not available.',
      summary: summary?.summary,
      alternatives: alternatives?.alternatives,
      scannedAt: new Date().toISOString(),
      dataAiHint: product.dataAiHint || product.name, // Ensure dataAiHint is passed
    };

    let history: ScanResult[] = JSON.parse(localStorage.getItem('saforaScanHistory') || '[]');
    const existingIndex = history.findIndex(item => item.barcode === product.barcode);
    if (existingIndex > -1) {
      history[existingIndex] = scanResult; 
    } else {
      history.unshift(scanResult); 
    }
    history = history.slice(0, 50); 
    localStorage.setItem('saforaScanHistory', JSON.stringify(history));
  };

  const handleFavoriteToggle = () => {
    if (isProductFavorite) {
      removeFavorite(product.barcode);
    } else {
      addFavorite(product.barcode);
    }
    setIsProductFavorite(!isProductFavorite);
  };

  useEffect(() => {
    if (!isLoading && compatibility) {
      saveToHistory();
    }
  }, [isLoading, compatibility, product, summary, alternatives]); // Added dependencies


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3">
            <Image
              src={product.imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-64 md:h-full"
              data-ai-hint={product.dataAiHint || product.name}
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            {product.brand && <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>}
            <CardTitle className="text-3xl md:text-4xl font-headline mb-4">{product.name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}>
              {isProductFavorite ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500"><path d="m11.645 20.917-7.393-7.393a1.5 1.5 0 0 1-.436-1.052V9.272a3 3 0 0 1 3-3h1.026a3 3 0 0 1 2.121.879l1.415 1.415a1.5 1.5 0 0 0 2.121 0l1.415-1.415a3 3 0 0 1 2.121-.879h1.026a3 3 0 0 1 3 3v3.202a1.5 1.5 0 0 1-.436 1.052l-7.393 7.393a1.5 1.5 0 0 1-2.121 0Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>}
            </Button>
            <Badge variant="outline" className="mb-6 text-sm py-1 px-3">Barcode: {product.barcode}</Badge>

            {isLoading && (
              <div className="space-y-4 my-6">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </div>
                <Progress value={progressValue} className="w-full h-2 [&>div]:bg-primary" />
              </div>
            )}

            {!isLoading && compatibility && (
              <Alert className={`mb-6 ${statusVisuals.color}`}>
                {statusVisuals.icon}
                <AlertTitle className="text-xl font-semibold">{compatibility.compatibilityStatus}</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-1">
                    {compatibility.reason.split('\\n').map((line, idx) => line.trim().startsWith('- ') ? <li key={idx}>{line.trim().substring(2)}</li> : (line.trim() && <li key={idx}>{line.trim()}</li>) )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
             {!isLoading && !compatibility && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-6 w-6" />
                <AlertTitle>Analysis Unavailable</AlertTitle>
                <AlertDescription>
                  Could not perform dietary analysis. Please ensure your profile is set up or try again later.
                  <Button variant="link" asChild className="p-0 h-auto ml-1 text-destructive hover:underline"><Link href="/dietary-profile">Set up profile</Link></Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      <Accordion type="multiple" defaultValue={['ingredients', 'summary']} className="w-full space-y-4">
        <Card>
          <AccordionItem value="ingredients" className="border-b-0">
            <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <List className="h-6 w-6 text-primary" />
                Ingredients
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 p-4 rounded-md">
                {Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        {!isLoading && summary && (
          <Card>
            <AccordionItem value="summary" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  AI Nutritional Summary
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <p className="text-foreground/90 leading-relaxed">{summary.summary}</p>
              </AccordionContent>
            </AccordionItem>
          </Card>
        )}

        {!isLoading && alternatives && alternatives.alternatives.length > 0 && (
          <Card>
            <AccordionItem value="alternatives" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Suggested Alternatives
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <ul className="list-disc pl-5 space-y-2 text-foreground/90">
                  {alternatives.alternatives.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Card>
        )}
      </Accordion>
      
      <CardFooter className="mt-8 p-0">
        <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/scan">
            <ScanLine className="mr-2 h-5 w-5" /> Scan Another Product
          </Link>
        </Button>
      </CardFooter>
    </div>
  );
}
    

    

"use client";

import Image from 'next/image';
import { ProductInfo, CompatibilityStatus, ScanResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, AlertTriangle, List, Brain, Lightbulb, Loader2, Search, ScanLine, Heart, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { analyzeFoodCompatibility, AnalyzeFoodCompatibilityOutput } from '@/ai/flows/analyze-food-compatibility';
import { summarizeIngredientInformation, SummarizeIngredientInformationOutput } from '@/ai/flows/summarize-ingredient-information';
import { suggestAlternatives, SuggestAlternativesOutput } from '@/ai/flows/suggest-alternatives';
import { useProfile } from '@/hooks/useProfile';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { addFavorite, removeFavorite, isFavorite, getFavorites } from '@/lib/favorites';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ScanResultDisplayProps {
  product: ProductInfo;
}

const getStatusVisuals = (status: CompatibilityStatus | undefined) => {
  switch (status) {
    case 'Safe':
      return { icon: <CheckCircle2 className="h-6 w-6 text-green-600" />, color: 'text-green-700 bg-green-50 border-green-400', badgeVariant: 'default' as const, badgeClass: 'bg-green-600 hover:bg-green-700' };
    case 'Contains Allergen':
      return { icon: <XCircle className="h-6 w-6 text-red-600" />, color: 'text-red-700 bg-red-50 border-red-400', badgeVariant: 'destructive' as const, badgeClass: '' };
    case 'Not Recommended':
      return { icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />, color: 'text-yellow-700 bg-yellow-50 border-yellow-400', badgeVariant: 'secondary' as const, badgeClass: 'bg-yellow-500 hover:bg-yellow-600 text-yellow-foreground' };
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
  const [progressValue, setProgressValue] = React.useState(0);

  const { profile, getProfileForAI } = useProfile();
  const { toast } = useToast();

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
            .filter(([, value]) => value === true && !String(value).startsWith("other"))
            .map(([key]) => key.substring(3).replace(/([A-Z])/g, ' $1').trim().toLowerCase());
          
          const userPreferences = Object.entries(profile.dietaryPreferences || {})
            .filter(([, value]) => value === true && !String(value).startsWith("other"))
            .map(([key]) => key.substring(2).replace(/([A-Z])/g, ' $1').trim().toLowerCase());

          const altResult = await suggestAlternatives({
            productName: product.name,
            allergies: userAllergies,
            dietaryPreferences: userPreferences,
          });
          setAlternatives(altResult);
        }
        setProgressValue(100);
      } catch (error: any) {
        console.error("AI Analysis Error:", error);
        toast({
          title: "AI Analysis Error",
          description: error.message || "Could not complete AI analysis for this product.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    runAIAnalysis();
  }, [product, profile, getProfileForAI, toast]);

  useEffect(() => {
    setIsProductFavorite(isFavorite(product.barcode));
  }, [product.barcode]);

  const statusVisuals = getStatusVisuals(compatibility?.compatibilityStatus as CompatibilityStatus);

  const saveToHistory = React.useCallback(() => {
    const scanResult: ScanResult = {
      ...product,
      compatibility: compatibility?.compatibilityStatus as CompatibilityStatus || 'Unknown',
      reason: compatibility?.reason || 'Analysis not available.',
      summary: summary?.summary,
      alternatives: alternatives?.alternatives,
      scannedAt: new Date().toISOString(),
      dataAiHint: product.dataAiHint || product.name.toLowerCase().split(" ").slice(0,2).join(" "),
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
  }, [product, compatibility, summary, alternatives]);

  const handleFavoriteToggle = () => {
    const currentScanResult: ScanResult = {
        ...product,
        compatibility: compatibility?.compatibilityStatus as CompatibilityStatus || 'Unknown',
        reason: compatibility?.reason || 'Analysis not available.',
        summary: summary?.summary,
        alternatives: alternatives?.alternatives,
        scannedAt: new Date().toISOString(), // Or use existing scan date if available from history
        dataAiHint: product.dataAiHint || product.name.toLowerCase().split(" ").slice(0,2).join(" "),
    };

    if (isProductFavorite) {
      removeFavorite(product.barcode);
      toast({ title: "Removed from Favorites", description: `${product.name} has been removed from your favorites.` });
    } else {
      addFavorite(currentScanResult);
      toast({ title: "Added to Favorites", description: `${product.name} has been added to your favorites.` });
    }
    setIsProductFavorite(!isProductFavorite);
  };

  useEffect(() => {
    if (!isLoading && compatibility) {
      saveToHistory();
    }
  }, [isLoading, compatibility, saveToHistory]);


  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 md:flex-shrink-0">
            <Image
              src={product.imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-64 md:h-full"
              data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(" ").slice(0,2).join(" ")}
            />
          </div>
          <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
            {product.brand && <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>}
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl md:text-4xl font-headline mb-2 flex-grow">{product.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleFavoriteToggle} aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"} className="ml-2 flex-shrink-0">
                <Heart className={cn("h-7 w-7", isProductFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-400")} />
              </Button>
            </div>
            <Badge variant="outline" className="mb-6 text-sm py-1 px-3 self-start">Barcode: {product.barcode}</Badge>

            {isLoading && (
              <div className="space-y-4 my-6">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing with AI... This may take a moment.</span>
                </div>
                <Progress value={progressValue} className="w-full h-2 [&>div]:bg-primary" />
              </div>
            )}

            {!isLoading && compatibility && (
              <Alert className={`mb-6 ${statusVisuals.color}`}>
                <div className="flex items-center gap-2"> {statusVisuals.icon}
                <AlertTitle className="text-xl font-semibold">{compatibility.compatibilityStatus}</AlertTitle></div>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    {compatibility.reason.split('\n').map((line, idx) => line.trim().startsWith('- ') ? <li key={idx}>{line.trim().substring(2)}</li> : (line.trim() && <li key={idx}>{line.trim()}</li>) )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
             {!isLoading && !compatibility && !profile && (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-6 w-6" />
                <AlertTitle>Set Up Your Profile for Analysis</AlertTitle>
                <AlertDescription>
                  To get personalized food compatibility insights, please set up your dietary profile.
                  <Button variant="link" asChild className="p-0 h-auto ml-1 text-destructive hover:underline"><Link href="/dietary-profile">Set up profile</Link></Button>
                </AlertDescription>
              </Alert>
            )}
            {!isLoading && !compatibility && profile && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-6 w-6" />
                <AlertTitle>Analysis Unavailable</AlertTitle>
                <AlertDescription>
                  Could not perform dietary analysis at this time. Please try again later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      <Accordion type="multiple" defaultValue={['ingredients', 'summary']} className="w-full space-y-4">
        <Card>
          <AccordionItem value="ingredients" className="border-b-0">
            <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline data-[state=open]:text-primary">
              <div className="flex items-center gap-3">
                <List className="h-6 w-6 text-primary/80 data-[state=open]:text-primary" />
                Ingredients
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 p-4 rounded-md shadow-inner">
                {Array.isArray(product.ingredients) ? product.ingredients.join(', ') : product.ingredients}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>

        {!isLoading && summary && (
          <Card>
            <AccordionItem value="summary" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline data-[state=open]:text-primary">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary/80 data-[state=open]:text-primary" />
                  AI Nutritional Summary
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
              </AccordionContent>
            </AccordionItem>
          </Card>
        )}

        {!isLoading && alternatives && alternatives.alternatives.length > 0 && (
          <Card>
            <AccordionItem value="alternatives" className="border-b-0">
              <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline data-[state=open]:text-primary">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-primary/80 data-[state=open]:text-primary" />
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
      
      <CardFooter className="mt-8 p-0 flex justify-center">
        <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-6">
          <Link href="/scan">
            <ScanLine className="mr-2 h-5 w-5" /> Scan Another Product
          </Link>
        </Button>
      </CardFooter>
    </div>
  );
}


"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ScanLine, UserCheck, Sparkles, ListChecks } from "lucide-react";

const onboardingSteps = [
  {
    icon: <ScanLine className="h-16 w-16 text-primary" />,
    title: "Scan Food Products",
    description: "Easily scan barcodes to get instant insights about food products.",
    image: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxiYXJjb2RlfGVufDB8fHx8MTc0OTgwODUwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "person scanning",
  },
  {
    icon: <UserCheck className="h-16 w-16 text-primary" />,
    title: "Personalize Your Diet",
    description: "Set up your dietary preferences, allergies, and health goals.",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoZWFsdGh5JTIwZm9vZHxlbnwwfHx8fDE3NDk4MDg2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "healthy food",
  },
  {
    icon: <Sparkles className="h-16 w-16 text-primary" />,
    title: "AI-Powered Analysis",
    description: "Our AI analyzes ingredients and compatibility with your diet.",
    image: "https://images.unsplash.com/photo-1683248893968-b5530c640b6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxudXRyaXRpb24lMjBzY2llbmNlfGVufDB8fHx8MTc0OTgwODY0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "nutrition science",
  },
  {
    icon: <CheckCircle2 className="h-16 w-16 text-primary" />,
    title: "Get Clear Results",
    description: "Understand if a product is right for you with simple compatibility status.",
    image: "https://images.unsplash.com/photo-1623265301442-f4a98db77ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxncm9jZXJ5JTIwbGlzdHxlbnwwfHx8fDE3NDk4MDg2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "grocery list",
  },
  {
    icon: <ListChecks className="h-16 w-16 text-primary" />,
    title: "Track Your Choices",
    description: "Keep a history of your scanned items for easy reference.",
    image: "https://images.unsplash.com/photo-1748017185912-c2a467989758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxmb29kJTIwam91cm5hbHxlbnwwfHx8fDE3NDk4MDg2NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "food journal",
  },
];

export function OnboardingCarousel() {
  const router = useRouter();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleNext = () => {
    if (current < count) {
      api?.scrollNext();
    } else {
      router.push("/auth");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {onboardingSteps.map((step, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden shadow-xl border-none bg-card">
                <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[60vh] text-center">
                  <div className="mb-6">{step.icon}</div>
                  <h3 className="text-3xl font-bold font-headline text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-foreground/80 mb-8 max-w-md">
                    {step.description}
                  </p>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={267}
                    className="rounded-lg shadow-md object-cover"
                    data-ai-hint={step.dataAiHint}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <div className="py-4 text-center text-sm text-muted-foreground">
        Step {current} of {count}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={handleNext} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto px-12 py-6 text-lg">
          {current === count ? "Get Started" : "Next"}
        </Button>
      </div>
       {current < count && (
         <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.push("/auth")} className="text-foreground hover:text-foreground/90">
                Skip Onboarding
            </Button>
         </div>
        )}
    </div>
  );
}

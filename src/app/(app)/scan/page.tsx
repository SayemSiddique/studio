"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Barcode, ArrowRight, Camera } from 'lucide-react';
import Image from 'next/image';

export default function ScanPage() {
  const [barcode, setBarcode] = useState('');
  const router = useRouter();

  const handleScan = () => {
    // In a real app, this would trigger camera scanning.
    // For now, we'll use a predefined barcode or let user input.
    if (barcode.trim()) {
      router.push(`/scan-results/${barcode.trim()}`);
    } else {
      // Example: use a default barcode for demo if input is empty
      router.push(`/scan-results/0049000006467`); // Example: Coca-Cola barcode
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleScan();
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <ScanLine className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Scan Food Product</CardTitle>
          <CardDescription>
            Use your device's camera to scan a barcode or enter it manually to get insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            {/* Placeholder for camera view */}
            <Image src="https://placehold.co/600x338.png?text=Camera+View+Placeholder" alt="Camera view placeholder" width={600} height={338} className="rounded-md object-cover" data-ai-hint="camera phone" />
          </div>
          <Button 
            onClick={() => { 
              // Simulate scan with a default barcode if input is empty
              router.push(`/scan-results/${barcode.trim() || '070847811169'}`); // Example: KIND Bar
            }} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
          >
            <Camera className="mr-2 h-6 w-6" />
            Simulate Scan Product
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or enter barcode manually
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="barcode" className="sr-only">Barcode</Label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="barcode"
                  type="text"
                  placeholder="Enter barcode number"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full text-lg py-6" disabled={!barcode.trim()}>
              Get Product Info <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                Actual camera scanning functionality would be implemented here in a full application.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

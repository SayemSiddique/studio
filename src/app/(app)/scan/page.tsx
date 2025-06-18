
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanLine, Barcode, ArrowRight, Camera, X, ImageUp, Zap, Crop, ScanText, AlertTriangle, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ScanPage() {
  const [manualBarcode, setManualBarcode] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraViewActive, setIsCameraViewActive] = useState(false);
  const [scanMode, setScanMode] = useState<'barcode' | 'ocr' | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);


  useEffect(() => {
    // Cleanup stream when component unmounts or camera view is closed
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: 'destructive',
        title: 'Camera Not Supported',
        description: 'Your browser does not support camera access.',
      });
      setHasCameraPermission(false);
      return null;
    }

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setHasCameraPermission(true);
      setStream(cameraStream);
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      return cameraStream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature. You may need to refresh the page after granting permission.',
      });
      return null;
    }
  };

  const startScan = async (mode: 'barcode' | 'ocr') => {
    setScanMode(mode);
    setIsCameraViewActive(true);
    if (hasCameraPermission === null || hasCameraPermission === false) {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) {
            setIsCameraViewActive(false); // Don't show camera view if no permission
            return;
        }
    } else if (stream && videoRef.current) { // If permission already granted and stream exists
        videoRef.current.srcObject = stream; // Re-attach stream if needed
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraViewActive(false);
    setScanMode(null);
    if(videoRef.current) videoRef.current.srcObject = null;
  };

  const handleCapture = () => {
    // In a real app, you'd capture a frame from the video here
    // For example, using a canvas to draw the current video frame.
    if (scanMode === 'barcode') {
      toast({ title: "Barcode Scanned (Simulated)", description: "Processing product..." });
      // Simulate navigating to a product page after "scan"
      router.push(`/scan-results/070847811169`); // Example: KIND Bar
    } else if (scanMode === 'ocr') {
      toast({ title: "Image Captured for OCR (Simulated)", description: "Extracting text from ingredients list..." });
      // Simulate OCR success
    }
    stopCamera();
  };
  
  const handleGalleryPick = () => {
    toast({ title: "Feature In Development", description: "Selecting from gallery will be available soon."});
  };

  const toggleFlash = () => {
    // Actual flash control requires more complex MediaStream track constraints
    // This is a UI-only mock for now
    setIsFlashOn(!isFlashOn);
    toast({ title: `Flash ${!isFlashOn ? 'On' : 'Off'} (Simulated)`});
  };


  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      router.push(`/scan-results/${manualBarcode.trim()}`);
    } else {
      toast({ variant: "destructive", title: "Empty Barcode", description: "Please enter a barcode number."})
    }
  };

  if (isCameraViewActive) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl aspect-[9/16] sm:aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {hasCameraPermission === true && stream ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-white">
                <VideoOff size={64} className="mb-4 text-gray-500" />
                {hasCameraPermission === null && <p>Requesting camera access...</p>}
                {hasCameraPermission === false && <p>Camera access denied or unavailable.</p>}
             </div>
          )}

          {/* Overlay for scan mode */}
          {scanMode === 'barcode' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-1/3 border-4 border-primary rounded-lg opacity-75 animate-pulse">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -translate-y-1/2"></div>
              </div>
            </div>
          )}
          {scanMode === 'ocr' && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crop size={100} className="text-primary opacity-75 animate-pulse" />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={stopCamera}
            className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Close camera"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="flex items-center justify-around w-full max-w-md mt-6">
          <Button variant="ghost" size="icon" onClick={handleGalleryPick} className="text-white hover:bg-white/10 rounded-full p-3" aria-label="Open gallery">
            <ImageUp size={28} />
          </Button>
          <Button
            onClick={handleCapture}
            className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-full w-20 h-20 text-lg shadow-xl transform active:scale-95 transition-transform"
            aria-label="Capture image"
            disabled={hasCameraPermission !== true}
          >
            {scanMode === 'barcode' ? <Barcode size={32} /> : <ScanText size={32} /> }
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFlash} className={cn("text-white hover:bg-white/10 rounded-full p-3", isFlashOn && "text-yellow-400")} aria-label="Toggle flash">
            <Zap size={28} />
          </Button>
        </div>
         {hasCameraPermission === false && (
           <Alert variant="destructive" className="mt-6 max-w-md w-full">
              <AlertTriangle className="h-5 w-5"/>
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Camera permission was denied or is unavailable. Please enable it in your browser settings and refresh the page to use scanning features.
              </AlertDescription>
            </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <ScanLine className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Scan Food Product</CardTitle>
          <CardDescription>
            Use your device's camera to scan a barcode for product details or scan an ingredients list with OCR.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => startScan('barcode')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 h-auto flex-col gap-2"
            >
              <Barcode className="h-8 w-8" />
              <span>Scan Barcode</span>
            </Button>
            <Button 
              onClick={() => startScan('ocr')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6 h-auto flex-col gap-2"
            >
              <ScanText className="h-8 w-8" />
              <span>Scan Ingredients (OCR)</span>
            </Button>
          </div>
          
          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-5 w-5"/>
                <AlertTitle>Camera Issue</AlertTitle>
                <AlertDescription>
                  Camera permission was previously denied or is unavailable. If you've enabled it, please refresh. Otherwise, check browser settings. You can still enter barcodes manually.
                </AlertDescription>
              </Alert>
          )}

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or enter barcode manually
              </span>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="manualBarcode" className="sr-only">Barcode</Label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="manualBarcode"
                  type="text"
                  placeholder="Enter barcode number"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" className="w-full text-lg py-6" disabled={!manualBarcode.trim()}>
              Get Product Info <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
                Barcode & OCR scanning uses your device's camera. Ensure permissions are granted.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    
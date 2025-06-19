
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ScanResult, CompatibilityStatus } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Search, CalendarDays } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react'; // Added useState

interface ProductCardProps {
  product: ScanResult;
}

const getStatusVisuals = (status: CompatibilityStatus | undefined) => {
  switch (status) {
    case 'Safe':
      return { icon: <CheckCircle2 className="h-5 w-5 text-green-600" />, badgeVariant: 'default' as const, badgeClass: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' };
    case 'Contains Allergen':
      return { icon: <XCircle className="h-5 w-5 text-red-600" />, badgeVariant: 'destructive' as const, badgeClass: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' };
    case 'Not Recommended':
      return { icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, badgeVariant: 'secondary' as const, badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200' };
    default:
      return { icon: <Search className="h-5 w-5 text-gray-500" />, badgeVariant: 'outline' as const, badgeClass: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' };
  }
};


export function ProductCard({ product }: ProductCardProps) {
  const statusVisuals = getStatusVisuals(product.compatibility);
  const timeAgo = product.scannedAt ? formatDistanceToNow(new Date(product.scannedAt), { addSuffix: true }) : 'Unknown time';

  const fallbackImageName = product.name || "product";
  const fallbackSrc = `https://placehold.co/300x200.png?text=${encodeURIComponent(fallbackImageName.substring(0, 20))}`; // Limit text length for placeholder

  const [imgSrc, setImgSrc] = useState(product.imageUrl || fallbackSrc);

  const handleImageError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card">
      <CardHeader className="p-0 relative">
        <Image
          src={imgSrc}
          alt={product.name}
          width={300}
          height={200}
          className="object-cover w-full h-48"
          data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(" ").slice(0,2).join(" ")}
          onError={handleImageError}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        {product.brand && <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>}
        <CardTitle className="text-lg font-semibold mb-2 leading-tight h-[3em] overflow-hidden line-clamp-2">{product.name}</CardTitle>
        <div className="flex items-center gap-2 mt-1 mb-3">
          {statusVisuals.icon}
          <Badge variant={statusVisuals.badgeVariant} className={`${statusVisuals.badgeClass} text-xs font-medium py-1 px-2.5`}>{product.compatibility || 'Unknown'}</Badge>
        </div>
        <div className="mt-auto flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          Scanned: {timeAgo}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/scan-results/${product.barcode}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

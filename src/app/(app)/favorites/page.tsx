
"use client";

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { ScanResult } from '@/lib/types';
import { getFavorites } from '@/lib/favorites';
import { Heart, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavoriteProducts(getFavorites());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Heart className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <Heart className="h-10 w-10 text-red-500 fill-red-500" />
          My Favorite Products
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/scan">Scan More Products</Link>
        </Button>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard key={product.barcode} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center bg-muted/30 rounded-lg">
          <ShoppingBasket className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No Favorites Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't added any products to your favorites. Look for the heart icon on product pages to save them!
          </p>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/scan">Find Products to Favorite</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

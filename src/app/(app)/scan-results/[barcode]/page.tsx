
"use client";

import { ScanResultDisplay } from '@/components/product/ScanResultDisplay';
import { ProductInfo } from '@/lib/types';
import { AlertTriangle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Mock function to fetch product data - replace with actual OpenFoodFacts API call
async function fetchProductData(barcode: string): Promise<ProductInfo | null> {
  console.log(`Fetching product data for barcode: ${barcode}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Example: Return mock data based on barcode
  if (barcode === '0049000006467') { // Coca-Cola example
    return {
      barcode,
      name: 'Coca-Cola Classic',
      brand: 'Coca-Cola',
      imageUrl: 'https://placehold.co/400x400.png?text=Coca-Cola',
      dataAiHint: "coca cola",
      ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
    };
  }
  if (barcode === '070847811169') { // KIND Bar example
    return {
      barcode,
      name: 'KIND Bar - Dark Chocolate Nuts & Sea Salt',
      brand: 'KIND',
      imageUrl: 'https://placehold.co/400x400.png?text=KIND+Bar',
      dataAiHint: "kind bar",
      ingredients: ['Almonds', 'Peanuts', 'Chicory Root Fiber', 'Honey', 'Palm Kernel Oil', 'Sugar', 'Cocoa Powder', 'Non GMO Glucose', 'Sea Salt', 'Soy Lecithin', 'Milk Powder', 'Vanilla Extract'],
    };
  }
   if (barcode === '1234567890123') {
    return {
      barcode,
      name: 'Organic Peanut Butter',
      brand: 'NatureNosh',
      imageUrl: 'https://images.unsplash.com/photo-1624684244440-1130c3b65783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwZWFudXQlMjBidXR0ZXJ8ZW58MHx8fHwxNzQ5ODE0Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: "peanut butter",
      ingredients: ['Organic Peanuts', 'Salt'],
    };
  }
  if (barcode === '9876543210987') {
    return {
      barcode,
      name: 'Whole Wheat Bread',
      brand: 'Bakery Co.',
      imageUrl: 'https://placehold.co/400x400.png?text=Wheat+Bread',
      dataAiHint: "wheat bread",
      ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Soybean Oil', 'Calcium Propionate'],
    };
  }

  // Default mock product if barcode not recognized
  return {
    barcode,
    name: `Sample Product ${barcode}`,
    brand: 'Generic Brand',
    imageUrl: `https://placehold.co/400x400.png?text=Product+${barcode}`,
    dataAiHint: "generic product",
    ingredients: ['Ingredient A', 'Ingredient B', 'Preservative C', 'Colorant D', 'Flavor E'],
  };
}


export default function ScanResultsPage(props: { params: Promise<{ barcode: string }> }) {
  const params = React.use(props.params);
	const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.barcode) {
      fetchProductData(params.barcode)
        .then(data => {
          if (data) {
            setProduct(data);
          } else {
            setError('Product not found.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to fetch product data.');
        })
        .finally(() => setLoading(false));
    }
  }, [params.barcode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading product information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!product) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Product Not Found</h2>
        <p className="text-muted-foreground">The product with barcode {params.barcode} could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <ScanResultDisplay product={product} />
    </div>
  );
}

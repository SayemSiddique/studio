
"use client";

import { ProductCard } from '@/components/product/ProductCard';
import { ScanResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Search, FilterX } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const mockHistory: ScanResult[] = [
  {
    barcode: 'SAFORA-MOCK-001',
    name: 'Organic Fuji Apples (Bag)',
    brand: 'Nature\'s Crisp',
    imageUrl: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcHBsZXN8ZW58MHx8fHwxNzEwMjU0NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'red apples',
    ingredients: ['Organic Fuji Apples'],
    compatibility: 'Safe',
    reason: 'Fresh, organic, and nutritious choice.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    barcode: '0049000006467',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    imageUrl: 'https://images.unsplash.com/photo-1630979805425-08f5f5f39aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjb2NhY29sYXxlbnwwfHx8fDE3NDk4MTQ3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "coca cola",
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
    compatibility: 'Not Recommended',
    reason: 'High sugar content, not aligned with health goals.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-003',
    name: 'Artisan Sourdough Bread',
    brand: 'The Rustic Loaf',
    imageUrl: 'https://images.unsplash.com/photo-1534623228078-9f1irythh32Q7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBicmVhZHxlbnwwfHx8fDE3MTAyNTQ4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sourdough bread',
    ingredients: ['Unbleached Wheat Flour', 'Water', 'Sourdough Starter (Wheat Flour, Water)', 'Salt'],
    compatibility: 'Not Recommended',
    reason: 'Contains wheat/gluten. Check your gluten preference.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    barcode: '070847811169',
    name: 'KIND Bar - Dark Chocolate Nuts & Sea Salt',
    brand: 'KIND',
    imageUrl: 'https://images.unsplash.com/photo-1558022032-1356636a26ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxiYXIlMjBwZWFudXQlMjBmb29kfGVufDB8fHx8MTc0OTgxNTIxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "kind bar",
    ingredients: ['Almonds', 'Peanuts', 'Chicory Root Fiber', 'Honey', 'Palm Kernel Oil', 'Sugar', 'Cocoa Powder', 'Non GMO Glucose', 'Sea Salt', 'Soy Lecithin', 'Milk Powder', 'Vanilla Extract'],
    compatibility: 'Contains Allergen',
    reason: 'Contains peanuts and tree nuts, potential allergens. Contains milk and soy.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-005',
    name: 'Plain Greek Yogurt, 32oz',
    brand: 'Olympus Farms',
    imageUrl: 'https://images.unsplash.com/photo-1562119472-4409e5ada8e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmVlayUyMHlvZ3VydHxlbnwwfHx8fDE3MTAyNTQ4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'greek yogurt',
    ingredients: ['Cultured Pasteurized Grade A Nonfat Milk', 'Live and Active Cultures (S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei)'],
    compatibility: 'Safe',
    reason: 'High in protein, good for gut health if dairy is tolerated.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-009',
    name: 'Dark Chocolate Bar (70% Cacao)',
    brand: 'ChocoLux',
    imageUrl: 'https://images.unsplash.com/photo-1549470770-0f369209b970?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hvY29sYXRlJTIwYmFyfGVufDB8fHx8MTc0OTgzMTExNHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'dark chocolate',
    ingredients: ['Cocoa Beans', 'Sugar', 'Cocoa Butter', 'Soy Lecithin (emulsifier)', 'Vanilla Extract'],
    compatibility: 'Safe',
    reason: 'Generally healthy in moderation. Contains soy.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-012',
    name: 'Sparkling Water - Lemon Flavor, 12pk',
    brand: 'BubbleUp',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23eda2c5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGFya2xpbmclMjB3YXRlciUyMGNhbnxlbnwwfHx8fDE3NDk4MzEyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sparkling water',
    ingredients: ['Carbonated Water', 'Natural Lemon Flavor'],
    compatibility: 'Safe',
    reason: 'Good alternative to sugary drinks.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-018',
    name: 'Unsweetened Almond Milk, Half Gallon',
    brand: 'NutriPure',
    imageUrl: 'https://images.unsplash.com/photo-1600150900661-08a0b0eff776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbG1vbmQlMjBtaWxrJTIwY2FydG9ufGVufDB8fHx8MTc0OTgzMTM1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'almond milk',
    ingredients: ['Filtered Water', 'Almonds', 'Calcium Carbonate', 'Sea Salt', 'Potassium Citrate', 'Sunflower Lecithin', 'Gellan Gum', 'Vitamin A Palmitate', 'Vitamin D2', 'D-Alpha-Tocopherol (Natural Vitamin E)'],
    compatibility: 'Contains Allergen',
    reason: 'Contains almonds (tree nuts).',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-020',
    name: 'Wild Caught Salmon Fillet, 1lb',
    brand: 'Ocean\'s Bounty',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBmaWxsZXR8ZW58MHx8fHwxNzQ5ODMxNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'salmon fillet',
    ingredients: ['Salmon'],
    compatibility: 'Contains Allergen',
    reason: 'Contains fish. Excellent source of Omega-3s if not allergic.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-023',
    name: 'Organic Tofu - Firm, 14oz',
    brand: 'SoyLife',
    imageUrl: 'https://images.unsplash.com/photo-1588442146195-55815012079a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b2Z1JTIwYmxvY2t8ZW58MHx8fHwxNzQ5ODMzMzE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'tofu block',
    ingredients: ['Water', 'Organic Soybeans', 'Calcium Sulfate', 'Nigari (Magnesium Chloride)'],
    compatibility: 'Contains Allergen',
    reason: 'Contains soy.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
  },
  {
    barcode: '1234567890123', // Original mock item
    name: 'Organic Peanut Butter',
    brand: 'NatureNosh',
    imageUrl: 'https://images.unsplash.com/photo-1624684244440-1130c3b65783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwZWFudXQlMjBidXR0ZXJ8ZW58MHx8fHwxNzQ5ODE0Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "peanut butter",
    ingredients: ['Organic Peanuts', 'Salt'],
    compatibility: 'Contains Allergen',
    reason: 'Contains peanuts.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
  },
  {
    barcode: '9876543210987', // Original mock item
    name: 'Whole Wheat Bread',
    brand: 'Bakery Co.',
    imageUrl: 'https://images.unsplash.com/photo-1676723066040-614d1ae56666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3aGVhdCUyMGJyZWFkfGVufDB8fHx8MTc0OTgxNDcwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "wheat bread",
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Soybean Oil', 'Calcium Propionate'],
    compatibility: 'Not Recommended',
    reason: 'Contains wheat/gluten and soy.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-025',
    name: 'Hummus - Classic, 10oz',
    brand: 'MedGrill',
    imageUrl: 'https://images.unsplash.com/photo-1635705421931-a03526a6f020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxodW1tdXMlMjBjb250YWluZXJ8ZW58MHx8fHwxNzQ5ODMzMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'hummus container',
    ingredients: ['Cooked Chickpeas', 'Tahini (Sesame Paste)', 'Water', 'Lemon Juice', 'Olive Oil', 'Garlic', 'Salt', 'Cumin', 'Citric Acid'],
    compatibility: 'Safe',
    reason: 'Generally healthy, good source of fiber. Contains sesame.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-036',
    name: 'Protein Powder - Whey Vanilla, 2lb',
    brand: 'MuscleMax',
    imageUrl: 'https://images.unsplash.com/photo-1637441199493-40c420a799d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwcG93ZGVyJTIwY29udGFpbmVyfGVufDB8fHx8MTc0OTgzMzY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'protein powder',
    ingredients: ['Whey Protein Concentrate', 'Natural and Artificial Flavors', 'Soy Lecithin', 'Sucralose', 'Salt'],
    compatibility: 'Contains Allergen',
    reason: 'Contains milk (whey) and soy. Check for sugar goals.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 130).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-042',
    name: 'Potato Chips - Classic Salted, 9oz',
    brand: 'Lay\'s',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b917b6e873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBjaGlwcyUyMGJhZ3xlbnwwfHx8fDE3NDk4MzM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'potato chips',
    ingredients: ['Potatoes', 'Vegetable Oil (Corn, Canola, and/or Sunflower Oil)', 'Salt'],
    compatibility: 'Not Recommended',
    reason: 'High in sodium and processed oils, typically not aligned with health goals.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
  },
   {
    barcode: 'SAFORA-MOCK-008',
    name: 'Organic Quinoa, 1lb',
    brand: 'Ancient Grains Co.',
    imageUrl: 'https://images.unsplash.com/photo-1578314009380-faf98c108fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBib3dsfGVufDB8fHx8MTc0OTgzMTA3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'quinoa bowl',
    ingredients: ['Organic White Quinoa'],
    compatibility: 'Safe',
    reason: 'Excellent gluten-free grain, high in protein and fiber.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-013',
    name: 'Organic Baby Spinach, 5oz',
    brand: 'GreenLeaf Organics',
    imageUrl: 'https://images.unsplash.com/photo-1576045057190-c767c606f819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDB8fHx8MTc0OTgzMTIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'spinach leaves',
    ingredients: ['Organic Baby Spinach'],
    compatibility: 'Safe',
    reason: 'Nutrient-dense leafy green.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-015',
    name: 'Whole Bean Coffee - Medium Roast, 12oz',
    brand: 'Awake Coffee Co.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFuc3xlbnwwfHx8fDE3NDk4MzEyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'coffee beans',
    ingredients: ['100% Arabica Coffee Beans'],
    compatibility: 'Safe',
    reason: 'Generally fine unless caffeine sensitive.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 170).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-033',
    name: 'Maple Syrup - Grade A Dark, 8oz',
    brand: 'Vermont Gold',
    imageUrl: 'https://images.unsplash.com/photo-1551955236-a86421a0987e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXBsZSUyMHN5cnVwJTIwYm90dGxlfGVufDB8fHx8MTc0OTgzMzU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'maple syrup',
    ingredients: ['Pure Maple Syrup'],
    compatibility: 'Safe',
    reason: 'Natural sweetener, use in moderation if watching sugar.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-050',
    name: 'Rolled Oats - Old Fashioned, 42oz',
    brand: 'Quaker',
    imageUrl: 'https://images.unsplash.com/photo-1507704495565-eba6200533c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb2xsZWQlMjBvYXRzJTIwY29udGFpbmVyfGVufDB8fHx8MTc0OTgzNDA5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'rolled oats',
    ingredients: ['Whole Grain Rolled Oats'],
    compatibility: 'Safe',
    reason: 'Great source of fiber. Can be cross-contaminated with gluten if not certified GF.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 190).toISOString(),
  },
];


export default function HistoryPage() {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Safe', 'Contains Allergen', 'Not Recommended'
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc', 'date_asc', 'name_asc', 'name_desc'

  useEffect(() => {
    const storedHistory = localStorage.getItem('saforaScanHistory');
    if (storedHistory) {
      setScanHistory(JSON.parse(storedHistory));
    } else {
      // Populate with mock if nothing in local storage for demo
      setScanHistory(mockHistory);
      localStorage.setItem('saforaScanHistory', JSON.stringify(mockHistory));
    }
  }, []);

  const filteredAndSortedHistory = useMemo(() => {
    let result = scanHistory;

    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(item => item.compatibility === filterStatus);
    }
    
    switch (sortBy) {
      case 'date_desc':
        result.sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
        break;
      case 'date_asc':
        result.sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime());
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [scanHistory, searchTerm, filterStatus, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('date_desc');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <ListChecks className="h-10 w-10" />
          Scan History
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/scan">Scan New Product</Link>
        </Button>
      </div>

      <Card className="p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="search" className="text-sm font-medium">Search by Name/Brand</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filterStatus" className="text-sm font-medium">Filter by Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filterStatus">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Safe">Safe</SelectItem>
                <SelectItem value="Contains Allergen">Contains Allergen</SelectItem>
                <SelectItem value="Not Recommended">Not Recommended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sortBy" className="text-sm font-medium">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest First)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {(searchTerm || filterStatus !== 'all' || sortBy !== 'date_desc') && (
          <Button variant="ghost" onClick={clearFilters} className="mb-4 text-accent hover:text-accent/90">
            <FilterX className="mr-2 h-4 w-4" /> Clear Filters & Sort
          </Button>
        )}
      </Card>


      {filteredAndSortedHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedHistory.map((item) => (
            <ProductCard key={`${item.barcode}-${item.scannedAt}`} product={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Scans Found</h3>
          <p className="text-muted-foreground">
            {scanHistory.length === 0 ? "You haven't scanned any products yet." : "No products match your current filters."}
          </p>
          {scanHistory.length > 0 && searchTerm && (
             <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2 text-accent hover:text-accent/90">
                Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

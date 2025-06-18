
"use client";

import { ProductCard } from '@/components/product/ProductCard';
import { ScanResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Search, FilterX, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const mockHistory: ScanResult[] = [
  {
    barcode: 'SAFORA-MOCK-001',
    name: 'Organic Fuji Apples (Bag)',
    brand: 'Nature\'s Crisp',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5ff452b9-4199-4e52-a6fe-bfb910e86799?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'fuji apples',
    ingredients: ['Organic Fuji Apples'],
    compatibility: 'Safe',
    reason: 'Fresh, organic, and nutritious choice.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-005',
    name: 'Plain Greek Yogurt, 32oz',
    brand: 'Olympus Farms',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_08a934cb-a966-4011-9d23-c5f0e1c76b31?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_4c260465-90fb-4123-875c-828519bdd9e1?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_612a5443-e94f-449a-b72b-8f20854c7022?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_baed9146-6d88-4d51-b5a5-34efa9130e4e?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6b75841c-2398-4873-bcac-9b628d124de9?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_c6af06c5-b187-47f4-850e-2dcc917f1a2e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'organic tofu',
    ingredients: ['Water', 'Organic Soybeans', 'Calcium Sulfate', 'Nigari (Magnesium Chloride)'],
    compatibility: 'Contains Allergen',
    reason: 'Contains soy.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-025',
    name: 'Hummus - Classic, 10oz',
    brand: 'MedGrill',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6ccdc713-c156-43f6-8a14-47c43882a593?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'classic hummus',
    ingredients: ['Cooked Chickpeas', 'Tahini (Sesame Paste)', 'Water', 'Lemon Juice', 'Olive Oil', 'Garlic', 'Salt', 'Cumin', 'Citric Acid'],
    compatibility: 'Safe',
    reason: 'Generally healthy, good source of fiber. Contains sesame.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-036',
    name: 'Protein Powder - Whey Vanilla, 2lb',
    brand: 'MuscleMax',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_f7f3482e-598a-4bc3-bd9b-c52db8480bae?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_95a9db1b-6395-4d56-bad4-f9ca19a2220d?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_fbfb37f4-c7eb-40f0-9e84-d1ab859fcb06?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'organic quinoa',
    ingredients: ['Organic White Quinoa'],
    compatibility: 'Safe',
    reason: 'Excellent gluten-free grain, high in protein and fiber.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-013',
    name: 'Organic Baby Spinach, 5oz',
    brand: 'GreenLeaf Organics',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_69f5fc1c-463d-4081-837e-1f5b008d36c6?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'baby spinach',
    ingredients: ['Organic Baby Spinach'],
    compatibility: 'Safe',
    reason: 'Nutrient-dense leafy green.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-015',
    name: 'Whole Bean Coffee - Medium Roast, 12oz',
    brand: 'Awake Coffee Co.',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_75db4576-1e87-41db-8028-90798a949a22?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_1757f2d5-ce0a-4005-a753-06d95cb2d295?wid=600&hei=600&qlt=80&fmt=webp',
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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_b8b7bb60-fb10-4b35-abc2-2a8b4bbbef3a?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'rolled oats',
    ingredients: ['Whole Grain Rolled Oats'],
    compatibility: 'Safe',
    reason: 'Great source of fiber. Can be cross-contaminated with gluten if not certified GF.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 190).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-003',
    name: 'Artisan Sourdough Bread',
    brand: 'The Rustic Loaf',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_29132c2d-a484-40d1-ab91-99e94b42570b?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'sourdough bread',
    ingredients: ['Unbleached Wheat Flour', 'Water', 'Sourdough Starter (Wheat Flour, Water)', 'Salt'],
    compatibility: 'Not Recommended',
    reason: 'Contains wheat/gluten. Check your gluten preference.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-004',
    name: 'Crunchy Oat & Almond Cereal',
    brand: 'MorningGlow Cereals',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5938b85e-eb88-451e-99a2-35d3faeda13e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'oat cereal',
    ingredients: ['Whole Grain Oats', 'Sugar', 'Almonds', 'Corn Syrup', 'Canola Oil', 'Honey', 'Salt', 'Natural Vanilla Flavor', 'Vitamin E (mixed tocopherols) to preserve freshness'],
    compatibility: 'Contains Allergen',
    reason: 'Contains almonds. Check sugar content against goals.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-010',
    name: 'Natural Almond Butter, 16oz',
    brand: 'NuttyNaturals',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6d19728b-e787-463a-a6ae-8d4af57da85f?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'almond butter',
    ingredients: ['Dry Roasted Almonds', 'Sea Salt'],
    compatibility: 'Contains Allergen',
    reason: 'Contains tree nuts (almonds).',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-014',
    name: 'Free-Range Large Brown Eggs, Dozen',
    brand: 'HappyHen Farms',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_fdcd2e42-1d87-4b92-aebc-abab6719cb08?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'brown eggs',
    ingredients: ['Eggs'],
    compatibility: 'Contains Allergen',
    reason: 'Contains eggs.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    barcode: 'SAFORA-MOCK-017',
    name: 'Organic Tomato Sauce, 24oz',
    brand: 'Mama Rosa\'s',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_4a41c1ba-32b8-47e4-b350-4d41d163598e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'tomato sauce',
    ingredients: ['Organic Tomatoes', 'Organic Tomato Puree', 'Organic Onion', 'Organic Garlic', 'Sea Salt', 'Organic Basil', 'Organic Oregano'],
    compatibility: 'Safe',
    reason: 'Generally safe and healthy option.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
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
      setScanHistory(mockHistory);
      localStorage.setItem('saforaScanHistory', JSON.stringify(mockHistory));
    }
  }, []);

  const filteredAndSortedHistory = useMemo(() => {
    let result = [...scanHistory]; // Create a copy to avoid mutating original state directly

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
        <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl">Filter & Sort Scans</CardTitle>
            <CardDescription>Refine your view of previously scanned products.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
            <div className="lg:col-span-2">
                <Label htmlFor="search" className="text-sm font-medium">Search by Name/Brand</Label>
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="search"
                    placeholder="E.g., 'Apples' or 'Nature's Crisp'"
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
            <Button variant="ghost" onClick={clearFilters} className="mb-4 text-primary hover:text-primary/90 hover:bg-primary/5">
                <FilterX className="mr-2 h-4 w-4" /> Clear Filters & Sort
            </Button>
            )}
        </CardContent>
      </Card>


      {filteredAndSortedHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedHistory.map((item) => (
            <ProductCard key={`${item.barcode}-${item.scannedAt}`} product={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center bg-muted/30 rounded-lg">
          <ShoppingBasket className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No Scans Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {scanHistory.length === 0 ? "You haven't scanned any products yet. Start scanning to build your history!" : "No products match your current filters. Try adjusting your search or filter criteria."}
          </p>
          {scanHistory.length > 0 && (searchTerm || filterStatus !== 'all') && (
             <Button variant="link" onClick={clearFilters} className="mt-4 text-lg text-primary hover:text-primary/90">
                Clear Filters & Search
            </Button>
          )}
           {scanHistory.length === 0 && (
             <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/scan">Scan First Product</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

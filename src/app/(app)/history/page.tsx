"use client";

import { ProductCard } from '@/components/product/ProductCard';
import { ScanResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Search, FilterX } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';

const mockHistory: ScanResult[] = [
   {
    barcode: '1234567890123',
    name: 'Organic Peanut Butter',
    brand: 'NatureNosh',
    imageUrl: 'https://placehold.co/300x200.png?text=Peanut+Butter',
    dataAiHint: "peanut butter",
    ingredients: ['Organic Peanuts', 'Salt'],
    compatibility: 'Safe',
    reason: 'Aligns with your preferences.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    barcode: '9876543210987',
    name: 'Whole Wheat Bread',
    brand: 'Bakery Co.',
    imageUrl: 'https://placehold.co/300x200.png?text=Wheat+Bread',
    dataAiHint: "wheat bread",
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
    compatibility: 'Not Recommended',
    reason: 'Contains wheat, which you are avoiding.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    barcode: '0049000006467',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    imageUrl: 'https://placehold.co/300x200.png?text=Coca-Cola',
    dataAiHint: "coca cola",
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
    compatibility: 'Not Recommended',
    reason: 'High sugar content, not aligned with health goals.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    barcode: '070847811169',
    name: 'KIND Bar - Dark Chocolate Nuts & Sea Salt',
    brand: 'KIND',
    imageUrl: 'https://placehold.co/300x200.png?text=KIND+Bar',
    dataAiHint: "kind bar",
    ingredients: ['Almonds', 'Peanuts', 'Chicory Root Fiber', 'Honey', 'Palm Kernel Oil', 'Sugar', 'Cocoa Powder', 'Non GMO Glucose', 'Sea Salt', 'Soy Lecithin', 'Milk Powder', 'Vanilla Extract'],
    compatibility: 'Contains Allergen',
    reason: 'Contains peanuts and tree nuts, potential allergens.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    barcode: '5432109876543',
    name: 'Almond Milk - Unsweetened Vanilla',
    brand: 'NutriMilks',
    imageUrl: 'https://placehold.co/300x200.png?text=Almond+Milk',
    dataAiHint: "almond milk",
    ingredients: ['Almonds', 'Water', 'Calcium Carbonate', 'Natural Vanilla Flavor', 'Sea Salt', 'Potassium Citrate', 'Sunflower Lecithin', 'Gellan Gum', 'Vitamin A Palmitate', 'Vitamin D2', 'D-Alpha-Tocopherol (Natural Vitamin E)'],
    compatibility: 'Safe',
    reason: 'Good dairy-free alternative, aligns with preferences.',
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
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

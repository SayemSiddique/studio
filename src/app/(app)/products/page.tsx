
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductInfo, ScanResult } from '@/lib/types';
import { productDatabase } from '@/app/(app)/scan-results/[barcode]/page'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search, FilterX, ShoppingBag, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

const ALL_PRODUCTS: ProductInfo[] = Object.values(productDatabase);

const getUniqueCategories = (products: ProductInfo[]): string[] => {
  const categories = new Set<string>();
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return Array.from(categories).sort();
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc', 'name_desc', 'category_asc', 'category_desc'
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(getUniqueCategories(ALL_PRODUCTS));
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    switch (sortBy) {
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'category_asc':
        result.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      case 'category_desc':
        result.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
        break;
    }
    
    // Transform ProductInfo to ScanResult for ProductCard compatibility
    return result.map(product => ({
      ...product,
      compatibility: 'Unknown', // Mock compatibility for general listing
      reason: 'View details for full analysis.', // Mock reason
      scannedAt: new Date().toISOString(), // Mock scan date
    } as ScanResult));

  }, [searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name_asc');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b">
        <h1 className="text-4xl font-bold font-headline text-primary flex items-center gap-3">
          <LayoutGrid className="h-10 w-10" />
          Browse Products
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/scan">Scan a Product</Link>
        </Button>
      </div>

      <Card className="p-6 shadow-md">
        <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl">Filter & Sort Products</CardTitle>
            <CardDescription>Find the products you're looking for.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-end">
            <div className="lg:col-span-1">
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
                <Label htmlFor="filterCategory" className="text-sm font-medium">Filter by Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="filterCategory">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
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
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="category_asc">Category (A-Z)</SelectItem>
                    <SelectItem value="category_desc">Category (Z-A)</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            {(searchTerm || selectedCategory !== 'all' || sortBy !== 'name_asc') && (
            <Button variant="ghost" onClick={clearFilters} className="mb-4 text-primary hover:text-primary/90 hover:bg-primary/5">
                <FilterX className="mr-2 h-4 w-4" /> Clear Filters & Sort
            </Button>
            )}
        </CardContent>
      </Card>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.barcode} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center bg-muted/30 rounded-lg">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No Products Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No products match your current filters. Try adjusting your search or filter criteria.
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
             <Button variant="link" onClick={clearFilters} className="mt-4 text-lg text-primary hover:text-primary/90">
                Clear Filters & Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

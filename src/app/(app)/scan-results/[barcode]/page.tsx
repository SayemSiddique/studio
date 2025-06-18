
"use client";

import { ScanResultDisplay } from '@/components/product/ScanResultDisplay';
import { ProductInfo } from '@/lib/types';
import { AlertTriangle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const productDatabase: Record<string, ProductInfo> = {
  'SAFORA-MOCK-001': {
    barcode: 'SAFORA-MOCK-001',
    name: 'Organic Fuji Apples (Bag)',
    brand: 'Nature\'s Crisp',
    imageUrl: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcHBsZXN8ZW58MHx8fHwxNzEwMjU0NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'red apples',
    ingredients: ['Organic Fuji Apples'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-002': {
    barcode: 'SAFORA-MOCK-002',
    name: 'Whole Milk, Gallon',
    brand: 'FarmFresh Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtaWxrJTIwY2FydG9ufGVufDB8fHx8MTcxMDI1NDgwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'milk carton',
    ingredients: ['Pasteurized Whole Milk', 'Vitamin D3'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-003': {
    barcode: 'SAFORA-MOCK-003',
    name: 'Artisan Sourdough Bread',
    brand: 'The Rustic Loaf',
    imageUrl: 'https://images.unsplash.com/photo-1534623228078-9f1irythh32Q7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBicmVhZHxlbnwwfHx8fDE3MTAyNTQ4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sourdough bread',
    ingredients: ['Unbleached Wheat Flour', 'Water', 'Sourdough Starter (Wheat Flour, Water)', 'Salt'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-004': {
    barcode: 'SAFORA-MOCK-004',
    name: 'Crunchy Oat & Almond Cereal',
    brand: 'MorningGlow Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjZXJlYWwlMjBib3dsfGVufDB8fHx8MTcxMDI1NDg2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'cereal bowl',
    ingredients: ['Whole Grain Oats', 'Sugar', 'Almonds', 'Corn Syrup', 'Canola Oil', 'Honey', 'Salt', 'Natural Vanilla Flavor', 'Vitamin E (mixed tocopherols) to preserve freshness'],
    category: 'Breakfast',
  },
  'SAFORA-MOCK-005': {
    barcode: 'SAFORA-MOCK-005',
    name: 'Plain Greek Yogurt, 32oz',
    brand: 'Olympus Farms',
    imageUrl: 'https://images.unsplash.com/photo-1562119472-4409e5ada8e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmVlayUyMHlvZ3VydHxlbnwwfHx8fDE3MTAyNTQ4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'greek yogurt',
    ingredients: ['Cultured Pasteurized Grade A Nonfat Milk', 'Live and Active Cultures (S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-006': {
    barcode: 'SAFORA-MOCK-006',
    name: 'Frozen Mixed Berries, 10oz',
    brand: 'BerryBest',
    imageUrl: 'https://images.unsplash.com/photo-1425934398892-380e0e4ca0a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBiZXJyaWVzfGVufDB8fHx8MTc0OTgzMTAxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'frozen berries',
    ingredients: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries'],
    category: 'Frozen Foods',
  },
  'SAFORA-MOCK-007': {
    barcode: 'SAFORA-MOCK-007',
    name: 'Extra Virgin Olive Oil, 500ml',
    brand: 'Golden Harvest',
    imageUrl: 'https://images.unsplash.com/photo-1620189507195-68709c0da135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbCUyMGJvdHRsZXxlbnwwfHx8fDE3NDk4MzEwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'olive oil',
    ingredients: ['100% Extra Virgin Olive Oil'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-008': {
    barcode: 'SAFORA-MOCK-008',
    name: 'Organic Quinoa, 1lb',
    brand: 'Ancient Grains Co.',
    imageUrl: 'https://images.unsplash.com/photo-1578314009380-faf98c108fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxxdWlub2ElMjBib3dsfGVufDB8fHx8MTc0OTgzMTA3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'quinoa bowl',
    ingredients: ['Organic White Quinoa'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-009': {
    barcode: 'SAFORA-MOCK-009',
    name: 'Dark Chocolate Bar (70% Cacao)',
    brand: 'ChocoLux',
    imageUrl: 'https://images.unsplash.com/photo-1549470770-0f369209b970?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hvY29sYXRlJTIwYmFyfGVufDB8fHx8MTc0OTgzMTExNHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'dark chocolate',
    ingredients: ['Cocoa Beans', 'Sugar', 'Cocoa Butter', 'Soy Lecithin (emulsifier)', 'Vanilla Extract'],
    category: 'Sweets & Desserts',
  },
  'SAFORA-MOCK-010': {
    barcode: 'SAFORA-MOCK-010',
    name: 'Natural Almond Butter, 16oz',
    brand: 'NuttyNaturals',
    imageUrl: 'https://images.unsplash.com/photo-1612200993018-c68701161824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbG1vbmQlMjBidXR0ZXJ8ZW58MHx8fHwxNzQ5ODMxMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'almond butter',
    ingredients: ['Dry Roasted Almonds', 'Sea Salt'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-011': {
    barcode: 'SAFORA-MOCK-011',
    name: 'Canned Chickpeas, 15oz',
    brand: 'PantryStaples',
    imageUrl: 'https://images.unsplash.com/photo-1607622452477-32a8b9e099c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGlja3BlYXN8ZW58MHx8fHwxNzQ5ODMxMTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'chickpeas can',
    ingredients: ['Chickpeas', 'Water', 'Salt', 'Calcium Chloride (firming agent)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-012': {
    barcode: 'SAFORA-MOCK-012',
    name: 'Sparkling Water - Lemon Flavor, 12pk',
    brand: 'BubbleUp',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23eda2c5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGFya2xpbmclMjB3YXRlciUyMGNhbnxlbnwwfHx8fDE3NDk4MzEyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sparkling water',
    ingredients: ['Carbonated Water', 'Natural Lemon Flavor'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-013': {
    barcode: 'SAFORA-MOCK-013',
    name: 'Organic Baby Spinach, 5oz',
    brand: 'GreenLeaf Organics',
    imageUrl: 'https://images.unsplash.com/photo-1576045057190-c767c606f819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhdmVzfGVufDB8fHx8MTc0OTgzMTIyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'spinach leaves',
    ingredients: ['Organic Baby Spinach'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-014': {
    barcode: 'SAFORA-MOCK-014',
    name: 'Free-Range Large Brown Eggs, Dozen',
    brand: 'HappyHen Farms',
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc889896cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlZ2dzJTIwY2FydG9ufGVufDB8fHx8MTc0OTgzMTI1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'eggs carton',
    ingredients: ['Eggs'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-015': {
    barcode: 'SAFORA-MOCK-015',
    name: 'Whole Bean Coffee - Medium Roast, 12oz',
    brand: 'Awake Coffee Co.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFuc3xlbnwwfHx8fDE3NDk4MzEyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'coffee beans',
    ingredients: ['100% Arabica Coffee Beans'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-016': {
    barcode: 'SAFORA-MOCK-016',
    name: 'Gluten-Free Pasta - Penne, 12oz',
    brand: 'PastaJoy GF',
    imageUrl: 'https://images.unsplash.com/photo-1607291057903-ac9bfac62c94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnbHV0ZW4lMjBmcmVlJTIwcGFzdGF8ZW58MHx8fHwxNzQ5ODMxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'glutenfree pasta',
    ingredients: ['Corn Flour', 'Rice Flour', 'Mono and Diglycerides'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-017': {
    barcode: 'SAFORA-MOCK-017',
    name: 'Organic Tomato Sauce, 24oz',
    brand: 'Mama Rosa\'s',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzYXVjZSUyMGphcnxlbnwwfHx8fDE3NDk4MzEzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'tomato sauce',
    ingredients: ['Organic Tomatoes', 'Organic Tomato Puree', 'Organic Onion', 'Organic Garlic', 'Sea Salt', 'Organic Basil', 'Organic Oregano'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-018': {
    barcode: 'SAFORA-MOCK-018',
    name: 'Unsweetened Almond Milk, Half Gallon',
    brand: 'NutriPure',
    imageUrl: 'https://images.unsplash.com/photo-1600150900661-08a0b0eff776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhbG1vbmQlMjBtaWxrJTIwY2FydG9ufGVufDB8fHx8MTc0OTgzMTM1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'almond milk',
    ingredients: ['Filtered Water', 'Almonds', 'Calcium Carbonate', 'Sea Salt', 'Potassium Citrate', 'Sunflower Lecithin', 'Gellan Gum', 'Vitamin A Palmitate', 'Vitamin D2', 'D-Alpha-Tocopherol (Natural Vitamin E)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-019': {
    barcode: 'SAFORA-MOCK-019',
    name: 'Avocado, Single',
    brand: 'Fresh Picks',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhdm9jYWRvfGVufDB8fHx8MTc0OTgzMTM4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'avocado fruit',
    ingredients: ['Avocado'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-020': {
    barcode: 'SAFORA-MOCK-020',
    name: 'Wild Caught Salmon Fillet, 1lb',
    brand: 'Ocean\'s Bounty',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBmaWxsZXR8ZW58MHx8fHwxNzQ5ODMxNDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'salmon fillet',
    ingredients: ['Salmon'],
    category: 'Meat & Seafood',
  },
  'SAFORA-MOCK-021': {
    barcode: 'SAFORA-MOCK-021',
    name: 'Organic Bananas (Bunch)',
    brand: 'Tropical Sun',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-16d428488887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiYW5hbmFzfGVufDB8fHx8MTc0OTgzMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'bananas bunch',
    ingredients: ['Organic Bananas'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-022': {
    barcode: 'SAFORA-MOCK-022',
    name: 'Cheddar Cheese Block, 8oz',
    brand: 'Old Mill Creamery',
    imageUrl: 'https://images.unsplash.com/photo-1618164435970-3380e7c7a731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGVkZGFyJTIwY2hlZXNlJTIwYmxvY2t8ZW58MHx8fHwxNzQ5ODMzMjg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'cheddar cheese',
    ingredients: ['Pasteurized Milk', 'Cheese Culture', 'Salt', 'Enzymes', 'Annatto (color)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-023': {
    barcode: 'SAFORA-MOCK-023',
    name: 'Organic Tofu - Firm, 14oz',
    brand: 'SoyLife',
    imageUrl: 'https://images.unsplash.com/photo-1588442146195-55815012079a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0b2Z1JTIwYmxvY2t8ZW58MHx8fHwxNzQ5ODMzMzE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'tofu block',
    ingredients: ['Water', 'Organic Soybeans', 'Calcium Sulfate', 'Nigari (Magnesium Chloride)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-024': {
    barcode: 'SAFORA-MOCK-024',
    name: 'Sweet Potatoes, 3lb Bag',
    brand: 'Harvest Gold',
    imageUrl: 'https://images.unsplash.com/photo-1591797035002-961481500cb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0b2VzfGVufDB8fHx8MTc0OTgzMzM0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'sweet potatoes',
    ingredients: ['Sweet Potatoes'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-025': {
    barcode: 'SAFORA-MOCK-025',
    name: 'Hummus - Classic, 10oz',
    brand: 'MedGrill',
    imageUrl: 'https://images.unsplash.com/photo-1635705421931-a03526a6f020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxodW1tdXMlMjBjb250YWluZXJ8ZW58MHx8fHwxNzQ5ODMzMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'hummus container',
    ingredients: ['Cooked Chickpeas', 'Tahini (Sesame Paste)', 'Water', 'Lemon Juice', 'Olive Oil', 'Garlic', 'Salt', 'Cumin', 'Citric Acid'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-026': {
    barcode: 'SAFORA-MOCK-026',
    name: 'Brown Rice Cakes - Unsalted, 14ct',
    brand: 'SimplyCrisp',
    imageUrl: 'https://images.unsplash.com/photo-1589928946075-c3a42fce8a54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyaWNlJTIwY2FrZXN8ZW58MHx8fHwxNzQ5ODMzMzk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'rice cakes',
    ingredients: ['Whole Grain Brown Rice'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-027': {
    barcode: 'SAFORA-MOCK-027',
    name: 'Green Tea Bags, 20ct',
    brand: 'ZenInfusions',
    imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f3c8d075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlYSUyMGJveHxlbnwwfHx8fDE3NDk4MzM0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'green tea',
    ingredients: ['Green Tea Leaves'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-028': {
    barcode: 'SAFORA-MOCK-028',
    name: 'Balsamic Vinaigrette Dressing, 16oz',
    brand: 'Salad Sensations',
    imageUrl: 'https://images.unsplash.com/photo-1505253758473-963103d787f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiYWxzYW1pYyUyMHZpbmFpZ3JldHRlJTIwYm90dGxlfGVufDB8fHx8MTc0OTgzMzQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'salad dressing',
    ingredients: ['Water', 'Balsamic Vinegar (Wine Vinegar, Concentrated Grape Must, Caramel Color)', 'Soybean Oil', 'Sugar', 'Salt', 'Garlic', 'Onion', 'Spices', 'Xanthan Gum', 'Potassium Sorbate (preservative)'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-029': {
    barcode: 'SAFORA-MOCK-029',
    name: 'Organic Chicken Broth, 32oz',
    brand: 'Kitchen Basics',
    imageUrl: 'https://images.unsplash.com/photo-1624280420197-db9706f4901e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnJvdGglMjBjYXJ0b258ZW58MHx8fHwxNzQ5ODMzNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'chicken broth',
    ingredients: ['Organic Chicken Stock', 'Organic Vegetable Stock (Carrot, Celery, Onion)', 'Sea Salt', 'Organic Chicken Flavor', 'Organic Turmeric'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-030': {
    barcode: 'SAFORA-MOCK-030',
    name: 'Walnuts - Halves & Pieces, 8oz',
    brand: 'NutHarvest',
    imageUrl: 'https://images.unsplash.com/photo-1587679998159-c94a27988a0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3YWxudXRzJTIwYm93bHxlbnwwfHx8fDE3NDk4MzM1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'walnuts bowl',
    ingredients: ['Walnuts'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-031': {
    barcode: 'SAFORA-MOCK-031',
    name: 'Mayonnaise - Real, 30oz',
    brand: 'BestFoods',
    imageUrl: 'https://images.unsplash.com/photo-1620894589905-a34815529936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXlvbm5haXNlJTIwamFyfGVufDB8fHx8MTc0OTgzMzU0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'mayonnaise jar',
    ingredients: ['Soybean Oil', 'Water', 'Whole Eggs and Egg Yolks', 'Vinegar', 'Salt', 'Sugar', 'Lemon Juice Concentrate', 'Calcium Disodium EDTA (to protect flavor)', 'Natural Flavors'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-032': {
    barcode: 'SAFORA-MOCK-032',
    name: 'Dijon Mustard, 12oz',
    brand: 'Grey Poupon',
    imageUrl: 'https://images.unsplash.com/photo-1580900907743-bc6185785015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaWpvbiUyMG11c3RhcmQlMjBqYXJ8ZW58MHx8fHwxNzQ5ODMzNTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'dijon mustard',
    ingredients: ['Water', 'Mustard Seeds', 'Vinegar', 'Salt', 'Citric Acid', 'Sulfites'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-033': {
    barcode: 'SAFORA-MOCK-033',
    name: 'Maple Syrup - Grade A Dark, 8oz',
    brand: 'Vermont Gold',
    imageUrl: 'https://images.unsplash.com/photo-1551955236-a86421a0987e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXBsZSUyMHN5cnVwJTIwYm90dGxlfGVufDB8fHx8MTc0OTgzMzU5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'maple syrup',
    ingredients: ['Pure Maple Syrup'],
    category: 'Sweets & Desserts',
  },
  'SAFORA-MOCK-034': {
    barcode: 'SAFORA-MOCK-034',
    name: 'Salsa - Medium Chunky, 16oz',
    brand: 'El Grande',
    imageUrl: 'https://images.unsplash.com/photo-1582319802964-c7b13c603458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWxzYSUyMGphcnxlbnwwfHx8fDE3NDk4MzM2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'salsa jar',
    ingredients: ['Diced Tomatoes', 'Onions', 'Jalapeno Peppers', 'Cilantro', 'Water', 'Salt', 'Garlic Powder', 'Vinegar', 'Spices'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-035': {
    barcode: 'SAFORA-MOCK-035',
    name: 'Popcorn Kernels - Organic, 30oz',
    brand: 'PopPerfect',
    imageUrl: 'https://images.unsplash.com/photo-1578839814504-002050951755?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3Bjb3JuJTIwa2VybmVsc3xlbnwwfHx8fDE3NDk4MzM2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'popcorn kernels',
    ingredients: ['Organic Popcorn Kernels'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-036': {
    barcode: 'SAFORA-MOCK-036',
    name: 'Protein Powder - Whey Vanilla, 2lb',
    brand: 'MuscleMax',
    imageUrl: 'https://images.unsplash.com/photo-1637441199493-40c420a799d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcm90ZWluJTIwcG93ZGVyJTIwY29udGFpbmVyfGVufDB8fHx8MTc0OTgzMzY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'protein powder',
    ingredients: ['Whey Protein Concentrate', 'Natural and Artificial Flavors', 'Soy Lecithin', 'Sucralose', 'Salt'],
    category: 'Health & Wellness',
  },
  'SAFORA-MOCK-037': {
    barcode: 'SAFORA-MOCK-037',
    name: 'Coconut Water - Pure, 1L',
    brand: 'Island Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1553305132-007ab6900e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwd2F0ZXIlMjBib3R0bGV8ZW58MHx8fHwxNzQ5ODMzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'coconut water',
    ingredients: ['100% Coconut Water'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-038': {
    barcode: 'SAFORA-MOCK-038',
    name: 'Herbal Tea - Chamomile, 20 bags',
    brand: 'Calm Moments',
    imageUrl: 'https://images.unsplash.com/photo-1600095923367-f72a54cec1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWErfGVufDB8fHx8MTc0OTgzMzc0NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'herbal tea',
    ingredients: ['Chamomile Flowers'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-039': {
    barcode: 'SAFORA-MOCK-039',
    name: 'Frozen Peas, 12oz',
    brand: 'Green Giant',
    imageUrl: 'https://images.unsplash.com/photo-1581331368802-740f84326f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBwZWFzfGVufDB8fHx8MTc0OTgzMzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'frozen peas',
    ingredients: ['Peas'],
    category: 'Frozen Foods',
  },
  'SAFORA-MOCK-040': {
    barcode: 'SAFORA-MOCK-040',
    name: 'Apple Cider Vinegar - Organic, 16oz',
    brand: 'Bragg',
    imageUrl: 'https://images.unsplash.com/photo-1601599607363-5f5ed609c8f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMGNpZGVyJTIwdmluZWdhciUyMGJvdHRsZXxlbnwwfHx8fDE3NDk4MzM4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'apple cider vinegar',
    ingredients: ['Certified Organic Raw Apple Cider Vinegar', 'Purified Water (diluted to 5% acidity)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-041': {
    barcode: 'SAFORA-MOCK-041',
    name: 'Canned Tuna in Water, 5oz',
    brand: 'StarKist',
    imageUrl: 'https://images.unsplash.com/photo-1603400514650-050a5f147201?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYW5uZWQlMjB0dW5hfGVufDB8fHx8MTc0OTgzMzg0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'canned tuna',
    ingredients: ['Light Tuna', 'Water', 'Vegetable Broth', 'Salt'],
    category: 'Meat & Seafood',
  },
  'SAFORA-MOCK-042': {
    barcode: 'SAFORA-MOCK-042',
    name: 'Potato Chips - Classic Salted, 9oz',
    brand: 'Lay\'s',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b917b6e873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBjaGlwcyUyMGJhZ3xlbnwwfHx8fDE3NDk4MzM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'potato chips',
    ingredients: ['Potatoes', 'Vegetable Oil (Corn, Canola, and/or Sunflower Oil)', 'Salt'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-043': {
    barcode: 'SAFORA-MOCK-043',
    name: 'Orange Juice - No Pulp, 52oz',
    brand: 'Tropicana',
    imageUrl: 'https://images.unsplash.com/photo-1618844850903-c1e454752c87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZSUyMGNhcnRvbnxlbnwwfHx8fDE3NDk4MzM4OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'orange juice',
    ingredients: ['100% Orange Juice'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-044': {
    barcode: 'SAFORA-MOCK-044',
    name: 'Ketchup - Tomato, 20oz',
    brand: 'Heinz',
    imageUrl: 'https://images.unsplash.com/photo-1585580419885-4ed809949b90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrZXRjaHVwJTIwYm90dGxlfGVufDB8fHx8fDE3NDk4MzM5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'ketchup bottle',
    ingredients: ['Tomato Concentrate from Red Ripe Tomatoes', 'Distilled Vinegar', 'High Fructose Corn Syrup', 'Corn Syrup', 'Salt', 'Spice', 'Onion Powder', 'Natural Flavoring'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-045': {
    barcode: 'SAFORA-MOCK-045',
    name: 'Pickles - Dill Spears, 24oz',
    brand: 'Vlasic',
    imageUrl: 'https://images.unsplash.com/photo-1581000907002-91c10a40f0ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaWNrbGUlMjBqYXJ8ZW58MHx8fHwxNzQ5ODMzOTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'pickle jar',
    ingredients: ['Cucumbers', 'Water', 'Vinegar', 'Salt', 'Calcium Chloride', 'Natural Flavors', 'Polysorbate 80', 'Turmeric (for color)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-046': {
    barcode: 'SAFORA-MOCK-046',
    name: 'Instant Coffee - Classic Roast, 8oz',
    brand: 'Nescafé',
    imageUrl: 'https://images.unsplash.com/photo-1567350558564-86478b6679d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbnN0YW50JTIwY29mZmVlJTIwamFyfGVufDB8fHx8MTc0OTgzMzk3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'instant coffee',
    ingredients: ['100% Pure Coffee'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-047': {
    barcode: 'SAFORA-MOCK-047',
    name: 'Black Beans - Canned, Organic, 15oz',
    brand: 'Eden Organic',
    imageUrl: 'https://images.unsplash.com/photo-1598601413905-5c95897d608c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYW5uZWQlMjBibGFjayUyMGJlYW5zfGVufDB8fHx8MTc0OTgzNDAwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'black beans can',
    ingredients: ['Organic Black Beans', 'Water', 'Kombu Seaweed'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-048': {
    barcode: 'SAFORA-MOCK-048',
    name: 'Soy Sauce - Low Sodium, 10oz',
    brand: 'Kikkoman',
    imageUrl: 'https://images.unsplash.com/photo-1613844237701-8f3664fc2eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb3klMjBzYXVjZSUyMGJvdHRsZXxlbnwwfHx8fDE3NDk4MzQwMzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'soy sauce',
    ingredients: ['Water', 'Soybeans', 'Wheat', 'Salt', 'Lactic Acid', 'Sodium Benzoate: Less than 1/10 of 1% as a preservative'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-049': {
    barcode: 'SAFORA-MOCK-049',
    name: 'Corn Tortillas - White, 30ct',
    brand: 'Mission',
    imageUrl: 'https://images.unsplash.com/photo-1567022528107-57e243991545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb3JuJTIwdG9ydGlsbGFzfGVufDB8fHx8MTc0OTgzNDA2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'corn tortillas',
    ingredients: ['Corn Masa Flour', 'Water', 'Cellulose Gum', 'Propionic Acid (to preserve freshness)', 'Benzoic Acid (to preserve freshness)', 'Phosphoric Acid (acidulant)', 'Guar Gum', 'Amylase'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-050': {
    barcode: 'SAFORA-MOCK-050',
    name: 'Rolled Oats - Old Fashioned, 42oz',
    brand: 'Quaker',
    imageUrl: 'https://images.unsplash.com/photo-1507704495565-eba6200533c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyb2xsZWQlMjBvYXRzJTIwY29udGFpbmVyfGVufDB8fHx8MTc0OTgzNDA5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: 'rolled oats',
    ingredients: ['Whole Grain Rolled Oats'],
    category: 'Breakfast',
  },
  '0049000006467': { 
    barcode: '0049000006467',
    name: 'Coca-Cola Classic',
    brand: 'Coca-Cola',
    imageUrl: 'https://images.unsplash.com/photo-1630979805425-08f5f5f39aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjb2NhY29sYXxlbnwwfHx8fDE3NDk4MTQ3MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "coca cola",
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
    category: 'Beverages',
  },
  '070847811169': { 
    barcode: '070847811169',
    name: 'KIND Bar - Dark Chocolate Nuts & Sea Salt',
    brand: 'KIND',
    imageUrl: 'https://images.unsplash.com/photo-1558022032-1356636a26ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxiYXIlMjBwZWFudXQlMjBmb29kfGVufDB8fHx8MTc0OTgxNTIxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "kind bar",
    ingredients: ['Almonds', 'Peanuts', 'Chicory Root Fiber', 'Honey', 'Palm Kernel Oil', 'Sugar', 'Cocoa Powder', 'Non GMO Glucose', 'Sea Salt', 'Soy Lecithin', 'Milk Powder', 'Vanilla Extract'],
    category: 'Snacks',
  },
   '1234567890123': { 
    barcode: '1234567890123',
    name: 'Organic Peanut Butter',
    brand: 'NatureNosh',
    imageUrl: 'https://images.unsplash.com/photo-1624684244440-1130c3b65783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxwZWFudXQlMjBidXR0ZXJ8ZW58MHx8fHwxNzQ5ODE0Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "peanut butter",
    ingredients: ['Organic Peanuts', 'Salt'],
    category: 'Pantry Staples',
  },
  '9876543210987': { 
    barcode: '9876543210987',
    name: 'Whole Wheat Bread',
    brand: 'Bakery Co.',
    imageUrl: 'https://images.unsplash.com/photo-1676723066040-614d1ae56666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3aGVhdCUyMGJyZWFkfGVufDB8fHx8MTc0OTgxNDcwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    dataAiHint: "wheat bread",
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Soybean Oil', 'Calcium Propionate'],
    category: 'Bakery & Grains',
  },
};

async function fetchProductData(barcode: string): Promise<ProductInfo | null> {
  console.log(`Fetching product data for barcode: ${barcode}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  if (productDatabase[barcode]) {
    return productDatabase[barcode];
  }

  return {
    barcode,
    name: `Sample Product ${barcode}`,
    brand: 'Generic Brand',
    imageUrl: `https://placehold.co/400x400.png?text=Product+${barcode}`,
    dataAiHint: "generic product",
    ingredients: ['Ingredient X', 'Ingredient Y', 'Flavor Z', 'Colorant Q', 'Preservative R'],
    category: 'Unknown',
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



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
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5ff452b9-4199-4e52-a6fe-bfb910e86799?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'fuji apples',
    ingredients: ['Organic Fuji Apples'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-002': {
    barcode: 'SAFORA-MOCK-002',
    name: 'Whole Milk, Gallon',
    brand: 'FarmFresh Dairy',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_49891b88-b609-465f-8c8d-aef748abc7dc?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'milk gallon',
    ingredients: ['Pasteurized Whole Milk', 'Vitamin D3'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-003': {
    barcode: 'SAFORA-MOCK-003',
    name: 'Artisan Sourdough Bread',
    brand: 'The Rustic Loaf',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_29132c2d-a484-40d1-ab91-99e94b42570b?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'sourdough bread',
    ingredients: ['Unbleached Wheat Flour', 'Water', 'Sourdough Starter (Wheat Flour, Water)', 'Salt'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-004': {
    barcode: 'SAFORA-MOCK-004',
    name: 'Crunchy Oat & Almond Cereal',
    brand: 'MorningGlow Cereals',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5938b85e-eb88-451e-99a2-35d3faeda13e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'oat cereal',
    ingredients: ['Whole Grain Oats', 'Sugar', 'Almonds', 'Corn Syrup', 'Canola Oil', 'Honey', 'Salt', 'Natural Vanilla Flavor', 'Vitamin E (mixed tocopherols) to preserve freshness'],
    category: 'Breakfast',
  },
  'SAFORA-MOCK-005': {
    barcode: 'SAFORA-MOCK-005',
    name: 'Plain Greek Yogurt, 32oz',
    brand: 'Olympus Farms',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_08a934cb-a966-4011-9d23-c5f0e1c76b31?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'greek yogurt',
    ingredients: ['Cultured Pasteurized Grade A Nonfat Milk', 'Live and Active Cultures (S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-006': {
    barcode: 'SAFORA-MOCK-006',
    name: 'Frozen Mixed Berries, 10oz',
    brand: 'BerryBest',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_3d400c9d-2c4c-4112-ba49-1567bd8bd675?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'mixed berries',
    ingredients: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries'],
    category: 'Frozen Foods',
  },
  'SAFORA-MOCK-007': {
    barcode: 'SAFORA-MOCK-007',
    name: 'Extra Virgin Olive Oil, 500ml',
    brand: 'Golden Harvest',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_0ba311bb-e3e5-435f-9257-b7f05a501b99?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'olive oil',
    ingredients: ['100% Extra Virgin Olive Oil'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-008': {
    barcode: 'SAFORA-MOCK-008',
    name: 'Organic Quinoa, 1lb',
    brand: 'Ancient Grains Co.',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_fbfb37f4-c7eb-40f0-9e84-d1ab859fcb06?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'organic quinoa',
    ingredients: ['Organic White Quinoa'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-009': {
    barcode: 'SAFORA-MOCK-009',
    name: 'Dark Chocolate Bar (70% Cacao)',
    brand: 'ChocoLux',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_4c260465-90fb-4123-875c-828519bdd9e1?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'dark chocolate',
    ingredients: ['Cocoa Beans', 'Sugar', 'Cocoa Butter', 'Soy Lecithin (emulsifier)', 'Vanilla Extract'],
    category: 'Sweets & Desserts',
  },
  'SAFORA-MOCK-010': {
    barcode: 'SAFORA-MOCK-010',
    name: 'Natural Almond Butter, 16oz',
    brand: 'NuttyNaturals',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6d19728b-e787-463a-a6ae-8d4af57da85f?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'almond butter',
    ingredients: ['Dry Roasted Almonds', 'Sea Salt'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-011': {
    barcode: 'SAFORA-MOCK-011',
    name: 'Canned Chickpeas, 15oz',
    brand: 'PantryStaples',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_d29ea595-6d17-411b-8410-d5412e9e3812?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'canned chickpeas',
    ingredients: ['Chickpeas', 'Water', 'Salt', 'Calcium Chloride (firming agent)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-012': {
    barcode: 'SAFORA-MOCK-012',
    name: 'Sparkling Water - Lemon Flavor, 12pk',
    brand: 'BubbleUp',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_612a5443-e94f-449a-b72b-8f20854c7022?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'sparkling water',
    ingredients: ['Carbonated Water', 'Natural Lemon Flavor'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-013': {
    barcode: 'SAFORA-MOCK-013',
    name: 'Organic Baby Spinach, 5oz',
    brand: 'GreenLeaf Organics',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_69f5fc1c-463d-4081-837e-1f5b008d36c6?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'baby spinach',
    ingredients: ['Organic Baby Spinach'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-014': {
    barcode: 'SAFORA-MOCK-014',
    name: 'Free-Range Large Brown Eggs, Dozen',
    brand: 'HappyHen Farms',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_fdcd2e42-1d87-4b92-aebc-abab6719cb08?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'brown eggs',
    ingredients: ['Eggs'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-015': {
    barcode: 'SAFORA-MOCK-015',
    name: 'Whole Bean Coffee - Medium Roast, 12oz',
    brand: 'Awake Coffee Co.',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_75db4576-1e87-41db-8028-90798a949a22?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'coffee beans',
    ingredients: ['100% Arabica Coffee Beans'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-016': {
    barcode: 'SAFORA-MOCK-016',
    name: 'Gluten-Free Pasta - Penne, 12oz',
    brand: 'PastaJoy GF',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_dba77cb1-73f7-4782-877d-960d24b7d201?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'glutenfree pasta',
    ingredients: ['Corn Flour', 'Rice Flour', 'Mono and Diglycerides'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-017': {
    barcode: 'SAFORA-MOCK-017',
    name: 'Organic Tomato Sauce, 24oz',
    brand: 'Mama Rosa\'s',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_4a41c1ba-32b8-47e4-b350-4d41d163598e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'tomato sauce',
    ingredients: ['Organic Tomatoes', 'Organic Tomato Puree', 'Organic Onion', 'Organic Garlic', 'Sea Salt', 'Organic Basil', 'Organic Oregano'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-018': {
    barcode: 'SAFORA-MOCK-018',
    name: 'Unsweetened Almond Milk, Half Gallon',
    brand: 'NutriPure',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_baed9146-6d88-4d51-b5a5-34efa9130e4e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'almond milk',
    ingredients: ['Filtered Water', 'Almonds', 'Calcium Carbonate', 'Sea Salt', 'Potassium Citrate', 'Sunflower Lecithin', 'Gellan Gum', 'Vitamin A Palmitate', 'Vitamin D2', 'D-Alpha-Tocopherol (Natural Vitamin E)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-019': {
    barcode: 'SAFORA-MOCK-019',
    name: 'Avocado, Single',
    brand: 'Fresh Picks',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_803813fc-5040-433b-bbcc-217d2cb36884?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'avocado fruit',
    ingredients: ['Avocado'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-020': {
    barcode: 'SAFORA-MOCK-020',
    name: 'Wild Caught Salmon Fillet, 1lb',
    brand: 'Ocean\'s Bounty',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6b75841c-2398-4873-bcac-9b628d124de9?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'salmon fillet',
    ingredients: ['Salmon'],
    category: 'Meat & Seafood',
  },
  'SAFORA-MOCK-021': {
    barcode: 'SAFORA-MOCK-021',
    name: 'Organic Bananas (Bunch)',
    brand: 'Tropical Sun',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_8162d58e-0a2f-4aaf-88e8-a488bab34269?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'organic bananas',
    ingredients: ['Organic Bananas'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-022': {
    barcode: 'SAFORA-MOCK-022',
    name: 'Cheddar Cheese Block, 8oz',
    brand: 'Old Mill Creamery',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_3dfa711a-db6f-4724-9466-89406fd5ba17?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'cheddar cheese',
    ingredients: ['Pasteurized Milk', 'Cheese Culture', 'Salt', 'Enzymes', 'Annatto (color)'],
    category: 'Dairy & Alternatives',
  },
  'SAFORA-MOCK-023': {
    barcode: 'SAFORA-MOCK-023',
    name: 'Organic Tofu - Firm, 14oz',
    brand: 'SoyLife',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_c6af06c5-b187-47f4-850e-2dcc917f1a2e?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'organic tofu',
    ingredients: ['Water', 'Organic Soybeans', 'Calcium Sulfate', 'Nigari (Magnesium Chloride)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-024': {
    barcode: 'SAFORA-MOCK-024',
    name: 'Sweet Potatoes, 3lb Bag',
    brand: 'Harvest Gold',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_09807fd1-dc4a-4baa-b842-d844c98907eb?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'sweet potatoes',
    ingredients: ['Sweet Potatoes'],
    category: 'Fruits & Vegetables',
  },
  'SAFORA-MOCK-025': {
    barcode: 'SAFORA-MOCK-025',
    name: 'Hummus - Classic, 10oz',
    brand: 'MedGrill',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_6ccdc713-c156-43f6-8a14-47c43882a593?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'classic hummus',
    ingredients: ['Cooked Chickpeas', 'Tahini (Sesame Paste)', 'Water', 'Lemon Juice', 'Olive Oil', 'Garlic', 'Salt', 'Cumin', 'Citric Acid'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-026': {
    barcode: 'SAFORA-MOCK-026',
    name: 'Brown Rice Cakes - Unsalted, 14ct',
    brand: 'SimplyCrisp',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_73e19c96-0376-4649-bd5d-749a6ba81e20?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'rice cakes',
    ingredients: ['Whole Grain Brown Rice'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-027': {
    barcode: 'SAFORA-MOCK-027',
    name: 'Green Tea Bags, 20ct',
    brand: 'ZenInfusions',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_22e7266b-3f68-4c20-be33-d87b93741556?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'green tea',
    ingredients: ['Green Tea Leaves'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-028': {
    barcode: 'SAFORA-MOCK-028',
    name: 'Balsamic Vinaigrette Dressing, 16oz',
    brand: 'Salad Sensations',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_8edae504-bb91-41dd-b268-653f5adedb14?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'balsamic dressing',
    ingredients: ['Water', 'Balsamic Vinegar (Wine Vinegar, Concentrated Grape Must, Caramel Color)', 'Soybean Oil', 'Sugar', 'Salt', 'Garlic', 'Onion', 'Spices', 'Xanthan Gum', 'Potassium Sorbate (preservative)'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-029': {
    barcode: 'SAFORA-MOCK-029',
    name: 'Organic Chicken Broth, 32oz',
    brand: 'Kitchen Basics',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_aa709469-dd45-4d61-a39a-b1e56fbdf950?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'chicken broth',
    ingredients: ['Organic Chicken Stock', 'Organic Vegetable Stock (Carrot, Celery, Onion)', 'Sea Salt', 'Organic Chicken Flavor', 'Organic Turmeric'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-030': {
    barcode: 'SAFORA-MOCK-030',
    name: 'Walnuts - Halves & Pieces, 8oz',
    brand: 'NutHarvest',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_f7c37bd7-cc5a-4bcb-a94e-136bffd3128f?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'walnuts pieces',
    ingredients: ['Walnuts'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-031': {
    barcode: 'SAFORA-MOCK-031',
    name: 'Mayonnaise - Real, 30oz',
    brand: 'BestFoods',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_79630b5d-655b-49ad-b78a-9d33227f38a0?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'real mayonnaise',
    ingredients: ['Soybean Oil', 'Water', 'Whole Eggs and Egg Yolks', 'Vinegar', 'Salt', 'Sugar', 'Lemon Juice Concentrate', 'Calcium Disodium EDTA (to protect flavor)', 'Natural Flavors'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-032': {
    barcode: 'SAFORA-MOCK-032',
    name: 'Dijon Mustard, 12oz',
    brand: 'Grey Poupon',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_b2febfbf-17ec-40ac-94b8-62734161e23d?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'dijon mustard',
    ingredients: ['Water', 'Mustard Seeds', 'Vinegar', 'Salt', 'Citric Acid', 'Sulfites'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-033': {
    barcode: 'SAFORA-MOCK-033',
    name: 'Maple Syrup - Grade A Dark, 8oz',
    brand: 'Vermont Gold',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_1757f2d5-ce0a-4005-a753-06d95cb2d295?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'maple syrup',
    ingredients: ['Pure Maple Syrup'],
    category: 'Sweets & Desserts',
  },
  'SAFORA-MOCK-034': {
    barcode: 'SAFORA-MOCK-034',
    name: 'Salsa - Medium Chunky, 16oz',
    brand: 'El Grande',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_ebc33747-5bc2-49aa-8d78-1701958ad38f?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'chunky salsa',
    ingredients: ['Diced Tomatoes', 'Onions', 'Jalapeno Peppers', 'Cilantro', 'Water', 'Salt', 'Garlic Powder', 'Vinegar', 'Spices'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-035': {
    barcode: 'SAFORA-MOCK-035',
    name: 'Popcorn Kernels - Organic, 30oz',
    brand: 'PopPerfect',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_c1fe21c5-5ca7-4b3a-8dfa-21560f3e25c1?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'popcorn kernels',
    ingredients: ['Organic Popcorn Kernels'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-036': {
    barcode: 'SAFORA-MOCK-036',
    name: 'Protein Powder - Whey Vanilla, 2lb',
    brand: 'MuscleMax',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_f7f3482e-598a-4bc3-bd9b-c52db8480bae?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'protein powder',
    ingredients: ['Whey Protein Concentrate', 'Natural and Artificial Flavors', 'Soy Lecithin', 'Sucralose', 'Salt'],
    category: 'Health & Wellness',
  },
  'SAFORA-MOCK-037': {
    barcode: 'SAFORA-MOCK-037',
    name: 'Coconut Water - Pure, 1L',
    brand: 'Island Fresh',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_d464ac4f-4f5b-4586-865a-05eb4b08f877?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'coconut water',
    ingredients: ['100% Coconut Water'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-038': {
    barcode: 'SAFORA-MOCK-038',
    name: 'Herbal Tea - Chamomile, 20 bags',
    brand: 'Calm Moments',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_895414b3-ef04-43ef-b327-38155bace9e7?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'herbal tea',
    ingredients: ['Chamomile Flowers'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-039': {
    barcode: 'SAFORA-MOCK-039',
    name: 'Frozen Peas, 12oz',
    brand: 'Green Giant',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_4da68a94-e9ae-4c96-adf4-b3253d460cdb?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'frozen peas',
    ingredients: ['Peas'],
    category: 'Frozen Foods',
  },
  'SAFORA-MOCK-040': {
    barcode: 'SAFORA-MOCK-040',
    name: 'Apple Cider Vinegar - Organic, 16oz',
    brand: 'Bragg',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_44d14b7a-5c41-4205-9341-f005aa77597d?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'cider vinegar',
    ingredients: ['Certified Organic Raw Apple Cider Vinegar', 'Purified Water (diluted to 5% acidity)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-041': {
    barcode: 'SAFORA-MOCK-041',
    name: 'Canned Tuna in Water, 5oz',
    brand: 'StarKist',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_39edf6b1-6792-4d5b-a29f-ffb7b0174f10?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'canned tuna',
    ingredients: ['Light Tuna', 'Water', 'Vegetable Broth', 'Salt'],
    category: 'Meat & Seafood',
  },
  'SAFORA-MOCK-042': {
    barcode: 'SAFORA-MOCK-042',
    name: 'Potato Chips - Classic Salted, 9oz',
    brand: 'Lay\'s',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_95a9db1b-6395-4d56-bad4-f9ca19a2220d?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'potato chips',
    ingredients: ['Potatoes', 'Vegetable Oil (Corn, Canola, and/or Sunflower Oil)', 'Salt'],
    category: 'Snacks',
  },
  'SAFORA-MOCK-043': {
    barcode: 'SAFORA-MOCK-043',
    name: 'Orange Juice - No Pulp, 52oz',
    brand: 'Tropicana',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_e6fc16ef-5cca-44c3-913b-76fc1ac96342?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'orange juice',
    ingredients: ['100% Orange Juice'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-044': {
    barcode: 'SAFORA-MOCK-044',
    name: 'Ketchup - Tomato, 20oz',
    brand: 'Heinz',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_d9bec0e7-eb73-4ff0-a41e-13247aeb1a94?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'tomato ketchup',
    ingredients: ['Tomato Concentrate from Red Ripe Tomatoes', 'Distilled Vinegar', 'High Fructose Corn Syrup', 'Corn Syrup', 'Salt', 'Spice', 'Onion Powder', 'Natural Flavoring'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-045': {
    barcode: 'SAFORA-MOCK-045',
    name: 'Pickles - Dill Spears, 24oz',
    brand: 'Vlasic',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_650d923f-0f26-4548-ac86-ad1a766ac60d?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'dill pickles',
    ingredients: ['Cucumbers', 'Water', 'Vinegar', 'Salt', 'Calcium Chloride', 'Natural Flavors', 'Polysorbate 80', 'Turmeric (for color)'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-046': {
    barcode: 'SAFORA-MOCK-046',
    name: 'Instant Coffee - Classic Roast, 8oz',
    brand: 'Nescafé',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_656f460e-113a-4d52-b3ef-4e53cae6375c?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'instant coffee',
    ingredients: ['100% Pure Coffee'],
    category: 'Beverages',
  },
  'SAFORA-MOCK-047': {
    barcode: 'SAFORA-MOCK-047',
    name: 'Black Beans - Canned, Organic, 15oz',
    brand: 'Eden Organic',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_0d80e657-0a0b-4e6b-a973-af6c21a83cef?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'black beans',
    ingredients: ['Organic Black Beans', 'Water', 'Kombu Seaweed'],
    category: 'Pantry Staples',
  },
  'SAFORA-MOCK-048': {
    barcode: 'SAFORA-MOCK-048',
    name: 'Soy Sauce - Low Sodium, 10oz',
    brand: 'Kikkoman',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_c52046ec-5c3c-4fab-b115-8a847c90a7c9?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'soy sauce',
    ingredients: ['Water', 'Soybeans', 'Wheat', 'Salt', 'Lactic Acid', 'Sodium Benzoate: Less than 1/10 of 1% as a preservative'],
    category: 'Condiments & Sauces',
  },
  'SAFORA-MOCK-049': {
    barcode: 'SAFORA-MOCK-049',
    name: 'Corn Tortillas - White, 30ct',
    brand: 'Mission',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_c8390074-5109-41ab-a571-7b9d79b3b379?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'corn tortillas',
    ingredients: ['Corn Masa Flour', 'Water', 'Cellulose Gum', 'Propionic Acid (to preserve freshness)', 'Benzoic Acid (to preserve freshness)', 'Phosphoric Acid (acidulant)', 'Guar Gum', 'Amylase'],
    category: 'Bakery & Grains',
  },
  'SAFORA-MOCK-050': {
    barcode: 'SAFORA-MOCK-050',
    name: 'Rolled Oats - Old Fashioned, 42oz',
    brand: 'Quaker',
    imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_b8b7bb60-fb10-4b35-abc2-2a8b4bbbef3a?wid=600&hei=600&qlt=80&fmt=webp',
    dataAiHint: 'rolled oats',
    ingredients: ['Whole Grain Rolled Oats'],
    category: 'Breakfast',
  },
};

async function fetchProductData(barcode: string): Promise<ProductInfo | null> {
  console.log(`Fetching product data for barcode: ${barcode}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  if (productDatabase[barcode]) {
    return productDatabase[barcode];
  }

  // Fallback for unknown barcodes - useful for testing manual input
  // but in a real app, you'd likely show a "product not found" message sooner.
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


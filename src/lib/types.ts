export interface DietaryPreferences {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isLowCarb: boolean;
  isKeto: boolean;
  otherPreferences: string[];
}

export interface Allergies {
  hasPeanuts: boolean;
  hasTreeNuts: boolean;
  hasMilk: boolean;
  hasEggs: boolean;
  hasWheat: boolean;
  hasSoy: boolean;
  hasFish: boolean;
  hasShellfish: boolean;
  otherAllergies: string[];
}

export interface HealthGoals {
  wantsWeightLoss: boolean;
  wantsMuscleGain: boolean;
  wantsMaintainWeight: boolean;
  wantsImproveGutHealth: boolean;
  wantsLowerSugarIntake: boolean;
  otherGoals: string[];
}

export interface UserProfile {
  dietaryPreferences: Partial<DietaryPreferences>;
  allergies: Partial<Allergies>;
  healthGoals: Partial<HealthGoals>;
  customRestrictions?: string; // Consolidated for AI
}

export interface ProductInfo {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  ingredients: string[]; // Or a single string
  nutritionalInfo?: Record<string, string>; // e.g. { calories: '100', protein: '5g' }
}

export type CompatibilityStatus = "Safe" | "Contains Allergen" | "Not Recommended" | "Unknown";

export interface ScanResult extends ProductInfo {
  compatibility: CompatibilityStatus;
  reason: string; // From AI
  summary?: string; // From AI
  alternatives?: string[]; // From AI
  scannedAt: string; // ISO Date string
}

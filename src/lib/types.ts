
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

export interface UserProfileLocation {
  region?: string;
  country?: string;
  city?: string;
}

export interface UserProfile {
  // Fields from original design
  dietaryPreferences: Partial<DietaryPreferences>;
  allergies: Partial<Allergies>;
  healthGoals: Partial<HealthGoals>; // Boolean based goals
  customRestrictions?: string;

  // New detailed fields from multi-step onboarding
  name?: string;
  dateOfBirth?: string; // Store as YYYY-MM-DD string
  location?: Partial<UserProfileLocation>;

  selectedDiets?: string[]; // e.g., ["Vegan", "Gluten-Free"]
  ingredientsToAvoid?: string[]; // e.g., ["Pork", "Alcohol"]
  customIngredientsToAvoid?: string;
  
  knownAllergens?: string[]; // e.g., ["Peanuts", "Shellfish"]
  customAllergens?: string;

  healthConditions?: string[]; // e.g., ["Diabetes", "Hypertension"]
  healthGoalsList?: string[]; // Replaces/augments boolean healthGoals, e.g., ["Weight Loss", "Eat Cleaner"]

  profileCompletionStatus?: 'initial' | 'partial_onboarding' | 'complete';
}


export interface ProductInfo {
  barcode: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  dataAiHint?: string;
  ingredients: string[] | string; 
  nutritionalInfo?: Record<string, string>;
  category?: string;
}

export type CompatibilityStatus = "Safe" | "Contains Allergen" | "Not Recommended" | "Unknown";

export interface ScanResult extends ProductInfo {
  compatibility: CompatibilityStatus;
  reason: string;
  summary?: string;
  alternatives?: string[];
  scannedAt: string; // ISO Date string
}

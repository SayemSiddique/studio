

export interface DietaryPreferences { // This is largely legacy now
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isLowCarb: boolean;
  isKeto: boolean;
  otherPreferences: string[];
}

export interface Allergies { // This is largely legacy now
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

export interface HealthGoals { // This is largely legacy now
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
  // Fields from multi-step data collection (primary source of data)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // Store as YYYY-MM-DD string
  age?: number; // Calculated from DOB
  location?: UserProfileLocation;

  selectedDiets?: string[];
  ingredientsToAvoid?: string[];
  customIngredientsToAvoid?: string;

  knownAllergens?: string[]; // Will store common (chips) + other (dropdown)
  customAllergens?: string;

  healthConditions?: string[];
  healthGoalsList?: string[];
  
  customRestrictions?: string; // For any other general notes

  profileCompletionStatus?: 'initial' | 'visual_complete' | 'data_collection_started' | 'data_partial' | 'data_complete' | 'data_complete_guest';

  // Legacy fields - can be removed if no longer needed for migration or fallback
  name?: string; 
  dietaryPreferences?: Partial<DietaryPreferences>;
  allergies?: Partial<Allergies>;
  healthGoals?: Partial<HealthGoals>;
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


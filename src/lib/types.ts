
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
  // Fields from original visual onboarding form
  dietaryPreferences: Partial<DietaryPreferences>; // Keep for now, can be deprecated later
  allergies: Partial<Allergies>; // Keep for now, can be deprecated later
  healthGoals: Partial<HealthGoals>; // Keep for now, can be deprecated later
  customRestrictions?: string; // General custom notes

  // New detailed fields from multi-step data collection
  name?: string;
  dateOfBirth?: string; // Store as YYYY-MM-DD string
  location?: Partial<UserProfileLocation>;

  selectedDiets?: string[]; 
  ingredientsToAvoid?: string[];
  customIngredientsToAvoid?: string;
  
  knownAllergens?: string[];
  customAllergens?: string;

  healthConditions?: string[];
  healthGoalsList?: string[];

  profileCompletionStatus?: 'initial' | 'visual_complete' | 'data_collection_started' | 'data_collection_complete';
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


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
  // Old structure fields (can be progressively deprecated or used for migration)
  dietaryPreferences: Partial<DietaryPreferences>;
  allergies: Partial<Allergies>;
  healthGoals: Partial<HealthGoals>;
  customRestrictions?: string;

  // New detailed fields from multi-step data collection
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // Store as YYYY-MM-DD string
  age?: number; // Calculated from DOB
  location?: Partial<UserProfileLocation>;

  selectedDiets?: string[];
  ingredientsToAvoid?: string[];
  customIngredientsToAvoid?: string;

  knownAllergens?: string[];
  customAllergens?: string;

  healthConditions?: string[];
  healthGoalsList?: string[];

  profileCompletionStatus?: 'initial' | 'visual_complete' | 'data_collection_started' | 'data_partial' | 'data_complete' | 'data_complete_guest';
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

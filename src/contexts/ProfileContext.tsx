
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>; // Allow partial updates
  getProfileForAI: () => string; 
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  dietaryPreferences: {},
  allergies: {},
  healthGoals: {},
  customRestrictions: "",
  name: "",
  dateOfBirth: "",
  location: {},
  selectedDiets: [],
  ingredientsToAvoid: [],
  customIngredientsToAvoid: "",
  knownAllergens: [],
  customAllergens: "",
  healthConditions: [],
  healthGoalsList: [],
  profileCompletionStatus: 'initial',
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem('saforaUserProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile({ ...initialProfile, ...parsedProfile });
      } catch (error) {
        console.error("Failed to parse stored profile:", error);
        setProfile(initialProfile);
      }
    } else {
      setProfile(initialProfile);
    }
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (newProfileData: Partial<UserProfile>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    
    setProfile(prevProfile => {
      const updated = { ...(prevProfile || initialProfile), ...newProfileData };
      localStorage.setItem('saforaUserProfile', JSON.stringify(updated));
      return updated;
    });
    setLoading(false);
  }, []);

  const getProfileForAI = useCallback((): string => {
    if (!profile) return "No dietary profile set.";

    let restrictionsStr = "User Dietary Profile:\n";
    
    if (profile.name) restrictionsStr += `Name: ${profile.name}\n`;
    // DOB and Location might not be relevant for food analysis AI, but can be included if needed.

    const formatArraySection = (title: string, items: string[] | undefined, prefix: string = "") => {
      if (items && items.length > 0) {
        restrictionsStr += `${title}:\n${items.map(item => `- ${prefix}${item}`).join("\n")}\n`;
      }
    };
    
    // Combine old boolean preferences with new array if both exist, or prioritize new array.
    // For now, focusing on new arrays:
    formatArraySection("Dietary Choices", profile.selectedDiets);
    formatArraySection("Ingredients to Avoid", profile.ingredientsToAvoid);
    if(profile.customIngredientsToAvoid) restrictionsStr += `Custom Ingredients to Avoid: ${profile.customIngredientsToAvoid}\n`;
    
    formatArraySection("Known Allergens", profile.knownAllergens, "Allergic to ");
     if(profile.customAllergens) restrictionsStr += `Custom Allergens: ${profile.customAllergens}\n`;

    formatArraySection("Health Conditions", profile.healthConditions);
    formatArraySection("Health Goals", profile.healthGoalsList);
    
    if (profile.customRestrictions) {
      restrictionsStr += `Other General Restrictions:\n- ${profile.customRestrictions}\n`;
    }
    
    if (restrictionsStr === "User Dietary Profile:\n") return "No specific dietary restrictions, preferences, or goals set.";

    return restrictionsStr.trim();
  }, [profile]);


  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, getProfileForAI }}>
      {children}
    </ProfileContext.Provider>
  );
};

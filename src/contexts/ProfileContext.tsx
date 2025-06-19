
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  getProfileForAI: () => string; 
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  // Old structure defaults (can be phased out)
  dietaryPreferences: {},
  allergies: {},
  healthGoals: {},
  customRestrictions: "",

  // New detailed fields
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
        // Ensure all fields from initialProfile are present, even if not in storedProfile
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
    if (profile.dateOfBirth) restrictionsStr += `Date of Birth: ${profile.dateOfBirth}\n`;
    if (profile.location?.country) restrictionsStr += `Location: ${profile.location.city ? profile.location.city + ', ' : ''}${profile.location.country}\n`;
    
    const formatArraySection = (title: string, items: string[] | undefined, customItem?: string | undefined, prefix: string = "") => {
      if (items && items.length > 0) {
        restrictionsStr += `${title}:\n${items.map(item => `- ${prefix}${item}`).join("\n")}\n`;
      }
      if (customItem && customItem.trim() !== "") {
        restrictionsStr += `Custom ${title.toLowerCase()}:\n- ${customItem}\n`;
      }
    };
    
    formatArraySection("Dietary Choices", profile.selectedDiets);
    formatArraySection("Ingredients to Avoid", profile.ingredientsToAvoid, profile.customIngredientsToAvoid);
    formatArraySection("Known Allergens", profile.knownAllergens, profile.customAllergens, "Allergic to ");
    formatArraySection("Health Conditions", profile.healthConditions);
    formatArraySection("Health Goals", profile.healthGoalsList);
    
    if (profile.customRestrictions && profile.customRestrictions.trim() !== "") {
      restrictionsStr += `Other General Notes/Restrictions:\n- ${profile.customRestrictions}\n`;
    }
    
    // Include old boolean preferences if they exist and new arrays are empty (for backward compatibility during transition)
    // This part can be removed once fully migrated to new array fields
    if ((!profile.selectedDiets || profile.selectedDiets.length === 0) && Object.values(profile.dietaryPreferences).some(v => v)) {
      restrictionsStr += "Legacy Dietary Preferences:\n";
      Object.entries(profile.dietaryPreferences).forEach(([key, value]) => {
        if (value === true && !key.startsWith("other")) {
          restrictionsStr += `- ${key.replace("is", "")}\n`;
        }
      });
    }
     if ((!profile.knownAllergens || profile.knownAllergens.length === 0) && Object.values(profile.allergies).some(v => v)) {
      restrictionsStr += "Legacy Allergies:\n";
      Object.entries(profile.allergies).forEach(([key, value]) => {
        if (value === true && !key.startsWith("other")) {
          restrictionsStr += `- ${key.replace("has", "")}\n`;
        }
      });
    }
     if ((!profile.healthGoalsList || profile.healthGoalsList.length === 0) && Object.values(profile.healthGoals).some(v => v)) {
      restrictionsStr += "Legacy Health Goals:\n";
      Object.entries(profile.healthGoals).forEach(([key, value]) => {
        if (value === true && !key.startsWith("other")) {
          restrictionsStr += `- ${key.replace("wants", "")}\n`;
        }
      });
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

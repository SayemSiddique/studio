

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
    if (profile.dateOfBirth) restrictionsStr += `DOB: ${profile.dateOfBirth}\n`;
    if (profile.location) {
      const locParts = [];
      if (profile.location.city) locParts.push(profile.location.city);
      if (profile.location.country) locParts.push(profile.location.country);
      if (locParts.length > 0) restrictionsStr += `Location: ${locParts.join(', ')}\n`;
    }
    
    const formatArraySection = (title: string, items?: string[], customItem?: string, itemPrefix: string = "- ") => {
      let sectionContent = "";
      if (items && items.length > 0) {
        sectionContent += items.map(item => `${itemPrefix}${item}`).join("\n") + "\n";
      }
      if (customItem && customItem.trim() !== "") {
        // Ensure custom items are also prefixed if a prefix is usually applied
        sectionContent += `${itemPrefix}${customItem.trim()}\n`;
      }
      if (sectionContent) {
        restrictionsStr += `${title}:\n${sectionContent}`;
      }
    };
    
    formatArraySection("Dietary Choices", profile.selectedDiets);
    formatArraySection("Ingredients to Avoid", profile.ingredientsToAvoid, profile.customIngredientsToAvoid);
    formatArraySection("Allergies", profile.knownAllergens, profile.customAllergens);
    formatArraySection("Health Conditions", profile.healthConditions);
    formatArraySection("Health Goals", profile.healthGoalsList);
    
    // Include old boolean preferences if they exist and new arrays are empty (for backward compatibility during transition)
    // This part can be removed once fully migrated to new array fields
    const addLegacyData = (legacyField: keyof UserProfile, title: string, keyPrefixToRemove: string) => {
      const legacyData = profile[legacyField] as Record<string, any> | undefined;
      if (legacyData && Object.values(legacyData).some(v => v === true)) {
        const items = Object.entries(legacyData)
          .filter(([key, value]) => value === true && !key.startsWith("other"))
          .map(([key]) => `- ${key.replace(keyPrefixToRemove, "").replace(/([A-Z])/g, ' $1').trim()}`);
        if (items.length > 0) {
          restrictionsStr += `${title} (Legacy):\n${items.join("\n")}\n`;
        }
      }
    };

    if (!profile.selectedDiets || profile.selectedDiets.length === 0) {
       addLegacyData('dietaryPreferences', "Dietary Preferences", "is");
    }
    if (!profile.knownAllergens || profile.knownAllergens.length === 0) {
       addLegacyData('allergies', "Allergies", "has");
    }
    if (!profile.healthGoalsList || profile.healthGoalsList.length === 0) {
      addLegacyData('healthGoals', "Health Goals", "wants");
    }
     if (profile.customRestrictions && profile.customRestrictions.trim() !== "") {
      restrictionsStr += `Other General Notes/Restrictions (Legacy):\n- ${profile.customRestrictions}\n`;
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


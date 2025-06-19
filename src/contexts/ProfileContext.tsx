

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
  // Old structure defaults
  dietaryPreferences: {},
  allergies: {},
  healthGoals: {},
  customRestrictions: "",

  // New detailed fields
  name: "",
  dateOfBirth: "", // YYYY-MM-DD
  location: { region: "", country: "", city: "" },
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
    await new Promise(resolve => setTimeout(resolve, 300)); 
    
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
    
    const locParts = [];
    if (profile.location?.city) locParts.push(profile.location.city);
    if (profile.location?.country) locParts.push(profile.location.country);
    if (profile.location?.region) locParts.push(profile.location.region);
    if (locParts.length > 0) restrictionsStr += `Location: ${locParts.join(', ')}\n`;
    
    restrictionsStr += "\n";

    const formatArraySection = (title: string, items?: string[], customItem?: string) => {
      let sectionContent = "";
      if (items && items.length > 0) {
        sectionContent += items.map(item => `- ${item}`).join("\n") + "\n";
      }
      if (customItem && customItem.trim() !== "") {
        // Split custom items by comma if they are lists
        const customItemsArray = customItem.split(',').map(i => i.trim()).filter(i => i);
        if (customItemsArray.length > 0) {
            sectionContent += customItemsArray.map(item => `- ${item} (custom)`).join("\n") + "\n";
        }
      }
      if (sectionContent) {
        return `${title}:\n${sectionContent}\n`;
      }
      return "";
    };
    
    restrictionsStr += formatArraySection("Dietary Choices/Paths", profile.selectedDiets);
    restrictionsStr += formatArraySection("Specific Ingredients to Avoid", profile.ingredientsToAvoid, profile.customIngredientsToAvoid);
    restrictionsStr += formatArraySection("Known Allergens", profile.knownAllergens, profile.customAllergens);
    restrictionsStr += formatArraySection("Health Conditions", profile.healthConditions);
    restrictionsStr += formatArraySection("Health Goals", profile.healthGoalsList);
    
    // Fallback to old customRestrictions if present and new detailed fields are sparse
    if (profile.customRestrictions && profile.customRestrictions.trim() !== "" && 
        !(profile.selectedDiets && profile.selectedDiets.length > 0) &&
        !(profile.ingredientsToAvoid && profile.ingredientsToAvoid.length > 0) &&
        !(profile.knownAllergens && profile.knownAllergens.length > 0)
    ) {
      restrictionsStr += `Other General Notes/Restrictions (Legacy):\n- ${profile.customRestrictions}\n`;
    }

    if (restrictionsStr.trim() === "User Dietary Profile:") return "No specific dietary restrictions, preferences, or goals set.";

    return restrictionsStr.trim();
  }, [profile]);


  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, getProfileForAI }}>
      {children}
    </ProfileContext.Provider>
  );
};

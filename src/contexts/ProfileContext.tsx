
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile, UserProfileLocation } from '@/lib/types';
import { differenceInYears, parseISO, isValid } from "date-fns";


interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  getProfileForAI: () => string;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  // New detailed fields (primary source of data)
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  age: undefined,
  location: { region: "", country: "", city: "" },
  selectedDiets: [],
  ingredientsToAvoid: [],
  customIngredientsToAvoid: "",
  knownAllergens: [],
  customAllergens: "",
  healthConditions: [],
  healthGoalsList: [],
  profileCompletionStatus: 'initial',

  // Old structure fields (can be used as fallbacks or for migration if needed)
  name: "", // old single name field
  dietaryPreferences: {},
  allergies: {},
  healthGoals: {},
  customRestrictions: "",
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem('saforaUserProfile');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        // Ensure all fields from initialProfile are present
        const completeProfile = { ...initialProfile, ...parsedProfile };
        
        // Recalculate age if DOB is present
        if (completeProfile.dateOfBirth) {
          try {
            const birthDate = parseISO(completeProfile.dateOfBirth);
            if (isValid(birthDate)) {
              completeProfile.age = differenceInYears(new Date(), birthDate);
            } else {
              completeProfile.age = undefined;
            }
          } catch (e) {
            completeProfile.age = undefined;
          }
        }
        setProfile(completeProfile);
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
      // Recalculate age if DOB changed
      if (newProfileData.dateOfBirth !== undefined) {
        if(newProfileData.dateOfBirth) {
          try {
            const birthDate = parseISO(newProfileData.dateOfBirth);
            if (isValid(birthDate)) {
              updated.age = differenceInYears(new Date(), birthDate);
            } else {
              updated.age = undefined;
            }
          } catch (e) {
            updated.age = undefined;
          }
        } else {
           updated.age = undefined;
        }
      }
      localStorage.setItem('saforaUserProfile', JSON.stringify(updated));
      return updated;
    });
    setLoading(false);
  }, []);

  const getProfileForAI = useCallback((): string => {
    if (!profile) return "No dietary profile set.";

    let restrictionsStr = "User Dietary Profile:\n";

    if (profile.firstName || profile.lastName) {
      restrictionsStr += `Name: ${profile.firstName || ""} ${profile.lastName || ""}\n`.trim() + "\n";
    } else if (profile.name) { // Fallback to old name field
      restrictionsStr += `Name: ${profile.name}\n`;
    }

    if (profile.age !== undefined) restrictionsStr += `Age: ${profile.age} years old\n`;
    if (profile.dateOfBirth) restrictionsStr += `Date of Birth: ${profile.dateOfBirth}\n`;

    const locParts = [];
    if (profile.location?.city) locParts.push(profile.location.city);
    if (profile.location?.country) locParts.push(profile.location.country);
    if (profile.location?.region) locParts.push(profile.location.region);
    if (locParts.length > 0) restrictionsStr += `Location: ${locParts.join(', ')}\n`;

    restrictionsStr += "\n"; // Add a separator before listing choices

    const formatArraySection = (title: string, items?: string[], customItemsString?: string) => {
      let sectionContent = "";
      const combinedItems = new Set<string>();

      if (items && items.length > 0) {
        items.forEach(item => combinedItems.add(item));
      }

      if (customItemsString && customItemsString.trim() !== "") {
        customItemsString.split(',').map(i => i.trim()).filter(i => i).forEach(item => combinedItems.add(`${item} (custom)`));
      }
      
      if (combinedItems.size > 0) {
        sectionContent += Array.from(combinedItems).map(item => `- ${item}`).join("\n") + "\n";
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

    // Include legacy customRestrictions if it has value and new fields are mostly empty
    // to ensure data isn't lost for users who might have only filled that.
    const newFieldsAreEmpty = 
        (profile.selectedDiets?.length || 0) === 0 &&
        (profile.ingredientsToAvoid?.length || 0) === 0 && !profile.customIngredientsToAvoid &&
        (profile.knownAllergens?.length || 0) === 0 && !profile.customAllergens &&
        (profile.healthConditions?.length || 0) === 0 &&
        (profile.healthGoalsList?.length || 0) === 0;

    if (profile.customRestrictions && profile.customRestrictions.trim() !== "" && newFieldsAreEmpty) {
      restrictionsStr += `Other General Notes/Restrictions (Legacy):\n- ${profile.customRestrictions}\n`;
    } else if (profile.customRestrictions && profile.customRestrictions.trim() !== "" && !newFieldsAreEmpty) {
      restrictionsStr += `Other General Notes/Restrictions:\n- ${profile.customRestrictions}\n`; // If new fields are also filled, just label it generically
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


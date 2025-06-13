"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfile: UserProfile) => Promise<void>;
  getProfileForAI: () => string; // Method to format profile for AI
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const initialProfile: UserProfile = {
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
        // Ensure all keys from initialProfile are present
        setProfile({ ...initialProfile, ...parsedProfile });
      } catch (error) {
        console.error("Failed to parse stored profile:", error);
        setProfile(initialProfile); // Fallback to initial profile
      }
    } else {
      setProfile(initialProfile);
    }
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (newProfile: UserProfile) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedProfile = { ...profile, ...newProfile }; // Merge existing with new
    setProfile(updatedProfile);
    localStorage.setItem('saforaUserProfile', JSON.stringify(updatedProfile));
    setLoading(false);
  }, [profile]);

  const getProfileForAI = useCallback((): string => {
    if (!profile) return "No dietary profile set.";

    let restrictionsStr = "User Dietary Profile:\n";

    const formatSection = (title: string, data: Record<string, any> | undefined, prefixTrue: string = "", prefixFalse: string = "") => {
      if (!data || Object.keys(data).length === 0) return "";
      let sectionStr = `${title}:\n`;
      let items: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith("is") || key.startsWith("has") || key.startsWith("wants")) {
           if (value === true) items.push(`${prefixTrue}${key.substring(key.startsWith("is") ? 2 : (key.startsWith("has") ? 3 : 5)).replace(/([A-Z])/g, ' $1').trim()}`);
           // else if (value === false && prefixFalse) items.push(`${prefixFalse}${key.substring(key.startsWith("is") ? 2 : (key.startsWith("has") ? 3 : 5)).replace(/([A-Z])/g, ' $1').trim()}`);
        } else if (key.startsWith("other") && Array.isArray(value) && value.length > 0) {
          items.push(...value);
        }
      }
      if (items.length > 0) {
        sectionStr += items.map(item => `- ${item}`).join("\n") + "\n";
        return sectionStr;
      }
      return "";
    };
    
    restrictionsStr += formatSection("Preferences", profile.dietaryPreferences, "Prefers ");
    restrictionsStr += formatSection("Allergies", profile.allergies, "Allergic to ");
    restrictionsStr += formatSection("Health Goals", profile.healthGoals, "Goal: ");

    if (profile.customRestrictions) {
      restrictionsStr += `Other Restrictions:\n- ${profile.customRestrictions}\n`;
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

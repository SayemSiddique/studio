# Safora: AI Food Insights

## Overview

Safora is a web application designed to empower users to make informed dietary choices through personalized, AI-driven analysis of food products. Whether you have specific dietary restrictions, allergies, health goals, or simply want to understand your food better, Safora provides instant insights by "scanning" product barcodes or analyzing ingredient lists.

**Purpose:** To help users navigate the complex world of food ingredients and nutritional information, ensuring their food choices align with their unique dietary needs, preferences (like halal, vegan, gluten-free), allergies, and health objectives.

## Key Features

*   **Comprehensive Onboarding:** A detailed, multi-step onboarding process to capture user's:
    *   Personal information (name, age, location).
    *   Dietary paths (e.g., Vegan, Halal, Keto, Gluten-Free).
    *   Specific ingredients to avoid (non-allergy related).
    *   Known allergies (common and custom).
    *   Health conditions.
    *   Health goals.
*   **Food Product Scanning (Simulated):**
    *   Simulate barcode scanning to fetch product details.
    *   Option for manual barcode entry.
    *   Mock OCR for ingredient list scanning.
*   **AI-Powered Analysis:**
    *   **Compatibility Check:** Analyzes scanned product ingredients against the user's detailed dietary profile.
    *   **Status Indication:** Clearly indicates if a product is "Safe," "Contains Allergen," or "Not Recommended."
    *   **Detailed Reasoning:** Provides explanations for the compatibility status.
    *   **Nutritional Summary:** AI-generated summary of key nutritional aspects.
    *   **Alternative Suggestions:** Offers alternative products if a scanned item is unsuitable.
*   **Detailed Product Information:** View product name, brand, image, and full ingredient list.
*   **Personalized Dietary Profile Management:**
    *   Create, view, and edit a comprehensive dietary profile at any time.
    *   All onboarding data points are editable.
*   **Scan History:** Keep track of all previously scanned items, with options to filter and sort.
*   **Favorites:** Mark products as favorites for quick access.
*   **Product Directory:** Browse a list of known products within the app.
*   **User Authentication:** Secure sign-up and login (mocked email/password and social logins). Option to continue as a guest with locally saved profile.

## Tech Stack

Safora is built using a modern web technology stack:

*   **Frontend Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **UI Library:** [React](https://reactjs.org/)
*   **Component Library:** [ShadCN UI](https://ui.shadcn.com/) (built on Radix UI & Tailwind CSS)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & CSS Modules
*   **AI/ML Integration:** [Genkit (by Firebase)](https://firebase.google.com/docs/genkit) for defining and running AI flows (e.g., using Google's Gemini models).
*   **State Management:** React Context API
*   **Forms:** React Hook Form with Zod for validation.
*   **Date Handling:** date-fns
*   **Icons:** Lucide React

## Getting Started

This project is developed within Firebase Studio.

1.  **Launch the App:** The application starts with a splash screen and automatically proceeds to the onboarding flow.
2.  **Onboarding:**
    *   Go through the initial visual introduction slides.
    *   Proceed to the detailed data collection steps to set up your dietary profile. This is crucial for personalized analysis.
3.  **Authentication:** After onboarding (or if you skip parts of it), you'll be prompted to create an account or log in. You can also continue as a guest.
4.  **Explore:**
    *   **Home Page (`/home`):** Access quick actions like scanning, viewing history, or managing your profile.
    *   **Scan Page (`/scan`):** Simulate scanning a product barcode or enter one manually.
    *   **Product Results (`/scan-results/[barcode]`):** View detailed analysis of a product.
    *   **Profile Page (`/profile`):** View your current dietary profile.
    *   **Dietary Profile Edit (`/dietary-profile`):** Modify your saved preferences.
    *   **History (`/history`), Favorites (`/favorites`), Products (`/products`):** Explore these sections to manage your data and discover items.

## Project Structure

The project follows standard Next.js App Router conventions:

*   **`src/app/`**: Contains all routes, layouts, and pages.
    *   `(app)/`: Authenticated routes.
    *   `(auth)/`: Authentication routes.
    *   `(default)/`: Public routes like splash and onboarding.
*   **`src/components/`**: Reusable UI components (ShadCN UI, custom components).
*   **`src/contexts/`**: React Context for global state (Auth, Profile).
*   **`src/lib/`**: Utility functions, type definitions, and constant data (like onboarding options).
*   **`src/ai/`**: Genkit flows and AI-related configurations.
*   **`public/`**: Static assets like images.

## Note

This `README.md` provides a high-level overview of the Safora application as prototyped in Firebase Studio. The authentication and data persistence for profile, history, and favorites are currently mocked using `localStorage` for rapid prototyping. A full production deployment would involve integrating with live Firebase Authentication and Firestore services.

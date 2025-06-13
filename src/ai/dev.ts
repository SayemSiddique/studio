import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-food-compatibility.ts';
import '@/ai/flows/summarize-ingredient-information.ts';
import '@/ai/flows/suggest-alternatives.ts';
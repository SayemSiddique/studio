
"use client";

import Link from 'next/link';
import { Leaf } from 'lucide-react'; // Changed from UtensilsCrossed

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Leaf className="h-8 w-8" /> {/* Changed from UtensilsCrossed */}
      <span className="text-2xl font-bold font-headline">Safora</span>
    </Link>
  );
}

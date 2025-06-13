"use client";

import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <UtensilsCrossed className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">Safora</span>
    </Link>
  );
}

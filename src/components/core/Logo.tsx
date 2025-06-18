
"use client";

import Link from 'next/link';
import Image from 'next/image';
import MainLogo from '@/image/main_logo.png';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Image src={MainLogo} alt="Safora Logo" width={32} height={32} className="h-8 w-8 object-contain" />
      <span className="text-2xl font-bold font-headline">Safora</span>
    </Link>
  );
}

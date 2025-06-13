"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 md:px-6 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Safora AI Food Insights. All rights reserved.</p>
        <p className="mt-1">Your guide to smarter, healthier eating choices.</p>
      </div>
    </footer>
  );
}

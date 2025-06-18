
"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ScanLine, ListChecks, UserCircle2, Settings, LogOut, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/core/Logo';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import * as React from 'react';

const navLinks = [
  { href: '/home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { href: '/scan', label: 'Scan', icon: <ScanLine className="h-5 w-5" /> },
  { href: '/history', label: 'History', icon: <ListChecks className="h-5 w-5" /> },
  { href: '/favorites', label: 'Favorites', icon: <Heart className="h-5 w-5" /> },
];

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const NavLinkItem: React.FC<{ href: string; label: string; icon: React.ReactNode; onClick?: () => void }> = ({ href, label, icon, onClick }) => (
    <Button
      variant={pathname === href ? "secondary" : "ghost"}
      asChild
      className={cn(
        "justify-start w-full text-left",
        pathname === href && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
      onClick={onClick}
    >
      <Link href={href} className="flex items-center gap-3">
        {icon}
        {label}
      </Link>
    </Button>
  );
  
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : (user?.displayName ? user.displayName.charAt(0).toUpperCase() : "S");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4 bg-card">
                <div className="mb-6">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLinkItem key={link.href} {...link} onClick={() => setIsSheetOpen(false)} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant={pathname === link.href ? "secondary" : "ghost"} asChild 
              className={cn(
                "px-3 py-2 text-sm font-medium",
                pathname === link.href && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              <Link href={link.href} className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png?text=${userInitial}`} alt={user.displayName || user.email || "User"} data-ai-hint="profile avatar" />
                  <AvatarFallback className="bg-muted">{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || user.email?.split('@')[0]}</p>
                  {user.email && <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                  <UserCircle2 className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dietary-profile" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Dietary Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading} className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="h-4 w-4" />
                <span>{loading ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => router.push('/auth')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

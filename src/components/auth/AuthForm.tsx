"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/core/Logo';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, KeyRound } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
        toast({ title: "Login Successful", description: "Welcome back!" });
        router.push('/dietary-profile'); // Or /home if profile already set
      } else {
        await signup(data.email, data.password);
        toast({ title: "Signup Successful", description: "Welcome to Safora! Let's set up your profile." });
        router.push('/dietary-profile');
      }
    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6">
         <Logo />
        </div>
        <CardTitle className="text-3xl font-headline">{isLogin ? 'Welcome Back!' : 'Create Account'}</CardTitle>
        <CardDescription>{isLogin ? 'Log in to continue your journey.' : 'Join Safora for personalized food insights.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} className="pl-10" />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                {...form.register('password')} 
                className="pl-10 pr-10"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-accent hover:text-accent/90">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </Button>
      </CardFooter>
    </Card>
  );
}

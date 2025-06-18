
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
import { Eye, EyeOff, Mail, KeyRound, Smartphone, Facebook } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { 
    login, 
    signup, 
    loading, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithPhoneNumber, 
    forgotPassword 
  } = useAuth();
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
        router.push('/home'); 
      } else {
        await signup(data.email, data.password);
        toast({ title: "Signup Successful", description: "Welcome to Safora! Let's set up your profile." });
        router.push('/dietary-profile');
      }
    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({ title: "Forgot Password", description: "Please enter your email address first.", variant: "destructive"});
      form.setFocus('email');
      return;
    }
    if (z.string().email().safeParse(email).success === false) {
        toast({ title: "Forgot Password", description: "Please enter a valid email address.", variant: "destructive"});
        form.setFocus('email');
        return;
    }
    try {
      await forgotPassword(email);
      toast({ title: "Password Reset", description: `If an account exists for ${email}, a password reset link has been sent.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Could not send password reset email.", variant: "destructive" });
    }
  };

  const handleSocialLogin = async (provider: () => Promise<void>, providerName: string) => {
    try {
      await provider();
      toast({ title: `${providerName} Sign-In Successful`, description: "Welcome to Safora!" });
      router.push('/home'); // Or /dietary-profile if first time
    } catch (error: any) {
      toast({ title: `${providerName} Sign-In Failed`, description: error.message || "An unexpected error occurred.", variant: "destructive" });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {isLogin && (
            <div className="flex items-center justify-end">
              <Button type="button" variant="link" size="sm" onClick={handleForgotPassword} className="px-0 text-sm h-auto text-primary hover:underline">
                Forgot password?
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={loading}>
            {loading && form.formState.isSubmitting ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or {isLogin ? 'log in' : 'sign up'} with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin(loginWithGoogle, "Google")} disabled={loading}>
            <GoogleIcon /> Continue with Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 border-[#1877F2] hover:border-[#1877F2]/90" 
            onClick={() => handleSocialLogin(loginWithFacebook, "Facebook")} 
            disabled={loading}
          >
            <Facebook className="mr-2 h-5 w-5" /> Continue with Facebook
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin(loginWithPhoneNumber, "Phone")} disabled={loading}>
            <Smartphone className="mr-2 h-5 w-5" /> Continue with Phone
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center mt-4">
        <Button variant="link" onClick={() => { setIsLogin(!isLogin); form.clearErrors(); }} className="text-foreground hover:text-foreground/90">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
        </Button>
      </CardFooter>
    </Card>
  );
}

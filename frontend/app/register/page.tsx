"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import type { UserRole } from "@/types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "faculty", "student", "accountant"]),
});

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" as UserRole });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await authApi.register(validation.data);
      console.log("Registration response:", response);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Registration error:", err);
      // Handle different error types
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 p-12 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">College ERP</h1>
            <p className="text-xs text-white/70">Management System</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-white text-balance">
            Join Our Educational Platform
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Create your account to access the comprehensive ERP system for managing your academic journey.
          </p>
          
          <div className="space-y-3 pt-4">
            {[
              "Secure Account Creation",
              "Role-based Access",
              "Instant Dashboard Access",
              "Complete Feature Set"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 text-white/70" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-sm text-white/60">
          <p>Trusted by educational institutions worldwide</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex flex-1 flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">College ERP</h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-0">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    disabled={isSubmitting}
                    required
                    className="h-11 bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    disabled={isSubmitting}
                    required
                    className="h-11 bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min 8 characters)"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    disabled={isSubmitting}
                    required
                    className="h-11 bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Role</Label>
                  <Select 
                    value={form.role} 
                    onValueChange={(value) => setForm((p) => ({ ...p, role: value as UserRole }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-11 bg-muted/50">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="h-11 w-full text-sm font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button asChild variant="outline" className="h-11 w-full text-sm font-medium">
                  <Link href="/login">
                    Sign in instead
                  </Link>
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleGoToDashboard = () => {
    if (user) {
      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "faculty":
          router.push("/faculty");
          break;
        case "student":
          router.push("/student");
          break;
        case "accountant":
          router.push("/accountant");
          break;
        default:
          router.push("/");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              You are logged in as:{" "}
              <span className="font-semibold text-foreground">
                {user?.role?.toUpperCase()}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This page is restricted to specific roles only.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGoToDashboard}
              className="w-full"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to My Dashboard
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground text-center">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

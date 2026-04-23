"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole, LoginCredentials, AuthState } from "@/types";

// ============================================
// NO AUTH MODE - Anyone can access
// ============================================

// ============================================
// AUTH CONTEXT TYPES
// ============================================
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const initialState: AuthState = {
  user: {
    id: "guest",
    email: "guest@college.edu",
    name: "Guest User",
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  token: "guest-token",
  isAuthenticated: true,
  isLoading: false,
};

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// AUTH PROVIDER
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Auto-authenticate on mount
  const checkAuth = useCallback(async () => {
    setState(initialState);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function - always succeeds
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState(initialState);
      router.push("/admin");
    },
    [router]
  );

  // Logout function
  const logout = useCallback(async () => {
    router.push("/admin");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// USE AUTH HOOK
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// ============================================
// AUTH GUARD COMPONENT - Now allows everyone
// ============================================
interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>;
}

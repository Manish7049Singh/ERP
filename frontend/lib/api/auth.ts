import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { User, LoginCredentials, AuthResponse, ApiResponse } from "@/types";

// ============================================
// AUTH API SERVICE
// ============================================

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
  },
};

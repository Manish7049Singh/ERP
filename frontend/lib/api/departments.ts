import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { ApiResponse, Department } from "@/types";

export type DepartmentPayload = Omit<Department, "id">;

// ============================================
// DEPARTMENTS API SERVICE
// ============================================
export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await apiClient.get<Array<Partial<Department> & { id: string | number }>>(
      API_ENDPOINTS.DEPARTMENTS.BASE
    );

    return response.map((item) => ({
      id: String(item.id),
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      headOfDepartment: item.headOfDepartment,
      establishedYear: item.establishedYear || new Date().getFullYear(),
      status: item.status || "active",
    }));
  },

  getById: async (id: string): Promise<Department> => {
    const item = await apiClient.get<Partial<Department> & { id: string | number }>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id)
    );

    return {
      id: String(item.id),
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      headOfDepartment: item.headOfDepartment,
      establishedYear: item.establishedYear || new Date().getFullYear(),
      status: item.status || "active",
    };
  },

  create: async (data: DepartmentPayload): Promise<Department> => {
    return apiClient.post<Department>(API_ENDPOINTS.DEPARTMENTS.BASE, data);
  },

  update: async (id: string, data: Partial<DepartmentPayload>): Promise<Department> => {
    return apiClient.put<Department>(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
  },
};

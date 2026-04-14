import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { Faculty, FacultyFormData, PaginatedResponse, ApiResponse, FilterState } from "@/types";

// ============================================
// FACULTY API SERVICE
// ============================================

export const facultyApi = {
  /**
   * Get all faculty with pagination and filters
   */
  getAll: async (filters: Partial<FilterState>): Promise<PaginatedResponse<Faculty>> => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const response = await apiClient.get<
      Array<{
        id: string | number;
        faculty_id?: string;
        name: string;
        email?: string;
        phone?: string;
        department?: string;
        designation?: string;
      }>
    >(API_ENDPOINTS.FACULTY.BASE, {
      skip,
      limit,
      search: filters.search,
    });

    const normalized: Faculty[] = response.map((item) => ({
      id: String(item.id),
      userId: String(item.id),
      employeeId: item.faculty_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      qualification: "",
      specialization: "",
      departmentId: item.department || "",
      designation: item.designation || "",
      joiningDate: "",
      status: "active",
      assignedSubjects: [],
      assignedCourses: [],
    }));

    return {
      data: normalized,
      total: normalized.length,
      page,
      limit,
      totalPages: normalized.length < limit ? page : page + 1,
    };
  },

  /**
   * Get faculty by ID
   */
  getById: async (id: string): Promise<Faculty> => {
    const item = await apiClient.get<{
      id: string | number;
      faculty_id?: string;
      name: string;
      email?: string;
      phone?: string;
      department?: string;
      designation?: string;
    }>(API_ENDPOINTS.FACULTY.BY_ID(id));

    return {
      id: String(item.id),
      userId: String(item.id),
      employeeId: item.faculty_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      qualification: "",
      specialization: "",
      departmentId: item.department || "",
      designation: item.designation || "",
      joiningDate: "",
      status: "active",
      assignedSubjects: [],
      assignedCourses: [],
    };
  },

  /**
   * Create new faculty
   */
  create: async (data: FacultyFormData): Promise<Faculty> => {
    return apiClient.post<Faculty>(API_ENDPOINTS.FACULTY.BASE, data);
  },

  /**
   * Update faculty
   */
  update: async (id: string, data: Partial<FacultyFormData>): Promise<Faculty> => {
    return apiClient.put<Faculty>(API_ENDPOINTS.FACULTY.BY_ID(id), data);
  },

  /**
   * Delete faculty
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.FACULTY.BY_ID(id));
  },

  /**
   * Search faculty
   */
  search: async (query: string): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>(API_ENDPOINTS.FACULTY.SEARCH, { q: query });
  },

  /**
   * Get faculty by department
   */
  getByDepartment: async (departmentId: string): Promise<Faculty[]> => {
    return apiClient.get<Faculty[]>(API_ENDPOINTS.FACULTY.BY_DEPARTMENT(departmentId));
  },

  /**
   * Assign subjects to faculty
   */
  assignSubjects: async (facultyId: string, subjectIds: string[]): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.FACULTY.ASSIGN_SUBJECTS(facultyId), {
      subjectIds,
    });
  },

  /**
   * Assign courses to faculty
   */
  assignCourses: async (facultyId: string, courseIds: string[]): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.FACULTY.ASSIGN_COURSES(facultyId), {
      courseIds,
    });
  },
};

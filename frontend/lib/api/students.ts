import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/config/api";
import type { Student, StudentFormData, PaginatedResponse, ApiResponse, FilterState } from "@/types";

// ============================================
// STUDENTS API SERVICE
// ============================================

export const studentsApi = {
  /**
   * Get all students with pagination and filters
   */
  getAll: async (filters: Partial<FilterState>): Promise<PaginatedResponse<Student>> => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const response = await apiClient.get<
      Array<{
        id: string | number;
        student_id?: string;
        name: string;
        email?: string;
        phone?: string;
        department?: string;
        year?: number;
      }>
    >(API_ENDPOINTS.STUDENTS.BASE, {
      skip,
      limit,
      search: filters.search,
    });

    const normalized: Student[] = response.map((item) => ({
      id: String(item.id),
      userId: String(item.id),
      rollNumber: item.student_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      guardianName: "",
      guardianPhone: "",
      departmentId: item.department || "",
      courseId: "",
      semester: item.year || 1,
      batch: "",
      admissionDate: "",
      status: "active",
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
   * Get student by ID
   */
  getById: async (id: string): Promise<Student> => {
    const item = await apiClient.get<{
      id: string | number;
      student_id?: string;
      name: string;
      email?: string;
      phone?: string;
      department?: string;
      year?: number;
    }>(API_ENDPOINTS.STUDENTS.BY_ID(id));

    return {
      id: String(item.id),
      userId: String(item.id),
      rollNumber: item.student_id || "",
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      address: "",
      dateOfBirth: "",
      gender: "other",
      guardianName: "",
      guardianPhone: "",
      departmentId: item.department || "",
      courseId: "",
      semester: item.year || 1,
      batch: "",
      admissionDate: "",
      status: "active",
    };
  },

  /**
   * Create new student
   */
  create: async (data: StudentFormData): Promise<Student> => {
    const payload = {
      student_id: data.rollNumber,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.departmentId,
      year: data.semester,
    };

    const created = await apiClient.post<{
      id: string | number;
      student_id: string;
      name: string;
      email: string;
      phone: string;
      department: string;
      year: number;
    }>(`${API_ENDPOINTS.STUDENTS.BASE}/`, payload);

    return {
      id: String(created.id),
      userId: String(created.id),
      rollNumber: created.student_id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      departmentId: created.department,
      courseId: data.courseId,
      semester: created.year,
      batch: data.batch,
      admissionDate: "",
      status: "active",
    };
  },

  /**
   * Update student
   */
  update: async (id: string, data: Partial<StudentFormData>): Promise<Student> => {
    return apiClient.put<Student>(API_ENDPOINTS.STUDENTS.BY_ID(id), data);
  },

  /**
   * Delete student
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.STUDENTS.BY_ID(id));
  },

  /**
   * Search students
   */
  search: async (query: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.SEARCH, { q: query });
  },

  /**
   * Get students by course
   */
  getByCourse: async (courseId: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_COURSE(courseId));
  },

  /**
   * Get students by department
   */
  getByDepartment: async (departmentId: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_DEPARTMENT(departmentId));
  },
};

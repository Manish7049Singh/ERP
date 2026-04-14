import { authApi } from "./auth";
import { apiClient } from "./client";

interface StudentRecord {
  id: number;
  student_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
}

export async function getCurrentStudentRecord(): Promise<StudentRecord | null> {
  const user = await authApi.getCurrentUser();
  const students = await apiClient.get<StudentRecord[]>("/students", {
    skip: 0,
    limit: 1,
    email: user.email,
  });
  return students[0] || null;
}

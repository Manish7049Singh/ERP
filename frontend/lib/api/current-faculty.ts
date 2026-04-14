import { authApi } from "./auth";
import { apiClient } from "./client";

interface FacultyRecord {
  id: number;
  faculty_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export async function getCurrentFacultyRecord(): Promise<FacultyRecord | null> {
  const user = await authApi.getCurrentUser();
  const records = await apiClient.get<FacultyRecord[]>("/faculty", {
    skip: 0,
    limit: 1,
    email: user.email,
  });
  return records[0] || null;
}

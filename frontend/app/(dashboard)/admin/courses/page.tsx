"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminCoursesPage() {
  return (
    <ApiListPage
      title="Courses"
      description="Manage all courses across departments"
      fetchData={() => apiClient.get("/courses", { skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "course_code", label: "Course Code" },
          { key: "name", label: "Name" },
          { key: "department", label: "Department" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "credits", label: "Credits", type: "number" },
        ],
        onCreate: (payload) => apiClient.post("/courses/create", payload),
      }}
    />
  );
}

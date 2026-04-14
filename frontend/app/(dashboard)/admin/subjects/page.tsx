"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminSubjectsPage() {
  return (
    <ApiListPage
      title="Subjects"
      description="Manage all subjects across courses"
      fetchData={() => apiClient.get("/subjects", { skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          { key: "semester", label: "Semester", type: "number" },
          { key: "department_id", label: "Department ID", type: "number" },
        ],
        onCreate: (payload) => apiClient.post("/subjects/create", payload),
      }}
    />
  );
}

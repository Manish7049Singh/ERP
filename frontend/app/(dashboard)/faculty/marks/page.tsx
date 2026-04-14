"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function FacultyMarksPage() {
  return (
    <ApiListPage
      title="Faculty Marks"
      description="View marks records and sync with backend"
      fetchData={() => apiClient.get("/marks", { skip: 0, limit: 50 })}
    />
  );
}

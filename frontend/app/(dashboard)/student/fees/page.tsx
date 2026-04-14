"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";
import { getCurrentStudentRecord } from "@/lib/api/current-student";

export default function StudentFeesPage() {
  return (
    <ApiListPage
      title="My Fees"
      description="View fee records synced from backend"
      fetchData={async () => {
        const student = await getCurrentStudentRecord();
        if (!student) return [];
        return apiClient.get("/fees", {
          skip: 0,
          limit: 50,
          student_id: student.id,
        });
      }}
    />
  );
}

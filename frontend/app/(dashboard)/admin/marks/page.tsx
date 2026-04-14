"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminMarksPage() {
  return (
    <ApiListPage
      title="Marks"
      description="View and manage student marks"
      fetchData={() => apiClient.get("/marks", { skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "exam_type", label: "Exam Type" },
          { key: "marks_obtained", label: "Marks Obtained", type: "number" },
        ],
        onCreate: (payload) => apiClient.post("/marks/add", payload),
      }}
    />
  );
}

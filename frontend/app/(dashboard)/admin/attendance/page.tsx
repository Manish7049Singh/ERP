"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminAttendancePage() {
  return (
    <ApiListPage
      title="Attendance"
      description="View and manage attendance records"
      fetchData={() => apiClient.get("/attendance", { skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "course_id", label: "Course ID", type: "number" },
          { key: "date", label: "Date", type: "date" },
          { key: "status", label: "Status" },
        ],
        onCreate: (payload) => apiClient.post("/attendance/mark", payload),
      }}
    />
  );
}

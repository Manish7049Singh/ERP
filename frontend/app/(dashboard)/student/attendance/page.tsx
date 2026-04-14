"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";
import { getCurrentStudentRecord } from "@/lib/api/current-student";

export default function StudentAttendancePage() {
  return (
    <ApiListPage
      title="My Attendance"
      description="View your attendance records"
      fetchData={async () => {
        const student = await getCurrentStudentRecord();
        if (!student) return [];
        return apiClient.get("/attendance", {
          skip: 0,
          limit: 50,
          student_id: student.id,
        });
      }}
    />
  );
}

"use client";

import { ApiListPage } from "@/components/shared";
import { apiClient } from "@/lib/api";

export default function AdminFeesPage() {
  return (
    <ApiListPage
      title="Fees"
      description="Manage fee collection and records"
      fetchData={() => apiClient.get("/fees", { skip: 0, limit: 50 })}
      createConfig={{
        fields: [
          { key: "student_id", label: "Student ID", type: "number" },
          { key: "total_amount", label: "Total Amount", type: "number" },
          { key: "paid_amount", label: "Paid Amount", type: "number" },
          { key: "balance_amount", label: "Balance Amount", type: "number" },
          { key: "status", label: "Status" },
        ],
        onCreate: (payload) => apiClient.post("/fees/create", payload),
      }}
    />
  );
}

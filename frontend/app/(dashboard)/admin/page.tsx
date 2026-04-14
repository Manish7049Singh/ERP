"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentStudents, setRecentStudents] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [recentFaculty, setRecentFaculty] = useState<Array<{ id: number; name: string; email: string }>>([]);

  useEffect(() => {
    void (async () => {
      const [dashboard, students, faculty] = await Promise.all([
        apiClient.get<Record<string, number>>("/dashboard/stats"),
        apiClient.get<Array<{ id: number; name: string; email: string }>>("/students", { skip: 0, limit: 5 }),
        apiClient.get<Array<{ id: number; name: string; email: string }>>("/faculty", { skip: 0, limit: 5 }),
      ]);
      setStats(dashboard);
      setRecentStudents(students);
      setRecentFaculty(faculty);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Live overview from database." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{key.replaceAll("_", " ")}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentStudents.map((student) => (
              <div key={student.id} className="rounded border p-2 text-sm">
                <p className="font-medium">{student.name}</p>
                <p className="text-muted-foreground">{student.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Faculty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentFaculty.map((member) => (
              <div key={member.id} className="rounded border p-2 text-sm">
                <p className="font-medium">{member.name}</p>
                <p className="text-muted-foreground">{member.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

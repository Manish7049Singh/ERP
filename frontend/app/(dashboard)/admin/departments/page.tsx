"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { departmentsApi } from "@/lib/api";
import type { Department } from "@/types";
import { Building2, Plus, RefreshCw } from "lucide-react";

// ============================================
// ADMIN DEPARTMENTS PAGE
// ============================================

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDepartments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await departmentsApi.getAll();
      const normalized = Array.isArray(response)
        ? response
        : Array.isArray((response as { data?: Department[] }).data)
          ? (response as { data: Department[] }).data
          : [];
      setDepartments(normalized);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch departments from backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  const activeCount = departments.filter((dept) => dept.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage all departments in the college"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void loadDepartments()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>
      </PageHeader>

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading departments...</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments found"
          description="No records came from backend. Create departments from backend or add create API UI next."
          action={{
            label: "Reload",
            onClick: () => void loadDepartments(),
          }}
        />
      ) : null}

      {!isLoading && departments.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-xs text-muted-foreground">Total Departments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Active Departments</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Head of Department</TableHead>
                    <TableHead>Established</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.code}</TableCell>
                      <TableCell>{department.headOfDepartment || "-"}</TableCell>
                      <TableCell>{department.establishedYear || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={department.status === "active" ? "default" : "secondary"}>
                          {department.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

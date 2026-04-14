"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentsApi } from "@/lib/api";
import type { Student } from "@/types";
import { RefreshCw, Search, Users } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async (searchTerm?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studentsApi.getAll({
        page: 1,
        limit: 50,
        search: searchTerm || "",
      });
      setStudents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStudents();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage all students in your institution">
        <Button variant="outline" size="sm" onClick={() => void loadStudents(search)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search students by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => void loadStudents(search)}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <p className="text-sm text-muted-foreground">Loading students...</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="No student records were returned by backend."
          action={{ label: "Reload", onClick: () => void loadStudents(search) }}
        />
      ) : null}

      {!isLoading && students.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Fetched Students</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber || "-"}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email || "-"}</TableCell>
                      <TableCell>{student.phone || "-"}</TableCell>
                      <TableCell>{student.departmentId || "-"}</TableCell>
                      <TableCell>{student.semester || "-"}</TableCell>
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

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
import { facultyApi } from "@/lib/api";
import type { Faculty } from "@/types";
import { RefreshCw, Search, Users } from "lucide-react";

// ============================================
// ADMIN FACULTY LIST PAGE
// ============================================

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFaculty = async (searchTerm?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await facultyApi.getAll({
        page: 1,
        limit: 50,
        search: searchTerm || "",
      });
      setFaculty(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load faculty.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFaculty();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty"
        description="Manage all faculty members in the system"
      >
        <Button variant="outline" size="sm" onClick={() => void loadFaculty(search)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search faculty by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => void loadFaculty(search)}>
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
            <p className="text-sm text-muted-foreground">Loading faculty...</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && faculty.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No faculty found"
          description="No faculty records were returned by backend."
          action={{ label: "Reload", onClick: () => void loadFaculty(search) }}
        />
      ) : null}

      {!isLoading && faculty.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{faculty.length}</p>
                <p className="text-xs text-muted-foreground">Fetched Faculty</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Faculty List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.employeeId || "-"}</TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email || "-"}</TableCell>
                      <TableCell>{member.phone || "-"}</TableCell>
                      <TableCell>{member.departmentId || "-"}</TableCell>
                      <TableCell>{member.designation || "-"}</TableCell>
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

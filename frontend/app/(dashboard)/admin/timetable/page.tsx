"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface TimetableRow {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  subject_id: number;
  faculty_id: number;
}

interface SubjectRow {
  id: number;
  name: string;
}

interface FacultyRow {
  id: number;
  name: string;
}

export default function AdminTimetablePage() {
  const [items, setItems] = useState<TimetableRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    day: "",
    start_time: "",
    end_time: "",
    room: "",
    subject_id: "",
    faculty_id: "",
  });

  const subjectById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects]
  );
  const facultyById = useMemo(
    () => Object.fromEntries(faculty.map((f) => [f.id, f.name])),
    [faculty]
  );

  const load = async () => {
    setLoading(true);
    try {
      const [tt, subj, fac] = await Promise.all([
        apiClient.get<TimetableRow[]>("/timetable", { skip: 0, limit: 200 }),
        apiClient.get<SubjectRow[]>("/subjects", { skip: 0, limit: 200 }),
        apiClient.get<FacultyRow[]>("/faculty", { skip: 0, limit: 200 }),
      ]);
      setItems(tt);
      setSubjects(subj);
      setFaculty(fac);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load timetable data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async () => {
    if (!form.day || !form.start_time || !form.end_time || !form.room || !form.subject_id || !form.faculty_id) {
      toast.error("Fill all timetable fields.");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/timetable/create", {
        day: form.day,
        start_time: form.start_time,
        end_time: form.end_time,
        room: form.room,
        subject_id: Number(form.subject_id),
        faculty_id: Number(form.faculty_id),
      });
      toast.success("Timetable entry created.");
      setForm({
        day: "",
        start_time: "",
        end_time: "",
        room: "",
        subject_id: "",
        faculty_id: "",
      });
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create timetable");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Manage live timetable entries from database." />
      <Card>
        <CardHeader>
          <CardTitle>Create Timetable Entry</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <Label>Day</Label>
            <Input value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Start Time</Label>
            <Input value={form.start_time} onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>End Time</Label>
            <Input value={form.end_time} onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Room</Label>
            <Input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Subject</Label>
            <Select value={form.subject_id} onValueChange={(v) => setForm((p) => ({ ...p, subject_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Faculty</Label>
            <Select value={form.faculty_id} onValueChange={(v) => setForm((p) => ({ ...p, faculty_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
              <SelectContent>
                {faculty.map((f) => <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button disabled={saving} onClick={onCreate}>{saving ? "Saving..." : "Create Entry"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timetable Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timetable entries found.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="rounded border p-2 text-sm">
                  <p className="font-medium">{item.day} {item.start_time} - {item.end_time} ({item.room})</p>
                  <p className="text-muted-foreground">
                    Subject: {subjectById[item.subject_id] || `#${item.subject_id}`} | Faculty: {facultyById[item.faculty_id] || `#${item.faculty_id}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

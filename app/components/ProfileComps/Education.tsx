"use client";

import formatDate from "@/lib/utils/format";
import { EducationLevel } from "@/src/generated/prisma/enums";
import {
  GraduationCap,
  Pencil,
  Plus,
  School,
  BookOpen,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

export default function Education() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);


  const [education, setEducation] = useState<
    {
      id: number;
      institute: string;
      level: string;
      course: string;
      doEntry: string;
      doExit: string | null;
    }[]
  >([]);

  //Get education
  useEffect(() => {
    fetch("/api/workerEducation")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setEducation(d))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    institute: "",
    level: "",
    course: "",
    doEntry: "",
    doExit: "",
  });

  function handleAdd() {
    setError("");
    setEditingId("new");
    setOpen(true);
    setForm({
      institute: "",
      level: "",
      course: "",
      doEntry: "",
      doExit: "",
    });
  }

  const levels = EducationLevel;

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent, id: number | "new") {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isNew = id === "new";
      const res = await fetch(
        isNew ? "/api/workerEducation" : `/api/workerEducation/${id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            institute: form.institute,
            level: form.level,
            course: form.course,
            doEntry: form.doEntry,
            doExit: form.doExit,
          }),
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again!");
        return;
      }

      setEditingId(null);
      setEducation((prev) =>
        isNew
          ? [...prev, data]
          : prev.map((item) => (item.id === id ? data : item)),
      );
    } catch {
      setError("Couldn't reach server. Check your connection!");
    } finally {
      setLoading(false);
    }
  }

  function handleClick(ed: (typeof education)[number]) {
    setEditingId(ed.id);
    setForm({
      institute: ed.institute,
      course: ed.course,
      level: ed.level,
      doEntry: ed.doEntry.slice(0, 10),
      doExit: ed.doExit?.slice(0, 10) ?? "",
    });
  }

  async function handleDelete(id: number) {
    setError("");
    setDeletingId(id);

    try {
      const res = await fetch(`/api/workerEducation/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to delete language.");
        return;
      }

      setEducation((prev) => prev.filter((ed) => ed.id !== id));
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-6 md:mt-10 md:p-4">
      <div className="flex items-center justify-between gap-3">
        <ProfileSectionHeading
          title="Education"
          description="Add your academic background and qualifications."
          icon={GraduationCap}
          open={open}
          onToggle={() => setOpen(!open)}
        />

        {editingId === null && (
          <button
            onClick={handleAdd}
            className="outlineBtn inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      <div
        className={`gridWrap ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          {editingId !== null ? (
            <form
              onSubmit={(e) => handleSubmit(e, editingId)}
              className="mt-4 flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1 text-sm text-foreground/70">
                <span className="flex items-center gap-2">
                  <School size={15} />
                  School / Institution
                </span>
                <input
                  className="input"
                  type="text"
                  name="institute"
                  placeholder="School / Institution"
                  value={form.institute}
                  onChange={update}
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <GraduationCap size={15} />
                    Level
                  </span>
                  <select
                    className="input"
                    name="level"
                    id=""
                    value={form.level}
                    onChange={update}
                    required
                  >
                    <option value="" disabled>
                      Level
                    </option>
                    {Object.values(levels).map((value) => (
                      <option key={value} value={value}>
                        {value.replaceAll("_", "/")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <BookOpen size={15} />
                    Course / Field of study
                  </span>
                  <input
                    className="input"
                    type="text"
                    name="course"
                    placeholder="Course / Field of study"
                    value={form.course}
                    onChange={update}
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    Start date
                  </span>
                  <input
                    className="input"
                    type="date"
                    name="doEntry"
                    value={form.doEntry}
                    onChange={update}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    End date (Leave empty if current)
                  </span>
                  <input
                    className="input"
                    type="date"
                    name="doExit"
                    value={form.doExit}
                    onChange={update}
                  />
                </label>
              </div>

              <p className="text-accent">{error ? error : ""}</p>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="formBtn inline-flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? "Saving" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setError("");
                  }}
                  className="cancelBtn inline-flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              {education.length === 0 && (
                <p className="mt-3 text-foreground/70">
                  You have not added any education
                </p>
              )}
              <ul className="mt-4 space-y-8">
                {education.map((ed) => (
                  <li key={ed.id} className="border-l-2 border-primary/40 pl-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 wrap-break-word text-lg font-semibold">
                        {ed.course}
                      </h3>
                      <div className="flex gap-1">
                      <button onClick={() => handleClick(ed)} type="button">
                        <Pencil className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ed.id)}
                        disabled={deletingId !== null}
                      >
                        <Trash2 className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                    </div>
                    </div>
                    <p className="flex items-center gap-2 wrap-break-word text-foreground/70">
                      <School size={14} className="shrink-0" />
                      {ed.institute} -- {ed.level.replaceAll("_", "/")}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-foreground/60">
                      <CalendarDays size={14} className="shrink-0" />
                      {formatDate(new Date(ed.doEntry))} -{" "}
                      {ed.doExit ? formatDate(new Date(ed.doExit)) : "Present"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

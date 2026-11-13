"use client";

import formatDate from "@/lib/utils/format";
import { EducationLevel } from "@/src/generated/prisma/enums";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

{
  /* id        Int
    userId    Int
    user      Users
    institute String
    level     EducationLevel
    course    String
    doEntry   DateTime
    doExit    DateTime? */
}

export default function Education() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      .then(setEducation)
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

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-6 md:p-4 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex-1 font-logo text-xl font-bold text-primary">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex justify-between items-center gap-3 text-left"
          >
            Education
            <ChevronDown
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""} `}
            />
          </button>
        </h2>
        {editingId === null && (
          <button onClick={handleAdd} className="outlineBtn">
            + Add
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
              className="flex flex-col gap-4 mt-4"
            >
              <input
                className="input"
                type="text"
                name="institute"
                placeholder="School / Institution"
                value={form.institute}
                onChange={update}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
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

                <input
                  className="input"
                  type="text"
                  name="course"
                  placeholder="Course / Field of study"
                  value={form.course}
                  onChange={update}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className=" flex flex-col gap-1 text-sm text-foreground/70">
                  Start date
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
                  End date (Leave empty if current)
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
                <button type="submit" className="formBtn" disabled={loading}>
                  {loading ? "Saving" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setError("");
                  }}
                  className="rounded-lg border border-primary/40 text-primary px-4 py-2 transition-colors hover:bg-background"
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
                      <button
                        onClick={() => handleClick(ed)}
                        type="button"
                        className="outlineBtn"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="wrap-break-word text-foreground/70">
                      {ed.institute} -- {ed.level.replaceAll("_", "/")}
                    </p>
                    <p className="text-sm text-foreground/60">
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

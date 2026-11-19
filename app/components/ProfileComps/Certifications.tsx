"use client";

import formatDate from "@/lib/utils/format";
import { Award, CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

export default function Certifications() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState<
    {
      id: number;
      name: string;
      issueDate: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCerts(d))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "",
    issueDate: "",
  });

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const isNew = editingId === "new";

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleClick(c: (typeof certs)[number]) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      issueDate: c.issueDate.slice(0, 10),
    });
  }

  function handleAdd() {
    setError("");
    setEditingId("new");
    setOpen(true);
    setForm({
      name: "",
      issueDate: "",
    });
  }

  async function handleSubmit(e: React.SubmitEvent, id: number | "new") {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        isNew ? "/api/certifications" : `/api/certifications/${id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            issueDate: form.issueDate,
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong");
        return;
      }
      setEditingId(null);
      setCerts((prev) =>
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

  async function handleDelete(id: number) {
    setError("");
    setDeletingId(id);

    try {
      const res = await fetch(`/api/certifications/${id}`, {
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

      setCerts((prev) => prev.filter((cert) => cert.id !== id));
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <ProfileSectionHeading
          title="Certifications"
          description="Highlight your professional certifications and credentials."
          icon={Award}
          open={open}
          onToggle={() => setOpen(!open)}
        />
        {editingId === null && (
          <button
            onClick={handleAdd}
            type="button"
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <Award size={15} />
                    Name
                  </span>
                  <input
                    className="input"
                    type="text"
                    name="name"
                    placeholder="e.g. Diploma in Project Management"
                    value={form.name}
                    onChange={update}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={15} />
                    Issued date
                  </span>
                  <input
                    className="input"
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={update}
                    required
                  />
                </label>
              </div>

              {error && <p className="text-accent">{error}</p>}

              <div className="flex gap-3">
                <button
                  disabled={loading}
                  className="formBtn inline-flex items-center justify-center gap-2"
                  type="submit"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setError("");
                  }}
                  className="cancelBtn"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : certs.length === 0 ? (
            <p className="mt-3 text-foreground/70">
              You have not added any certifications
            </p>
          ) : (
            <ul className="mt-4 space-y-6">
              {certs.map((cert) => (
                <li key={cert.id} className="border-l-2 border-primary/40 pl-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="flex items-start gap-2 wrap-break-word font-semibold text-foreground">
                        <Award
                          size={16}
                          className="mt-1 shrink-0 text-accent"
                        />
                        {cert.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-foreground/60">
                        <CalendarDays size={14} className="shrink-0" />
                        Issued {formatDate(new Date(cert.issueDate))}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleClick(cert)} type="button">
                        <Pencil className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId !== null}
                      >
                        <Trash2 className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

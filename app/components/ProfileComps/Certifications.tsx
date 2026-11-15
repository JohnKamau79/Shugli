"use client";

import formatDate from "@/lib/utils/format";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Certifications() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
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

  return (
  <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 md:mt-10">
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex-1 font-logo text-xl font-bold text-primary">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          Certifications
          <ChevronDown
            className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      {editingId === null && (
        <button onClick={handleAdd} type="button" className="outlineBtn">
          + Add
        </button>
      )}
    </div>

    <div className={`gridWrap ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
      <div className="overflow-hidden" inert={!open}>
        {editingId !== null ? (
          <form
            onSubmit={(e) => handleSubmit(e, editingId)}
            className="mt-4 flex flex-col gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-foreground/70">
                Name
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
                Issued date
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
              <button disabled={loading} className="formBtn" type="submit">
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
              <li
                key={cert.id}
                className="border-l-2 border-primary/40 pl-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-foreground">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Issued {formatDate(new Date(cert.issueDate))}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClick(cert)}
                    type="button"
                    className="outlineBtn shrink-0"
                  >
                    Edit
                  </button>
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

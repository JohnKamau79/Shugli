"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProfessionalSummary() {
  const [editing, setEditing] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [open, setOpen] = useState(false);

  const [workerProfile, setWorkerProfile] = useState<{
    id: number;
    headline: string;
    bio: string;
    yoe: number;
    categoryId: number;
    category: { name: string };
  } | null>(null);

  useEffect(() => {
    fetch("/api/workerProfile")
      .then((r) => r.json())
      .then(setWorkerProfile)
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    yoe: "",
    categoryId: "",
  });

  function handleClick() {
    setOpen(true)
    setEditing(true);
    setForm({
      headline: workerProfile?.headline ?? "",
      bio: workerProfile?.bio ?? "",
      yoe: String(workerProfile?.yoe ?? ""),
      categoryId: String(workerProfile?.categoryId ?? ""),
    });
  }

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    fetch("/api/category")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [editing]);

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/workerProfile", {
        method: workerProfile ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: form.headline,
          bio: form.bio,
          yoe: form.yoe,
          categoryId: form.categoryId,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again!");
        return;
      }
      setEditing(false);
      setWorkerProfile(data);
      // router.refresh();
    } catch {
      setError("Could not reach server! Check your connection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex-1 font-logo text-xl font-bold text-primary">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex justify-between items-center gap-3 text-left"
          >
            Professional summary
            <ChevronDown
              className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </h2>
        {!editing && (
          <button
            onClick={handleClick}
            className="rounded-lg border border-primary px-3 text-sm text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {workerProfile ? "Edit" : "Add"}
          </button>
        )}
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          {editing ? (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <input
                className="input"
                type="text"
                name="headline"
                placeholder="Headline(e.g. Experienced carpenter)"
                value={form.headline}
                onChange={update}
                required
              />
              <textarea
                className="input min-h-28"
                name="bio"
                placeholder="Tell employers about yourself (max-400 chars)"
                onChange={update}
                value={form.bio}
                required
                maxLength={400}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  type="number"
                  name="yoe"
                  min={0}
                  placeholder="Years of experience"
                  value={form.yoe}
                  onChange={update}
                  required
                />
                <select
                  className="input"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={update}
                  required
                >
                  <option value="" disabled>
                    Category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-accent">{error}</p>}

              <div className="flex gap-3">
                <button className="formBtn" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                  }}
                  className="rounded-lg border border-primary text-primary px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : !workerProfile ? (
            <p className="mt-3 space-y-3">
              You haven&apos;t added a professional summary yet!
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-lg font-semibold">{workerProfile.headline}</p>
              <div className="flex flex-wrap gap-2">
                <span className=" rounded-2xl bg-primary text-primary-foreground px-3 text-sm">
                  {workerProfile.category.name}
                </span>
                <span className="rounded-2xl border border-primary/40 bg-background px-3 text-sm text-primary">
                  {workerProfile.yoe}{" "}
                  {workerProfile.yoe === 1 ? "year" : "years"} experience
                </span>
              </div>
              <p className="whitespace-pre-line text-foreground/80">
                {workerProfile.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

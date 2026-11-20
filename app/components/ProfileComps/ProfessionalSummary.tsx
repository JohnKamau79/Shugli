"use client";

import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  UserRound,
  FileText,
  CalendarDays,
  Briefcase,
  Folder,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

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
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setWorkerProfile(d))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    yoe: "",
    categoryId: "",
  });

  function handleClick() {
    setOpen(true);
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
      .then((d) => Array.isArray(d) && setCategories(d))
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
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <ProfileSectionHeading
          title="Professional Summary"
          description="Introduce yourself and highlight your professional background."
          icon={BriefcaseBusiness}
          open={open}
          onToggle={() => setOpen(!open)}
        />

        {!editing && (
          <button
            onClick={handleClick}
            className="outlineBtn inline-flex shrink-0 items-center justify-center gap-2"
          >
            {workerProfile ? (
              <>
                <Pencil size={14} />
                Edit
              </>
            ) : (
              <>
                <Plus size={16} />
                Add
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          {editing ? (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Briefcase size={15} className="shrink-0 text-accent" />
                  Professional headline
                </label>
                <input
                  className="input w-full"
                  type="text"
                  name="headline"
                  placeholder="e.g. Experienced carpenter"
                  value={form.headline}
                  onChange={update}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-primary">
                  <FileText size={15} className="shrink-0 text-accent" />
                  About you
                </label>
                <textarea
                  className="input min-h-32 w-full resize-y"
                  name="bio"
                  placeholder="Describe your skills, experience and what you bring to the job..."
                  onChange={update}
                  value={form.bio}
                  required
                  maxLength={400}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {form.bio.length}/400 characters
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-primary">
                    <CalendarDays size={15} className="shrink-0 text-accent" />
                    Years of experience
                  </label>
                  <input
                    className="input w-full"
                    type="number"
                    name="yoe"
                    min={0}
                    placeholder="e.g. 5"
                    value={form.yoe}
                    onChange={update}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Folder size={15} className="shrink-0 text-accent" />
                    Professional category
                  </label>
                  <select
                    className="input w-full"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={update}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                <button
                  className="formBtn inline-flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save summary"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-background"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : !workerProfile ? (
            <div className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <BriefcaseBusiness className="mx-auto mb-3 h-9 w-9 text-muted-foreground/50" />

              <p className="font-semibold text-primary">
                No professional summary yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a summary to introduce yourself and highlight your
                professional experience.
              </p>

              <button
                onClick={handleClick}
                className="outlineBtn mt-4 inline-flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add summary
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-lg font-bold leading-snug text-primary sm:text-xl">
                  {workerProfile.headline}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    <Folder size={13} />
                    {workerProfile.category.name}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium text-primary">
                    <CalendarDays size={13} />
                    {workerProfile.yoe}{" "}
                    {workerProfile.yoe === 1 ? "year" : "years"} experience
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <UserRound size={15} className="shrink-0 text-accent" />
                  About
                </p>
                <p className="whitespace-pre-line text-sm leading-7 text-foreground/80">
                  {workerProfile.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

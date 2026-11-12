"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Profile = {
  headline: string;
  bio: string;
  yoe: number;
  categoryId: number;
  category: { name: string };
} | null;

export default function ProfessionalSummary({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [profile, setProfile] = useState()

  const [form, setForm] = useState({
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    yoe: String(profile?.yoe ?? ""),
    categoryId: String(profile?.categoryId ?? ""),
  });

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
        method: profile ? "PATCH" : "POST",
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
      router.refresh();
    } catch {
      setError("Could not reach server! Check your connection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-logo text-xl font-bold text-primary">
          Professional summary
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-primary px-3 text-sm text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            Add/Edit
          </button>
        )}
      </div>
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
            placeholder="Tell employers about yourself"
            onChange={update}
            value={form.bio}
            required
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
            <button type="button" onClick={() => {setEditing(false); setError("")}} className="rounded-lg border border-primary text-primary px-4 py-2">Cancel</button>
          </div>
        </form>
      ) : !profile ? (
            <p className="mt-3 space-y-3">You haven&apos;t added a professional summary yet!</p>
      ) : (
        <div className="mt-3 space-y-3">
            <p className="text-lg font-semibold">profile.headline</p>
            <div className="flex flex-wrap gap-2">
                <span className=" rounded-2xl bg-primary text-primary-foreground px-3 text-sm">profile.category.name</span>
                <span className="rounded-2xl border border-primary/40 bg-background px-3 text-sm text-primary">profile.yoe experience</span>
            </div>
            <p className="whitespace-pre-line text-foreground/80">profile.bio</p>
        </div>
      )}
    </section>
  );
}

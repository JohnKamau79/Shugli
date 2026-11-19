"use client";

import { LanguageLevel } from "@/src/generated/prisma/enums";
import {
  Plus,
  Trash2,
  Languages as LanguagesIcon,
  X,
  Globe,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

type Language = {
  id: number;
  name: string;
};

type UserLanguage = {
  id: number;
  langId: number;
  level: string;
  language: { name: string };
};

export default function Languages() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [languages, setLanguages] = useState<Language[]>([]);
  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([]);

  const [form, setForm] = useState({
    langId: "",
    level: "",
  });

  useEffect(() => {
    fetch("/api/userLanguages")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setUserLanguages(d))
      .catch(() => {});

    fetch("/api/languages")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setLanguages(d))
      .catch(() => {});
  }, []);

  function handleAdd() {
    setError("");
    setForm({ langId: "", level: "" });
    setEditing(true);
    setOpen(true);
  }

  function handleCancel() {
    setEditing(false);
    setError("");
    setForm({ langId: "", level: "" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.langId || !form.level) {
      setError("Please select a language and proficiency level.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/userLanguages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          langId: form.langId,
          level: form.level,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }

      setUserLanguages((prev) => [...prev, data]);
      setEditing(false);
      setForm({ langId: "", level: "" });
    } catch {
      setError("Server not reachable. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setDeletingId(id);

    try {
      const res = await fetch("/api/userLanguages", {
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

      setUserLanguages((prev) => prev.filter((lang) => lang.id !== id));
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:mt-10 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <ProfileSectionHeading
          title="Languages"
          description="List the languages you speak and your proficiency levels."
          icon={LanguagesIcon}
          open={open}
          onToggle={() => setOpen(!open)}
        />

        {!editing && (
          <button
            type="button"
            onClick={handleAdd}
            className="outlineBtn inline-flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={`gridWrap ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pt-5">
            {/* Add Form */}
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Globe size={15} className="shrink-0 text-accent" />
                      Language
                    </label>

                    <select
                      className="input w-full"
                      value={form.langId}
                      name="langId"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          langId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Select language
                      </option>

                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Award size={15} className="shrink-0 text-accent" />
                      Proficiency
                    </label>

                    <select
                      className="input w-full"
                      value={form.level}
                      name="level"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          level: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Select proficiency
                      </option>

                      {Object.values(LanguageLevel).map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500"
                  >
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="formBtn inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save language"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="cancelBtn inline-flex items-center justify-center gap-1"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {error && (
                  <p
                    role="alert"
                    className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500"
                  >
                    {error}
                  </p>
                )}

                {/* Language List */}
                {userLanguages.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {userLanguages.map((lang) => (
                      <li
                        key={lang.id}
                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-medium text-primary">
                            <Globe size={15} className="shrink-0 text-accent" />
                            {lang.language.name}
                          </p>

                          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                            <Award size={12} />
                            {lang.level}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(lang.id)}
                          disabled={deletingId !== null}
                        >
                          <Trash2 className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-border py-8 text-center">
                    <LanguagesIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />

                    <p className="font-medium text-primary">
                      No languages added yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add languages to showcase your proficiency.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

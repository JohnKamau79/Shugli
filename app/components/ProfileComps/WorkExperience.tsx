"use client";

import formatDate from "@/lib/utils/format";
import { clean } from "@/lib/utils/trim";
import {
  BriefcaseBusiness,
  Pencil,
  Plus,
  Building2,
  CalendarDays,
  MapPin,
  Wrench,
  Trophy,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

export default function WorkExperience() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [workExperience, setWorkExperience] = useState<
    {
      id: number;
      jobTitle: string;
      company: string;
      doEntry: string;
      doExit: string | null;
      cityId: number;
      city: { name: string };
      skills: string[];
      achievements: string[];
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/workExperience")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setWorkExperience(d))
      .catch(() => {});
  }, []);

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCities(d))
      .catch(() => {});
  }, []);

  const [skillInput, setSkillInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  function addSkill() {
    const skill = clean(skillInput);
    if (!skill) return;
    setForm({ ...form, skills: [...form.skills, skill] });
    setSkillInput("");
  }

  function removeSkill(index: number) {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index),
    });
  }

  function addAchievement() {
    const achievement = clean(achievementInput);
    if (!achievement) return;
    setForm({ ...form, achievements: [...form.achievements, achievement] });
    setAchievementInput("");
  }

  function removeAchievement(index: number) {
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index),
    });
  }

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    doEntry: "",
    doExit: "",
    cityId: "",
    skills: [] as string[],
    achievements: [] as string[],
  });

  function handleClick(experience: (typeof workExperience)[number]) {
    setEditingId(experience.id);
    setForm({
      jobTitle: experience.jobTitle,
      company: experience.company,
      doEntry: experience.doEntry.slice(0, 10),
      doExit: experience.doExit?.slice(0, 10) ?? "",
      cityId: String(experience.cityId),
      skills: experience.skills,
      achievements: experience.achievements,
    });
  }

  function handleAddExperience() {
    setOpen(true);
    setEditingId("new");
    setForm({
      jobTitle: "",
      company: "",
      doEntry: "",
      doExit: "",
      cityId: "",
      skills: [],
      achievements: [],
    });
    setSkillInput("");
    setAchievementInput("");
  }

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
        isNew ? "/api/workExperience" : `/api/workExperience/${id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: form.jobTitle,
            company: form.company,
            doEntry: form.doEntry,
            doExit: form.doExit,
            cityId: form.cityId,
            skills: form.skills,
            achievements: form.achievements,
          }),
        },
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again!");
        return;
      }
      setEditingId(null);
      setWorkExperience((prev) =>
        isNew
          ? [...prev, data]
          : prev.map((item) => (item.id === id ? data : item)),
      );
    } catch {
      setError("Could not reach server. Check your connection!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setDeletingId(id);

    try {
      const res = await fetch(`/api/workExperience/${id}`, {
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

      setWorkExperience((prev) =>
        prev.filter((experience) => experience.id !== id),
      );
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:mt-10 sm:p-6 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <ProfileSectionHeading
          title="Work Experience"
          description="Showcase your previous roles, responsibilities and achievements."
          icon={BriefcaseBusiness}
          open={open}
          onToggle={() => setOpen(!open)}
        />
        {editingId === null && (
          <button
            type="button"
            onClick={handleAddExperience}
            className="outlineBtn inline-flex shrink-0 items-center justify-center gap-2"
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
              className="mt-5 space-y-5"
            >
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                  <BriefcaseBusiness
                    size={16}
                    className="shrink-0 text-accent"
                  />
                  Employment details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                      <BriefcaseBusiness
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      Job title
                    </label>
                    <input
                      className="input w-full"
                      type="text"
                      name="jobTitle"
                      placeholder="e.g. Software Developer"
                      value={form.jobTitle}
                      onChange={update}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                      <Building2 size={14} className="shrink-0 text-accent" />
                      Company
                    </label>
                    <input
                      className="input w-full"
                      type="text"
                      name="company"
                      placeholder="Company name"
                      value={form.company}
                      onChange={update}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      Start date
                    </label>
                    <input
                      className="input w-full"
                      type="date"
                      name="doEntry"
                      value={form.doEntry}
                      onChange={update}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      End date
                    </label>
                    <input
                      className="input w-full"
                      type="date"
                      name="doExit"
                      value={form.doExit}
                      onChange={update}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty if this is your current job.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                    <MapPin size={14} className="shrink-0 text-accent" />
                    City
                  </label>
                  <select
                    className="input w-full"
                    name="cityId"
                    value={form.cityId}
                    onChange={update}
                    required
                  >
                    <option value="" disabled>
                      Select city
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2 border-t border-border pt-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <Wrench size={15} className="shrink-0 text-accent" />
                    Skills
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add skills relevant to this position.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    className="input min-w-0 w-full"
                    type="text"
                    placeholder="e.g. CAD, TypeScript"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="outlineBtn inline-flex shrink-0 items-center justify-center gap-1.5"
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>

                {form.skills.length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {form.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-background py-1 pl-3 pr-1 text-xs font-medium text-foreground/70"
                      >
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(index)}
                          className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-primary hover:text-foreground/70-foreground"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Achievements */}
              <div className="space-y-2 border-t border-border pt-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                    <Trophy size={15} className="shrink-0 text-accent" />
                    Achievements
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Highlight your contributions and accomplishments.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    className="input min-w-0 w-full"
                    type="text"
                    placeholder="Add an achievement"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAchievement();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="outlineBtn inline-flex shrink-0 items-center justify-center gap-1.5"
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>

                {form.achievements.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {form.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                      >
                        <span className="min-w-0 wrap-break-word text-foreground/80">
                          {achievement}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="shrink-0 text-xs font-medium text-primary transition-colors hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && (
                <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="formBtn inline-flex items-center justify-center gap-2"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-primary transition-colors hover:bg-background"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : loading ? (
            <p className="mt-3 text-foreground/70">Loading...</p>
          ) : error ? (
            <p className="mt-3 text-accent">{error}</p>
          ) : workExperience.length === 0 ? (
            <p className="mt-3 text-foreground/70">
              You have not added any work experience
            </p>
          ) : (
            <ul className="mt-4 space-y-8">
              {workExperience.map((experience) => (
                <li
                  key={experience.id}
                  className="border-l-2 border-primary/40 pl-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 wrap-break-word text-lg font-semibold">
                      {experience.jobTitle}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleClick(experience)}
                        type="button"
                      >
                        <Pencil className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(experience.id)}
                        disabled={deletingId !== null}
                      >
                        <Trash2 className="border border-foreground/10 rounded-md p-1 transition-colors duration-300 hover:text-accent hover:bg-accent/10 hover:border-accent/50" />
                      </button>
                    </div>
                  </div>

                  <p className="flex flex-wrap items-center gap-1.5 wrap-break-word font-semibold text-foreground/70">
                    <Building2 size={14} className="shrink-0 text-accent" />
                    {experience.company}
                    <span>·</span>
                    <MapPin size={14} className="shrink-0 text-accent" />
                    {experience.city.name}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-foreground/60">
                    <CalendarDays size={14} className="shrink-0" />
                    {formatDate(new Date(experience.doEntry))} –{" "}
                    {experience.doExit
                      ? formatDate(new Date(experience.doExit))
                      : "Present"}
                  </p>
                  {experience.skills.length > 0 && (
                    <p className="mt-3 flex flex-wrap items-start gap-1.5 text-foreground/80">
                      <Wrench size={15} className="mt-1 shrink-0 text-accent" />
                      <span className="font-semibold text-foreground/80">
                        Skills:
                      </span>{" "}
                      {experience.skills.join(", ")}
                    </p>
                  )}

                  {experience.achievements.length > 0 && (
                    <>
                      <p className="mt-3 flex items-center gap-2 font-semibold text-foreground/80">
                        <Trophy size={15} className="shrink-0 text-accent" />
                        Achievements
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/80">
                        {experience.achievements.map((achievement, id) => (
                          <li key={id} className="wrap-break-word">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

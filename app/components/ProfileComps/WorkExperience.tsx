"use client";

import formatDate from "@/lib/utils/format";
import { clean } from "@/lib/utils/trim";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function WorkExperience() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [open, setOpen] = useState(false);

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
      .then(setWorkExperience)
      .catch(() => {});
  }, []);

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities)
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

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className=" flex-1 font-logo text-xl font-bold text-primary">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center justify-between gap-3 text-left"
          >
            Work Experience
            <ChevronDown
              className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </h2>
        {editingId === null && (
          <button
            type="button"
            onClick={handleAddExperience}
            className="outlineBtn"
          >
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
              className="mt-4 flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="input"
                  type="text"
                  name="jobTitle"
                  placeholder="Job title"
                  value={form.jobTitle}
                  onChange={update}
                  required
                />
                <input
                  className="input"
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={form.company}
                  onChange={update}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-foreground/70">
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
                  End date (leave empty if current)
                  <input
                    className="input"
                    type="date"
                    name="doExit"
                    value={form.doExit}
                    onChange={update}
                  />
                </label>
              </div>

              <select
                className="input"
                name="cityId"
                value={form.cityId}
                onChange={update}
                required
              >
                <option value="" disabled>
                  City
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground/80">
                  Skills
                </p>
                <div className="flex gap-2">
                  <input
                    className="input min-w-0 flex-1"
                    type="text"
                    placeholder="Add a skill"
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
                    className="outlineBtn"
                  >
                    Add
                  </button>
                </div>

                {form.skills.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {form.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-1 rounded-2xl border border-primary/40 bg-background py-0.5 pl-3 pr-1 text-sm text-primary"
                      >
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(index)}
                          className="rounded-full px-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground/80">
                  Achievements
                </p>
                <div className="flex gap-2">
                  <input
                    className="input min-w-0 flex-1"
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
                    className="outlineBtn"
                  >
                    Add
                  </button>
                </div>

                {form.achievements.length > 0 && (
                  <ul className="space-y-2">
                    {form.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className="flex items-start justify-between gap-3 rounded-lg bg-background px-3 py-2 text-sm"
                      >
                        <span className="min-w-0 wrap-break-word">
                          {achievement}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="shrink-0 text-primary underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && <p className="text-accent">{error}</p>}

              <div className="flex gap-3">
                <button disabled={loading} type="submit" className="formBtn">
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setError("");
                  }}
                  className="rounded-lg border border-primary/40 px-4 py-2 text-primary transition-colors hover:bg-background"
                >
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
                    <button
                      type="button"
                      onClick={() => handleClick(experience)}
                      className="outlineBtn"
                    >
                      Edit
                    </button>
                  </div>

                  <p className="wrap-break-word text-foreground/70 font-semibold">
                    {experience.company} · {experience.city.name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {formatDate(new Date(experience.doEntry))} –{" "}
                    {experience.doExit
                      ? formatDate(new Date(experience.doExit))
                      : "Present"}
                  </p>
                  {experience.skills.length > 0 && (
                    <p className="mt-3 text-foreground/80">
                      <span className="font-semibold text-foreground/80">
                        Skills:
                      </span>{" "}
                      {experience.skills.join(", ")}
                    </p>
                  )}

                  {experience.achievements.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/80">
                      {experience.achievements.map((achievement, id) => (
                        <li key={id} className="wrap-break-word">
                          {achievement}
                        </li>
                      ))}
                    </ul>
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

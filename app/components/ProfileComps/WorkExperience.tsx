"use client";

import formatDate from "@/lib/utils/format";
import { clean } from "@/lib/utils/trim";
import { useEffect, useState } from "react";

export default function WorkExperience() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

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
    <section className=" rounded-2xl border border-border bg-surface p-6 mt-6 md:mt-10">
      <h2 className="font-logo text-xl font-bold text-primary">
        Work Experience
      </h2>

      {editingId !== null ? (
        <form onSubmit={(e) => handleSubmit(e, editingId)}>
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
          <input
            className="input"
            type="date"
            name="doEntry"
            placeholder="Date of entry"
            value={form.doEntry}
            onChange={update}
            required
          />
          <input
            className="input"
            type="date"
            name="doExit"
            placeholder="Date of exit"
            value={form.doExit}
            onChange={update}
          />
          <select name="cityId" value={form.cityId} onChange={update} required>
            <option value="" disabled>
              City
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <div>
            <input
              className="input"
              type="text"
              placeholder="Add a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <button type="button" onClick={addSkill}>
              Add
            </button>

            <ul>
              {form.skills.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <input
              className="input"
              type="text"
              placeholder="Add an achievement"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
            />
            <button type="button" onClick={addAchievement}>
              Add
            </button>

            <ul>
              {form.achievements.map((achievement, index) => (
                <li key={index}>
                  {achievement}
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="text-accent">{error}</p>}

          <div>
            <button disabled={loading} type="submit" className="formBtn">
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : loading ? (
        <p className="mt-3 text-foreground/70">Loading...</p>
      ) : error || workExperience.length === 0 ? (
        <p className="mt-3 text-accent">
          {error || "You have not added any work experience"}
        </p>
      ) : (
        <ul className="mt-4 space-y-6">
          {workExperience.map((experience) => (
            <li
              key={experience.id}
              className="border-l-2 border-primary/40 pl-4 mb-8"
            >
              <h3 className="text-lg font-semibold">{experience.jobTitle}</h3>
              <div className="justify-between items-center flex-wrap flex">
                <p className="text-foreground/70">
                  {experience.company} - {experience.city.name}
                </p>
                <p className="text-sm text-foreground/60">
                  {formatDate(new Date(experience.doEntry))} -{" "}
                  {experience.doExit
                    ? formatDate(new Date(experience.doExit))
                    : "Present"}
                </p>
                {editingId === null && (
                  <button
                    onClick={() => handleClick(experience)}
                    className="rounded-lg border border-primary px-3 text-sm text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    Edit
                  </button>
                )}
              </div>

              {experience.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1 text-foreground/90">
                  Skills:
                  {experience.skills.map((skill, id) => (
                    <span key={id} className="text-foreground/80">
                      {skill},
                    </span>
                  ))}
                </div>
              )}

              {experience.achievements.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/80">
                  {experience.achievements.map((achievement, id) => (
                    <li key={id}>{achievement}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <button
            className="formBtn"
            type="button"
            onClick={handleAddExperience}
          >
            Add
          </button>
        </ul>
      )}
    </section>
  );
}

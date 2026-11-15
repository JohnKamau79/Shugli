"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Skills() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("/api/userSkills")
      .then((r) => r.json())
      .then(setSkills)
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "",
  });

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/userSkills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again!");
        return;
      }
      setSkills(data);
      setForm({ name: "" });
    } catch {
      setError("Couldn't reach server. Check your connection!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    try {
      const res = await fetch("/api/userSkills", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again");
        return;
      }
      setSkills(data);
    } catch {
      setError("Couldn't reach server. Check you connection!");
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex-1 font-logo text-xl font-bold text-primary">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center justify-between w-full gap-3 text-left"
          >
            My Skills
            <ChevronDown
              className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </h2>
      </div>

      <div
        className={`gridWrap ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="mt-4 space-y-4">
            {skills.length < 1 ? (
              <p className="text-foreground/70">
                You have not added any skills
              </p>
            ) : (
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-foreground/80">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center gap-1 border border-primary/5 px-1 rounded-2xl"
                  >
                    {skill.name}
                    <button
                      type="button"
                      aria-label={`Remove ${skill.name}`}
                      onClick={() => handleDelete(skill.id)}
                      className="px-1 text-primary transition-colors duration-300 hover:text-accent"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                className="min-w-0 flex-1 border-b border-primary/30 bg-transparent py-1 text-sm outline-none transition-colors placeholder:text-foreground/50 focus:border-primary"
                type="text"
                name="name"
                placeholder="Add another skill"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="text-sm font-semibold text-primary transition-colors hover:text-accent"
              >
                + Add
              </button>
            </form>

            {error && <p className="text-sm text-accent">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

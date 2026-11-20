"use client";

import { Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfileSectionHeading } from "../ProfileSectionHeading";

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
      .then((d) => Array.isArray(d) && setSkills(d))
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
        <ProfileSectionHeading
          title="My Skills"
          description=" Highlight your technical and professional abilities."
          icon={Wrench}
          open={open}
          onToggle={() => setOpen(!open)}
        />
      </div>

      <div
        className={`gridWrap ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="mt-5 space-y-4">
            {skills.length < 1 ? (
              <p className="text-sm text-foreground/70">
                You have not added any skills
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-background py-1 pl-3 pr-1 text-xs font-medium text-foreground/80"
                  >
                    {skill.name}
                    <button
                      type="button"
                      aria-label={`Remove ${skill.name}`}
                      onClick={() => handleDelete(skill.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-primary hover:text-background"
                    >
                      <X size={13} />
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

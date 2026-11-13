"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Skills() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
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
    e.preventDefault()
    setError("")
    setLoading(true);

    try {
        const res = await fetch("/api/userSkills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: form.name
            })
        });

        const data = await res.json().catch(() => null);
        if(!res.ok) {
            setError(data.error ?? "Something went wrong. Please try again!");
            return;
        }
        setSkills(data);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 sm:p-6 md:mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex-1 font-logo text-xl font-bold text-primary">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center justify-between gap-3 text-left"
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
            <div className="flex  gap-2">
              <input
                className="input min-w-0 flex-1"
                type="text"
                name="name"
                placeholder="Add a skill"
              />
              <button className="formBtn" type="submit">
                Add
              </button>
            </div>
            {error && (
              <p className="text-accent">{error ?? "Something went wrong"}</p>
            )}

            <p className="text-foreground/70">You have not added any skills</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-foreground/80">
              {skills.map((skill) => (
                <li key={skill.id} className="flex items-center gap-1">
                  {skill.name}
                  <button className="px-1 text-primary transition-colors duration-300 hover:text-accent">
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

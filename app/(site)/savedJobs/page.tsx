"use client";

import { useEffect, useState } from "react";
import { Building2, FileSearch, MapPinIcon } from "lucide-react";
import Link from "next/link";
import SaveShareJobs from "@/app/components/SaveShareJobs";
import formatDate from "@/lib/utils/format";

type Jobs = {
  id: number;
  job: {
    id: number;
    title: string;
    jobType: string;
    city: { name: string };
    company: string;
    duration: string;
    category: { name: string };
    salary: number;
    employer: { firstName: string; lastName: string };
    createdAt: Date;
  };
};

export default function SavedJobs() {
  const pretty = (v: string) => v.replaceAll("_", "-");

  const [saved, setSaved] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/savedJobs")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setSaved(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-logo text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Saved Jobs
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Apply for saved jobs before they expire
            </p>
          </div>
          {!loading && (
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              {saved.length} {saved.length === 1 ? "job" : "jobs"}
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="flex h-32 animate-pulse items-center justify-center rounded-xl border border-border bg-background"
              >
                <FileSearch className="size-8 text-primary/40" />
              </div>
            ))}
          </div>
        )}

        {!loading && saved.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {saved.map((save) => (
              <li key={save.job.id}>
                <Link
                  href={`/jobs/${save.job.id}`}
                  className="group flex h-full flex-col rounded-xl border border-primary/40 bg-primary/5 p-3 shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md hover:shadow-primary/30"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-logo text-sm font-bold text-primary">
                      {save.job.company?.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold leading-tight">
                        {save.job.company}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-foreground/60">
                        <MapPinIcon className="size-3" />
                        {save.job.city.name}
                      </p>
                    </div>
                    <div>
                      <SaveShareJobs id={save.job.id} />
                    </div>
                  </div>

                  <h3 className="mt-2 line-clamp-1 text-base font-semibold leading-snug">
                    {save.job.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      {save.job.jobType}
                    </span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                      {pretty(save.job.duration)}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 text-sm">
                    <p className="font-bold text-primary">
                      {save.job.salary !== null
                        ? `Ksh ${save.job.salary.toLocaleString()}`
                        : ""}
                    </p>
                    <span className="text-xs text-foreground/50">
                      {formatDate(save.job.createdAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!loading && saved.length === 0 && (
          <div className="rounded-xl border border-border bg-background px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-foreground">No saved yet</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-foreground/70">
              Jobs you apply for will show up here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

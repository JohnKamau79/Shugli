"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  BriefcaseBusiness,
  Building2,
  Wallet,
  CalendarDays,
  FolderOpen,
  FileSearch,
} from "lucide-react";
import Link from "next/link";

type Application = {
  id: number;
  job: {
    id: number;
    title: string;
    jobtype: string;
    city: { name: string };
    category: { name: string };
    salary: number;
    employer: { firstName: string; lastName: string };
    createdAt: string;
  };
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setApplications(d))
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
              My Applications
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Jobs you&apos;ve applied for
            </p>
          </div>
          {!loading && (
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}
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

        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {applications.map((app) => (
              <Link href={`/jobs/${app.job.id}`} key={app.id}>
                <article className="rounded-xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-bold text-foreground">
                        {app.job.title}
                      </h2>
                      <p className="truncate text-sm text-foreground">
                        {app.job.employer.firstName} {app.job.employer.lastName}
                      </p>
                    </div>

                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      <span className="size-1.5 rounded-full bg-primary" />
                      Applied
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground/80">
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="size-3.5 text-foreground/70 " />
                      {app.job.jobtype}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-foreground/70 " />
                      {app.job.city.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="size-3.5 text-foreground/70 " />
                      {app.job.category.name}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <Wallet className="size-4 text-primary" />
                      {app.job.salary.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-foreground/70 ">
                      <CalendarDays className="size-3.5" />
                      Posted{" "}
                      {new Date(app.job.createdAt).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="rounded-xl border border-border bg-background px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              No applications yet
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-foreground/70">
              Jobs you apply for will show up here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

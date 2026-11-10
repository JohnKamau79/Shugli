import ApplyButton from "@/app/components/ApplyButton";
import { prisma } from "@/src/lib/db/prisma";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date();

  today.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const created = new Date(date);
  created.setHours(0, 0, 0, 0);

  if (created.getTime() === today.getTime()) return "Today";
  if (created.getTime() === yesterday.getTime()) return "Yesterday";

  return created.toLocaleDateString();
}

const pretty = (v: string) => v.replaceAll("_", " ");

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId)) notFound();

  const job = await prisma.jobs.findUnique({
    where: { id: jobId },
    include: {
      city: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  if (!job) notFound();

  const relatedJobs = await prisma.jobs.findMany({
    where: { categoryId: job.categoryId, id: { not: job.id } },
    include: { city: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const summary = [
    { icon: MapPinIcon, label: "Location", value: job.city.name },
    { icon: TagIcon, label: "Category", value: job.category.name },
    { icon: BriefcaseIcon, label: "Work type", value: job.jobType },
    { icon: ClockIcon, label: "Duration", value: pretty(job.duration) },
    { icon: CalendarDaysIcon, label: "Posted", value: formatDate(job.createdAt) },
  ];

  return (
    <main className="bg-background pb-10 md:pb-20">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to jobs
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground font-logo text-3xl font-extrabold text-primary shadow-lg sm:size-20 sm:text-4xl">
              {job.company?.charAt(0)}
            </span>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-primary-foreground/80 sm:text-lg">
                {job.company}
              </p>
              <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                <span className="rounded-full bg-primary-foreground px-3 py-1 text-primary">
                  {job.jobType}
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
                  {pretty(job.duration)}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1">
                  <MapPinIcon className="size-4" />
                  {job.city.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto -mt-8 grid max-w-6xl gap-6 px-4 sm:-mt-10 sm:px-6 lg:grid-cols-3">
        {/* Sidebar: first on mobile, right column on desktop */}
        <aside className="order-first lg:order-last">
          <div className="rounded-2xl border border-primary/20 bg-background p-5 shadow-xl shadow-primary/10 lg:sticky lg:top-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BanknoteIcon className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Salary
                </p>
                <p className="text-xl font-extrabold text-primary">
                  {job.salary !== null
                    ? `Ksh ${job.salary.toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <ApplyButton jobId={job.id} />
            </div>

            <ul className="mt-5 divide-y divide-border border-t border-border">
              {summary.map(({ icon: Icon, label, value }) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-foreground/60">
                    <Icon className="size-4 text-primary" />
                    {label}
                  </span>
                  <span className="text-right font-semibold">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Description */}
        <section className="rounded-2xl border border-primary/20 bg-background p-5 shadow-xl shadow-primary/10 sm:p-8 lg:col-span-2">
          <h2 className="mb-4 text-xl font-extrabold text-primary sm:text-2xl">
            About this job
          </h2>
          <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80 sm:text-lg mb-20">
            {job.description}
          </p>
          <ApplyButton jobId={job.id} />
        </section>
      </div>

      {/* Related jobs */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
            Similar jobs
          </h2>
          <Link
            href={`/jobs?category=${job.categoryId}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {relatedJobs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-primary/30 p-8 text-center text-foreground/60">
            No similar jobs yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {relatedJobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="group flex h-full flex-col rounded-xl border border-primary/40 bg-primary/5 p-3 shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md hover:shadow-primary/30"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-logo text-sm font-bold text-primary">
                      {job.company?.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold leading-tight">
                        {job.company}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-foreground/60">
                        <MapPinIcon className="size-3" />
                        {job.city.name}
                      </p>
                    </div>
                    <ArrowRightIcon className="size-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  <h3 className="mt-2 line-clamp-1 text-base font-semibold leading-snug">
                    {job.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      {job.jobType}
                    </span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                      {pretty(job.duration)}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 text-sm">
                    <p className="font-bold text-primary">
                      {job.salary !== null
                        ? `Ksh ${job.salary.toLocaleString()}`
                        : ""}
                    </p>
                    <span className="text-xs text-foreground/50">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
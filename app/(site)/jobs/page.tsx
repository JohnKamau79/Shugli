import formatDate from "@/lib/utils/format";
import { prisma } from "@/src/lib/db/prisma";
import { JobType, Duration } from "@/src/generated/prisma/client";
import type { Prisma } from "@/src/generated/prisma/client";
import { ArrowRightIcon, MapPinIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import JobSearch from "../../components/JobSearch";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    duration?: string;
    min?: string;
    max?: string;
  }>;
};

const pretty = (v: string) => v.replaceAll("_", " ");

export default async function Jobs({ searchParams }: Props) {
  const params = await searchParams;

  const { q, category, type, duration, min, max } = params;

  const selectedType = Object.values(JobType).find((value) => value === type);

  const selectedDuration = Object.values(Duration).find(
    (value) => value === duration,
  );

  const categoryId = Number(category);
  const minSalary = Number(min);
  const maxSalary = Number(max);

  const validCategory =
    category && Number.isInteger(categoryId) && categoryId > 0;

  const validMin =
    min !== undefined &&
    min !== "" &&
    Number.isFinite(minSalary) &&
    minSalary >= 0;

  const validMax =
    max !== undefined &&
    max !== "" &&
    Number.isFinite(maxSalary) &&
    maxSalary >= 0;

  const where: Prisma.JobsWhereInput = {
    ...(q?.trim() && {
      OR: [
        { title: { contains: q.trim(), mode: "insensitive" } },
        { company: { contains: q.trim(), mode: "insensitive" } },
      ],
    }),
    ...(validCategory && { categoryId }),
    ...(selectedType && { jobType: selectedType }),
    ...(selectedDuration && { duration: selectedDuration }),
    ...(validMin || validMax
      ? {
          salary: {
            ...(validMin && { gte: minSalary }),
            ...(validMax && { lte: maxSalary }),
          },
        }
      : {}),
  };

  const [jobs, categories] = await Promise.all([
    prisma.jobs.findMany({
      where,
      include: {
        city: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { id: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const isFiltered = Object.values(params).some(Boolean);

  return (
    <main className="bg-background mb-10 md:mb-20">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-24 sm:pt-14">
          <h1 className="font-heading text-3xl font-extrabold sm:text-5xl">
            Find Your Job Here.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 sm:text-lg">
            Search by title, category, type and salary.
          </p>
        </div>
      </section>

      {/* Search overlaps the hero */}
      <div className="mx-auto -mt-10 max-w-6xl px-4 sm:-mt-14 sm:px-6">
        <Suspense>
          <JobSearch categories={categories} />
        </Suspense>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground/70 sm:text-base">
            <span className="font-extrabold text-primary">{jobs.length}</span>{" "}
            {jobs.length === 1 ? "job" : "jobs"}
            {isFiltered ? " found" : " available"}
          </p>
          {isFiltered && (
            <Link
              href="/jobs"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear all
            </Link>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/30 px-6 py-16 text-center">
            <SearchXIcon className="size-10 text-primary/60" />
            <p className="text-lg font-bold">No jobs found</p>
            <p className="max-w-sm text-sm text-foreground/60">
              Try a different keyword or remove some filters.
            </p>
            <Link
              href="/jobs"
              className="mt-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground"
            >
              View all jobs
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {jobs.map((job) => (
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

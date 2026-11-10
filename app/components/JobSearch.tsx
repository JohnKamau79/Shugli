"use client";
import { Duration, JobType } from "@/src/generated/prisma/enums";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  categories: {
    id: number;
    name: string;
  }[];
};

const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-300 focus:border-primary focus:ring-2 focus:ring-primary/30";

const pretty = (v: string) => v.replaceAll("_", "-");

export default function JobSearch({ categories }: Props) {
  const params = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = ["category", "type", "duration", "min", "max"].some((k) =>
    params.get(k),
  );

  return (
    <section>
      <form
        action="/jobs"
        key={params.toString()}
        method="GET"
        className="bg-background text-foreground mx-auto w-full max-w-4xl rounded-2xl p-3 text-left shadow-xl shadow-primary/20 sm:p-4"
      >
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary/70" />
            <input
              type="search"
              name="q"
              defaultValue={params.get("q") ?? ""}
              placeholder="Job title or company"
              className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors duration-300 focus:border-primary focus:ring-2 focus:ring-primary/30 sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="bg-primary h-11 shrink-0 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground sm:px-6 sm:text-base"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          className="relative mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary/20 md:hidden"
        >
          <SlidersHorizontalIcon className="size-4" />
          <span>Filters</span>
          {hasFilters && (
            <span className="absolute right-3 top-2 size-2.5 rounded-full bg-accent" />
          )}
        </button>

        <div
          className={`${showFilters ? "grid" : "hidden"} mt-3 grid-cols-2 gap-2 border-t border-border pt-3 md:grid md:grid-cols-5 md:gap-3`}
        >
          <label className="col-span-2 md:col-span-1">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              Category
            </span>
            <select
              name="category"
              defaultValue={params.get("category") ?? ""}
              className={fieldClass}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              Job type
            </span>
            <select
              name="type"
              defaultValue={params.get("type") ?? ""}
              className={fieldClass}
            >
              <option value="">All</option>
              {Object.values(JobType).map((jobtype) => (
                <option key={jobtype} value={jobtype}>
                  {pretty(jobtype)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              Duration
            </span>
            <select
              name="duration"
              defaultValue={params.get("duration") ?? ""}
              className={fieldClass}
            >
              <option value="">All</option>
              {Object.values(Duration).map((d) => (
                <option key={d} value={d}>
                  {pretty(d)}
                </option>
              ))}
            </select>
          </label>

          <div className="col-span-2">
            <span className="mb-1 block text-xs font-semibold text-foreground/60">
              Salary (Ksh)
            </span>

            <div className="flex items-center gap-2">
              <input
                type="number"
                name="min"
                min={0}
                inputMode="numeric"
                placeholder="Min"
                defaultValue={params.get("min") ?? ""}
                className={fieldClass}
              />
              <span>-</span>
              <input
                type="number"
                name="max"
                min={0}
                inputMode="numeric"
                placeholder="Max"
                defaultValue={params.get("max") ?? ""}
                className={fieldClass}
              />
            </div>
          </div>

          {hasFilters && (
            <Link
              href="/jobs"
              className="col-span-2 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline md:col-span-5 md:justify-end"
            >
              <XIcon className="size-4" />
              Clear Filters
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}

import formatDate from "@/lib/utils/format";
import { prisma } from "@/src/lib/db/prisma";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
};

export default async function MainLatestJobs({ className }: Props) {
  const latestJobs = await prisma.jobs.findMany({
    take: 6,
    include: { city: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className={className}>
      <div className="grid grid-cols-[1fr_auto_2fr] md:grid-cols-[1fr_auto_1fr] items-center px-4">
        <span aria-hidden="true" />

        <h2 className="text-center font-heading text-2xl font-extrabold text-primary sm:text-4xl">
          Latest Jobs
        </h2>

        <Link
          href="/jobs"
          className="justify-self-end text-sm md:text-lg font-semibold text-primary hover:text-primary/80 sm:text-base flex gap-1 items-center"
        >
          See all jobs
          <ArrowRightIcon size={20} />
        </Link>
      </div>
      <div className="mt-6 px-4 sm:mt-10 md:mt-20">
        {latestJobs.length === 0 ? (
          <p className="text-center text-foreground/70">
            No jobs available at the moment
          </p>
        ) : (
          <ul className="-mx-4 grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col grid-rows-2 gap-3 overflow-x-auto scroll-px-4 px-4 py-2 sm:mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:grid-rows-none sm:gap-4 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3">
            {latestJobs.map((job) => (
              <li key={job.id} className="snap-start">
                <Link
                  href={`/jobs/${job.id}`}
                  className="group flex h-full flex-col rounded-xl border border-primary/40 bg-primary/5 p-3 shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20"
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
                      {job.duration}
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
      </div>
    </section>
  );
}

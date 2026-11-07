import formatDate from "@/lib/utils/format";
import { prisma } from "@/src/lib/db/prisma";
import { ArrowRightIcon } from "lucide-react";
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
          <ArrowRightIcon size={20}/>
        </Link>
      </div>
      <div className="mt-6 px-4 sm:mt-10 md:mt-20">
        {latestJobs.length === 0 ? (
          <p className="text-center text-foreground/70">
            No jobs available at the moment
          </p>
        ) : (
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3">
  {latestJobs.map((job) => (
    <li
      key={job.id}
      className="group w-[82%] shrink-0 snap-start rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-3 shadow-md shadow-primary/25 transition-all duration-300 hover:bg-primary/50 sm:w-auto sm:shadow-xl"
    >
                <Link href={`/latest/${job.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border-2 border-primary/40 font-logo text-base font-bold text-primary sm:size-9 sm:border-3 sm:text-lg">
                        {job.company?.charAt(0)}
                      </span>

                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-base font-bold leading-tight sm:text-lg">
                          {job.company}
                        </p>
                        <p className="truncate text-xs font-semibold leading-tight text-primary/70 sm:text-sm">
                          {job.city.name}
                        </p>
                      </div>
                    </div>

                    <ArrowRightIcon className="size-5 shrink-0 text-primary transition-all duration-300 group-hover:scale-150 sm:size-6" />
                  </div>

                  <div>
                    <h3 className="mt-1.5 line-clamp-1 text-base font-semibold leading-tight sm:mt-2 sm:line-clamp-none sm:text-lg">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:gap-2">
                      <span className="rounded-2xl bg-primary/80 px-2.5 py-0.5 text-xs text-primary-foreground sm:px-3 sm:text-sm">
                        {job.jobType}
                      </span>
                      <span className="rounded-2xl bg-accent/80 px-2.5 py-0.5 text-xs text-primary-foreground sm:px-3 sm:text-sm">
                        {job.duration.replace("_", "-")}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
                      {job.salary && (
                        <p className="text-base font-bold text-primary sm:text-lg">
                          Ksh {job.salary.toLocaleString()}
                        </p>
                      )}

                      <span className="ml-auto text-xs font-semibold text-foreground/50 sm:text-sm">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
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

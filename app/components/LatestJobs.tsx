import formatDate from "@/lib/utils/format";
import { prisma } from "@/src/lib/db/prisma";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
};

export default async function LatestJobs({ className }: Props) {
  const latestJobs = await prisma.jobs.findMany({
    take: 9,
    include: {
      city: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className={className}>
      <h2 className="text-center font-heading text-4xl font-extrabold text-primary">
        Latest Jobs
      </h2>
      <div className="mt-20 pl-2">
        {latestJobs.length === 0 ? (
          <p>No jobs available at the moment</p>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {latestJobs.map((job) => (
              <li
                key={job.id}
                className="shadow-xl shadow-primary/20 px-3 py-2 mr-3 my-2 pr-5 rounded-lg transition-all duration-300 hover:bg-primary/50 w-full sm:w-[48%] lg:w-[31%] xl:w-[23%] group"
              >
                <Link href={`/latest/${job.id}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="border-3 border-primary/40 w-9 h-9 flex shrink-0 items-center justify-center rounded-lg text-lg font-bold font-logo text-primary">
                        {job.company?.charAt(0)}
                      </span>

                      <div className="flex flex-col">
                        <p className="text-lg font-bold leading-tight">
                          {job.company}
                        </p>
                        <p className="text-sm font-semibold leading-tight text-primary/70">
                          {job.city.name}
                        </p>
                      </div>
                    </div>

                    <ArrowRightIcon className="text-primary transition-all duration-300 group-hover:scale-150" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold leading-tight mt-2">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="bg-primary/80 px-3 py-0.5 text-primary-foreground text-sm rounded-2xl">
                        {job.jobType}
                      </span>
                      <span className="bg-accent/80 px-3 py-0.5 text-primary-foreground text-sm rounded-2xl">
                        {job.duration.replace("_", "-")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {job.salary && (
                        <p className="text-primary font-bold text-lg">
                          Ksh {job.salary.toLocaleString()}
                        </p>
                      )}

                      <span className="text-sm font-semibold text-foreground/50">
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

import formatDate from "@/lib/utils/format";
import { prisma } from "@/src/lib/db/prisma";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  className?: string;
};

export default async function MainCompanies({ className }: Props) {
  const jobs = await prisma.jobs.findMany({
    select: {
      id: true,
      company: true,
    },
  });

  return (
    <section className={className}>
      <div className="mt-6 px-4 sm:mt-10 md:mt-20">
        {jobs.length === 0 ? (
          <p className="text-center text-foreground/70">
            No jobs available at the moment
          </p>
        ) : (
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="group w-[82%] shrink-0 snap-start rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-3 shadow-md shadow-primary/25 transition-all duration-300 hover:bg-primary/50 sm:w-auto sm:shadow-xl"
              >
                {job.company}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

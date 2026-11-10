import { prisma } from "@/src/lib/db/prisma";

export default async function MainCompanies() {
  const rows = await prisma.jobs.findMany({
    distinct: ["company"],
    select: { company: true },
    where: { company: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const companies = rows.map((r) => r.company as string);

  if (companies.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 bg-primary/5">
      <h2 className="px-4 text-center font-heading font-extrabold text-primary/40 sm:text-lg">
        Hiring Companies
      </h2>

      <div className="mt-6 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:mt-10">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
            >
              {companies.map((name) => (
                <li
                  key={`${copy}-${name}`}
                  className="flex items-center gap-10 text-primary/70 px-3 py-2 sm:px-4 sm:py-3"
                >
                  <span className="whitespace-nowrap text-sm font-extrabold sm:text-base">
                    {name}
                  </span>
                  <span className="bg-accent/40 p-1"></span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

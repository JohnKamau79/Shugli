import { prisma } from "@/src/lib/db/prisma";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function MainCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16 lg:py-24">
      <h2 className="text-center font-heading text-3xl font-extrabold text-primary sm:text-4xl">
        Popular job categories
      </h2>
      <p className="mt-2 text-center text-sm text-foreground/70 sm:mt-3 sm:text-base">
        Browse jobs by the kind of work you do
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-center text-foreground/70 sm:mt-12">
          No categories yet
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.id}`}
                className="group flex h-11 items-center justify-between gap-2 rounded-xl border border-border bg-primary/20 px-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground sm:h-20 sm:gap-3 sm:rounded-2xl sm:p-6 sm:text-xl sm:hover:shadow-lg sm:[@media(hover:hover)]:hover:-translate-y-1"
              >
                <span className="min-w-0 wrap-break-word line-clamp-1 sm:line-clamp-2">
                  {category.name}
                </span>
                <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-6" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

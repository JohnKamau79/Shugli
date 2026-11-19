import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Looking for a job?",
    text: "Create an account and apply to verified jobs in minutes.",
    cta: "Create an account",
    href: "/auth/register",
    primary: true,
  },
  {
    title: "Hiring?",
    text: "Post your job and reach people looking for work today.",
    cta: "Post a job",
    href: "/auth/register",
    primary: false,
  },
];

export default function MainCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`flex flex-col items-start gap-3 rounded-2xl p-5 shadow-lg shadow-primary/20 sm:p-8 ${
              card.primary
                ? "bg-primary text-primary-foreground"
                : "border border-primary/30 bg-primary/5 text-foreground"
            }`}
          >
            <h2 className="font-heading text-xl font-extrabold sm:text-2xl">
              {card.title}
            </h2>
            <p
              className={`text-sm sm:text-base ${
                card.primary ? "text-primary-foreground/80" : "text-foreground/70"
              }`}
            >
              {card.text}
            </p>
            <Link
              href={card.href}
              className={`group mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-colors duration-300 ${
                card.primary
                  ? "bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                  : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {card.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
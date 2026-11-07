import { CheckCircle } from "lucide-react";
import Link from "next/link";

const badges = ["Verified jobs", "Updated daily", "Built for Kenya"];

export default function Main() {
  return (
    <section className="bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-background/60 px-4 py-12 text-center backdrop-blur-md sm:px-6 md:min-h-dvh md:py-16">
        <h1 className="max-w-4xl font-logo text-4xl font-extrabold text-primary sm:text-5xl lg:text-6xl">
          Find Your Next Opportunity Today!
        </h1>

        <p className="mt-3 max-w-2xl text-base font-semibold sm:text-lg lg:text-xl">
          Welcome to Shugli. Where we connect you to your future job and give
          you a platform to showcase a job for hire.
        </p>

        <ul className="mb-2 mt-6 flex flex-wrap items-center justify-center gap-3 font-logo text-sm font-semibold sm:gap-4 sm:text-base">
          {badges.map((badge) => (
            <li
              key={badge}
              className="flex items-center gap-2 rounded-2xl bg-primary px-3 py-1 text-primary-foreground"
            >
              {badge} <CheckCircle className="size-4 sm:size-5" />
            </li>
          ))}
        </ul>

        <div className="mt-7 flex w-full max-w-md flex-col gap-4 text-lg font-semibold sm:max-w-none sm:flex-row sm:justify-center sm:gap-6 sm:text-xl lg:gap-10 lg:text-2xl">
          <Link
            href="/jobs"
            className="rounded-2xl border-2 border-accent bg-accent-foreground px-6 py-3 text-accent shadow-3xl transition-all duration-300 hover:bg-accent hover:text-accent-foreground sm:px-10"
          >
            Find your job
          </Link>
          <Link
            href="/auth/LoginPage"
            className="rounded-2xl bg-accent px-6 py-3 text-accent-foreground shadow-3xl transition-all duration-300 hover:bg-accent-foreground hover:text-accent sm:px-10"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}

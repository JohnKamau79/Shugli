import { CheckCircle, ChevronDown } from "lucide-react";

const reasons = [
  {
    title: "Verified employers",
    description:
      "Every employer is checked before they can post, so you apply to real companies.",
  },
  {
    title: "Relevant job recommendations",
    description:
      "You see jobs that match your category and interests, so you spend less time scrolling.",
  },
  {
    title: "Easy application process",
    description:
      "Apply in a few clicks, with no long forms and no repeated typing.",
  },
  {
    title: "Free job seeker accounts",
    description:
      "Signing up and applying costs you nothing, now or later.",
  },
];

export default function WhyChoose() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h2 className="mb-6 text-center font-logo text-2xl font-extrabold text-primary sm:text-3xl">
        Why choose this platform?
      </h2>

      <ul className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <li key={reason.title}>
            <details className="group rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-3">
              <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold">
                <CheckCircle className="size-5 shrink-0 text-primary" />
                {reason.title}
                <ChevronDown className="ml-auto size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-foreground/70">
                {reason.description}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
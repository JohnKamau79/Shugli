const stats = [
  { value: "899", label: "Total Employers" },
  { value: "899", label: "Total Jobs" },
  { value: "899", label: "Active Jobs" },
  { value: "899", label: "Total Users" },
];

export default function MainTotals() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-4 md:gap-x-0 md:py-20 md:divide-x md:divide-primary-foreground/20 lg:py-28">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 px-2 text-center sm:gap-4 md:px-8"
          >
            <span className="font-logo text-4xl font-bold sm:text-5xl lg:text-6xl">
              {stat.value}
              <span className="text-accent">+</span>
            </span>
            <span className="text-xs uppercase tracking-wide text-primary-foreground/70 sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

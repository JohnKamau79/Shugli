import Link from "next/link";

const columns = [
  {
    title: "Job seekers",
    links: [
      { label: "Browse jobs", href: "/jobs" },
      { label: "Categories", href: "/categories" },
      { label: "Create an account", href: "/auth/register" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post a job", href: "/auth/register" },
      { label: "Log in", href: "/auth/LoginPage" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-logo text-2xl font-extrabold text-primary"
            >
              Shugli
            </Link>
            <p className="mt-2 max-w-xs text-sm text-foreground/70">
              Verified jobs, updated daily. Built for Kenya.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-300 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-5 text-center text-xs text-foreground/60 sm:mt-12 sm:text-sm">
          © {new Date().getFullYear()} Shugli. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

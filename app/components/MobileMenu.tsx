"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon, X, ChevronRight, UserRound } from "lucide-react";
import LogoutButton from "./LogoutButton";
import Button from "./Button";

type Props = {
  links: { href: string; label: string }[];
};

const navs = [
  { id: 1, name: "Saved jobs", href: "" },
  { id: 2, name: "Applications", href: "" },
  { id: 3, name: "Profile", href: "/ProfilePage" },
];

export default function MobileMenu({ links }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSession(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUser(d))
      .catch(() => {});
  }, []);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-xl border border-border bg-background p-2.5 text-primary transition-colors hover:bg-primary/10"
      >
        {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {open && (
        <nav className="absolute right-0 top-full z-50 mt-3 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-xl">
          <div
            className={` ${session !== null && "border-b p-3"} border-border `}
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between rounded-xl px-3 py-3 font-semibold text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {link.label}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {session !== null && (
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="size-6" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3">
            {session !== null && (
              <div>
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  My Account
                </p>

                <div className="flex flex-col gap-1">
                  {navs.map((nav) => (
                    <Link
                      href={nav.href}
                      key={nav.id}
                      onClick={close}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {nav.name}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 border-t border-border pt-3">
              {session === null ? (
                <Button className="w-full" href="/auth/LoginPage">
                  Sign In
                </Button>
              ) : (
                <LogoutButton className="w-full" />
              )}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

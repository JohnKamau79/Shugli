"use client";

import { ChevronDown, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./Button";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

const navs = [
  { id: 1, name: "Saved jobs", href: "/savedJobs" },
  { id: 2, name: "Applications", href: "/applications" },
  { id: 3, name: "Profile", href: "/ProfilePage" },
];

export default function HeaderProfile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);

  const pathName = usePathname();
  const [prevPath, setPrevPath] = useState(pathName);
  if (pathName !== prevPath) {
    setPrevPath(pathName);
    setOpen(false);
  }

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
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 border border-primary/30 rounded-full"
      >
        <span className="p-1 font-logo font-bold bg-surface text-primary text-sm rounded-full pr-2 border-r border-primary/30">
          <UserRound />
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <nav className="absolute right-0 top-full z-50 flex flex-col border border-border bg-background shadow-md p-3 w-3xs rounded-2xl text-foreground">
          <div className="ml-3 grid grid-cols-1">
            <div className="border-b border-border pb-3">
              <p className="flex gap-1 font-bold text-foreground/80 text-xl font-logo">
                <span>{user.firstName}</span>
                <span>{user.lastName}</span>
              </p>
              <p className="font-semibold text-foreground/60 text-sm">
                {user.email}
              </p>
            </div>
            {navs.map((nav) => (
              <Link
                href={nav.href}
                key={nav.id}
                className="border-b border-border font-semibold text-foreground/80 mt-2 transition-all duration-300 hover:text-primary/90"
              >
                {nav.name}
              </Link>
            ))}
            {session === null ? (
              <Button className="mt-3 m-auto" href="/auth/LoginPage">
                Sign In
              </Button>
            ) : (
              <LogoutButton className="mt-3 m-auto" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

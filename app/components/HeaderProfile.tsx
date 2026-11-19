"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navs = [
  { id: 1, name: "Saved jobs", href: "" },
  { id: 2, name: "Applications", href: "" },
  { id: 3, name: "Profile", href: "" },
];

export default function HeaderProfile() {
  const [user, setUSer] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUSer)
      .catch(() => {});
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 border border-primary/30 rounded-full bg-accent/90 text-accent-foreground"
      >
        <span className="p-1 font-logo font-bold bg-primary/90 text-primary-foreground text-sm rounded-full pr-2">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {!open && (
        <nav className="absolute right-0 top-full z-50 flex flex-col border border-border bg-background shadow-md p-3 w-3xs rounded-2xl text-foreground">
          <div className="ml-3">
            <div className="border-b border-border pb-3">
            <p className="flex gap-1 font-bold text-foreground/80 text-xl font-logo">
              <span>{user.firstName}</span>
              <span>{user.lastName}</span>
            </p>
            <p className="font-semibold text-foreground/60 text-sm">{user.email}</p>
          </div>
          {navs.map((nav) => (
            <Link href={nav.href} key={nav.id}>
              {nav.name}
            </Link>
          ))}
          </div>
        </nav>
      )}
    </div>
  );
}

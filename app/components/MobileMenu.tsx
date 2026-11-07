"use client";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import LogoutButton from "./LogoutButton";

type Props = {
  links: { href: string; label: string }[];
  isLoggedIn: boolean;
};

export default function MobileMenu({ links, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-lg border border-border p-2 text-primary"
      >
        {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full z-50 flex flex-col border-b border-border bg-background shadow-md">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="px-4 py-3 font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div onClick={close} className="px-4 py-3">
              <LogoutButton className=" font-semibold text-primary transition-colors duration-300 hover:bg-primary/10" />
            </div>
          ) : (
            <Link
              href="/auth/LoginPage"
              onClick={close}
              className="px-4 py-3 font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
            >
              Log In
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
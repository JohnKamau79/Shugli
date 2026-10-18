"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

const NAV = [
  { href: "/jobs", label: "Find a job" },
  { href: "/workers", label: "Find a worker" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={close}>
          Shugli
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/login" className={styles.login}>
            Log in
          </Link>
          <Link href="/post-job" className="btn btn-primary">
            Post a job
          </Link>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className={styles.mobileMenu} aria-label="Main">
          <div className="container">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={close}>
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={close}>
              Log in
            </Link>
            <Link href="/post-job" className="btn btn-primary" onClick={close}>
              Post a job
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

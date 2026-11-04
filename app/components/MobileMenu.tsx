"use client"
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import LogoutButton from "./LogoutButton";


export default function MobileMenu({ links, isLoggedIn }: { links: { href: string; label: string }[], isLoggedIn: boolean }) {
    const [open, setOpen] = useState(false);


    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="rounded-lg border border-border px-3 py-2"
            >
                {open ? <X className="text-primary" /> : <MenuIcon className="text-primary" />}
            </button>

            {open && (
                <nav className="absolute inset-x-0 flex flex-col gap-3 border-b border-border bg-accent/95 p-1">
                    {links.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                            {link.label}
                        </Link>
                    ))}
                    {isLoggedIn ?
                        <LogoutButton />
                        :
                        <Link href={'/'} onClick={() => setOpen(false)}>Log In</Link>
                    }
                </nav>
            )}
        </div>
    );
}
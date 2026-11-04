import Link from "next/link";
import { ReactNode } from "react";

type NavLinkProps = {
    href: string,
    children: ReactNode,
}

export default function NavLink({ href, children }: NavLinkProps) {
    return (
        <Link href={href} className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
            {children}
        </Link>
    );
}
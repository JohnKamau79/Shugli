import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
    href: string,
    children: ReactNode,
}

export default function Button({ href, children }: ButtonProps) {
    return (
        <Link href={href} className="btn-primary">
            {children}
        </Link>
    );
}
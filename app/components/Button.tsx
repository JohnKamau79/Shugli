import { LogIn } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
};

export default function Button({ href, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className="btn-primary flex justify-center items-center gap-1"
    >
      <LogIn className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      {children}
    </Link>
  );
}

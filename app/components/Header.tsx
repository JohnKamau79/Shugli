import Link from "next/link";
import NavLink from "./NavLink";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { getSession } from "@/src/lib/session";
import LogoutButton from "./LogoutButton";


const links = [
  { href: "/jobs", label: "Find a Job" },
  { href: "/workers", label: "Find a Worker" },
  { href: "/post", label: "Post a Job" },
]

export default async function Header() {
  const session = await getSession();


  return (
    <header className="border border-border bg-background/90 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4 relative">
        <Link href={'/'} className="font-logo text-3xl font-bold text-primary">
          Shugli
        </Link>
        <nav className="hidden text-primary font-medium text-lg md:flex gap-6">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          {!session ?
            <Button href="../auth/LoginPage">Log In</Button>
            :
            <LogoutButton className="btn-primary" />
          }
        </nav>
        <MobileMenu links={links} isLoggedIn={!!session} />
      </div>

    </header>
  );
}
"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutButton({className}: {className?: string}) {
    const router = useRouter();

    async function logout() {
        await fetch("../api/auth/logout", { method: "POST" });
        router.push('/')
        router.refresh();
    }

    return (
        <Link href={"/"} onClick={logout} className={className}>Log Out</Link>
        
        
    )
}
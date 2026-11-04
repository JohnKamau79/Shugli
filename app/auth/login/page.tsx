"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("../auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push("/");
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error);
            setLoading(false);
        }
    }

    return (
        <main className="flex items-center justify-center">
            <div className="bg-background shadow-primary shadow-xl shadoe  p-5 m-10 rounded-2xl">
                <div className="flex flex-col-reverse justify-center items-center gap-3 mb-3">
                    <h1 className="font-bold text-primary text-xl">Log In</h1>
                <Image src={"../../icon.svg"} alt={"Icon"} width={60} height={60} />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input className="input" type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                    <input className="input" type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />

                    {error && <p> {error}</p>}
                    <button className="formBtn" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </main>
    );
}
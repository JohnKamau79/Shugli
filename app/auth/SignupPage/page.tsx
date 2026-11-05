"use client";
import NavLink from "@/app/components/NavLink";
import PhoneNumberField from "@/app/components/PhoneNumberField";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [city, setCity] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("../../ap/auth/login", {
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
        } catch {
            setError("Could not reach server! Check your connection");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex items-center justify-center bg-[url('/working3.jpg')] bg-cover bg-center h-screen">
            <div className="bg-background/70 shadow-primary shadow-xl p-5 m-10 rounded-2xl w-full max-w-sm  ">
                <div className="flex flex-col-reverse justify-center items-center gap-3 mb-6">
                    <h1 className="font-extrabold text-primary text-xl">FIND YOUR DREAM JOB TODAY!</h1>
                    <Image src={"../../icon.svg"} alt={"Icon"} width={60} height={60} />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        className="input"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        className="input"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        required
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PhoneNumberField />
                    <input
                        className="input"
                        type="tel"
                        placeholder="+25412345678"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="input"
                        type="tel"
                        placeholder="+25412345678"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="input"
                        type="tel"
                        placeholder="+25412345678"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="input"
                        type="tel"
                        placeholder="+25412345678"
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-accent animate-[fadeIn_600ms_ease-in-out]">
                            {" "}
                            {error}
                        </p>
                    )}
                    <button className="formBtn" type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                    <p className="text-center text-foreground font-semibold text-lg">Already registered? <span className="text-primary"><NavLink href="../auth/LoginPage">Sign In</NavLink></span></p>
                </form>
            </div>
        </main>
    );
}

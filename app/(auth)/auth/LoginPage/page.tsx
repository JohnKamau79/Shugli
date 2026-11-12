"use client";
import NavLink from "@/app/components/NavLink";
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/ProfilePage");
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
    <main className="bg-[url('/working3.jpg')] bg-cover bg-center min-h-dvh ">
     <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center ">
       <div className="bg-background/70 shadow-primary shadow-xl p-5 m-10 rounded-2xl w-full max-w-sm  relative">
        <div className="flex flex-col-reverse justify-center items-center gap-3 mb-3">
          <h1 className="font-bold text-primary text-xl">Log In</h1>
          <Image src={"../../icon.svg"} alt={"Icon"} width={60} height={60} priority />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="text-center text-primary font-semibold text-lg">Not registered? <span><NavLink href="../auth/SignupPage">Sign Up</NavLink></span></p>
        </form>
      </div>
     </div>
    </main>
  );
}

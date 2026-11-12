"use client";
import NavLink from "@/app/components/NavLink";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type City = { id: number; name: string };

const gender = [{ name: "Male" }, { name: "Female" }, { name: "Other" }];

const roles = [
  { name: "Applicant" },
  { name: "Employer" },
  { name: "Worker" },
  { name: "Customer" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    role: "",
    cityId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  function update(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cityId: Number(form.cityId) }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.error ?? "Something went workAsyncStorage. Please try again!",
        );
        return;
      }
      router.push("/auth/LoginPage");
    } catch {
      setError("Could not reach server! Check your connection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-[url('/working3.jpg')] bg-cover bg-center min-h-dvh ">
      <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-background/70 shadow-primary shadow-xl p-5 m-10 rounded-2xl w-full max-w-sm  relative">
          <div className="flex flex-col-reverse justify-center items-center gap-3 mb-3">
            <h1 className="font-bold text-primary text-xl">Create account</h1>
            <Image
              src={"../../icon.svg"}
              alt={"Icon"}
              width={60}
              height={60}
              priority
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="text"
                className="input w-1/2"
                name="firstName"
                placeholder="First Name"
                onChange={update}
                value={form.firstName}
                required
              />
              <input
                type="text"
                className="input w-1/2"
                name="lastName"
                placeholder="Last Name"
                onChange={update}
                value={form.lastName}
                required
              />
            </div>
            <input
              type="email"
              className="input"
              name="email"
              placeholder="Email"
              onChange={update}
              value={form.email}
              required
            />
            <input
              type="tel"
              className="input"
              name="phone"
              placeholder="Phone"
              onChange={update}
              value={form.phone}
              required
            />
            <input
              type="password"
              className="input"
              name="password"
              placeholder="Password"
              onChange={update}
              value={form.password}
              required
            />

            <select
              className="input p-1 text-foreground/70"
              value={form.gender}
              name="gender"
              id=""
              onChange={update}
              required
            >
              <option disabled value="">
                Gender
              </option>
              {gender.map((g) => (
                <option value={g.name} key={g.name}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              className="input p-1 text-foreground/70"
              value={form.role}
              name="role"
              onChange={update}
              required
            >
              <option disabled value="">
                I am a ...
              </option>
              {roles.map((role) => (
                <option value={role.name} key={role.name}>
                  {role.name}
                </option>
              ))}
            </select>

            <select
              className="input p-1 text-foreground/70"
              value={form.cityId}
              name="cityId"
              onChange={update}
              required
            >
              <option disabled value="">
                City
              </option>
              {cities.map((city) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {error && <p className="text-accent">{error}</p>}
            <button className="formBtn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <p className="text-center text-primary font-semibold text-lg">Already registered? <span><NavLink href="../auth/LoginPage">Sign In</NavLink></span></p>
          </form>
        </div>
      </div>
    </main>
  );
}

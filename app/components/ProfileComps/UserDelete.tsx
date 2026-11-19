"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch("api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/login") 
    } catch {
      setError("Could not reach server. Check your connection!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button disabled={loading} onClick={handleDelete}>
        Delete Account
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

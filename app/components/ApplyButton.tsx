"use client";
import { BriefcaseBusiness } from "lucide-react";
import { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: number }) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleApply() {
    const response = await fetch(`/api/jobs/${jobId}/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      setSuccess(true);
      setMessage("Application submitted successfully");
    } else {
      setSuccess(false);
      setMessage(data.error);
    }
  }

  return (
    <div>
      <button
        onClick={handleApply}
        className="bg-primary text-primary-foreground p-2 px-6 rounded-xl md:text-xl font-bold transition-all duration-300 hover:opacity-90 mx-auto mt-10 flex justify-center items-center gap-2"
      >
        {<span>Apply Now</span>}
        <BriefcaseBusiness className="md:size-6" />
      </button>
      <p
        className={
          success
            ? "text-center mt-4 text-lg font-semibold bg-primary text-primary-foreground rounded-md w-fit mx-auto px-4"
            : "text-center mt-4 text-lg font-semibold bg-accent text-accent-foreground rounded-md w-fit mx-auto px-4"
        }
      >
        {message}
      </p>
    </div>
  );
}

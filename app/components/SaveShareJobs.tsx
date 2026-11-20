"use client";

import { Bookmark, Share2 } from "lucide-react";
import { useState } from "react";

export default function SaveShareJobs({ id }: { id: number }) {
  const [saved, setSaved] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const res = await fetch("/api/savedJobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    }
  }

  return (
    <span className="flex items-center gap-0.5 text-foreground/50">
      <span
        className={`rounded-full p-1.5 transition-colors hover:bg-primary/10 hover:text-primary`}
      >
        <button onClick={toggleSave}>
          <Bookmark
            className={`${saved ? "fill-primary text-primary" : ""} size-4.5`}
          />
        </button>
      </span>
      <span className="rounded-full p-1.5 transition-colors hover:bg-primary/10 hover:text-primary">
        <Share2 className="size-4.5" />
      </span>
    </span>
  );
}

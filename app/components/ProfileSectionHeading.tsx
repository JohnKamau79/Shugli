import { ChevronDown } from "lucide-react";
import React from "react";

export function ProfileSectionHeading({
  title,
  description,
  icon: Icon,
  open,
  onToggle,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <h2 className="flex-1 font-logo text-xl font-bold text-primary">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-5 w-5 shrink-0 text-accent" />
          <span>
            <span className="block">{title}</span>
            <span className="block text-xs font-sans font-semibold text-foreground/60">
              {description}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
    </h2>
  );
}

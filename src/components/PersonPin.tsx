import { useState } from "react";
import { ThumbsUp, ThumbsDown, MapPin } from "lucide-react";
import type { Person } from "@/data/people";

interface PersonPinProps {
  person: Person;
  onClick: () => void;
  isSelected: boolean;
}

export default function PersonPin({ person, onClick, isSelected }: PersonPinProps) {
  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center group cursor-pointer z-10 hover:z-30"
      style={{ left: `${person.x}%`, top: `${person.y}%`, transform: "translate(-50%, -100%)" }}
    >
      <div
        className={`
          rounded-full border-2 w-10 h-10 flex items-center justify-center text-lg font-bold
          shadow-lg transition-all duration-300
          ${person.gender === "boy"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-secondary-foreground border-secondary"
          }
          ${isSelected ? "scale-125 ring-4 ring-accent" : "group-hover:scale-110"}
          animate-pulse-pin
        `}
      >
        {person.gender === "boy" ? "🧑" : "👩"}
      </div>
      <MapPin
        className={`w-4 h-4 -mt-1 ${person.gender === "boy" ? "text-primary" : "text-secondary"}`}
      />
      <span className="text-[10px] font-semibold bg-card/90 px-1.5 py-0.5 rounded shadow text-card-foreground whitespace-nowrap">
        {person.name.split(" ")[0]}
      </span>
    </button>
  );
}

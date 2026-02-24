import { ThumbsUp, ThumbsDown, X, MapPin, ExternalLink } from "lucide-react";

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    gender: string;
    area: string;
    quote: string;
    realVotes: number;
    fakeVotes: number;
    social_media_link?: string;
  };
  onClose: () => void;
  onVote: (id: string, type: "real" | "fake") => void;
}

export default function PersonCard({ person, onClose, onVote }: PersonCardProps) {
  const totalVotes = person.realVotes + person.fakeVotes;
  const realPercent = totalVotes > 0 ? Math.round((person.realVotes / totalVotes) * 100) : 50;

  return (
    <div className="animate-slide-up fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-[1100] w-[95vw] sm:w-[90vw] max-w-md">
      <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div
          className={`p-3 sm:p-4 flex items-center gap-2 sm:gap-3 ${
            person.gender === "boy"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <span className="text-2xl sm:text-3xl">{person.gender === "boy" ? "🧑" : "👩"}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate" style={{ fontFamily: "var(--font-display)" }}>
              {person.name}
            </h3>
            <p className="text-xs sm:text-sm opacity-90 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{person.area}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
          <p className="text-center text-sm sm:text-lg italic text-muted-foreground">"{person.quote}"</p>

          {person.social_media_link && (
            <a
              href={person.social_media_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs sm:text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Social Media Profile
            </a>
          )}

          {/* Loyalty bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>👍 {person.realVotes} Real</span>
              <span>👎 {person.fakeVotes} Fake</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${realPercent}%` }}
              />
              <div
                className="h-full bg-destructive transition-all duration-500"
                style={{ width: `${100 - realPercent}%` }}
              />
            </div>
            {totalVotes > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                {realPercent}% loyal · {totalVotes} total votes
              </p>
            )}
          </div>

          {/* Vote buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => onVote(person.id, "real")}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm sm:text-base hover:opacity-90 transition-opacity active:scale-95"
            >
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" /> Real!
            </button>
            <button
              onClick={() => onVote(person.id, "fake")}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm sm:text-base hover:opacity-90 transition-opacity active:scale-95"
            >
              <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" /> Fake!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

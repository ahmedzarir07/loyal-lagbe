import { ThumbsUp, ThumbsDown, X, MapPin } from "lucide-react";

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    gender: string;
    area: string;
    quote: string;
    realVotes: number;
    fakeVotes: number;
  };
  onClose: () => void;
  onVote: (id: string, type: "real" | "fake") => void;
}

export default function PersonCard({ person, onClose, onVote }: PersonCardProps) {
  return (
    <div className="animate-slide-up fixed bottom-4 left-1/2 -translate-x-1/2 z-[1100] w-[90vw] max-w-md">
      <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div
          className={`p-4 flex items-center gap-3 ${
            person.gender === "boy"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <span className="text-3xl">{person.gender === "boy" ? "🧑" : "👩"}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
              {person.name}
            </h3>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {person.area}, Dhaka
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-center text-lg italic text-muted-foreground">"{person.quote}"</p>

          <div className="flex justify-center gap-2 text-sm text-muted-foreground">
            <span>👍 {person.realVotes} say Real</span>
            <span>•</span>
            <span>👎 {person.fakeVotes} say Fake</span>
          </div>

          {/* Vote buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onVote(person.id, "real")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity active:scale-95"
            >
              <ThumbsUp className="w-5 h-5" /> Real Loyal!
            </button>
            <button
              onClick={() => onVote(person.id, "fake")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-base hover:opacity-90 transition-opacity active:scale-95"
            >
              <ThumbsDown className="w-5 h-5" /> Fake!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

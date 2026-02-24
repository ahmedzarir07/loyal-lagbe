import { X, Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface Person {
  id: string;
  name: string;
  gender: string;
  area: string;
  real_votes: number;
  fake_votes: number;
}

interface LeaderboardProps {
  people: Person[];
  open: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
}

export default function Leaderboard({ people, open, onClose, onSelect }: LeaderboardProps) {
  if (!open) return null;

  const sorted = [...people].sort((a, b) => {
    const scoreA = a.real_votes - a.fake_votes;
    const scoreB = b.real_votes - b.fake_votes;
    return scoreB - scoreA;
  });

  const top = sorted.slice(0, 20);

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-accent text-accent-foreground p-4 flex items-center justify-between sticky top-0">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Trophy className="w-5 h-5" /> Loyalty Leaderboard
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[calc(80vh-64px)]">
          {top.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No people added yet</p>
          ) : (
            top.map((person, i) => {
              const score = person.real_votes - person.fake_votes;
              const isPositive = score >= 0;
              return (
                <button
                  key={person.id}
                  onClick={() => { onSelect(person); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50 last:border-0"
                >
                  <span className={`text-lg font-bold w-8 text-center ${i < 3 ? "text-accent-foreground" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <span className="text-xl">{person.gender === "boy" ? "🧑" : "👩"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.area}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {score > 0 ? "+" : ""}{score}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

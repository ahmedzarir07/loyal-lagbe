import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="bg-card/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-border hover:bg-accent transition-colors active:scale-90"
        title="Search people"
      >
        <Search className="w-5 h-5 text-foreground" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md rounded-full shadow-lg border border-border px-3 py-1.5 animate-slide-up">
      <Search className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        autoFocus
        type="text"
        placeholder="Search name or area…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-28 sm:w-40"
      />
      <button onClick={handleClear} className="p-1 rounded-full hover:bg-muted transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

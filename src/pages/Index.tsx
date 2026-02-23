import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import dhakaMap from "@/assets/dhaka-map.jpg";
import { generatePeople, type Person } from "@/data/people";
import PersonPin from "@/components/PersonPin";
import PersonCard from "@/components/PersonCard";

const Index = () => {
  const [people, setPeople] = useState<Person[]>(() => generatePeople(12));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPerson = people.find((p) => p.id === selectedId) ?? null;

  const handleVote = useCallback((id: string, type: "real" | "fake") => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              realVotes: type === "real" ? p.realVotes + 1 : p.realVotes,
              fakeVotes: type === "fake" ? p.fakeVotes + 1 : p.fakeVotes,
            }
          : p
      )
    );
    setSelectedId(null);
  }, []);

  const refresh = () => {
    setSelectedId(null);
    setPeople(generatePeople(12));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 p-3 flex items-center justify-between">
        <div className="bg-card/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-border">
          <h1
            className="text-2xl md:text-3xl font-bold tracking-wider text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            🇧🇩 LOYAL FINDER DHAKA
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">
            Find the most loyal boys & girls in Dhaka city
          </p>
        </div>

        <button
          onClick={refresh}
          className="bg-card/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-border hover:bg-accent transition-colors active:scale-90"
          title="Shuffle People"
        >
          <RefreshCw className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Stats bar */}
      <div className="absolute top-20 left-3 z-40 flex gap-2">
        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
          🧑 {people.filter((p) => p.gender === "boy").length} Boys
        </span>
        <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
          👩 {people.filter((p) => p.gender === "girl").length} Girls
        </span>
      </div>

      {/* Map */}
      <div className="w-full h-full relative">
        <img
          src={dhakaMap}
          alt="Dhaka Map"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/10" />

        {/* People pins */}
        {people.map((person) => (
          <PersonPin
            key={person.id}
            person={person}
            isSelected={selectedId === person.id}
            onClick={() => setSelectedId(selectedId === person.id ? null : person.id)}
          />
        ))}
      </div>

      {/* Selected person card */}
      {selectedPerson && (
        <PersonCard
          person={selectedPerson}
          onClose={() => setSelectedId(null)}
          onVote={handleVote}
        />
      )}
    </div>
  );
};

export default Index;

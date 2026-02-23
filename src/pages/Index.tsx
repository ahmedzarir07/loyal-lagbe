import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Compass, Locate, Plus, Minus } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import PersonCard from "@/components/PersonCard";

const DHAKA_CENTER: [number, number] = [23.7644, 90.3893];
const DEFAULT_ZOOM = 13;

interface Person {
  id: string;
  name: string;
  gender: string;
  area: string;
  quote: string;
  lat: number;
  lng: number;
  real_votes: number;
  fake_votes: number;
}

const Index = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DHAKA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("people").select("*");
    if (data) setPeople(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // Update markers when people change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    people.forEach((person) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${person.gender === "boy" ? "#1a7a5a" : "#e0446d"};color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid ${person.gender === "boy" ? "#0f5c42" : "#b8325a"};box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;">
          ${person.gender === "boy" ? "🧑" : "👩"}
        </div>
        <div style="text-align:center;margin-top:2px;font-size:10px;font-weight:600;background:rgba(255,255,255,0.9);padding:1px 6px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.15);white-space:nowrap;">
          ${person.name.split(" ")[0]}
        </div>`,
        iconSize: [36, 50],
        iconAnchor: [18, 50]
      });

      const marker = L.marker([person.lat, person.lng], { icon }).addTo(map);
      marker.on("click", () => setSelectedPerson(person));
      markersRef.current.push(marker);
    });
  }, [people]);

  const handleVote = async (id: string, type: "real" | "fake") => {
    const person = people.find((p) => p.id === id);
    if (!person) return;

    const updates =
    type === "real" ?
    { real_votes: person.real_votes + 1 } :
    { fake_votes: person.fake_votes + 1 };

    await supabase.from("people").update(updates).eq("id", id);

    setPeople((prev) =>
    prev.map((p) => p.id === id ? { ...p, ...updates } : p)
    );
    setSelectedPerson(null);
  };

  const handleLocate = () => {
    const map = mapRef.current;
    if (!map) return;
    setLocating(true);

    map.locate({ setView: true, maxZoom: 16 });
    map.once("locationfound", (e) => {
      if (userMarkerRef.current) userMarkerRef.current.remove();

      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#3b82f6;border-radius:50%;width:16px;height:16px;border:3px solid white;box-shadow:0 0 0 2px #3b82f6, 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      userMarkerRef.current = L.marker(e.latlng, { icon }).addTo(map);
      setLocating(false);
    });
    map.once("locationerror", () => setLocating(false));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-3 left-3 right-16 z-[1000] pointer-events-none">
        <div className="inline-block bg-card/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-border pointer-events-auto">
          <h1
            className="text-2xl md:text-3xl font-bold tracking-wider text-primary"
            style={{ fontFamily: "var(--font-display)" }}>🇧🇩 LOYAL FINDER BANGLADESH


          </h1>
          <p className="text-xs text-muted-foreground -mt-1">Find the most loyal boys & girls in Bangladesh!

          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="absolute top-20 left-3 z-[1000] flex gap-2">
        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
          🧑 {people.filter((p) => p.gender === "boy").length} Boys
        </span>
        <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
          👩 {people.filter((p) => p.gender === "girl").length} Girls
        </span>
      </div>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={fetchPeople}
          className="bg-card/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-border hover:bg-accent transition-colors active:scale-90"
          title="Refresh">

          <RefreshCw className={`w-5 h-5 text-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90">

          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90">

          <Minus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => mapRef.current?.setView(DHAKA_CENTER, DEFAULT_ZOOM)}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
          title="Reset to Dhaka center">

          <Compass className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleLocate}
          className={`bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90 ${locating ? "animate-pulse" : ""}`}
          title="Find my location">

          <Locate className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Person card */}
      {selectedPerson &&
      <PersonCard
        person={{
          ...selectedPerson,
          realVotes: selectedPerson.real_votes,
          fakeVotes: selectedPerson.fake_votes
        }}
        onClose={() => setSelectedPerson(null)}
        onVote={handleVote} />

      }
    </div>);

};

export default Index;
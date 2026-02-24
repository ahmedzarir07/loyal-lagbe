import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Compass, Locate, Plus, Minus, UserPlus } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import PersonCard from "@/components/PersonCard";
import AddPersonDialog from "@/components/AddPersonDialog";

const BD_CENTER: [number, number] = [23.6850, 90.3563];
const DEFAULT_ZOOM = 8;

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
  social_media_link: string;
}

const Index = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pickingMode, setPickingMode] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BD_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      maxBounds: [[20.5, 87.5], [26.7, 92.7]],
      minZoom: 7,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle map click for location picking
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!pickingMode) return;
      setPickedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      setPickingMode(false);
      setAddDialogOpen(true);
    };

    map.on("click", handleClick);
    return () => { map.off("click", handleClick); };
  }, [pickingMode]);

  // Update cursor when picking
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    container.style.cursor = pickingMode ? "crosshair" : "";
  }, [pickingMode]);

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("people").select("*");
    if (data) setPeople(data as Person[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // Update markers when people change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    people.forEach((person) => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${person.gender === "boy" ? "hsl(160,60%,36%)" : "hsl(350,70%,55%)"};color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid ${person.gender === "boy" ? "hsl(160,60%,26%)" : "hsl(350,70%,45%)"};box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;">
          ${person.gender === "boy" ? "🧑" : "👩"}
        </div>
        <div style="text-align:center;margin-top:2px;font-size:10px;font-weight:600;background:rgba(255,255,255,0.9);padding:1px 6px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.15);white-space:nowrap;">
          ${person.name.split(" ")[0]}
        </div>`,
        iconSize: [36, 50],
        iconAnchor: [18, 50],
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
      type === "real"
        ? { real_votes: person.real_votes + 1 }
        : { fake_votes: person.fake_votes + 1 };

    await supabase.from("people").update(updates).eq("id", id);

    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    setSelectedPerson(null);
  };

  const handleLocate = () => {
    const map = mapRef.current;
    if (!map) return;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        map.setView(latlng, 16);

        // Remove old user marker/circle
        if (userMarkerRef.current) userMarkerRef.current.remove();
        if (userCircleRef.current) userCircleRef.current.remove();

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:#3b82f6;border-radius:50%;width:16px;height:16px;border:3px solid white;box-shadow:0 0 0 2px #3b82f6, 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        userMarkerRef.current = L.marker(latlng, { icon }).addTo(map);
        userCircleRef.current = L.circle(latlng, {
          radius: pos.coords.accuracy,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);

        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startAddPerson = () => {
    if (pickingMode) {
      setPickingMode(false);
      return;
    }
    setPickingMode(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute top-3 left-3 right-16 z-[1000] pointer-events-none">
        <div className="inline-block bg-card/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-border pointer-events-auto">
          <h1
            className="text-2xl md:text-3xl font-bold tracking-wider text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            🇧🇩 LOYAL FINDER BANGLADESH
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">
            Find the most loyal boys & girls in Bangladesh!
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

      {/* Picking mode banner */}
      {pickingMode && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[1000] bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
          📍 Tap on the map to pick a location
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={fetchPeople}
          className="bg-card/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-border hover:bg-accent transition-colors active:scale-90"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 text-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
        <button
          onClick={startAddPerson}
          className={`backdrop-blur-md rounded-full p-3 shadow-lg border border-border transition-colors active:scale-90 ${
            pickingMode
              ? "bg-accent text-accent-foreground"
              : "bg-card/90 hover:bg-accent"
          }`}
          title={pickingMode ? "Cancel" : "Add person"}
        >
          <UserPlus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
        >
          <Plus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
        >
          <Minus className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => mapRef.current?.setView(BD_CENTER, DEFAULT_ZOOM)}
          className="bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90"
          title="Reset to Bangladesh"
        >
          <Compass className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleLocate}
          className={`bg-card/90 backdrop-blur-md w-11 h-11 rounded-lg shadow-lg border border-border flex items-center justify-center hover:bg-accent transition-colors active:scale-90 ${locating ? "animate-pulse" : ""}`}
          title="Find my location"
        >
          <Locate className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Person card */}
      {selectedPerson && (
        <PersonCard
          person={{
            ...selectedPerson,
            realVotes: selectedPerson.real_votes,
            fakeVotes: selectedPerson.fake_votes,
          }}
          onClose={() => setSelectedPerson(null)}
          onVote={handleVote}
        />
      )}

      {/* Add person dialog */}
      <AddPersonDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdded={fetchPeople}
        pickedLocation={pickedLocation}
      />
    </div>
  );
};

export default Index;

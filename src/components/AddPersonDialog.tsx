import { useState } from "react";
import { X, MapPin, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddPersonDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  pickedLocation: { lat: number; lng: number } | null;
}

export default function AddPersonDialog({ open, onClose, onAdded, pickedLocation }: AddPersonDialogProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [area, setArea] = useState("");
  const [quote, setQuote] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !area || !quote || !pickedLocation) return;

    setSubmitting(true);
    await supabase.from("people").insert({
      name,
      gender,
      area,
      quote,
      social_media_link: socialMediaLink,
      lat: pickedLocation.lat,
      lng: pickedLocation.lng,
    });

    setName("");
    setGender("boy");
    setArea("");
    setQuote("");
    setSocialMediaLink("");
    setSubmitting(false);
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Plus className="w-5 h-5" /> Add Person
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Location indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-primary" />
            {pickedLocation ? (
              <span>Location: {pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)}</span>
            ) : (
              <span className="text-destructive">Tap on the map first to pick a location</span>
            )}
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Gender */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGender("boy")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                gender === "boy"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              🧑 Boy
            </button>
            <button
              type="button"
              onClick={() => setGender("girl")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                gender === "girl"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              👩 Girl
            </button>
          </div>

          {/* Area */}
          <input
            type="text"
            placeholder="Area (e.g. Dhanmondi, Sylhet)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Quote */}
          <input
            type="text"
            placeholder="Loyalty quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Social Media Link */}
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="url"
              placeholder="Social media link (Facebook, Instagram...)"
              value={socialMediaLink}
              onChange={(e) => setSocialMediaLink(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !pickedLocation || !name || !area || !quote}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add to Map 📍"}
          </button>
        </form>
      </div>
    </div>
  );
}

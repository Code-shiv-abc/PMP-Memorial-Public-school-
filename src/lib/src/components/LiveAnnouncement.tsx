import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { fetchFromSanity } from "../lib/sanity";
import { useLanguage } from "../context/LanguageContext";

interface AnnouncementData {
  _id: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
}

export function LiveAnnouncement() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Fetches the single newest published announcement
    const query = `*[_type in ["announcement", "notice", "post"] && !(_id in path("drafts.**"))] | order(_createdAt desc)[0]{
      _id,
      "title": coalesce(title, heading, name),
      "titleHi": titleHi,
      "message": coalesce(message, description, body),
      "messageHi": messageHi
    }`;

    fetchFromSanity<AnnouncementData>(query).then((data) => {
      if (data && data.title) {
        setAnnouncement(data);
      }
    });
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 text-foreground">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-serif font-bold text-primary">
              {isHi && announcement.titleHi ? announcement.titleHi : announcement.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {isHi && announcement.messageHi ? announcement.messageHi : announcement.message}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default LiveAnnouncement;

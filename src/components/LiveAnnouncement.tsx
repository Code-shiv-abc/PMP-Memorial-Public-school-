
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { fetchFromSanity } from "@/src/lib/sanity";
import { useLanguage } from "@/src/context/LanguageContext";

interface AnnouncementData {
  _id: string;
  title?: unknown;
  titleHi?: unknown;
  message?: unknown;
  messageHi?: unknown;
}

function toPlainString(val: unknown): string {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val
      .map((block) => {
        if (block && typeof block === "object" && "children" in block && Array.isArray(block.children)) {
          return block.children.map((c: { text?: string }) => c?.text || "").join("");
        }
        return "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

export function LiveAnnouncement() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [announcement, setAnnouncement] = useState<{
    title: string;
    titleHi: string;
    message: string;
    messageHi: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const query = `*[_type in ["announcement", "announcements", "notice", "post", "offer"] && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]{
      _id,
      "title": coalesce(title, heading, name),
      "titleHi": titleHi,
      "message": coalesce(message, description, content, body),
      "messageHi": messageHi
    }`;

    fetchFromSanity<AnnouncementData>(query).then((data) => {
      if (data) {
        const title = toPlainString(data.title);
        const titleHi = toPlainString(data.titleHi);
        const message = toPlainString(data.message);
        const messageHi = toPlainString(data.messageHi);

        if (title || titleHi || message) {
          setAnnouncement({ title, titleHi, message, messageHi });
        }
      }
    });
  }, []);

  if (!announcement || dismissed) return null;

  const displayTitle = isHi && announcement.titleHi ? announcement.titleHi : announcement.title;
  const displayMessage = isHi && announcement.messageHi ? announcement.messageHi : announcement.message;

  return (
    <section
      aria-label="Live Announcement"
      className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-4 py-3 text-foreground"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="min-w-0">
            {displayTitle && (
              <h2 className="text-sm font-serif font-bold text-primary">
                {displayTitle}
              </h2>
            )}
            {displayMessage && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {displayMessage}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default LiveAnnouncement;

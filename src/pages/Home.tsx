import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Monitor,
  Users,
  Sparkles,
  Phone,
  Bell,
  Calendar,
  BookOpen,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { fetchFromSanity } from "@/src/lib/sanity";
import { useLanguage } from "@/src/context/LanguageContext";
import { LiveAnnouncement } from "@/src/components/LiveAnnouncement";

interface SanityNotice {
  _id: string;
  title: string;
  titleHi?: string;
  category?: string;
  date?: string;
  description?: string;
}

function extractText(val: unknown): string {
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

export function Home() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [notices, setNotices] = useState<SanityNotice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    // Developer specified: Content type "Notice" powers the Homepage Bulletin
    const query = `*[_type in ["notice", "notices"] && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0...6]{
      _id,
      "title": coalesce(title, heading, name),
      titleHi,
      category,
      "date": coalesce(date, _createdAt),
      "description": coalesce(description, message, content, body)
    }`;

    fetchFromSanity<Array<Record<string, unknown>>>(query).then((data) => {
      if (Array.isArray(data)) {
        const parsed: SanityNotice[] = data
          .map((item, idx) => ({
            _id: String(item._id || `notice-${idx}`),
            title: extractText(item.title),
            titleHi: extractText(item.titleHi),
            category: typeof item.category === "string" ? item.category : "Notice",
            date: item.date ? new Date(String(item.date)).toLocaleDateString("en-IN") : undefined,
            description: extractText(item.description),
          }))
          .filter((n) => Boolean(n.title || n.description));
        setNotices(parsed);
      }
      setLoadingNotices(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Dynamic Sanity Announcement Banner (_type == "announcement") */}
      <LiveAnnouncement />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-gradient-to-b from-[#151821] via-background to-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-serif font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isHi
                  ? "उ.प्र. सरकार द्वारा मान्यता प्राप्त • शाहपुर, गोंडा"
                  : "UP Govt Recognized • Gram Shahpur, Post Rek Sadiya, Gonda"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight text-foreground leading-[1.1]">
              P.M.P. Memorial{" "}
              <span className="text-primary block sm:inline">Public School</span>
            </h1>

            <p className="text-lg sm:text-xl font-serif text-primary/90 font-semibold" lang="hi">
              “शिक्षार्थ आइये, सेवार्थ जाइये” — Playgroup to Class 12 (English &amp; Hindi Medium)
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {isHi
                ? "ग्राम-शाहपुर, पोस्ट-रेक सदिया, जनपद-गोंडा में स्थित हमारा विद्यालय कक्षा Playgroup से 8 तक (English Medium) एवं कक्षा 3 से 12 तक (Hindi Medium) उत्कृष्ट शिक्षा, निःशुल्क कंप्यूटर लैब एवं निःशुल्क कोचिंग प्रदान करता है।"
                : "Empowering students across Shahpur, Rek Sadiya, and District Gonda with English Medium (PG–Class 8) and UP Board Hindi Medium (Class 3–12) education, free computer literacy, free board coaching, and 24×7 Vidya AI tutoring."}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/admissions"
                className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <span>{isHi ? "प्रवेश आवेदन (Apply Now)" : "Apply for Admission"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/portal/study-assistant"
                className="px-6 py-3.5 rounded-xl bg-card border border-primary/40 text-primary hover:bg-primary/10 font-serif font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHi ? "विद्या AI ट्यूटर (Vidya AI)" : "Launch Vidya AI Tutor"}</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <div className="text-xs text-primary font-bold">100% Fee Waiver</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Girls Registration (Class 9 &amp; 11)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border">
                <div className="text-xs text-primary font-bold">Free Computer Lab</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Classes 3 to 12 Practical
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-border col-span-2 sm:col-span-1">
                <div className="text-xs text-primary font-bold">Free Coaching</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Board Prep (Classes 9 to 12)
                </div>
              </div>
            </div>
          </div>

          {/* 3. Dynamic Sanity Notice Bulletin Board (_type == "notice") */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-foreground">
                      {isHi ? "सूचना पटल (Notice Bulletin)" : "Official Notice Bulletin"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">
                      Live updates from Sanity CMS
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider">
                  Live
                </span>
              </div>

              {loadingNotices ? (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  Loading notices from Sanity CMS...
                </div>
              ) : notices.length === 0 ? (
                <div className="py-8 px-4 text-center border border-dashed border-border rounded-2xl space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {isHi
                      ? "वर्तमान में कोई नई सूचना प्रकाशित नहीं है।"
                      : "No active notices published in Sanity Studio yet."}
                  </p>
                  <Link
                    to="/admissions"
                    className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                  >
                    <span>View Admissions &amp; Scholarships</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="p-4 rounded-2xl bg-background border border-border hover:border-primary/40 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold uppercase tracking-wider">
                          {notice.category || "Notice"}
                        </span>
                        {notice.date && (
                          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-primary" />
                            {notice.date}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-serif font-bold text-foreground">
                        {isHi && notice.titleHi ? notice.titleHi : notice.title}
                      </h3>
                      {notice.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notice.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <Link to="/events" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                  <span>{isHi ? "सभी कार्यक्रम देखें" : "View All Events"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a href="tel:+919792954343" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>+91 97929 54343</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Institutional Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-2">
            Why Families Across Gonda Trust Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Modern Facilities &amp; Disciplined Academics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-md">
            <Monitor className="w-7 h-7 text-primary" />
            <h3 className="text-lg font-serif font-bold text-foreground">
              Free Computer Education
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practical computer lab sessions for every student from Class 3 to Class 12 at zero additional fee.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-md">
            <Award className="w-7 h-7 text-primary" />
            <h3 className="text-lg font-serif font-bold text-foreground">
              Free Board Coaching
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated afternoon board exam preparation for Classes 9 to 12 led by qualified school faculty.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-md">
            <Users className="w-7 h-7 text-primary" />
            <h3 className="text-lg font-serif font-bold text-foreground">
              100% Girls Fee Waiver
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete 100% registration fee waiver for girl students taking admission in Class 9 and Class 11.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-md">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <h3 className="text-lg font-serif font-bold text-foreground">
              CCTV Security &amp; Transport
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              24×7 CCTV monitored classrooms, monthly progress tests, and safe vehicle facility for surrounding villages.
            </p>
          </div>
        </div>

        {/* Leadership Strip */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-primary block">
              Founder &amp; Manager (संस्थापक एवं प्रबंधक)
            </span>
            <h3 className="text-base font-serif font-bold text-foreground mt-1">
              Shri Arvind Kumar Tiwari
            </h3>
            <p className="text-xs text-muted-foreground">M.A., B.Ed., NET</p>
            <a href="tel:+917651995858" className="text-xs text-primary hover:underline mt-1 inline-block">
              +91 76519 95858
            </a>
          </div>

          <div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-primary block">
              Principal (प्रधानाचार्य)
            </span>
            <h3 className="text-base font-serif font-bold text-foreground mt-1">
              Shri A.K. Tripathi
            </h3>
            <p className="text-xs text-muted-foreground">M.A., B.Ed., TET, CTET</p>
            <a href="tel:+916394282229" className="text-xs text-primary hover:underline mt-1 inline-block">
              +91 63942 82229
            </a>
          </div>

          <div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-primary block">
              President (अध्यक्ष)
            </span>
            <h3 className="text-base font-serif font-bold text-foreground mt-1">
              Shri Sanjay Kumar Tiwari
            </h3>
            <p className="text-xs text-muted-foreground">M.A., B.Ed., BTC, TET</p>
            <a href="tel:+919792954343" className="text-xs text-primary hover:underline mt-1 inline-block">
              +91 97929 54343
            </a>
          </div>

          <div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-primary block">
              Coordinator (समन्वयक)
            </span>
            <h3 className="text-base font-serif font-bold text-foreground mt-1">
              Sunil Kumar Tiwari
            </h3>
            <p className="text-xs text-muted-foreground">Academic &amp; Transport</p>
            <a href="tel:+919792954343" className="text-xs text-primary hover:underline mt-1 inline-block">
              +91 97929 54343
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

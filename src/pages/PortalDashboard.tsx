import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  Phone,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { StudentDashboard } from "./StudentDashboard";
import { useLanguage } from "../context/LanguageContext";

type PortalRole = "student" | "parent" | "teacher" | "admin";

export function PortalDashboard() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeRole, setActiveRole] = useState<PortalRole>("student");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium text-foreground">
            {isHi ? "पोर्टल दृश्य चुनें (Portal View):" : "Active Portal View:"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveRole("student")}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === "student"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isHi ? "विद्यार्थी (Student)" : "Student View"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("parent")}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === "parent"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isHi ? "अभिभावक (Parent)" : "Parent View"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("teacher")}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === "teacher"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHi ? "शिक्षक (Faculty)" : "Faculty View"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRole === "admin"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHi ? "प्रबंधन (Admin)" : "Management"}</span>
          </button>
        </div>
      </div>

      {activeRole === "student" && <StudentDashboard />}

      {activeRole === "parent" && (
        <div className="space-y-6">
          <div className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-1">
              {isHi ? "अभिभावक सूचना पटल" : "Parent & Guardian Portal"}
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              {isHi
                ? "अपने बच्चे की प्रगति एवं उपस्थिति देखें"
                : "Ward Attendance, Monthly Test Report & School Connect"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {isHi
                ? "पी. एम. पी. मेमोरियल पब्लिक स्कूल में प्रत्येक माह मासिक परीक्षा (Monthly Test) आयोजित की जाती है।"
                : "P.M.P. Memorial Public School conducts structured monthly evaluations and maintains direct communication with every family."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-5 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{isHi ? "मासिक उपस्थिति" : "Ward Attendance"}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif font-bold text-foreground">94% (Regular)</div>
                <p className="text-xs text-emerald-400 mt-1">CCTV Monitored Safe Campus</p>
              </div>

              <div className="p-5 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{isHi ? "मासिक परीक्षा परिणाम" : "Latest Monthly Test"}</span>
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl font-serif font-bold text-foreground">88% (Grade A)</div>
                <p className="text-xs text-muted-foreground mt-1">Free Coaching Batch Included</p>
              </div>

              <div className="p-5 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{isHi ? "आगामी पीटीएम (PTM)" : "Next Parent-Teacher Meet"}</span>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="text-lg font-serif font-bold text-foreground">Last Saturday of Month</div>
                <p className="text-xs text-primary mt-1">09:00 AM – 01:00 PM at Campus</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
              <a
                href="tel:+919792954343"
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-serif font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Coordinator: 9792954343</span>
              </a>
              <a
                href="https://wa.me/919792954343"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-serif font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp School Office</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeRole === "teacher" && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-1">
              Faculty Academic Console
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              UP Board &amp; NCERT Class Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Coordinate monthly test series, free afternoon board coaching (Classes 9–12), and computer practical sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-background border border-border space-y-2">
              <h3 className="text-base font-serif font-bold text-foreground">
                English Medium Wing (PG – Class 8)
              </h3>
              <p className="text-xs text-muted-foreground">
                Spoken English, foundational numeracy, activity-based learning, and computer lab starting Class 3.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border space-y-2">
              <h3 className="text-base font-serif font-bold text-foreground">
                High School &amp; Intermediate (Classes 9 – 12)
              </h3>
              <p className="text-xs text-muted-foreground">
                UP Board NCERT syllabus completion, monthly test evaluations, and free board exam coaching batches.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border space-y-2">
              <h3 className="text-base font-serif font-bold text-foreground">
                Vidya AI Lesson Support
              </h3>
              <p className="text-xs text-muted-foreground">
                Generate bilingual Hindi/English practice quizzes, step-by-step math solutions, and revision notes.
              </p>
              <Link
                to="/portal/study-assistant"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline pt-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Vidya AI Tutor</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeRole === "admin" && (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-1">
              School Administration • शाहपुर, गोंडा
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              P.M.P. Memorial Leadership &amp; Admissions Overview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Admissions for Session 2026–27 (Playgroup to Class 12) are active with 100% registration fee waiver for girls in Classes 9 &amp; 11.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-background border border-border">
              <div className="text-xs text-muted-foreground">Founder &amp; Manager (संस्थापक एवं प्रबंधक)</div>
              <div className="text-base font-serif font-bold text-foreground mt-1">
                Shri Arvind Kumar Tiwari
              </div>
              <a href="tel:+917651995858" className="text-xs text-primary hover:underline block mt-1">
                +91 76519 95858
              </a>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border">
              <div className="text-xs text-muted-foreground">Principal (प्रधानाचार्य)</div>
              <div className="text-base font-serif font-bold text-foreground mt-1">
                Shri A.K. Tripathi
              </div>
              <a href="tel:+916394282229" className="text-xs text-primary hover:underline block mt-1">
                +91 63942 82229
              </a>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border">
              <div className="text-xs text-muted-foreground">President (अध्यक्ष)</div>
              <div className="text-base font-serif font-bold text-foreground mt-1">
                Shri Sanjay Kumar Tiwari
              </div>
              <a href="tel:+919792954343" className="text-xs text-primary hover:underline block mt-1">
                +91 97929 54343
              </a>
            </div>
            <div className="p-5 rounded-xl bg-background border border-border">
              <div className="text-xs text-muted-foreground">Coordinator (समन्वयक)</div>
              <div className="text-base font-serif font-bold text-foreground mt-1">
                Sunil Kumar Tiwari
              </div>
              <a href="tel:+919792954343" className="text-xs text-primary hover:underline block mt-1">
                +91 97929 54343
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortalDashboard;

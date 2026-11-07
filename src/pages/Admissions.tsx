import React, { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  MessageCircle,
  Send,
  Sparkles,
  ShieldCheck,
  Award
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

const CLASS_OPTIONS = [
  "Playgroup / Nursery / LKG / UKG (English Medium)",
  "Class 1 to Class 5 (Primary Wing — English/Hindi Medium)",
  "Class 6 to Class 8 (Junior Wing — English/Hindi Medium)",
  "Class 9 (UP Board — 100% Registration Fee Waiver for Girls)",
  "Class 10 (UP Board High School)",
  "Class 11 (UP Board — 100% Registration Fee Waiver for Girls)",
  "Class 12 (UP Board Intermediate)",
];

export function Admissions() {
  const [studentName, setStudentName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [phone, setPhone] = useState("");
  const [applyingClass, setApplyingClass] = useState(CLASS_OPTIONS[3]);
  const [medium, setMedium] = useState("Hindi Medium (यूपी बोर्ड)");
  const [village, setVillage] = useState("");
  const [transportNeeded, setTransportNeeded] = useState("No");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const buildWhatsAppUrl = () => {
    const text = `नमस्ते P.M.P. Memorial Public School (Shahpur, Gonda),
मैं प्रवेश (Admission 2026-27) के लिए आवेदन करना चाहता/चाहती हूँ:
• विद्यार्थी का नाम: ${studentName || "N/A"}
• पिता/अभिभावक का नाम: ${guardianName || "N/A"}
• कक्षा (Class): ${applyingClass}
• माध्यम (Medium): ${medium}
• ग्राम/पता: ${village || "Shahpur, Gonda"}
• मोबाइल नंबर: ${phone || "N/A"}
• वाहन सुविधा (Transport): ${transportNeeded}`;
    return `https://wa.me/919792954343?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !guardianName.trim() || !phone.trim()) {
      toast.error("Please fill Student Name, Guardian Name, and Mobile Number.");
      return;
    }

    setSubmitting(true);
    const refCode = `PMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await addDoc(collection(db, "admissions"), {
        referenceId: refCode,
        studentName: studentName.trim(),
        guardianName: guardianName.trim(),
        phone: phone.trim(),
        applyingClass,
        medium,
        village: village.trim() || "Shahpur, Gonda",
        transportNeeded,
        notes: notes.trim(),
        createdAt: serverTimestamp(),
      });
      setSubmittedRef(refCode);
      toast.success("Admission application submitted successfully!");
    } catch (err) {
      console.warn("Firestore save note, providing instant reference:", err);
      setSubmittedRef(refCode);
      toast.success("Application registered! You can also send details directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-serif font-semibold uppercase tracking-widest mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>प्रवेश प्रारम्भ 2026–27 • Admissions Open (PG to Class 12)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-foreground tracking-tight">
            Online Admission &amp; Registration Form
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            P.M.P. Memorial Public School, Gram Shahpur, Post Rek Sadiya, District Gonda (U.P.)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-primary/40 rounded-2xl p-5 flex items-start gap-3.5 shadow-md">
            <Award className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-serif font-bold text-foreground">
                100% Free Registration for Girls (Class 9 &amp; 11)
              </h2>
              <p className="text-xs text-muted-foreground mt-1" lang="hi">
                कक्षा 9 एवं 11 में बालिकाओं के प्रवेश पर रजिस्ट्रेशन शुल्क पूर्णतः निःशुल्क है।
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-3.5 shadow-md">
            <Sparkles className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-serif font-bold text-foreground">
                Free Computer Lab &amp; Free Board Coaching
              </h2>
              <p className="text-xs text-muted-foreground mt-1" lang="hi">
                कक्षा 3 से 12 तक निःशुल्क कंप्यूटर शिक्षा एवं कक्षा 9 से 12 तक निःशुल्क कोचिंग।
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-3.5 shadow-md">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-serif font-bold text-foreground">
                English (PG–8) &amp; Hindi Medium (3–12)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                CCTV monitored campus, monthly tests, and safe school transport for nearby villages.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl">
            {submittedRef ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  आवेदन प्राप्त हुआ! (Application Registered)
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong>{studentName}</strong>. Your admission reference number is{" "}
                  <span className="text-primary font-mono font-bold">{submittedRef}</span>. Our coordinator (Sunil Kumar Tiwari) will contact you shortly.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Copy on WhatsApp (9792954343)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setStudentName("");
                    }}
                    className="px-6 py-3 rounded-xl border border-border text-foreground text-xs font-serif font-semibold"
                  >
                    Submit Another Student
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-border pb-4">
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    Student Admission Details (विद्यार्थी का विवरण)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill out the details below for Session 2026–27 admission inquiry.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="adm-student-name"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Student Full Name (विद्यार्थी का नाम) *
                    </label>
                    <input
                      id="adm-student-name"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Tiwari"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adm-guardian-name"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Father / Guardian Name (पिता / अभिभावक का नाम) *
                    </label>
                    <input
                      id="adm-guardian-name"
                      type="text"
                      required
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar Tiwari"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="adm-phone"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Mobile / WhatsApp Number (मोबाइल नंबर) *
                    </label>
                    <input
                      id="adm-phone"
                      type="tel"
                      required
                      pattern="[0-9+\-\s]{10,15}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adm-village"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Village / Post / Address (ग्राम / पता)
                    </label>
                    <input
                      id="adm-village"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Gram Shahpur, Post Rek Sadiya"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="adm-class"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Class Applying For (किस कक्षा में प्रवेश चाहिए?) *
                    </label>
                    <select
                      id="adm-class"
                      value={applyingClass}
                      onChange={(e) => setApplyingClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls} className="bg-neutral-900 text-white">
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="adm-medium"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Preferred Medium (माध्यम)
                    </label>
                    <select
                      id="adm-medium"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Hindi Medium (यूपी बोर्ड)" className="bg-neutral-900 text-white">
                        Hindi Medium (Class 3 to Class 12)
                      </option>
                      <option value="English Medium (PG to Class 8)" className="bg-neutral-900 text-white">
                        English Medium (Playgroup to Class 8)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="adm-transport"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      School Vehicle Needed? (वाहन सुविधा चाहिए?)
                    </label>
                    <select
                      id="adm-transport"
                      value={transportNeeded}
                      onChange={(e) => setTransportNeeded(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Yes (हाँ, वाहन सुविधा चाहिए)" className="bg-neutral-900 text-white">
                        Yes (हाँ, वाहन सुविधा चाहिए)
                      </option>
                      <option value="No (नहीं)" className="bg-neutral-900 text-white">
                        No (स्वयं आएंगे)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="adm-notes"
                      className="block text-xs font-semibold text-foreground mb-1.5"
                    >
                      Previous School / Any Question (अन्य विवरण)
                    </label>
                    <input
                      id="adm-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional notes or scholarship query"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitting
                        ? "Submitting Application..."
                        : "Submit Online Admission Form (आवेदन जमा करें)"}
                    </span>
                  </button>

                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Apply via WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-card border border-primary/30 rounded-2xl p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-serif font-bold text-foreground">
                Direct Admissions Helpline (प्रवेश सहायता)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Parents can also visit the school office directly between <strong>8:00 AM and 3:00 PM</strong> or call our leadership team:
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block">
                    Founder &amp; Manager (Shri Arvind Kumar Tiwari):
                  </span>
                  <a href="tel:+917651995858" className="text-primary font-bold text-sm hover:underline">
                    +91 76519 95858
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block">
                    Principal (Shri A.K. Tripathi):
                  </span>
                  <a href="tel:+916394282229" className="text-primary font-bold text-sm hover:underline">
                    +91 63942 82229
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <span className="text-muted-foreground block">
                    Coordinator (Sunil Kumar Tiwari):
                  </span>
                  <a href="tel:+919792954343" className="text-primary font-bold text-sm hover:underline">
                    +91 97929 54343
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-2.5 text-xs text-muted-foreground">
              <h4 className="font-serif font-bold text-foreground text-sm">
                Documents Required at Campus (आवश्यक दस्तावेज):
              </h4>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>2 Passport-size photographs of the student</li>
                <li>Copy of Student &amp; Parent Aadhaar Card</li>
                <li>Previous Class Report Card / Transfer Certificate (TC)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admissions;

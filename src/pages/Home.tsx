import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Shield, Award, Sparkles, Phone, CheckCircle2, GraduationCap, Monitor } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="bg-background text-foreground">
      {/* 1. Hero Section — Responsive typography for 320px–1920px screens */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-border py-16">
        <div className="absolute inset-0 z-0 bg-[#0F1115]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#0F1115]/90 to-[#0F1115]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="inline-block py-1 px-3 border border-primary/40 bg-primary/10 text-primary text-xs tracking-[0.2em] uppercase mb-6 font-medium"
                lang="hi"
              >
                उ.प्र. सरकार द्वारा मान्यता प्राप्त • शाहपुर, गोंडा
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-serif text-foreground leading-[1.08] tracking-tight mb-4">
                P.M.P. Memorial <br />
                <span className="italic font-light text-primary">Public School.</span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif text-primary/90 mb-4" lang="hi">
                पी. एम. पी. मेमोरियल पब्लिक स्कूल, शाहपुर - गोंडा
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-8"
            >
              <span className="text-foreground font-medium" lang="hi">
                “क्षेत्र का सबसे विश्वसनीय शिक्षा का केन्द्र”
              </span>{" "}
              — Offering quality education in{" "}
              <strong className="text-foreground">English Medium (Playgroup to Class 8)</strong> and{" "}
              <strong className="text-foreground">Hindi Medium (Class 3 to Class 12)</strong> with free computer education and board exam coaching.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                to="/admissions"
                className="px-7 py-4 bg-primary text-primary-foreground font-serif font-semibold text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center gap-3 group"
              >
                <span>प्रवेश प्रारम्भ — Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-7 py-4 border border-border text-foreground font-serif font-semibold text-xs uppercase tracking-[0.2em] hover:bg-secondary transition-all"
              >
                हमारे बारे में — About Us
              </Link>
              <a
                href="tel:+919792954343"
                className="px-5 py-4 border border-primary/40 text-primary font-serif font-semibold text-xs uppercase tracking-[0.15em] hover:bg-primary/10 transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call: 9792954343</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Key Institutional Metrics Bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="py-8 md:px-6 first:pl-0">
              <p className="text-primary text-xs font-serif font-semibold uppercase tracking-widest mb-2">
                Parent Trust
              </p>
              <div className="text-4xl lg:text-5xl font-serif text-foreground mb-1">98%</div>
              <p className="text-xs text-muted-foreground">Parent satisfaction across Shahpur &amp; Gonda</p>
            </div>
            <div className="py-8 md:px-6">
              <p className="text-primary text-xs font-serif font-semibold uppercase tracking-widest mb-2">
                Hindi Medium (UP Board)
              </p>
              <div className="text-4xl lg:text-5xl font-serif text-foreground mb-1">Class 3–12</div>
              <p className="text-xs text-muted-foreground">Complete Primary, High School &amp; Intermediate</p>
            </div>
            <div className="py-8 md:px-6">
              <p className="text-primary text-xs font-serif font-semibold uppercase tracking-widest mb-2">
                English Medium
              </p>
              <div className="text-4xl lg:text-5xl font-serif text-foreground mb-1">PG – Class 8</div>
              <p className="text-xs text-muted-foreground">Playgroup, Nursery, LKG, UKG to Class 8</p>
            </div>
            <div className="py-8 md:px-6 last:pr-0">
              <p className="text-primary text-xs font-serif font-semibold uppercase tracking-widest mb-2">
                Computer &amp; Coaching
              </p>
              <div className="text-4xl lg:text-5xl font-serif text-foreground mb-1">100% Free</div>
              <p className="text-xs text-muted-foreground">Free Computer Lab (3–12) &amp; Coaching (9–12)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Academic Pillars & Campus Highlights (Replaces "School photo coming soon" placeholder) */}
      <section className="py-20 lg:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="text-primary text-xs font-serif font-semibold uppercase tracking-[0.2em] block mb-4">
                विशेष सुविधाएं • Our Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground leading-tight mb-6">
                Modern Education Rooted in Indian Values.
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">
                P.M.P. Memorial Public School is recognized by the Uttar Pradesh Government (उ.प्र. सरकार द्वारा मान्यता प्राप्त). Under the guidance of TET, CTET, and NET qualified educators, we ensure every child receives personal attention and modern digital skills.
              </p>

              {/* Verified Campus Highlights Card (Replaces broken empty placeholder box) */}
              <div className="p-6 rounded-2xl bg-card border border-primary/30 space-y-4 mb-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-foreground" lang="hi">
                      शिक्षार्थ आइये, सेवार्थ जाइये
                    </h3>
                    <p className="text-xs text-muted-foreground">Shahpur, Rek Sadiya, District Gonda (UP)</p>
                  </div>
                  <GraduationCap className="w-7 h-7 text-primary shrink-0" />
                </div>
                <ul className="space-y-2.5 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Girls Fee Waiver:</strong> 100% Free Registration for girls in Class 9 &amp; 11</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Vidya AI Tutor:</strong> 24×7 Bilingual NCERT &amp; UP Board AI Study Assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>Safe Transport:</strong> Dedicated school vehicle facility for nearby villages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>CCTV Campus:</strong> Full CCTV surveillance with electricity &amp; pure water</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-card border border-border rounded-xl">
                <p className="text-sm font-serif text-primary italic mb-2" lang="sa">
                  “उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।”
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed" lang="hi">
                  परिश्रम से ही सभी कार्य सफल होते हैं, केवल इच्छा करने से नहीं।
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <div className="group border-b border-border pb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-primary">01 / FREE ACADEMIC COACHING &amp; GIRLS SCHOLARSHIP</span>
                  <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                  Free Coaching (Class 9–12) &amp; Girls Fee Waiver
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  We provide completely free coaching classes for Class 9 to 12 students so families do not have to pay for private tuition. Furthermore, registration fees are <strong>100% waived for girls</strong> taking admission in Class 9 and Class 11.
                </p>
                <Link to="/admissions" className="inline-flex items-center gap-2 text-xs text-primary font-serif uppercase tracking-widest hover:underline">
                  <span>Register for Class 9–12 Admission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="group border-b border-border pb-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-primary">02 / DIGITAL &amp; AI-ENABLED LEARNING</span>
                  <Monitor className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                  Free Computer Education (Class 3–12) &amp; Vidya AI
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Every student from Class 3 to Class 12 receives hands-on computer education at zero extra cost. Students also get access to <strong>Vidya AI</strong>, our bilingual Hindi/English study assistant tailored for UP Board and NCERT chapters.
                </p>
                <Link to="/portal/study-assistant" className="inline-flex items-center gap-2 text-xs text-primary font-serif uppercase tracking-widest hover:underline">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try Vidya AI Study Tutor</span>
                </Link>
              </div>

              <div className="group pb-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-primary">03 / EXPERIENCED LEADERSHIP &amp; SAFE CAMPUS</span>
                  <Shield className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                  Qualified Educators (M.A., B.Ed., TET, CTET, NET)
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Founded by Shri A.K. Tripathi (M.A., B.Ed., TET, CTET) and managed by Shri Arvind Kumar Tiwari (M.A., B.Ed., NET), our faculty conducts monthly evaluations, science/math fairs, and sports competitions in a fully CCTV-monitored environment.
                </p>
                <Link to="/faculty" className="inline-flex items-center gap-2 text-xs text-primary font-serif uppercase tracking-widest hover:underline">
                  <Award className="w-3.5 h-3.5" />
                  <span>Meet Our Leadership &amp; Faculty</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Official Notice Board & Academic Calendar */}
      <section className="py-20 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-primary text-xs font-serif font-semibold uppercase tracking-[0.2em] block mb-3">
                सूचना पट्ट • School Notice Board
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-foreground">
                Important Announcements &amp; Dates
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-serif font-semibold uppercase tracking-widest text-primary hover:text-foreground transition-colors flex items-center gap-2"
            >
              <span>View Academic Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                date: "FROM 01 APRIL",
                category: "ADMISSIONS 2026–27",
                title: "Admissions Open for Playgroup to Class 8 (English Medium) & Class 3 to 12 (Hindi Medium)",
                link: "/admissions"
              },
              {
                date: "SCHOLARSHIP SCHEME",
                category: "GIRLS EDUCATION INITIATIVE",
                title: "100% Registration Fee Waiver for All Girls Enrolling in Class 9 & Class 11",
                link: "/admissions"
              },
              {
                date: "ACADEMIC SUPPORT",
                category: "FREE COMPUTER & COACHING",
                title: "Free Daily Coaching for Classes 9–12 & Free Computer Practical Classes for Classes 3–12",
                link: "/academics"
              }
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="group p-6 bg-background border border-border hover:border-primary/50 rounded-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-primary">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-serif text-foreground group-hover:text-primary transition-colors leading-snug mb-4">
                    {item.title}
                  </h3>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-primary font-serif uppercase tracking-wider pt-2">
                  <span>{isHi ? "अधिक जानकारी" : "Learn More"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

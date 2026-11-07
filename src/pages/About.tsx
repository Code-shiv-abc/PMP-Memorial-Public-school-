import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Monitor,
  Users,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const LEADERSHIP_PILLARS = [
  {
    role: "Founder & Manager (संस्थापक एवं प्रबंधक)",
    name: "Shri Arvind Kumar Tiwari",
    hindiName: "श्री अरविन्द कुमार तिवारी",
    qualifications: "M.A., B.Ed., NET",
    phone: "7651995858",
  },
  {
    role: "Principal (प्रधानाचार्य)",
    name: "Shri A.K. Tripathi",
    hindiName: "श्री ए. के. त्रिपाठी",
    qualifications: "M.A., B.Ed., TET, CTET",
    phone: "6394282229",
  },
  {
    role: "President (अध्यक्ष)",
    name: "Shri Sanjay Kumar Tiwari",
    hindiName: "श्री संजय कुमार तिवारी",
    qualifications: "M.A., B.Ed., BTC, TET",
    phone: "9792954343",
  },
  {
    role: "Coordinator (समन्वयक)",
    name: "Sunil Kumar Tiwari",
    hindiName: "सुनील कुमार तिवारी",
    qualifications: "Academic & Transport Coordination",
    phone: "9792954343",
  },
];

export function About() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 border border-primary/40 bg-primary/10 text-primary text-xs tracking-[0.2em] uppercase mb-4 font-medium">
            हमारे विद्यालय के बारे में • UP Govt Recognized Institution
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-foreground sm:text-5xl tracking-tight">
            P.M.P. Memorial Public School
          </h1>
          <p className="mt-3 text-lg text-primary font-serif font-semibold" lang="hi">
            ग्राम-शाहपुर, पोस्ट-रेक सदिया, जनपद-गोंडा (उ.प्र.) • “शिक्षार्थ आइये, सेवार्थ जाइये”
          </p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Recognized by the Uttar Pradesh Government (उ.प्र. सरकार द्वारा मान्यता प्राप्त), P.M.P. Memorial Public School is dedicated to delivering modern, disciplined, and affordable education from <strong>Playgroup to Class 12</strong> for families across Shahpur, Rek Sadiya, and District Gonda.
          </p>
        </div>

        {/* Core Mission & Special Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Free Computer Lab (Classes 3–12)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every student from Class 3 to Class 12 receives hands-on practical computer education at 100% zero additional cost.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Free Coaching (Classes 9–12)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated board exam preparation and doubt-clearing coaching classes for Classes 9 to 12 provided completely free by school faculty.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Girls Fee Waiver (Classes 9 &amp; 11)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under our Balika Shiksha initiative, girl students taking admission in Class 9 and Class 11 receive a 100% registration fee waiver.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              CCTV Safety &amp; Transport
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              24×7 CCTV camera surveillance across classrooms, clean RO drinking water, lush playground, and safe vehicle transport for nearby villages.
            </p>
          </div>
        </div>

        {/* Dual-Medium Academic Structure */}
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-mono uppercase tracking-widest text-primary block">
              ACADEMIC WINGS • शिक्षण व्यवस्था
            </span>
            <h2 className="text-3xl font-serif font-bold text-foreground">
              English Medium (PG–Class 8) &amp; Hindi Medium (Class 3–12)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We combine traditional Indian moral values (<span lang="hi">संस्कार एवं अनुशासन</span>) with modern NCERT pedagogy and our 24×7 bilingual <strong>Vidya AI Study Assistant</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Playgroup, Nursery, LKG, UKG to Class 8 (English Medium)",
                "Class 3 to Class 12 UP Board (Hindi Medium)",
                "Monthly Test Series & Parent Progress Reports",
                "Science, Mathematics & Art Exhibitions",
                "Qualified M.A., B.Ed., NET, CTET & TET Faculty",
                "Safe School Vehicle Facility Available",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-background border border-primary/30 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-primary font-serif font-bold text-base">
              <MapPin className="w-5 h-5" />
              <span>Campus Location &amp; Visiting Hours</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              P.M.P. Memorial Public School
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gram Shahpur, Post Rek Sadiya, District Gonda, Uttar Pradesh — 271504
              <br />
              Office Hours: Monday to Saturday (08:00 AM – 03:00 PM)
            </p>
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <Link
                to="/admissions"
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/portal/study-assistant"
                className="flex-1 py-3 px-4 rounded-xl border border-primary/40 text-primary hover:bg-primary/10 font-serif font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Vidya AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* School Leadership Directory */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Institutional Leadership (विद्यालय प्रबंधन एवं प्रशासन)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Directly accessible leadership committed to every child&apos;s academic and moral growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_PILLARS.map((leader) => (
              <div
                key={leader.name}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-primary/15 text-primary text-[11px] font-serif font-semibold mb-3">
                    {leader.role}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-primary mt-0.5" lang="hi">
                    {leader.hindiName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {leader.qualifications}
                  </p>
                </div>

                <a
                  href={`tel:+91${leader.phone}`}
                  className="w-full py-2 px-3 rounded-xl bg-background hover:bg-primary hover:text-primary-foreground border border-primary/30 text-primary text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 {leader.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

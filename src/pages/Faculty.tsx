import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, BookOpen, GraduationCap, MessageCircle } from "lucide-react";

const FACULTY_MEMBERS = [
  {
    id: 1,
    name: "Shri Arvind Kumar Tiwari",
    hindiName: "श्री अरविन्द कुमार तिवारी",
    initials: "AKT",
    title: "Founder & Manager (संस्थापक एवं प्रबंधक)",
    department: "Institutional Vision & Management",
    qualifications: "M.A., B.Ed., NET",
    expertise: ["Educational Leadership", "Institutional Management", "Student Welfare"],
    bio: "Visionary Founder and Manager of P.M.P. Memorial Public School, dedicated to modernizing rural education with free computer literacy, CCTV campus safety, and 100% registration fee waivers for girls in Classes 9 and 11.",
    phone: "7651995858",
  },
  {
    id: 2,
    name: "Shri A.K. Tripathi",
    hindiName: "श्री ए. के. त्रिपाठी",
    initials: "AT",
    title: "Principal (प्रधानाचार्य)",
    department: "Academic Administration & Pedagogy",
    qualifications: "M.A., B.Ed., TET, CTET",
    expertise: ["Academic Excellence", "Curriculum Planning", "Board Exam Preparation"],
    bio: "Leading academic standards, disciplined classroom pedagogy, and monthly student evaluations across English Medium (PG–Class 8) and Hindi Medium (Class 3–12) wings.",
    phone: "6394282229",
  },
  {
    id: 3,
    name: "Shri Sanjay Kumar Tiwari",
    hindiName: "श्री संजय कुमार तिवारी",
    initials: "SKT",
    title: "President (अध्यक्ष)",
    department: "Governance & Community Relations",
    qualifications: "M.A., B.Ed., BTC, TET",
    expertise: ["Institutional Governance", "Primary & Junior Education", "Community Outreach"],
    bio: "Guiding the institution's holistic development programs, moral education standards, and cultural and sports initiatives across Gonda.",
    phone: "9792954343",
  },
  {
    id: 4,
    name: "Sunil Kumar Tiwari",
    hindiName: "सुनील कुमार तिवारी",
    initials: "ST",
    title: "Coordinator (समन्वयक)",
    department: "Admissions & Student Coordination",
    qualifications: "Academic & Campus Coordinator",
    expertise: ["Student Support", "Admissions Guidance", "Daily Operations"],
    bio: "Coordinating daily academic schedules, parent communication, transport management, and smooth admission assistance for families across the region.",
    phone: "9792954343",
  },
];

export function Faculty() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 border border-primary/40 bg-primary/10 text-primary text-xs tracking-[0.2em] uppercase mb-4 font-medium">
            मार्गदर्शक एवं शिक्षक वृन्द • Leadership &amp; Faculty
          </span>
          <h1 className="text-4xl font-serif font-extrabold text-foreground sm:text-5xl tracking-tight">
            Distinguished Leadership &amp; Educators
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Our institution is led by highly qualified educators holding <strong>M.A., B.Ed., NET, CTET, TET, and BTC</strong> certifications—dedicated to nurturing academic excellence and discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FACULTY_MEMBERS.map((faculty) => (
            <Card
              key={faculty.id}
              className="overflow-hidden hover:border-primary/50 transition-all duration-300 border border-border bg-card flex flex-col"
            >
              <div className="h-44 bg-gradient-to-br from-[#1A1D23] via-[#0F1115] to-[#262114] border-b border-border relative flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center text-primary font-serif font-bold text-xl mb-3 shadow-lg">
                  {faculty.initials}
                </div>
                <Badge className="bg-primary text-primary-foreground hover:bg-primary font-serif border-none text-[11px] mb-1">
                  {faculty.title}
                </Badge>
                <h2 className="text-lg font-serif font-bold text-foreground leading-tight">
                  {faculty.name}
                </h2>
                <p className="text-xs text-primary/90 mt-0.5" lang="hi">
                  {faculty.hindiName}
                </p>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium mb-3 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>{faculty.qualifications}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {faculty.bio}
                  </p>

                  <div>
                    <h3 className="text-[11px] font-serif font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>Areas of Focus</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {faculty.expertise.map((item) => (
                        <span
                          key={item}
                          className="text-[11px] bg-background text-foreground px-2.5 py-1 rounded-md border border-border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-2">
                  <a
                    href={`tel:+91${faculty.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/15 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {faculty.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${faculty.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${faculty.name}`}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faculty;

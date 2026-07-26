import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, BookOpen, GraduationCap, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Leadership Team Data
const FACULTY_MEMBERS = [
  {
    id: 1,
    name: "Shri A.K. Tripathi",
    title: "Principal",
    qualifications: "M.A., B.Ed., TET, BTC",
    contact: "6394282229",
    expertise: ["Educational Leadership", "School Administration"],
    bio: "Shri A.K. Tripathi serves as the Principal, guiding the school's academic vision and ensuring a disciplined learning environment. He brings extensive educational qualifications to support student growth and institutional excellence.",
    image: "",
    email: ""
  },
  {
    id: 2,
    name: "Shri Arvind Kumar Tiwari",
    title: "Manager",
    qualifications: "B.Sc., M.A. (English), B.Ed., TET, CTET",
    contact: "7651995858",
    expertise: ["School Management", "English Education", "Strategic Planning"],
    bio: "As Manager, Shri Arvind Kumar Tiwari oversees the school's operations and strategic direction. With strong qualifications in Science and English, he is dedicated to providing modern and reliable education.",
    image: "",
    email: ""
  },
  {
    id: 3,
    name: "Shri Sanjay Kumar Tiwari",
    title: "Coordinator",
    qualifications: "M.A., B.Ed., NET, TET, CTET",
    contact: "",
    expertise: ["Academic Coordination", "Curriculum Planning"],
    bio: "Shri Sanjay Kumar Tiwari acts as the Coordinator, ensuring smooth academic operations and effective teaching methodologies. His comprehensive educational background supports the high standards of the institution.",
    image: "",
    email: ""
  },
  {
    id: 4,
    name: "Sunil Kumar Tiwari",
    title: "Administrator",
    qualifications: "",
    contact: "9792954343",
    expertise: ["School Operations", "Admissions Management"],
    bio: "Sunil Kumar Tiwari serves as the Administrator, handling daily school operations and coordinating the admissions process. He plays a vital role in maintaining a safe, organized, and peaceful educational environment.",
    image: "",
    email: ""
  }
];

export default function Faculty() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary/5 border-b border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary bg-primary/10 tracking-widest uppercase">
            Our Educators
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Faculty & Leadership
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet the dedicated professionals who inspire, mentor, and guide our students. 
            Our faculty brings together world-class academic qualifications with a genuine passion for teaching.
          </p>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {FACULTY_MEMBERS.map((faculty) => (
            <Card key={faculty.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="h-48 overflow-hidden relative bg-muted">
                {faculty.image && (
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-serif font-bold text-2xl leading-tight">{faculty.name}</h3>
                    <p className="text-white/90 text-sm font-medium">{faculty.title}</p>
                    {faculty.contact && (
                      <p className="text-[#D4AF37] text-sm mt-1">
                        📞 {faculty.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="space-y-4 flex-1">
                  {faculty.qualifications && (
                    <div className="flex items-start text-sm">
                      <GraduationCap className="w-5 h-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed">{faculty.qualifications}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start text-sm">
                    <BookOpen className="w-5 h-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {faculty.expertise.map((subject, idx) => (
                        <Badge key={idx} variant="secondary" className="font-normal text-xs bg-secondary/50">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mt-4 pt-4 border-t border-border">
                    {faculty.bio}
                  </p>
                </div>
                
                {faculty.email && (
                  <div className="mt-6 pt-4 border-t border-border flex items-center text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer w-max">
                    <Mail className="w-4 h-4 mr-2" />
                    {faculty.email}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

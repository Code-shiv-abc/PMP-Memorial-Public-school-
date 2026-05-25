import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, BookOpen, GraduationCap, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for faculty
const FACULTY_MEMBERS = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    title: "Head of Mathematics",
    qualifications: "Ph.D. in Applied Mathematics, M.Sc. in Education",
    expertise: ["Calculus", "Linear Algebra", "Statistical Analysis"],
    bio: "Dr. Jenkins brings over 15 years of experience in higher mathematics education. She is passionate about making complex mathematical concepts accessible to all students.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    email: "s.jenkins@pmpmemorial.edu"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Senior Professor, Computer Science",
    qualifications: "Ph.D. in Computer Science, B.Eng. in Software Engineering",
    expertise: ["Algorithms", "Machine Learning", "Data Structures"],
    bio: "A former software engineer at leading tech firms, Dr. Chen bridges the gap between theoretical computer science and practical software engineering.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    email: "m.chen@pmpmemorial.edu"
  },
  {
    id: 3,
    name: "Prof. Emily Post",
    title: "Head of Humanities",
    qualifications: "M.A. in English Literature, B.A. in History",
    expertise: ["Classical Literature", "Modern World History", "Creative Writing"],
    bio: "Prof. Post has authored two books on 19th-century literature and leads the school's award-winning debate and literary society.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecbef79c14d?w=500&q=80",
    email: "e.post@pmpmemorial.edu"
  },
  {
    id: 4,
    name: "Dr. Robert Smith",
    title: "Head of Physics",
    qualifications: "Ph.D. in Theoretical Physics",
    expertise: ["Thermodynamics", "Quantum Mechanics", "Astrophysics"],
    bio: "Dr. Smith's enthusiastic teaching style and hands-on laboratory sessions have inspired countless students to pursue careers in STEM.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
    email: "r.smith@pmpmemorial.edu"
  },
  {
    id: 5,
    name: "Maria Gonzalez",
    title: "Director of Arts & Design",
    qualifications: "M.F.A. in Visual Arts",
    expertise: ["Fine Arts", "Digital Illustration", "Art History"],
    bio: "An internationally exhibited artist, Maria guides students through diverse artistic mediums, helping them discover their unique creative voices.",
    image: "https://images.unsplash.com/photo-1594824432258-f2b467d022b7?w=500&q=80",
    email: "m.gonzalez@pmpmemorial.edu"
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Director of Athletics",
    qualifications: "M.S. in Sports Science & Kinesiology",
    expertise: ["Physical Education", "Team Sports", "Sports Psychology"],
    bio: "Coach Wilson oversees all athletic programs and emphasizes teamwork, discipline, and healthy living both on and off the field.",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=500&q=80",
    email: "j.wilson@pmpmemorial.edu"
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
                <img 
                  src={faculty.image} 
                  alt={faculty.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-serif font-bold text-2xl leading-tight">{faculty.name}</h3>
                    <p className="text-white/90 text-sm font-medium">{faculty.title}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start text-sm">
                    <GraduationCap className="w-5 h-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground leading-relaxed">{faculty.qualifications}</span>
                  </div>
                  
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
                
                <div className="mt-6 pt-4 border-t border-border flex items-center text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer w-max">
                  <Mail className="w-4 h-4 mr-2" />
                  {faculty.email}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

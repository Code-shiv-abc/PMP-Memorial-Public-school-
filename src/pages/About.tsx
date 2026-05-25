import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function About() {
  return (
    <div className="bg-card min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">About P.M.P. Memorial</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Founded in 1996, P.M.P. Memorial Public School has been a beacon of learning, innovation, and character development. Our mission is to provide holistic education that nurtures the intellectual, social, and emotional growth of every student.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              With over 25 years of excellence, we have cultivated an environment where students are encouraged to think critically, act compassionately, and lead responsibly in a globalized world.
            </p>
            <div className="flex gap-4">
               <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-serif font-bold text-foreground text-xl">Our Vision</h3>
                  <p className="text-muted-foreground mt-2">To be a globally recognized institution that empowers students to reach their highest potential.</p>
               </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" alt="Campus" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
             { title: "Academic Excellence", desc: "Rigorous curriculum designed to foster deep understanding and critical thinking." },
             { title: "Holistic Development", desc: "Equal emphasis on sports, arts, and extracurricular activities for all-round growth." },
             { title: "Global Competence", desc: "Preparing students to thrive in an interconnected and rapidly changing world." }
          ].map((val, i) => (
             <div key={i} className="bg-background p-8 rounded-xl border border-border">
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">{val.title}</h3>
                <p className="text-muted-foreground">{val.desc}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

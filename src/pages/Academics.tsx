import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Academics() {
  return (
    <div className="bg-background min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4">Curriculum & Programs</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Academic Programs</h1>
          <p className="text-lg text-muted-foreground">
            Our comprehensive academic structure caters to students from early early childhood through pre-university education.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {[
            { tag: "Pre-Primary & Primary", title: "Foundations of Learning", ages: "Ages 3-10", desc: "Focuses on literacy, numeracy, cognitive skills, and structured play to build a strong foundation for lifelong learning." },
            { tag: "Middle School", title: "Exploration & Discovery", ages: "Ages 11-14", desc: "Introduces specialized subjects including advanced sciences, languages, and humanities, fostering independent thinking." },
            { tag: "High School", title: "Focused Academic Excellence", ages: "Ages 15-18", desc: "Comprehensive board-focused curriculum with specialized tracks in Science, Commerce, and Humanities. Includes dedicated career counseling." }
          ].map((program, i) => (
            <div key={i} className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="md:w-1/3">
                <Badge variant="outline" className="text-primary border-primary bg-primary/5 mb-4">{program.tag}</Badge>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">{program.title}</h2>
                <span className="text-sm font-serif font-semibold text-muted-foreground uppercase tracking-wider">{program.ages}</span>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-muted-foreground mb-6">{program.desc}</p>
                <Button variant="outline" className="rounded-full">Download Curriculum PDF</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

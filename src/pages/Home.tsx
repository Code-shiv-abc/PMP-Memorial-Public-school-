import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Calendar as CalendarIcon, BookOpen, Users, Trophy, Play, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Immersive Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-[#0A0A0A]"
        >
          {/* We use a subtle abstract gradient if no image is present, making it highly premium */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-80" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-[7.5rem] font-serif font-medium text-foreground mb-4 leading-[1.05] tracking-tight">
              PMP Memorial<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50 italic pr-4">Public School</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-2xl font-serif text-[#D4AF37] mb-2">
              पी.एम.पी. मेमोरियल पब्लिक स्कूल, शाहपुर-गोंडा
            </motion.p>

            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-2">
              Shahpur, Gonda, Uttar Pradesh
            </motion.p>

            <motion.p variants={fadeIn} className="text-lg text-[#D4AF37]/80 italic mb-8">
              क्षेत्र का सबसे विश्वसनीय शिक्षा का केन्द्र
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link to="/admissions" className="inline-flex h-14 px-8 shrink-0 items-center justify-center border border-transparent bg-clip-padding text-base whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 gap-1.5 rounded-none bg-foreground text-background hover:bg-primary font-semibold transition-colors duration-300">
                Begin the Journey <ArrowUpRight className="w-4 h-4 ml-2 opacity-50" />
              </Link>
              <Link to="/about" className="inline-flex h-14 px-6 shrink-0 items-center justify-center border border-transparent bg-clip-padding text-base font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 gap-1.5 rounded-none text-foreground hover:bg-transparent hover:text-primary group">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border border-border group-hover:border-primary transition-colors mr-3">
                    <Play className="w-3 h-3 ml-1" />
                  </span>
                  Explore Campus
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
           <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>

      {/* Horizontal Stats Bar */}
      <section className="py-16 border-y border-border/50 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "98%", label: "Parent Satisfaction", hindi: "अभिभावक संतुष्टि" },
              { value: "3-12", label: "Hindi Medium Classes", hindi: "हिन्दी माध्यम" },
              { value: "PG-8", label: "English Medium Classes", hindi: "अंग्रेजी माध्यम" },
              { value: "Free", label: "Computer Education", hindi: "कम्प्यूटर शिक्षा" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 border border-border/50 rounded-xl hover:border-[#D4AF37]/40 transition-colors">
                <div className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">{stat.hindi}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-card border-y border-border/50 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
                <Badge variant="outline" className="border-border text-foreground uppercase tracking-[0.2em] mb-8 font-medium bg-transparent">हमारी विशेषताएं</Badge>
                <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] text-foreground mb-8">
                  Quality Education for <span className="italic text-primary">Every Child</span>
                </h2>
                <div className="w-full h-[1px] bg-border mb-8" />
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
                  PMP Memorial Public School provides disciplined, modern education in a safe and peaceful environment. We offer free computer education from Class 3 to 12 and free coaching for Classes 9 to 12.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10">
                  With NTT trained teachers for Nursery and KG, experienced faculty throughout, and 98% parent satisfaction — we are the most trusted education center in Shahpur, Gonda.
                </p>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="aspect-[4/5] bg-[#1a1a2e] relative border border-[#D4AF37]/20 rounded-xl flex items-center justify-center"
             >
               <p className="text-[#D4AF37]/40 text-sm text-center px-8">
                 School photo coming soon
               </p>
               <div className="absolute bottom-8 left-8 right-8 bg-[#0F1115]/80 backdrop-blur-md p-6 border border-[#D4AF37]/20">
                  <p className="font-serif italic text-lg text-white mb-2">
                    "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।<br />
                    न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥"
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/60">— Sanskrit Proverb</p>
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Bulletin / Updates (Refined) */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">The Bulletin</h2>
              <p className="text-muted-foreground max-w-xl font-light">Latest dispatches, academic schedules, and institutional events.</p>
            </motion.div>
            <Button variant="outline" className="rounded-none border-border hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-[0.1em] text-xs h-12 px-6">
              View Directory
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-8">
            {[
              { tag: "Admissions", title: "प्रवेश प्रारम्भ — Admissions Open for 2026-27", date: "01 Apr 2026" },
              { tag: "Academic", title: "Free Computer Education — Class 3 to 12", date: "Ongoing" },
              { tag: "Notice", title: "Registration fee waived for girls in Class 9 & 11", date: "Annual" },
            ].map((item, i) => (
              <div key={i} className="py-6 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-card/50 transition-colors px-4 -mx-4">
                <div className="flex-1">
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mb-2 block">{item.tag}</span>
                  <h3 className="text-lg font-serif text-foreground leading-tight">{item.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground font-light shrink-0">{item.date}</span>
              </div>
            ))}
          </div>

          <div className="text-center py-8 mt-4">
            <p className="text-[#D4AF37]/60 text-sm mt-2">
              Contact: Sunil Kumar Tiwari — 9792954343
            </p>
            <p className="text-[#D4AF37]/60 text-xs mt-4">
              Real-time announcements coming soon via Sanity CMS
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

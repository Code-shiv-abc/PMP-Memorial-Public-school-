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

      {/* Elite Stats / Bento Box Style */}
      <section className="bg-background pt-24 pb-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="grid grid-cols-1 md:grid-cols-4 gap-4"
           >
              {/* Box 1 */}
              <div className="md:col-span-2 bg-card p-10 lg:p-14 border border-border/50 flex flex-col justify-end min-h-[320px] group hover:border-primary/30 transition-colors">
                 <div className="text-secondary/20 mb-auto"><Trophy className="w-12 h-12" /></div>
                 <h3 className="text-5xl md:text-6xl font-serif text-foreground mb-4 font-medium">98%</h3>
                 <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-semibold">Parent Satisfaction</p>
              </div>

              {/* Box 2 (Stacked) */}
              <div className="grid grid-rows-2 gap-4 md:col-span-1">
                 <div className="bg-card p-8 border border-border/50 flex flex-col justify-center group hover:border-primary/30 transition-colors">
                    <h3 className="text-4xl font-serif text-foreground mb-2 font-medium">3-12</h3>
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-semibold">Hindi Medium Classes</p>
                 </div>
                 <div className="bg-primary p-8 border border-primary flex flex-col justify-center">
                    <h3 className="text-4xl font-serif text-primary-foreground mb-2 font-medium">PG-8</h3>
                    <p className="text-primary-foreground/80 uppercase tracking-[0.2em] text-[10px] font-semibold">English Medium Classes</p>
                 </div>
              </div>

              {/* Box 3 */}
              <div className="md:col-span-1 bg-card p-10 border border-border/50 flex flex-col justify-end min-h-[320px] group hover:border-primary/30 transition-colors">
                 <div className="text-secondary/20 mb-auto"><Users className="w-12 h-12" /></div>
                 <h3 className="text-5xl font-serif text-foreground mb-4 font-medium">Free</h3>
                 <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-semibold">Computer Education</p>
              </div>
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
                <Badge variant="outline" className="border-border text-foreground uppercase tracking-[0.2em] mb-8 font-medium bg-transparent">Our Philosophy</Badge>
                <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] text-foreground mb-8">
                  Cultivating minds that <span className="italic text-primary">challenge</span> the ordinary.
                </h2>
                <div className="w-full h-[1px] bg-border mb-8" />
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
                  We believe that education is not merely the transmission of information, but the ignition of curiosity. Our campus serves as a canvas where students map their own potential.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10">
                  With a rigorous academic framework and robust co-curricular ecosystem, we prepare students for the complexities of a dynamic world.
                </p>
                <Button variant="link" className="p-0 text-foreground text-base h-auto hover:text-primary transition-colors flex items-center gap-2 group">
                  Read our full manifesto <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="aspect-[4/5] bg-secondary relative"
             >
               {/* Placeholder for high-end photography */}
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2073')] bg-cover bg-center opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 saturate-0 hover:saturate-100" />
               <div className="absolute inset-0 ring-1 ring-inset ring-border/20 pointer-events-none" />
               <div className="absolute bottom-8 left-8 right-8 bg-background/80 backdrop-blur-md p-6 border border-border/50">
                  <p className="font-serif italic text-lg text-foreground mb-2">"The highest result of education is tolerance."</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">— Helen Keller</p>
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

          <div className="grid grid-cols-1 gap-12">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Announcements coming soon. Check back for
                updates from PMP Memorial Public School.
              </p>
              <p className="text-[#D4AF37]/60 text-sm mt-2">
                Contact: Sunil Kumar Tiwari — 9792954343
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

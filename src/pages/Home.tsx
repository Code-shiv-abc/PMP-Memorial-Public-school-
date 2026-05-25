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
            <motion.div variants={fadeIn} className="flex items-center gap-4 mb-8">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.2em] font-medium px-4 py-2 bg-primary/5 backdrop-blur-sm shadow-2xl">
                Est. 1996
              </Badge>
              <div className="h-[1px] w-12 bg-primary/30" />
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-[7.5rem] font-serif font-medium text-foreground mb-8 leading-[1.05] tracking-tight">
              Shaping <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50 italic pr-4">Tomorrow's</span>
              <br/> Leaders.
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
              P.M.P. Memorial Public School provides a transformative educational experience fostering academic excellence and character.
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
                 <h3 className="text-5xl md:text-6xl font-serif text-foreground mb-4 font-medium">100%</h3>
                 <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-semibold">Board Pass Rate</p>
              </div>

              {/* Box 2 (Stacked) */}
              <div className="grid grid-rows-2 gap-4 md:col-span-1">
                 <div className="bg-card p-8 border border-border/50 flex flex-col justify-center group hover:border-primary/30 transition-colors">
                    <h3 className="text-4xl font-serif text-foreground mb-2 font-medium">25+</h3>
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-semibold">Years Legacy</p>
                 </div>
                 <div className="bg-primary p-8 border border-primary flex flex-col justify-center">
                    <h3 className="text-4xl font-serif text-primary-foreground mb-2 font-medium">50+</h3>
                    <p className="text-primary-foreground/80 uppercase tracking-[0.2em] text-[10px] font-semibold">Expert Faculty</p>
                 </div>
              </div>

              {/* Box 3 */}
              <div className="md:col-span-1 bg-card p-10 border border-border/50 flex flex-col justify-end min-h-[320px] group hover:border-primary/30 transition-colors">
                 <div className="text-secondary/20 mb-auto"><Users className="w-12 h-12" /></div>
                 <h3 className="text-5xl font-serif text-foreground mb-4 font-medium">20k+</h3>
                 <p className="text-muted-foreground uppercase tracking-[0.2em] text-sm font-semibold">Global Alumni</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Notices List */}
            <div className="lg:col-span-7">
               <div className="border-t border-border/50">
                  {[
                    { tag: "Academic", title: "Class 10 & 12 Pre-board Examination Schedule", date: "Apr 15" }, 
                    { tag: "Admission", title: "Admissions Open for Academic Session 2026-27", date: "Apr 12" },
                    { tag: "Transport", title: "Revised Bus Guidelines & Routes - Effective Immediately", date: "Apr 10" },
                  ].map((notice, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="py-8 border-b border-border/50 group cursor-pointer flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-card/50 transition-colors px-4 -mx-4"
                    >
                       <div className="flex-1">
                          <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-3 block">{notice.tag}</span>
                          <h3 className="text-xl font-serif text-foreground group-hover:text-primary transition-colors leading-tight max-w-md">{notice.title}</h3>
                       </div>
                       <div className="flex items-center justify-between w-full sm:w-auto gap-8 mt-4 sm:mt-0">
                          <span className="text-sm text-muted-foreground font-light">{notice.date}</span>
                          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                             <ArrowUpRight className="w-4 h-4" />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Upcoming Event Feature */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="lg:col-span-5 bg-card p-10 border border-border/50 relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10 transition-opacity duration-700 group-hover:opacity-20" />
               <div className="relative z-10 h-full flex flex-col">
                 <div className="flex items-center gap-3 mb-12">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <span className="text-xs uppercase tracking-[0.2em] font-medium">Upcoming Exhibition</span>
                 </div>
                 
                 <div className="mt-auto">
                    <h3 className="text-3xl font-serif text-foreground mb-4">Annual Science & Tech Symposium</h3>
                    <p className="text-muted-foreground font-light mb-8">Join us for a showcase of student innovation, robotics, and advanced scientific paradigms.</p>
                    
                    <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-6">
                       <div>
                         <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-1">Date</span>
                         <span className="font-serif text-lg">April 25, 2026</span>
                       </div>
                       <div>
                         <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-1">Time</span>
                         <span className="font-serif text-lg">10:00 AM</span>
                       </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}

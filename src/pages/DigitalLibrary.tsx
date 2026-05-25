import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, FileText, Video, Download, Filter, BookmarkPlus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function DigitalLibrary() {
  const [searchQuery, setSearchQuery] = useState("");

  const resources = [
    { title: "Advanced Mathematics Vol 2", type: "E-Book", subject: "Mathematics", year: "2025", icon: Book },
    { title: "Physics Lab Manual", type: "Document", subject: "Physics", year: "2026", icon: FileText },
    { title: "Introduction to Organic Chemistry", type: "Video Lecture", subject: "Chemistry", year: "2024", icon: Video },
    { title: "World History: The Modern Era", type: "E-Book", subject: "History", year: "2023", icon: Book },
    { title: "English Literature Complete Guide", type: "E-Book", subject: "English", year: "2025", icon: Book },
    { title: "Computer Science: Data Structures", type: "Document", subject: "Computer Science", year: "2026", icon: FileText },
  ];

  const types = Array.from(new Set(resources.map(r => r.type)));
  const subjects = Array.from(new Set(resources.map(r => r.subject)));

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header Search Area - Premium Minimalist */}
      <div className="relative border-b border-border/50 py-24 sm:py-32 overflow-hidden bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <Badge variant="outline" className="border-border text-muted-foreground uppercase tracking-[0.2em] mb-8 bg-transparent">Academic Repository</Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-foreground mb-6 leading-tight tracking-tight">
              The Digital <span className="italic text-primary">Library</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl font-light">Thousands of academic resources, peer-reviewed journals, and archival study materials preserved for our scholars.</p>
            
            <div className="relative max-w-2xl w-full mx-auto flex items-center shadow-2xl shadow-primary/5 group">
              <Search className="absolute left-6 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                className="h-16 pl-16 pr-32 text-lg rounded-none border border-border/50 bg-background/50 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all font-light" 
                placeholder="Search corpus by title, subject, or author..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-2 top-2 bottom-2 rounded-none px-6 text-xs uppercase tracking-[0.1em] font-medium bg-foreground text-background hover:bg-primary hover:text-primary-foreground">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-12">
          <div>
            <h4 className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               Criteria
            </h4>
            <div className="h-[1px] w-full bg-border/50 mb-6" />
          </div>
          
          <div>
            <h4 className="text-[10px] font-sans font-bold text-foreground uppercase tracking-[0.2em] mb-4">Format</h4>
            <div className="space-y-3">
              {types.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 border border-border/50 flex items-center justify-center group-hover:border-primary transition-colors">
                    <input type="checkbox" className="opacity-0 absolute" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-light">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-sans font-bold text-foreground uppercase tracking-[0.2em] mb-4">Discipline</h4>
            <div className="space-y-3">
              {subjects.map(subject => (
                <label key={subject} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 border border-border/50 flex items-center justify-center group-hover:border-primary transition-colors">
                    <input type="checkbox" className="opacity-0 absolute" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-light">{subject}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-serif font-medium text-foreground">Recommended Accessions</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <span className="uppercase tracking-[0.1em] text-[10px] font-bold">Sort By</span>
               <select className="bg-transparent border-b border-border/50 text-foreground py-1 pr-8 outline-none focus:border-primary transition-colors text-sm font-light">
                 <option>Curated Content</option>
                 <option>Newest Additions</option>
                 <option>Most Cited</option>
               </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="bg-card border border-border/50 p-8 group flex flex-col h-full hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <resource.icon className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] bg-transparent border-border/50 text-muted-foreground rounded-none">{resource.type}</Badge>
                </div>
                
                <h3 className="font-serif text-xl text-foreground mb-3 leading-tight">
                  {resource.title}
                </h3>
                
                <div className="mb-8 font-light text-muted-foreground text-sm">
                  {resource.subject}
                </div>
                
                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-[0.1em]">Acquired {resource.year}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-none">
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-none">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="px-8 rounded-none border-border hover:bg-foreground hover:text-background transition-colors uppercase tracking-[0.1em] text-xs h-12">
              Browse Entire Index
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

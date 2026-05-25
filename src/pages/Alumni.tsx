import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Alumni() {
  return (
    <div className="bg-background min-h-[calc(100vh-80px)] py-16 md:py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary hover:bg-primary/30">P.M.P. Alumni Network</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">A Lifelong Connection</h1>
          <p className="text-lg text-muted-foreground">
            Our alumni are our greatest ambassadors. Join the network to reconnect with old friends, mentor current students, and stay updated on the school's journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
           <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-6 rounded-xl text-center border border-border">
                   <div className="text-4xl font-serif font-bold text-primary mb-2">20k+</div>
                   <div className="text-sm text-muted-foreground uppercase tracking-wide">Registered Alumni</div>
                </div>
                <div className="bg-secondary p-6 rounded-xl text-center border border-border">
                   <div className="text-4xl font-serif font-bold text-primary mb-2">50+</div>
                   <div className="text-sm text-muted-foreground uppercase tracking-wide">Global Chapters</div>
                </div>
                <div className="bg-secondary p-6 rounded-xl text-center border border-border col-span-2">
                   <div className="text-2xl font-serif font-bold text-white mb-2">Upcoming Meetup</div>
                   <div className="text-muted-foreground">Class of 2016 - 10 Year Reunion, Oct 2026</div>
                </div>
             </div>
           </div>
           <div className="order-1 md:order-2">
             <h2 className="text-3xl font-serif font-bold mb-6">Why Join the Network?</h2>
             <ul className="space-y-4 mb-8">
               <li className="flex gap-3 text-muted-foreground">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">✓</div>
                 <span>Exclusive invites to alumni events, reunions, and school festivals.</span>
               </li>
               <li className="flex gap-3 text-muted-foreground">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">✓</div>
                 <span>Career networking opportunities across industries worldwide.</span>
               </li>
               <li className="flex gap-3 text-muted-foreground">
                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">✓</div>
                 <span>Opportunity to mentor senior students and offer internships.</span>
               </li>
             </ul>
             <Button size="lg" className="rounded-full px-8 h-14 text-lg">Register in Alumni Portal</Button>
           </div>
        </div>
      </div>
    </div>
  );
}

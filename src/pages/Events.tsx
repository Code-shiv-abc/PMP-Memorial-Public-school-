import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Clock } from "lucide-react";

export default function Events() {
  const events = [
    { title: "Annual Science Exhibition 2026", date: "April 25, 2026", time: "10:00 AM - 4:00 PM", location: "Main Auditorium", type: "Academic", img: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=600&q=80" },
    { title: "Inter-School Debate Competition", date: "May 02, 2026", time: "9:00 AM - 1:00 PM", location: "Library Hall", type: "Co-curricular", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80" },
    { title: "Summer Sports Camp Inauguration", date: "May 10, 2026", time: "8:00 AM", location: "School Sports Complex", type: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80" }
  ];

  return (
    <div className="bg-card min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Events & News</h1>
            <p className="text-lg text-muted-foreground">
              Discover what's happening at P.M.P. Memorial. From academic competitions to cultural festivals, stay connected with our vibrant community.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
             <Button className="rounded-full px-8 h-12">View Calendar</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border group hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img src={event.img} alt={event.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-4 left-4 bg-card/90 text-foreground border-none hover:bg-card">{event.type}</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-foreground mb-4 leading-tight">{event.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2 text-primary" /> {event.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" /> {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-primary" /> {event.location}
                  </div>
                </div>
                <Button variant="outline" className="w-full">Register / Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function About() {
  return (
    <div className="bg-card min-h-[calc(100vh-80px)] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">About PMP Memorial Public School</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              PMP Memorial Public School is a UP Government recognized institution located in Shahpur, Gonda, Uttar Pradesh. We are committed to providing quality education through modern digital tools in a safe and disciplined environment.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We offer Hindi Medium education from Class 3 to Class 12 and English Medium from Playgroup to Class 8. With free computer education, digital learning facilities, and free coaching for Classes 9 to 12, we are the most trusted education center in the region.
            </p>
            <div className="flex gap-4">
               <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-serif font-bold text-foreground text-xl">Our Vision</h3>
                  <p className="text-muted-foreground mt-2">क्षेत्र का सबसे विश्वसनीय शिक्षा का केन्द्र — The most trusted education center in the region.</p>
               </div>
            </div>
          </div>
          <div className="w-full h-64 bg-[#1a1a2e] rounded-xl border border-[#D4AF37]/20 flex items-center justify-center">
            <p className="text-[#D4AF37]/60 text-sm">
              Campus photo coming soon
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#1a1a2e] border-y border-[#D4AF37]/20 py-12 px-6 mt-16 md:mt-24">
        <p className="text-[#D4AF37] text-xl md:text-2xl font-serif text-center leading-relaxed">
          उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।<br />
          न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥
        </p>
        <p className="text-gray-400 text-sm italic text-center mt-4">
          "Goals are achieved through effort, not mere wishes. Even a lion gets no prey while sleeping."
        </p>
        <p className="text-[#D4AF37]/60 text-xs text-center mt-2">
          — Sanskrit Proverb
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
             { title: "Digital Education", desc: "Free computer education from Class 3 to Class 12 with internet facilities and modern digital learning tools." },
             { title: "Holistic Development", desc: "Focus on social development, moral values, and yoga training alongside academics. NTT trained teachers for Nursery and KG." },
             { title: "Inclusive Education", desc: "Registration fee waived for girls in Class 9 and Class 11. Free coaching provided for Classes 9 to 12." }
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

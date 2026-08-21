import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <Badge className="mb-4">Admissions Open 2026-2027</Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Online Admission Application</h1>
          <p className="text-xl text-[#D4AF37] font-serif mt-2 mb-4">
            प्रवेश प्रारम्भ — 01 अप्रैल से
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join the legacy of excellence at P.M.P. Memorial Public School. Please fill out the form below to begin the application process.
          </p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-12 rounded-2xl shadow-xl shadow-none text-center border top border-border"
          >
            <div className="w-20 h-20 bg-green-100 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Thank you for applying to P.M.P. Memorial Public School. Your application reference number is <strong>#APP-2026-8942</strong>. Our admissions office will contact you shortly.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full px-8">
              Submit Another Application
            </Button>
          </motion.div>
        ) : (
          <Card className="border-none shadow-xl shadow-none">
            <CardHeader className="bg-background text-white rounded-t-xl px-8 py-6">
              <CardTitle>Student Information</CardTitle>
              <CardDescription className="text-muted-foreground">All fields marked with red asterisks are mandatory.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" required placeholder="Enter student's first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" required placeholder="Enter student's last name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <select id="gender" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Academic Background */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                      <Label htmlFor="grade">Applying for Grade *</Label>
                      <select id="grade" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                        <option value="">Select Grade</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11 (Intermediate 1st Year)</option>
                        <option value="12">Grade 12 (Intermediate 2nd Year)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prevSchool">Previous School Attended</Label>
                      <Input id="prevSchool" placeholder="Name of previous school" />
                    </div>
                  </div>
                </div>

                {/* Parent/Guardian Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-semibold text-foreground border-b border-border pb-2">Parent/Guardian Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input id="parentName" required placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relation">Relationship to Student *</Label>
                      <Input id="relation" required placeholder="E.g., Father, Mother" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required placeholder="parent@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" required placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Residential Address *</Label>
                      <Textarea id="address" required placeholder="Full residential address" rows={3} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 text-blue-800 p-4 rounded-lg flex gap-3 text-sm">
                  <Info className="w-5 h-5 shrink-0 text-primary" />
                  <p>
                    Please review all information before submitting. An admissions counselor will reach out to you to schedule an interview and request supporting documents.
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-full">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

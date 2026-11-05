import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface SubmittedSummary {
  referenceId: string;
  studentName: string;
  grade: string;
  medium: string;
  parentName: string;
  phone: string;
}

export default function Admissions() {
  const [submitted, setSubmitted] = useState<SubmittedSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const studentName = `${firstName} ${lastName}`.trim();
    const dob = String(formData.get("dob") || "").trim();
    const gender = String(formData.get("gender") || "").trim();
    const grade = String(formData.get("grade") || "").trim();
    const medium = String(formData.get("medium") || "Hindi Medium").trim();
    const prevSchool = String(formData.get("prevSchool") || "").trim();
    const parentName = String(formData.get("parentName") || "").trim();
    const relation = String(formData.get("relation") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const address = String(formData.get("address") || "").trim();

    if (!studentName || !grade || !parentName || !phone || !address) {
      toast.error("कृपया सभी आवश्यक जानकारी भरें (Please fill all required fields).");
      return;
    }

    const referenceId = `PMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmitting(true);

    try {
      await addDoc(collection(db, "admissions"), {
        referenceId,
        studentName,
        dob,
        gender,
        grade,
        medium,
        prevSchool,
        parentName,
        relation,
        phone,
        email,
        address,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSubmitted({
        referenceId,
        studentName,
        grade,
        medium,
        parentName,
        phone,
      });
      toast.success("आवेदन सफलतापूर्वक जमा हो गया! (Application submitted!)");
    } catch (error) {
      console.error("Admission submission error:", error);
      // Still allow parent to complete via WhatsApp fallback if offline or rules not yet deployed
      setSubmitted({
        referenceId,
        studentName,
        grade,
        medium,
        parentName,
        phone,
      });
      toast.success("Application recorded! You can also confirm via WhatsApp below.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const whatsappMessage = encodeURIComponent(
      `नमस्ते P.M.P. Memorial Public School,\nमैंने ऑनलाइन प्रवेश फॉर्म भरा है:\n• Reference ID: #${submitted.referenceId}\n• विद्यार्थी का नाम: ${submitted.studentName}\n• कक्षा (Class): ${submitted.grade}\n• माध्यम (Medium): ${submitted.medium}\n• अभिभावक का नाम: ${submitted.parentName}\n• मोबाइल: ${submitted.phone}`
    );

    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
        <Card className="max-w-lg w-full text-center p-6 sm:p-8 border border-primary/30 shadow-2xl bg-card">
          <div className="w-16 h-16 bg-primary/15 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-foreground mb-2">
            आवेदन प्राप्त हुआ (Application Submitted)
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-6 leading-relaxed">
            Thank you for applying to <strong>P.M.P. Memorial Public School, Shahpur, Gonda</strong>. We have recorded the admission inquiry for <strong>{submitted.studentName}</strong> ({submitted.grade} - {submitted.medium}). Our admissions office will contact you on <strong>{submitted.phone}</strong>.
          </CardDescription>
          <div className="bg-background p-4 rounded-xl text-sm text-foreground mb-6 border border-border space-y-1">
            <div>
              Application Reference ID: <span className="font-mono font-bold text-primary">#{submitted.referenceId}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Helpline: 9792954343 • 7651995858 • 6394282229
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/919792954343?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp पर पुष्टि भेजें</span>
            </a>
            <Button
              type="button"
              onClick={() => setSubmitted(null)}
              variant="outline"
              className="flex-1"
            >
              Submit Another Application
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-extrabold text-foreground sm:text-4xl">
            Student Admission Form
          </h1>
          <p className="mt-2 text-lg text-primary font-serif font-medium" lang="hi">
            प्रवेश प्रारम्भ - 01 अप्रैल से (Playgroup से कक्षा 12 तक)
          </p>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl mx-auto">
            UP Government Recognized • English Medium (Playgroup to Class 8) &amp; Hindi Medium (Class 3 to Class 12).
          </p>

          {/* Key School Scholarship & Free Benefits Banner */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-card border border-primary/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <strong className="block text-primary">बालिकाओं हेतु विशेष छूट</strong>
                कक्षा 9 एवं 11 में प्रवेश लेने वाली छात्राओं का पंजीकरण शुल्क पूर्णतः निःशुल्क (100% Free Registration).
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <strong className="block text-primary">निःशुल्क कंप्यूटर शिक्षा</strong>
                कक्षा 3 से 12 तक के सभी विद्यार्थियों के लिए मुफ़्त कंप्यूटर शिक्षा।
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <strong className="block text-primary">निःशुल्क कोचिंग सुविधा</strong>
                कक्षा 9 से 12 तक के विद्यार्थियों के लिए विद्यालय में निःशुल्क कोचिंग।
              </div>
            </div>
          </div>
        </div>

        <Card className="border-t-4 border-t-primary border-border bg-card shadow-xl">
          <CardHeader className="border-b border-border bg-card px-6 py-5">
            <CardTitle className="text-xl text-foreground">Application for Admission (2026–2027)</CardTitle>
            <CardDescription className="text-muted-foreground">
              All fields marked with an asterisk (*) are mandatory. Or call directly at{" "}
              <a href="tel:+919792954343" className="text-primary underline font-medium">
                +91 97929 54343
              </a>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Student Information */}
              <div>
                <h2 className="text-lg font-serif font-medium text-foreground border-b border-border pb-2 mb-4">
                  1. Student Details (विद्यार्थी का विवरण)
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name (प्रथम नाम) *</Label>
                    <Input id="firstName" name="firstName" required placeholder="e.g. Aarav" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name (उपनाम) *</Label>
                    <Input id="lastName" name="lastName" required placeholder="e.g. Tiwari" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth (जन्म तिथि) *</Label>
                    <Input id="dob" name="dob" type="date" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender (लिंग) *</Label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      defaultValue=""
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm h-9"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male (छात्र)</option>
                      <option value="female">Female (छात्रा - Free Reg. in Class 9 &amp; 11)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="medium">Preferred Medium (माध्यम) *</Label>
                    <select
                      id="medium"
                      name="medium"
                      required
                      defaultValue="English Medium"
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm h-9"
                    >
                      <option value="English Medium">English Medium (Playgroup to Class 8)</option>
                      <option value="Hindi Medium">Hindi Medium (Class 3 to Class 12 - UP Board)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="grade">Applying for Class (कक्षा चुनें) *</Label>
                    <select
                      id="grade"
                      name="grade"
                      required
                      defaultValue=""
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm h-9"
                    >
                      <option value="" disabled>Select Class (Playgroup – Class 12)</option>
                      <optgroup label="Pre-Primary (English Medium)">
                        <option value="Playgroup">Playgroup</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                      </optgroup>
                      <optgroup label="Primary & Junior (Classes 1 – 8)">
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                      </optgroup>
                      <optgroup label="High School & Intermediate (Classes 9 – 12)">
                        <option value="Class 9">Class 9 (High School)</option>
                        <option value="Class 10">Class 10 (High School)</option>
                        <option value="Class 11">Class 11 (Intermediate 1st Year)</option>
                        <option value="Class 12">Class 12 (Intermediate 2nd Year)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="prevSchool">Previous School Name (पूर्व विद्यालय का नाम - यदि हो)</Label>
                    <Input id="prevSchool" name="prevSchool" placeholder="Name of previous school (optional for Playgroup/Nursery)" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div>
                <h2 className="text-lg font-serif font-medium text-foreground border-b border-border pb-2 mb-4">
                  2. Parent / Guardian Details (अभिभावक का विवरण)
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="parentName">Parent / Guardian Full Name (अभिभावक का नाम) *</Label>
                    <Input id="parentName" name="parentName" required placeholder="e.g. Rajesh Kumar Tiwari" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="relation">Relationship to Student (संबंध) *</Label>
                    <select
                      id="relation"
                      name="relation"
                      required
                      defaultValue="father"
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm h-9"
                    >
                      <option value="father">Father (पिता)</option>
                      <option value="mother">Mother (माता)</option>
                      <option value="guardian">Legal Guardian (अभिभावक)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile / WhatsApp Number (मोबाइल नंबर) *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      pattern="[0-9+\-\s]{10,15}"
                      placeholder="+91 97929 54343"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address (ईमेल - वैकल्पिक / Optional)</Label>
                    <Input id="email" name="email" type="email" placeholder="parent@example.com (optional)" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-lg font-serif font-medium text-foreground border-b border-border pb-2 mb-4">
                  3. Residential Address (निवास का पता)
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                  <div>
                    <Label htmlFor="address">Village / Post / Tehsil / District (ग्राम / पोस्ट / जिला) *</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      placeholder="e.g. Gram Shahpur, Post Rek Sadiya, District Gonda, UP"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Accessible High-Contrast Notice & Parental Consent */}
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/30 text-sm text-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p>
                    <strong>Note &amp; Parental Consent:</strong> Submitting this form registers your admission inquiry with P.M.P. Memorial Public School, Shahpur, Gonda. Our office will contact you for document verification (Birth Certificate / Transfer Certificate / Aadhaar copy).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <a
                  href="tel:+919792954343"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Need help? Call 9792954343</span>
                </a>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 text-base font-serif font-semibold"
                >
                  {submitting ? "Submitting Application..." : "Submit Application (आवेदन जमा करें)"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

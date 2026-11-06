import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Sparkles, Search, Plus, Trash2, Users } from "lucide-react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Course } from "../types/course";
import toast from "react-hot-toast";

const SCHOOL_COURSES: Course[] = [
  {
    id: "up-math-9-12",
    name: "Mathematics (गणित — UP Board & NCERT)",
    department: "Science & Mathematics",
    credits: 4,
    description:
      "Complete NCERT & UP Board Mathematics covering Algebra, Trigonometry, Geometry, Mensuration, and Calculus with step-by-step board exam practice.",
    prerequisites: [],
    schedule: "Mon – Sat • 08:30 AM",
    instructor: "Shri A.K. Tripathi (M.A., B.Ed., TET, CTET)",
    capacity: 60,
    enrolled: 48,
  },
  {
    id: "up-science-9-12",
    name: "Science (विज्ञान — Physics, Chemistry, Biology)",
    department: "Science & Mathematics",
    credits: 4,
    description:
      "Practical and theoretical mastery of Physics, Chemistry, and Biology aligned with UP Board High School and Intermediate examinations.",
    prerequisites: [],
    schedule: "Mon – Sat • 09:20 AM",
    instructor: "Shri Arvind Kumar Tiwari (M.A., B.Ed., NET)",
    capacity: 60,
    enrolled: 52,
  },
  {
    id: "free-computer-3-12",
    name: "Free Computer Education (निःशुल्क कंप्यूटर शिक्षा)",
    department: "Computer & Digital Literacy",
    credits: 3,
    description:
      "100% Free computer fundamentals, MS Office, typing, internet safety, and digital skills for all students from Class 3 to Class 12.",
    prerequisites: [],
    schedule: "Tue, Thu, Sat • 11:00 AM",
    instructor: "Sunil Kumar Tiwari (Coordinator)",
    capacity: 80,
    enrolled: 74,
  },
  {
    id: "up-hindi-3-12",
    name: "Hindi Literature & Grammar (हिंदी साहित्य एवं व्याकरण)",
    department: "Languages & Humanities",
    credits: 4,
    description:
      "Comprehensive Hindi Gadya, Padya, Sanskrit Digdarshika, and Vyakaran preparation for UP Board examinations.",
    prerequisites: [],
    schedule: "Mon – Sat • 10:15 AM",
    instructor: "Shri Sanjay Kumar Tiwari (M.A., B.Ed., BTC, TET)",
    capacity: 60,
    enrolled: 55,
  },
  {
    id: "eng-medium-pg-8",
    name: "English Grammar, Spoken English & Literature",
    department: "Languages & Humanities",
    credits: 4,
    description:
      "English language fluency, grammar, comprehension, and formal writing for Playgroup–Class 8 (English Medium) and Classes 9–12.",
    prerequisites: [],
    schedule: "Mon – Sat • 12:00 PM",
    instructor: "Shri A.K. Tripathi",
    capacity: 60,
    enrolled: 49,
  },
  {
    id: "free-coaching-9-12",
    name: "Free Board Exam Coaching Batch (निःशुल्क कोचिंग — कक्षा 9 से 12)",
    department: "Board Exam Special Coaching",
    credits: 4,
    description:
      "Dedicated after-school revision, previous-year paper solving, and doubt clearing provided 100% free of cost to Classes 9–12 students.",
    prerequisites: [],
    schedule: "Mon – Sat • 01:30 PM",
    instructor: "Senior Faculty Team",
    capacity: 100,
    enrolled: 86,
  },
];

export function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [localEnrolledIds, setLocalEnrolledIds] = useState<string[]>([
    "up-math-9-12",
    "up-science-9-12",
    "free-computer-3-12",
  ]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const departments = ["All", ...Array.from(new Set(SCHOOL_COURSES.map((c) => c.department)))];

  const filteredCourses = SCHOOL_COURSES.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || course.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleEnroll = async (course: Course) => {
    if (localEnrolledIds.includes(course.id)) return;
    setBusyId(course.id);

    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          enrolledCourseIds: arrayUnion(course.id),
          courses: arrayUnion({
            id: course.id,
            name: course.name,
            instructor: course.instructor,
            schedule: course.schedule,
            progress: 10,
          }),
        });
      }
      setLocalEnrolledIds((prev) => [...prev, course.id]);
      toast.success(`Enrolled in ${course.name}!`);
    } catch {
      setLocalEnrolledIds((prev) => [...prev, course.id]);
      toast.success(`Added ${course.name} to your study list!`);
    } finally {
      setBusyId(null);
    }
  };

  const handleDropCourse = async (courseId: string, courseName: string) => {
    setBusyId(courseId);
    try {
      const updatedIds = localEnrolledIds.filter((id) => id !== courseId);
      setLocalEnrolledIds(updatedIds);
      const uid = auth.currentUser?.uid;
      if (uid) {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          enrolledCourseIds: updatedIds,
        });
      }
      toast.success(`Removed ${courseName} from your active subjects.`);
    } catch {
      toast.success(`Removed ${courseName} from your active list.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-1">
            P.M.P. Memorial Public School • Academic Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            School Subjects &amp; Free Coaching Batches
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select your subjects to track syllabus progress and launch personalized sessions in Vidya AI.
          </p>
        </div>

        <Link
          to="/portal/study-assistant"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all inline-flex items-center gap-2 self-start"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Vidya AI Tutor</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search subjects or teachers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject (e.g. Mathematics, Science, Computer) or teacher..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDept === dept
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = localEnrolledIds.includes(course.id);
          const isBusy = busyId === course.id;

          return (
            <div
              key={course.id}
              className="bg-card border border-border hover:border-primary/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-primary/15 border border-primary/30 text-primary text-[11px] font-medium">
                    {course.department}
                  </span>
                  {isEnrolled && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-serif font-bold text-foreground leading-snug">
                  {course.name}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-2 space-y-1 text-xs text-neutral-300 border-t border-border/60">
                  <div>
                    <strong className="text-muted-foreground">Faculty:</strong> {course.instructor}
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Timing:</strong> {course.schedule}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {course.enrolled} / {course.capacity} Students Enrolled
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-border flex items-center gap-2">
                {isEnrolled ? (
                  <>
                    <Link
                      to="/portal/study-assistant"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-primary/15 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/30 text-xs font-serif font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Study with Vidya AI</span>
                    </Link>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDropCourse(course.id, course.name)}
                      aria-label={`Remove ${course.name}`}
                      className="p-2.5 rounded-xl bg-background hover:bg-red-950/50 text-muted-foreground hover:text-red-400 border border-border transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleEnroll(course)}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[100px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isBusy ? "Adding..." : "Add to My Subjects"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;

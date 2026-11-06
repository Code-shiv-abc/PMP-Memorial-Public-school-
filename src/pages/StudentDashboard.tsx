import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  GraduationCap,
  Monitor
} from "lucide-react";
import { UserProfile } from "../types/user";
import { useLanguage } from "../context/LanguageContext";

interface StudentDashboardProps {
  userData: UserProfile;
}

const DEFAULT_UP_BOARD_SUBJECTS = [
  {
    id: "math-10",
    name: "Mathematics (गणित — NCERT / UP Board)",
    instructor: "Shri A.K. Tripathi",
    schedule: "Mon – Sat • 08:30 AM",
    progress: 82,
  },
  {
    id: "sci-10",
    name: "Science (विज्ञान — Physics, Chemistry, Biology)",
    instructor: "Shri Arvind Kumar Tiwari",
    schedule: "Mon – Sat • 09:20 AM",
    progress: 78,
  },
  {
    id: "comp-free",
    name: "Free Computer Education (कंप्यूटर शिक्षा)",
    instructor: "Sunil Kumar Tiwari",
    schedule: "Tue, Thu, Sat • 11:00 AM",
    progress: 90,
  },
];

export default function StudentDashboard({ userData }: StudentDashboardProps) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const initialTasks =
    userData.tasks && userData.tasks.length > 0
      ? userData.tasks
      : [
          {
            id: "t1",
            title: "Trigonometry Exercise 8.1 & Identities Revision (त्रिकोणमिति अभ्यास)",
            dueDate: "Tomorrow",
            completed: false,
          },
          {
            id: "t2",
            title: "Science Chapter 1: Chemical Reactions & Equations Notes",
            dueDate: "This Friday",
            completed: false,
          },
          {
            id: "t3",
            title: "Computer Practical: MS Word & Internet Basics Lab",
            dueDate: "Saturday",
            completed: true,
          },
        ];

  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  // Convert legacy 4.0 GPA into a realistic UP Board Percentage (e.g. 3.8 -> 88%)
  const rawGpa = typeof userData.gpa === "number" && userData.gpa > 0 ? userData.gpa : 3.6;
  const percentageScore = rawGpa <= 5 ? Math.min(98, Math.round(rawGpa * 23.5)) : Math.round(rawGpa);
  const attendanceRate =
    typeof userData.attendance === "number" && userData.attendance > 0 ? userData.attendance : 94;

  const activeCourses =
    userData.courses && userData.courses.length > 0 ? userData.courses : DEFAULT_UP_BOARD_SUBJECTS;

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A1D23] via-[#14171E] to-[#231E12] border border-primary/30 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-serif font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>P.M.P. Memorial Public School • Shahpur, Gonda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {isHi ? `नमस्ते, ${userData.name}!` : `${t("welcome")}, ${userData.name}!`}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isHi
              ? "आपकी मासिक परीक्षा, निःशुल्क कंप्यूटर कक्षा और विद्या AI अध्ययन सहायिका यहाँ उपलब्ध हैं।"
              : "Track your UP Board syllabus progress, monthly evaluation scores, free computer lab schedule, and study with Vidya AI."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/portal/study-assistant"
            className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-serif font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHi ? "विद्या AI से प्रश्न पूछें" : "Ask Vidya AI Tutor"}</span>
          </Link>
          <Link
            to="/portal/courses"
            className="px-5 py-3 rounded-xl bg-background border border-border hover:border-primary/50 text-foreground font-serif font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>{isHi ? "सभी विषय देखें" : "Browse Subjects"}</span>
          </Link>
        </div>
      </div>

      {/* 2. Authentic UP Board Academic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-serif uppercase tracking-wider text-muted-foreground">
              {isHi ? "मासिक परीक्षा प्राप्तांक" : "Monthly Test Score"}
            </span>
            <Award className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-foreground">
            {percentageScore}%
          </div>
          <p className="text-xs text-emerald-400 mt-1">
            {isHi ? "प्रथम श्रेणी (First Division — Honours)" : "First Division (Honours Track)"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-serif uppercase tracking-wider text-muted-foreground">
              {isHi ? "उपस्थिति (Attendance)" : t("attendance")}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-foreground">
            {attendanceRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isHi ? "नियमित उपस्थिति (Regular Scholar)" : "Regular attendance record"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-serif uppercase tracking-wider text-muted-foreground">
              {isHi ? "सक्रिय विषय (Subjects)" : "Enrolled Subjects"}
            </span>
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-serif font-bold text-foreground">
            {activeCourses.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isHi ? "निःशुल्क कंप्यूटर एवं कोचिंग सहित" : "Includes Free Computer & Coaching"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-serif uppercase tracking-wider text-muted-foreground">
              {isHi ? "लंबित गृहकार्य" : "Pending Homework"}
            </span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-foreground">
            {pendingTasksCount}
          </div>
          <p className="text-xs text-amber-300 mt-1">
            {pendingTasksCount === 0
              ? isHi ? "सभी कार्य पूर्ण!" : "All caught up!"
              : isHi ? "इस सप्ताह पूर्ण करें" : "Due this week"}
          </p>
        </div>
      </div>

      {/* 3. Two-Column Subjects & Homework Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enrolled Subjects List */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">
                {isHi ? "मेरे विषय एवं पाठ्यक्रम" : "My Enrolled Subjects"}
              </h2>
              <p className="text-xs text-muted-foreground">
                NCERT &amp; UP Board Syllabus Progress
              </p>
            </div>
            <Link
              to="/portal/courses"
              className="text-xs font-serif font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>{isHi ? "सभी विषय" : t("viewAll")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-background border border-border hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-foreground">
                      {course.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {course.instructor} • {course.schedule}
                    </p>
                  </div>
                  <Link
                    to="/portal/study-assistant"
                    aria-label={`Practice ${course.name} with Vidya AI`}
                    className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isHi ? "अभ्यास" : "Practice"}</span>
                  </Link>
                </div>

                {/* High-contrast dark progress bar (Fixes light bg-slate-200 bug) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      {isHi ? "पाठ्यक्रम प्रगति" : "Syllabus Completed"}
                    </span>
                    <span className="text-primary font-semibold">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Homework & Daily Schedule Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-serif font-bold text-foreground">
                {isHi ? "गृहकार्य एवं अभ्यास (Tasks)" : "Homework & Revision Tasks"}
              </h2>
              <span className="text-xs text-primary font-medium">
                {tasks.filter((tItem) => tItem.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  htmlFor={`task-${task.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/40 cursor-pointer transition-colors"
                >
                  <input
                    id={`task-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 rounded border-neutral-600 accent-amber-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-snug ${
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[11px] text-primary block mt-1">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Free School Benefits Card */}
          <div className="bg-card border border-primary/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-serif font-bold text-sm">
              <Monitor className="w-4 h-4" />
              <span>{isHi ? "विद्यालय विशेष सुविधाएं" : "Included School Facilities"}</span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Free Daily Coaching for Classes 9 to 12</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Free Computer Lab Practicals (Classes 3 to 12)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Monthly Evaluation &amp; Science/Math Exhibitions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

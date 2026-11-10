import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchFromSanity } from "@/src/lib/sanity";

export interface SanityCourse {
  _id: string;
  name: string;
  department: string;
  description: string;
  instructor: string;
  schedule: string;
}

export function Courses() {
  const [courses, setCourses] = useState<SanityCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    const query = `*[_type == "course" && !(_id in path("drafts.**"))] | order(name asc){
      _id,
      "name": coalesce(name, title, "Untitled Course"),
      department,
      description,
      instructor,
      schedule
    }`;

    fetchFromSanity<SanityCourse[]>(query).then((data) => {
      setCourses(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const departments = [
    "All",
    ...Array.from(new Set(courses.map((c) => c.department).filter(Boolean))),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      (course.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || course.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-serif uppercase tracking-widest text-primary block mb-1">
            Academic Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            School Subjects &amp; Coaching
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search subjects or teachers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subjects or teachers..."
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading courses from Sanity CMS...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          No courses currently published in Sanity CMS.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col shadow-md"
            >
              <div className="flex-1 space-y-3">
                <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary text-[11px] font-medium">
                  {course.department || "General"}
                </span>
                <h2 className="text-lg font-serif font-bold text-foreground">
                  {course.name}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="pt-2 space-y-1 text-xs text-neutral-300 border-t border-border/60">
                  <div>
                    <strong className="text-muted-foreground">Faculty:</strong>{" "}
                    {course.instructor || "TBA"}
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Schedule:</strong>{" "}
                    {course.schedule || "TBA"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Calendar as CalendarIcon, Clock, Users, CheckCircle, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

// Course Catalog Data
const CATALOG = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 3,
    description: "An introductory course covering the fundamentals of programming, algorithms, and logical thinking.",
    prerequisites: ["None"],
    schedule: "Mon/Wed 10:00 AM - 11:30 AM",
    instructor: "Dr. Alan Turing",
    capacity: 40,
    enrolled: 38
  },
  {
    id: "CS202",
    name: "Computer Science II",
    department: "Computer Science",
    credits: 4,
    description: "Advanced data structures, object-oriented programming, and complexity analysis.",
    prerequisites: ["CS101"],
    schedule: "Tue/Thu 02:00 PM - 03:30 PM",
    instructor: "Dr. Michael Chen",
    capacity: 35,
    enrolled: 12
  },
  {
    id: "MAT301",
    name: "Advanced Mathematics",
    department: "Mathematics",
    credits: 4,
    description: "Calculus, differential equations, and linear algebra applications.",
    prerequisites: ["MAT201"],
    schedule: "Mon/Wed/Fri 09:00 AM - 10:00 AM",
    instructor: "Prof. Sarah Jenkins",
    capacity: 30,
    enrolled: 30
  },
  {
    id: "PHY401",
    name: "Physics: Thermodynamics",
    department: "Physics",
    credits: 3,
    description: "Principles of thermodynamics, statistical mechanics, and their applications.",
    prerequisites: ["PHY202", "MAT301"],
    schedule: "Tue/Thu 11:00 AM - 12:30 PM",
    instructor: "Dr. Robert Smith",
    capacity: 25,
    enrolled: 22
  },
  {
    id: "ENG105",
    name: "English Literature",
    department: "Humanities",
    credits: 3,
    description: "Exploration of classical and modern literature, emphasizing critical analysis and writing.",
    prerequisites: ["None"],
    schedule: "Wed/Fri 01:00 PM - 02:30 PM",
    instructor: "Prof. Emily Post",
    capacity: 45,
    enrolled: 20
  },
  {
    id: "HIS201",
    name: "World History",
    department: "Humanities",
    credits: 3,
    description: "A comprehensive overview of global historical events and their modern impacts.",
    prerequisites: ["None"],
    schedule: "Mon/Wed 03:00 PM - 04:30 PM",
    instructor: "Dr. Howard Zinn",
    capacity: 50,
    enrolled: 40
  }
];

// Initial active user courses
const INITIAL_ENROLLED = ["MAT301", "CS202", "PHY401", "ENG105"];

export default function Courses() {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(INITIAL_ENROLLED);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof CATALOG[0] | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredCatalog = CATALOG.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourses = CATALOG.filter(c => enrolledCourseIds.includes(c.id));

  const handleEnrollClick = (course: typeof CATALOG[0]) => {
    setSelectedCourse(course);
    setEnrollmentStatus("idle");
    setIsEnrollDialogOpen(true);
  };

  const confirmEnrollment = () => {
    if (!selectedCourse) return;

    setEnrollmentStatus("loading");

    // Simulate network delay and validation
    setTimeout(() => {
      // Logic constraint: Class full
      if (selectedCourse.enrolled >= selectedCourse.capacity) {
        setEnrollmentStatus("error");
        setErrorMessage("Class is fully booked. Waitlist is currently closed.");
        return;
      }
      
      // Simulate prerequisites check natively here
      const hasMissingPrereq = selectedCourse.prerequisites.some(
        prereq => prereq !== "None" && !enrolledCourseIds.includes(prereq) && 
        // Just mock CS101 as completed if not enrolled for the sake of demo, except MAT201 which isn't there
        prereq !== "CS101" 
      );

      if (hasMissingPrereq) {
        setEnrollmentStatus("error");
        setErrorMessage("You do not meet all prerequisites for this course.");
        return;
      }

      setEnrolledCourseIds(prev => [...prev, selectedCourse.id]);
      setEnrollmentStatus("success");
      
      setTimeout(() => {
        setIsEnrollDialogOpen(false);
      }, 1500);

    }, 800);
  };

  const handleDropCourse = (courseId: string) => {
    // Basic confirmation inline for demo, could be a dialog
    if(window.confirm("Are you sure you want to drop this course?")) {
      setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Course Catalog & Registration</h1>
        <p className="text-muted-foreground">Manage your enrolled courses and find new classes to join.</p>
      </div>

      <Tabs defaultValue="my-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-secondary/50">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="my-courses" className="mt-6 space-y-6">
          {enrolledCourses.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">No active enrollments</h3>
                <p className="text-muted-foreground max-w-sm mb-6">You aren't enrolled in any courses for the upcoming semester yet. Head over to the catalog to register.</p>
                <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="catalog"]')?.click()}>
                  Browse Course Catalog
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map(course => (
                <Card key={course.id} className="border-border shadow-sm flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3 border-b border-border bg-card/50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{course.id}</Badge>
                      <Badge variant="outline" className="text-muted-foreground">{course.credits} Credits</Badge>
                    </div>
                    <CardTitle className="leading-tight font-serif text-lg">{course.name}</CardTitle>
                    <CardDescription>{course.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="py-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-sm text-foreground mb-2">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground">Instructor:</span>&nbsp;{course.instructor}
                      </div>
                      <div className="flex items-start text-sm text-foreground">
                        <Clock className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                        <span>{course.schedule}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex items-center text-xs text-green-500 font-medium">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Enrolled & Verified
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4 bg-transparent border-t border-border mt-auto flex justify-end">
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full mt-4" onClick={() => handleDropCourse(course.id)}>
                      Drop Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Catalog Tab */}
        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="flex items-center space-x-2 relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, name, or department..." 
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCatalog.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const isFull = course.enrolled >= course.capacity;

              return (
                <Card key={course.id} className="flex flex-col h-full bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-primary text-primary">{course.id}</Badge>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{course.department}</Badge>
                      </div>
                      {isEnrolled && (
                        <Badge className="bg-green-500 hover:bg-green-600">Enrolled</Badge>
                      )}
                      {(!isEnrolled && isFull) && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                    <CardTitle className="font-serif text-xl">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 leading-relaxed h-10">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {course.credits} Credits
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {course.enrolled}/{course.capacity} Seats
                      </div>
                      <div className="col-span-2 flex items-center text-muted-foreground">
                        <CalendarIcon className="w-4 h-4 mr-2 shrink-0" />
                        {course.schedule}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-border">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prerequisites</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.prerequisites.map(prereq => (
                          <Badge key={prereq} variant="outline" className="text-xs text-muted-foreground font-normal">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border bg-muted/20">
                    <Button 
                      className="w-full" 
                      variant={isEnrolled ? "secondary" : "default"}
                      disabled={isEnrolled || isFull}
                      onClick={() => handleEnrollClick(course)}
                    >
                      {isEnrolled ? "Already Enrolled" : isFull ? "Course Full" : "Register for Course"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            {filteredCatalog.length === 0 && (
              <div className="col-span-1 md:col-span-2 py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                No courses found matching "{searchQuery}"
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Registration Secure Flow Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif">Confirm Registration</DialogTitle>
            <DialogDescription>
              Please review the course details before finalizing your enrollment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="font-bold text-lg text-foreground font-serif">{selectedCourse.name}</div>
                <div className="text-sm text-primary mb-3">{selectedCourse.id}</div>
                
                <div className="space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span>{selectedCourse.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span>{selectedCourse.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span>{selectedCourse.credits}</span>
                  </div>
                </div>
              </div>

              {enrollmentStatus === "error" && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              {enrollmentStatus === "success" && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-md flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Successfully enrolled in {selectedCourse.id}.</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEnrollDialogOpen(false)} disabled={enrollmentStatus === "loading" || enrollmentStatus === "success"}>
              Cancel
            </Button>
            <Button 
               onClick={confirmEnrollment} 
               disabled={enrollmentStatus === "loading" || enrollmentStatus === "success"}
               className="min-w:[100px]"
            >
              {enrollmentStatus === "loading" ? "Processing..." : enrollmentStatus === "success" ? "Done" : "Confirm Enrollment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

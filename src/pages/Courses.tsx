import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Calendar as CalendarIcon, Clock, Users, CheckCircle, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/src/hooks/useCourses";
import { Course } from "@/src/types/course";

export default function Courses() {
  const { data: catalog, loading, error } = useCourses();

  const [searchQuery, setSearchQuery] = useState("");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredCatalog = catalog.filter(course =>
    course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hardcode enrolled courses as empty for now since we are just displaying catalog
  const enrolledCourses: Course[] = [];

  const handleEnrollClick = (course: Course) => {
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
      
      setEnrollmentStatus("success");
      
      setTimeout(() => {
        setIsEnrollDialogOpen(false);
      }, 1500);

    }, 800);
  };

  const handleDropCourse = (courseId: string) => {
    if(window.confirm("Are you sure you want to drop this course?")) {
      // Mock dropping logic
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <div className="h-8 bg-muted rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

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

          {catalog.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent mt-6">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">No courses available yet</h3>
                <p className="text-muted-foreground max-w-sm">Please check back soon.</p>
              </CardContent>
            </Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCatalog.map(course => {
              const isEnrolled = false; // Mock as false for now
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
          )}
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

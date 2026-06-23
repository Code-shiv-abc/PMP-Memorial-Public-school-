import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, ArrowRight, Award, CheckCircle, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useUserProfile } from "@/src/hooks/useUserProfile";

export default function PortalDashboard() {
  const currentUser = auth.currentUser;
  const { data: userData, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted rounded-xl animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
          </div>
          <div className="space-y-6">
             <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
             <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error || "Profile not found. Please contact your administrator."}</p>
        </div>
      </div>
    );
  }

  const displayName = userData.name || currentUser?.displayName || "Student";
  const firstName = displayName.split(' ')[0];

  // Derive personalized recommendations natively
  const hasCourses = userData.courses && userData.courses.length > 0;
  const lowestCourse = hasCourses ? [...userData.courses].sort((a, b) => a.progress - b.progress)[0] : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your courses today.</p>
      </div>

      {/* Personalized AI Insight Feature */}
      {hasCourses && lowestCourse && (
        <div className="bg-gradient-to-r from-primary/20 via-background to-background border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
             <Sparkles className="w-48 h-48" />
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0 border border-primary/30">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-bold text-foreground mb-1 text-lg">Personalized Insight</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Based on your recent activity, your progress in <strong className="text-foreground font-semibold">{lowestCourse.name}</strong> is currently at <strong className="text-foreground">{lowestCourse.progress}%</strong>.
              Consider dedicating your 2:00 PM tutorial today entirely to reviewing chapter 4. We recommend attempting the practice quiz before Friday.
            </p>
          </div>
          <div>
            <Button className="shrink-0 gap-2 font-semibold">
              <TrendingUp className="w-4 h-4" /> View Study Plan
            </Button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-serif font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current GPA</p>
                <p className="text-4xl font-serif font-bold text-foreground">{userData.gpa.toFixed(1)}<span className="text-lg text-muted-foreground font-normal">/4.0</span></p>
              </div>
              <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400 font-medium">
               <ArrowRight className="w-4 h-4 mr-1 -rotate-45" /> +0.2 from last semester
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-serif font-semibold text-muted-foreground uppercase tracking-wider mb-1">Attendance</p>
                <p className="text-4xl font-serif font-bold text-foreground">{userData.attendance}<span className="text-lg text-muted-foreground font-normal">%</span></p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground font-medium">
               Overall attendance this term
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-none text-white bg-primary">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider mb-1">Upcoming Assignments</p>
                <p className="text-4xl font-serif font-bold text-primary-foreground">{userData.assignmentsDue + 2}</p>
              </div>
              <div className="p-3 bg-card/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-primary-foreground/90 font-medium">
               {userData.assignmentsDue} due within the next 48 hours
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Your enrolled subjects for Fall 2026</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {userData.courses.map((course, i) => (
                  <div key={i} className="p-4 sm:p-6 hover:bg-background transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-serif font-bold text-foreground">{course.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{course.code} • {course.teacher}</p>
                    </div>
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-serif font-semibold text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${course.progress > 80 ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-background border-b border-border rounded-t-xl">
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {userData.schedule.map((schedule, i) => (
                  <div key={i} className="flex p-4">
                    <div className="w-20 shrink-0 text-sm font-serif font-semibold text-muted-foreground border-r border-border pr-3 mr-3 flex flex-col justify-center">
                      {schedule.time}
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-foreground">{schedule.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] uppercase font-serif font-bold bg-muted px-1 py-0">{schedule.type}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> {schedule.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                 Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {userData.tasks.map((task, i) => (
                   <div key={i} className="flex gap-3 items-start border-l-2 border-primary pl-3">
                     <div className="mt-0.5"><input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" /></div>
                     <div>
                       <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                       <p className="text-xs text-muted-foreground mt-0.5">Due: {task.due}</p>
                     </div>
                   </div>
                 ))}
               </div>
               <Button variant="outline" className="w-full mt-6 text-sm">View All Assignments</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

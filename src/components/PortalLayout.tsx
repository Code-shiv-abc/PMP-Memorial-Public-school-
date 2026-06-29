import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar as CalendarIcon, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User,
  Menu,
  X,
  Loader2,
  Bot
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth, logOut } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogOut = async () => {
    await logOut();
    navigate('/');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/portal" },
    { icon: BookOpen, label: "My Courses", path: "/portal/courses" },
    { icon: FileText, label: "Assignments", path: "/portal/assignments" },
    { icon: CalendarIcon, label: "Schedule", path: "/portal/schedule" },
    { icon: Bot, label: "Study Assistant", path: "/portal/study-assistant" },
    { icon: Settings, label: "Settings", path: "/portal/settings" },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-6 border-b border-border shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-white flex justify-center items-center font-serif font-bold">
            P
          </div>
          <span className="font-serif font-bold text-lg text-primary uppercase tracking-wide">PMP Portal</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border shrink-0">
        <Button onClick={handleLogOut} variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile (Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
              <button 
                className="absolute top-6 right-4 p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative max-w-full">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="hidden md:flex items-center relative w-96">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
            <Input placeholder="Search portal..." className="pl-9 bg-background border-border" />
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border-2 border-card"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2 pl-1 pr-1 border border-border rounded-full h-10 sm:w-auto sm:px-3 hover:bg-secondary")}>
                  <Avatar className="w-8 h-8">
                    {user?.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                    ) : null}
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold font-serif">
                      {user?.displayName ? user.displayName.substring(0,2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block text-sm font-medium text-foreground pr-1">{user?.displayName || "Student"}</span>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-serif font-bold text-foreground">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className="text-destructive cursor-pointer focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

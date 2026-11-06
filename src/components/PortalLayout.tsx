import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Globe,
  Home,
  Phone
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, logOut } from "@/lib/firebase";
import { useLanguage } from "@/src/context/LanguageContext";

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const navItems = [
    {
      name: isHi ? "डैशबोर्ड (Dashboard)" : "Dashboard",
      path: "/portal",
      icon: LayoutDashboard,
    },
    {
      name: isHi ? "विद्या AI ट्यूटर (Vidya AI)" : "Vidya AI Tutor",
      path: "/portal/study-assistant",
      icon: Sparkles,
      badge: "AI",
    },
    {
      name: isHi ? "विषय एवं पाठ्यक्रम (Subjects)" : "Subjects & Courses",
      path: "/portal/courses",
      icon: BookOpen,
    },
    {
      name: isHi ? "गृहकार्य (Assignments)" : "Assignments",
      path: "/portal/assignments",
      icon: FileText,
    },
    {
      name: isHi ? "समय सारणी (Timetable)" : "Schedule",
      path: "/portal/schedule",
      icon: Calendar,
    },
    {
      name: isHi ? "सेटिंग्स (Settings)" : "Settings",
      path: "/portal/settings",
      icon: Settings,
    },
  ];

  const displayName =
    currentUser?.displayName || (isHi ? "विद्यार्थी (Scholar)" : "PMP Scholar");
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0F1115] text-foreground flex flex-col lg:flex-row font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#14171E] border-r border-border shrink-0 select-none">
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-serif font-black text-base shadow-md">
              PMP
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-foreground block leading-none">
                P.M.P. Memorial
              </span>
              <span className="text-[10px] text-primary uppercase tracking-widest block mt-1">
                {isHi ? "विद्यार्थी पोर्टल" : "Scholar Portal"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto" aria-label="Portal Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? "bg-black/20 text-primary-foreground"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-[#111318] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 text-primary flex items-center justify-center font-serif font-bold text-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-primary truncate">Student • Shahpur, Gonda</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isHi ? "मुख्य पृष्ठ" : "Website"}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-950/40 text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isHi ? "लॉग आउट" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sm:h-16 bg-[#14171E]/95 backdrop-blur-md border-b border-border px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open portal navigation menu"
              className="lg:hidden p-2 rounded-lg border border-border text-foreground hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/portal" className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-xs">
                PMP
              </div>
              <span className="font-serif font-bold text-sm text-foreground">
                {isHi ? "विद्यार्थी पोर्टल" : "Student Portal"}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
              <span>P.M.P. Memorial Public School, Shahpur, Gonda</span>
              <span>•</span>
              <span className="text-primary font-medium" lang="hi">
                शिक्षार्थ आइये, सेवार्थ जाइये
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+919792954343"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>Helpline: 9792954343</span>
            </a>

            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              aria-label={language === "en" ? "Switch language to Hindi" : "Switch language to English"}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === "en" ? "हिंदी" : "English"}</span>
            </button>

            <Link
              to="/portal/study-assistant"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-serif font-semibold hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHi ? "विद्या AI" : "Vidya AI"}</span>
            </Link>
          </div>
        </header>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/70 z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#14171E] border-r border-border z-50 flex flex-col lg:hidden"
              >
                <div className="h-14 px-4 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-sm">
                      PMP
                    </div>
                    <span className="font-serif font-bold text-sm text-foreground">
                      P.M.P. Scholar Portal
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close portal navigation menu"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/20">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-border bg-[#111318] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 text-primary flex items-center justify-center font-serif font-bold text-sm">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                      <p className="text-[11px] text-primary truncate">Student</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-border text-xs text-foreground"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>{isHi ? "मुख्य वेबसाइट" : "Home Site"}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-red-900/40 text-red-400 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isHi ? "लॉग आउट" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;

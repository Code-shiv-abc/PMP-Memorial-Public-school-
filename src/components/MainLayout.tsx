import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, UserCheck, LogOut, Phone, MessageCircle, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { signIn, logOut } from "@/lib/firebase";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useLanguage } from "@/src/context/LanguageContext";
import toast from "react-hot-toast";

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { user, loading } = useUserProfile();
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      const signedInUser = await signIn();
      if (signedInUser) {
        navigate("/portal");
      }
    } catch (error) {
      console.error("Sign in failed", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const navLinks = [
    { name: isHi ? "शिक्षा (Academics)" : "Academics", path: "/academics" },
    { name: isHi ? "शिक्षक (Faculty)" : "Faculty", path: "/faculty" },
    { name: isHi ? "पुस्तकालय (Library)" : "Library", path: "/library" },
    { name: isHi ? "कार्यक्रम (Events)" : "Events", path: "/events" },
    { name: isHi ? "पूर्व छात्र (Alumni)" : "Alumni", path: "/alumni" },
    { name: isHi ? "हमारे बारे में (About)" : "About", path: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Top Utility Belt */}
      <div className="bg-secondary text-muted-foreground text-xs py-2 px-4 sm:px-6 border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/admissions"
              className="inline-flex items-center text-primary font-medium tracking-wider uppercase text-[10px] hover:underline"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse" />
              {isHi ? "प्रवेश प्रारम्भ 2026-27 (PG – कक्षा 12)" : "Admissions Open 2026–27 (PG – Class 12)"}
            </Link>
            <a
              href="tel:+919792954343"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors text-[11px] text-foreground font-medium"
            >
              <Phone className="w-3 h-3 text-primary" />
              <span>+91 97929 54343</span>
            </a>
            <a
              href="tel:+917651995858"
              className="hidden md:inline-flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
            >
              <Phone className="w-3 h-3 text-primary" />
              <span>+91 76519 95858</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            {/* Bilingual Toggle Button */}
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              aria-label={language === "en" ? "Switch language to Hindi" : "Switch language to English"}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-medium rounded"
            >
              <Globe className="w-3 h-3" />
              <span>{language === "en" ? "हिंदी में देखें" : "English"}</span>
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/portal"
                      className="text-primary hover:underline flex items-center gap-1 font-medium text-[11px]"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isHi ? "विद्यार्थी पोर्टल" : "Student Portal"}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={logOut}
                      aria-label="Sign out"
                      className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <LogOut className="w-3 h-3" />
                      <span className="hidden sm:inline">{isHi ? "लॉग आउट" : "Sign Out"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="px-3 py-0.5 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-medium rounded disabled:opacity-50"
                  >
                    {isSigningIn
                      ? isHi ? "प्रतीक्षा करें..." : "Signing In..."
                      : isHi ? "पोर्टल लॉगिन (Vidya AI)" : "Access Portal (Vidya AI)"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border py-3 shadow-lg"
            : "bg-background py-5 border-b border-border/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-none border border-primary flex items-center justify-center bg-card group-hover:bg-primary transition-colors shrink-0">
              <span className="font-serif font-bold text-lg sm:text-xl text-primary group-hover:text-primary-foreground transition-colors">
                PMP
              </span>
            </div>
            <div>
              <span className="font-serif text-lg sm:text-2xl tracking-tight text-foreground block leading-none">
                P.M.P. Memorial
              </span>
              <span
                className="text-[10px] tracking-[0.18em] uppercase text-primary block mt-1 font-medium"
                lang="hi"
              >
                पब्लिक स्कूल • शाहपुर, गोंडा (उ.प्र.)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              to="/admissions"
              className="px-5 py-2.5 bg-primary text-primary-foreground font-serif font-semibold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 group"
            >
              <span>{isHi ? "प्रवेश फॉर्म" : "Apply Now"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden text-foreground p-2.5 focus:outline-none border border-border rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-b border-border overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-base font-serif py-2 border-b border-border/40 ${
                      location.pathname === link.path ? "text-primary font-bold" : "text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/admissions"
                    className="w-full py-3 bg-primary text-primary-foreground text-center font-serif font-semibold text-xs uppercase tracking-widest block"
                  >
                    {isHi ? "प्रवेश के लिए आवेदन करें (Apply Now)" : "Apply for Admission"}
                  </Link>
                  <a
                    href="tel:+919792954343"
                    className="w-full py-3 border border-primary/50 text-primary text-center font-serif font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call: 9792954343</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>

      {/* Floating WhatsApp Quick Inquiry Button */}
      <a
        href="https://wa.me/919792954343?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20P.M.P.%20Memorial%20Public%20School%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B5%E0%A5%87%E0%A4%B6%20(Admission)%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Admissions on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl border border-emerald-400/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          {isHi ? "WhatsApp सहायता" : "WhatsApp Inquiry"}
        </span>
      </a>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground border-t border-border pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-primary flex items-center justify-center bg-background">
                <span className="font-serif font-bold text-sm text-primary">PMP</span>
              </div>
              <span className="font-serif text-xl text-foreground tracking-tight">
                P.M.P. Memorial Public School
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              UP Government (UP Sarkar) recognized institution in Shahpur, Gonda. Empowering students from Playgroup to Class 12 with modern computer education, bilingual AI tutoring, and strong moral values.
            </p>
            <p className="text-xs text-primary/90 font-serif tracking-widest uppercase" lang="hi">
              “शिक्षार्थ आइये, सेवार्थ जाइये • विद्या ददाति विनयम्”
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-serif font-semibold uppercase tracking-widest text-foreground mb-5">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us (हमारे बारे में)</Link></li>
              <li><Link to="/academics" className="hover:text-primary transition-colors">Academics (पाठ्यक्रम)</Link></li>
              <li><Link to="/admissions" className="hover:text-primary transition-colors">Admissions (प्रवेश फॉर्म)</Link></li>
              <li><Link to="/faculty" className="hover:text-primary transition-colors">Leadership &amp; Faculty</Link></li>
              <li><Link to="/library" className="hover:text-primary transition-colors">Digital Library</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">School Events</Link></li>
              <li><Link to="/alumni" className="hover:text-primary transition-colors">Student Achievements</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs font-serif font-semibold uppercase tracking-widest text-foreground mb-5">
              Campus &amp; Direct Contact
            </h3>
            <address className="not-italic text-sm space-y-2.5 text-muted-foreground">
              <p className="text-foreground font-medium">P.M.P. Memorial Public School</p>
              <p>Gram Shahpur, Post Rek Sadiya</p>
              <p>District Gonda, Uttar Pradesh 271504</p>
              <div className="pt-3 space-y-1.5">
                <p>
                  <span className="text-xs text-muted-foreground">Coordinator (Sunil Kumar Tiwari): </span>
                  <a href="tel:+919792954343" className="block text-primary hover:underline font-medium">
                    +91 97929 54343
                  </a>
                </p>
                <p>
                  <span className="text-xs text-muted-foreground">Manager (Shri Arvind Kumar Tiwari): </span>
                  <a href="tel:+917651995858" className="block text-primary hover:underline font-medium">
                    +91 76519 95858
                  </a>
                </p>
                <p>
                  <span className="text-xs text-muted-foreground">Founder (Shri A.K. Tripathi): </span>
                  <a href="tel:+916394282229" className="block text-primary hover:underline font-medium">
                    +91 63942 82229
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} P.M.P. Memorial Public School, Shahpur, Gonda. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/admissions" className="hover:text-primary transition-colors">Online Admission</Link>
            <Link to="/portal" className="hover:text-primary transition-colors">Vidya AI Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;

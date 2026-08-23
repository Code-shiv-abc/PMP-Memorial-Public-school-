import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ArrowRight, LogIn, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { signIn, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      if (auth.currentUser) {
        navigate('/portal');
        return;
      }
      await signIn();
      navigate('/portal');
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const navLinks = [
    { name: "Academics", path: "/academics" },
    { name: "Faculty", path: "/faculty" },
    { name: "Library", path: "/library" },
    { name: "Alumni", path: "/alumni" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/30">
      {/* Top Utility Belt */}
      <div className="bg-foreground text-background py-1.5 px-4 sm:px-6 lg:px-8 text-xs font-semibold tracking-wider uppercase flex justify-between items-center w-full z-50 relative">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex gap-6 items-center opacity-80">
            <span className="hidden sm:inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Admissions Open 2026-27</span>
            <span className="hidden sm:inline opacity-50">|</span>
             <a href="mailto:info@pmpmemorial.edu" className="hover:text-primary transition-colors">info@pmpmemorial.edu</a>
          </div>
          <button 
            onClick={handleLogin} 
            disabled={isLoggingIn} 
            className="hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogIn className="w-3 h-3" />}
            {user ? 'Go to Portal' : 'Portal Access'}
          </button>
        </div>
      </div>

      {/* Main Premium Navigation */}
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-500 border-b",
        scrolled ? "bg-background/80 backdrop-blur-xl border-border py-2 support-[backdrop-filter]:bg-background/60" : "bg-background/95 border-transparent py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary flex items-center justify-center font-serif text-primary-foreground font-bold text-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-2xl leading-none text-foreground tracking-tight">P.M.P. Memorial</span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-muted-foreground uppercase opacity-80 mt-1">Institutional Excellence</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative py-2",
                  location.pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/admissions" className="inline-flex h-9 shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 gap-1.5 rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-semibold px-6 transition-colors duration-300">
                Apply Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background border-b border-border absolute w-full"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {[...navLinks, {name: 'About', path: '/about'}].map((link, i) => (
                  <motion.div
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: i * 0.05 }}
                     key={link.path}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-2xl font-serif tracking-tight transition-colors",
                         location.pathname === link.path ? "text-primary italic" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="pt-6 border-t border-border flex flex-col gap-4 mt-4"
                >
                  <Link to="/admissions" onClick={() => setMobileMenuOpen(false)} className="inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 h-9 gap-1.5 px-2.5 rounded-none w-full bg-foreground text-background hover:bg-primary">
                    Apply for Admission
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-card text-foreground pt-24 pb-12 border-t border-border relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-primary-foreground font-serif text-2xl font-bold">
                  P
                </div>
                <div>
                  <h2 className="font-serif font-bold text-2xl leading-none text-foreground tracking-tight">P.M.P. Memorial</h2>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-80 mt-1 block">Public School</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm font-light">
                Empowering minds, shaping futures. A premier institution dedicated to academic excellence, innovative leadership, and holistic development since 1996.
              </p>
            </div>
            
            <div className="md:col-span-2 md:col-start-7">
              <h3 className="font-sans font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">Institution</h3>
              <ul className="space-y-4">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Leadership', path: '/faculty' },
                  { name: 'Academics', path: '/academics' },
                  { name: 'Admissions', path: '/admissions' },
                ].map((item) => (
                  <li key={item.name}><Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">{item.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-sans font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">Resources</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Digital Library', path: '/library' },
                  { name: 'Student Portal', path: '/portal' },
                  { name: 'Alumni Network', path: '/alumni' },
                  { name: 'Events Calendar', path: '/events' },
                ].map((item) => (
                  <li key={item.name}><Link to={item.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">{item.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-sans font-bold text-foreground mb-6 uppercase text-xs tracking-[0.2em]">Connect</h3>
              <ul className="space-y-4 text-sm text-muted-foreground font-light">
                <li>123 Education Blvd<br/>Knowledge City, KC 10001</li>
                <li><a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a></li>
                <li><a href="mailto:contact@pmpmemorial.edu" className="hover:text-primary transition-colors">contact@pmpmemorial.edu</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-xs font-medium tracking-wide text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4 uppercase">
            <p>&copy; {new Date().getFullYear()} P.M.P. Memorial Public School.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

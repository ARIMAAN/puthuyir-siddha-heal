import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navbar translations directly in the component
const navTranslations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    treatments: "Treatments",
    blog: "Blog",
    contact: "Contact",
    bookConsultation: "Book Consultation",
  },
  ta: {
    home: "முகப்பு",
    about: "எங்களை பற்றி",
    services: "சேவைகள்",
    treatments: "சிகிச்சைகள்",
    blog: "வலைப்பதிவு",
    contact: "தொடர்பு",
    bookConsultation: "ஆலோசனை பதிவு செய்யுங்கள்",
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const t = navTranslations[language];

  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const tkn = localStorage.getItem("token");
    setToken(tkn);
    setUserName(localStorage.getItem("userName") || "");
  }, [location.pathname]);

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("profileComplete");
    setToken(null);
    navigate("/");
  };

  const navLinks = [
    { name: t.home, path: "/" },
    { name: t.about, path: "/about" },
    { name: t.services, path: "/services" },
    { name: t.treatments, path: "/treatments" },
    { name: t.blog, path: "/blog" },
    { name: t.contact, path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo-modified.svg"
              alt="Puthuyir Logo"
              className="w-14 h-14 rounded-full transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold text-foreground">Puthuyir</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "தமிழ்" : "EN"}
            </Button>
            <Button asChild variant="default">
              <Link to="/book-appointment">{t.bookConsultation}</Link>
            </Button>
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{userName || "Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="mx-4 gap-2"
              >
                <Languages className="w-4 h-4" />
                {language === "en" ? "தமிழ்" : "EN"}
              </Button>
              <Button asChild className="mx-4">
                <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
                  {t.bookConsultation}
                </Link>
              </Button>
              {token ? (
                <div className="mx-4 mt-2 grid gap-2">
                  <Button variant="secondary" onClick={() => { setIsOpen(false); navigate("/dashboard"); }}>Dashboard</Button>
                  <Button variant="secondary" onClick={() => { setIsOpen(false); navigate("/profile"); }}>Profile</Button>
                  <Button variant="outline" onClick={() => { setIsOpen(false); handleSignOut(); }}>Sign out</Button>
                </div>
              ) : (
                <div className="mx-4 mt-2">
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

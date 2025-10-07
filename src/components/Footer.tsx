import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import { FaTelegram, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

// Footer translations directly in the component
const footerTranslations = {
  en: {
    rights: "© 2025 Puthuyir. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    onlineConsult: "Online Consultations Available",
    about: "About",
    services: "Services",
    treatments: "Treatments",
    blog: "Blog",
  },
  ta: {
    rights: "© 2025 புத்துயிர். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.",
    privacy: "தனியுரிமைக் கொள்கை",
    terms: "விதிமுறைகள்",
    quickLinks: "விரைவு இணைப்புகள்",
    contactUs: "தொடர்பு கொள்ள",
    followUs: "எங்களை பின்தொடருங்கள்",
    onlineConsult: "ஆன்லைன் ஆலோசனைகள் கிடைக்கும்",
    about: "எங்களை பற்றி",
    services: "சேவைகள்",
    treatments: "சிகிச்சைகள்",
    blog: "வலைப்பதிவு",
  },
};

const Footer = () => {
  const { language } = useLanguage();
  const t = footerTranslations[language];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo-modified.svg"
                alt="Puthuyir Logo"
                className="w-14 h-14 rounded-full"
              />
              <span className="text-xl font-bold text-foreground">Puthuyir</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "ta"
                ? "உண்மையான சித்த மருத்துவம் மூலம் இயற்கையாக குணமாக்குதல், முழுமையாக வாழ்தல்."
                : "Healing Naturally, Living Fully through authentic Siddha medicine."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              {(
                [
                  { name: t.about, path: "/about" },
                  { name: t.services, path: "/services" },
                  { name: t.treatments, path: "/treatments" },
                  { name: t.blog, path: "/blog" },
                ] as const
              ).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:contact@puthuyir.com"
                  className="hover:text-primary transition-colors"
                >
                  contact@puthuyir.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t.onlineConsult}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.followUs}</h3>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: FaTelegram, href: "#", label: "Telegram" },
                  { Icon: FaWhatsapp, href: "#", label: "WhatsApp" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: FaPinterest, href: "#", label: "Pinterest" },
                ] as const
              ).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t.rights} | Dr. Dhivyadhashini, BSMS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


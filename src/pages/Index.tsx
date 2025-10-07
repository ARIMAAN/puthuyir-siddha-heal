import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-siddha.jpg";
import { 
  Leaf, 
  MessageSquare, 
  FileText, 
  Truck, 
  RefreshCw,
  Heart,
  Brain,
  Sparkles,
  Shield,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Home page translations
const homeTranslations = {
  en: {
    hero: {
      title: "Healing Naturally, Living Fully",
      description:
        "Personalized Siddha consultations and rejuvenation therapies designed to help you restore balance, enhance vitality, and achieve long-term wellness.",
      bookButton: "Book Consultation",
      learnMore: "Learn More",
    },
    highlights: {
      natural: "100% Siddha-based Natural Treatments",
      naturalDesc: "Ancient wisdom for modern wellness",
      consultation: "Online Consultation via Chat, Audio, or Video",
      consultationDesc: "Connect with Dr. Dhivyadhashini anytime",
      prescription: "Personalized E-Prescription & Home Delivery",
      prescriptionDesc: "Care delivered to your doorstep",
      followup: "Continuous Follow-up & Lifestyle Guidance",
      followupDesc: "Ongoing support for lasting health",
    },
    services: {
      title: "Featured Services",
      subtitle:
        "Comprehensive Siddha therapies tailored to your unique health needs",
      chronic: "Chronic & Lifestyle Disorders",
      chronicDesc:
        "Natural management for diabetes, hypertension, obesity, and stress",
      rejuvenation: "Rejuvenation Therapy (Kaya Kalpa)",
      rejuvenationDesc:
        "Ancient Siddha practices for vitality and longevity",
      skinHair: "Skin, Hair & Hormonal Care",
      skinHairDesc:
        "Holistic solutions for PCOS, acne, hair loss, and more",
      digestive: "Digestive & Respiratory Health",
      digestiveDesc:
        "Relief from gastritis, asthma, allergies, and chronic ailments",
      viewAll: "View All Services",
      learnMore: "Learn More",
    },
    cta: {
      title: "Ready to Start Your Healing Journey?",
      subtitle:
        "Take the first step towards natural wellness with a personalized Siddha consultation",
      button: "Book Your Consultation Now",
    },
  },
  ta: {
    hero: {
      title: "இயற்கையாக குணமாக்குதல், முழுமையாக வாழ்தல்",
      description:
        "உங்கள் சமநிலையை மீட்டெடுக்கவும், உயிர்ச்சக்தியை மேம்படுத்தவும், நீண்டகால ஆரோக்கியத்தை அடையவும் வடிவமைக்கப்பட்ட தனிப்பட்ட சித்த மருத்துவ ஆலோசனைகள் மற்றும் புத்துயிர் சிகிச்சைகள்.",
      bookButton: "ஆலோசனை பதிவு செய்யுங்கள்",
      learnMore: "மேலும் அறிக",
    },
    highlights: {
      natural: "100% சித்த அடிப்படையிலான இயற்கை சிகிச்சைகள்",
      naturalDesc: "நவீன ஆரோக்கியத்திற்கான பழமையான ஞானம்",
      consultation: "அரட்டை, ஆடியோ அல்லது வீடியோ வழியாக ஆன்லைன் ஆலோசனை",
      consultationDesc: "எப்போது வேண்டுமானாலும் டாக்டர் திவ்யதர்சினியுடன் இணையுங்கள்",
      prescription: "தனிப்பயனாக்கப்பட்ட மின்-பரிந்துரை மற்றும் வீட்டு வாசல் விநியோகம்",
      prescriptionDesc: "உங்களுக்கு வசதியான பராமரிப்பு வழங்கப்படுகிறது",
      followup: "தொடர்ச்சியான பின்தொடர்தல் மற்றும் வாழ்க்கைமுறை வழிகாட்டுதல்",
      followupDesc: "நீடித்த ஆரோக்கியத்திற்கான தொடர்ச்சியான ஆதரவு",
    },
    services: {
      title: "சிறப்பு சேவைகள்",
      subtitle:
        "உங்கள் தனிப்பட்ட ஆரோக்கிய தேவைகளுக்கு ஏற்ற விரிவான சித்த சிகிச்சைகள்",
      chronic: "நாள்பட்ட மற்றும் வாழ்க்கை முறை கோளாறுகள்",
      chronicDesc:
        "நீரிழிவு, உயர் இரத்த அழுத்தம், உடல் பருமன் மற்றும் மன அழுத்தத்தின் இயற்கை மேலாண்மை",
      rejuvenation: "புத்துயிர் சிகிச்சை (காயகல்பம்)",
      rejuvenationDesc:
        "உயிர்ச்சக்தி மற்றும் நீண்ட ஆயுளுக்கான பழமையான சித்த நடைமுறைகள்",
      skinHair: "தோல், முடி மற்றும் ஹார்மோன் பராமரிப்பு",
      skinHairDesc:
        "PCOS, முகப்பரு, முடி உதிர்தல் மற்றும் பலவற்றிற்கான முழுமையான தீர்வுகள்",
      digestive: "செரிமான மற்றும் சுவாச ஆரோக்கியம்",
      digestiveDesc:
        "இரைப்பை அழற்சி, ஆஸ்துமா, ஒவ்வாமை மற்றும் நாள்பட்ட நோய்களிலிருந்து நிவாரணம்",
      viewAll: "அனைத்து சேவைகளையும் காண்க",
      learnMore: "மேலும் அறிக",
    },
    cta: {
      title: "உங்கள் குணப்படுத்தும் பயணத்தைத் தொடங்கத் தயாரா?",
      subtitle:
        "தனிப்பயனாக்கப்பட்ட சித்த ஆலோசனையுடன் இயற்கை ஆரோக்கியத்தை நோக்கி முதல் படியை எடுத்து வையுங்கள்",
      button: "இப்போது உங்கள் ஆலோசனையை பதிவு செய்யுங்கள்",
    },
  },
};

const Index = () => {
  const { language } = useLanguage();
  const t = homeTranslations[language];

  const highlights = [
    {
      icon: Leaf,
      title: t.highlights.natural,
      description: t.highlights.naturalDesc
    },
    {
      icon: MessageSquare,
      title: t.highlights.consultation,
      description: t.highlights.consultationDesc
    },
    {
      icon: FileText,
      title: t.highlights.prescription,
      description: t.highlights.prescriptionDesc
    },
    {
      icon: RefreshCw,
      title: t.highlights.followup,
      description: t.highlights.followupDesc
    }
  ];

  const services = [
    {
      icon: Heart,
      title: t.services.chronic,
      description: t.services.chronicDesc
    },
    {
      icon: Sparkles,
      title: t.services.rejuvenation,
      description: t.services.rejuvenationDesc
    },
    {
      icon: Brain,
      title: t.services.skinHair,
      description: t.services.skinHairDesc
    },
    {
      icon: Shield,
      title: t.services.digestive,
      description: t.services.digestiveDesc
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t.hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/book-appointment">
                    {t.hero.bookButton}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">{t.hero.learnMore}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Siddha Medicine - Natural Healing"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-lg group">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-4xl font-bold text-foreground">{t.services.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary group">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <Link to="/treatments" className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all">
                    {t.services.learnMore}
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">{t.services.viewAll}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">{t.cta.title}</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            {t.cta.subtitle}
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link to="/book-appointment">
              {t.cta.button}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Index;

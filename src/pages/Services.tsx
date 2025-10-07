import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Phone, 
  Video, 
  FileText, 
  Truck, 
  RefreshCw, 
  Book,
  Calendar,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Services page translations
const servicesTranslations = {
  en: {
    title: "Services",
    subtitle: "Comprehensive Siddha therapies for your needs",
    consultationModesTitle: "Choose Your Consultation Mode",
    consultationModesDesc: "Connect with Dr. Dhivyadhashini in your preferred way",
    chat: "Chat Consultation",
    chatDesc: "Text-based consultation for detailed discussions at your convenience",
    audio: "Audio Call Consultation",
    audioDesc: "Voice consultation for personal connection and guidance",
    video: "Video Call Consultation",
    videoDesc: "Face-to-face consultation for thorough assessment",
    additionalSupportTitle: "Additional Support",
    additionalSupportDesc: "Holistic care beyond consultation",
    ePrescription: "E-Prescription",
    ePrescriptionDesc: "Digital prescription accessible anytime",
    medicineDelivery: "Medicine Delivery",
    medicineDeliveryDesc: "Home delivery of authentic Siddha medicines",
    followup: "Follow-up System",
    followupDesc: "Regular follow-ups to track progress",
    lifestyle: "Lifestyle & Diet Guidance",
    lifestyleDesc: "Personalized recommendations for holistic wellness",
    processTitle: "How It Works",
    processDesc: "Simple steps to start your healing journey",
    step1: "Book Online",
    step1Desc: "Choose your preferred time and consultation mode",
    step2: "Consultation",
    step2Desc: "Share symptoms, medical history, and reports",
    step3: "Receive Care",
    step3Desc: "Get e-prescription and medicines delivered",
    whyChooseTitle: "Why Puthuyir?",
    whyChoose: [
      "Faster recovery and lasting results",
      "Affordable treatments with no side effects",
      "Herbal and high-quality products",
      "Focus on holistic wellness, not just symptoms",
    ],
    bookNow: "Book Your Consultation",
  },
  ta: {
    title: "சேவைகள்",
    subtitle: "உங்கள் தேவைகளுக்கான விரிவான சித்த சிகிச்சைகள்",
    consultationModesTitle: "உங்கள் ஆலோசனை முறையைத் தேர்ந்தெடுக்கவும்",
    consultationModesDesc: "உங்களுக்கு ஏற்ற முறையில் டாக்டர் திவ்யதர்சினியுடன் இணைக",
    chat: "அரட்டை ஆலோசனை",
    chatDesc: "உங்களுக்கு வசதியாக விரிவான விவாதங்களுக்கு உரை அடிப்படையிலான ஆலோசனை",
    audio: "ஆடியோ அழைப்பு ஆலோசனை",
    audioDesc: "தனிப்பட்ட தொடர்புக்கும் வழிகாட்டலுக்கும் குரல் ஆலோசனை",
    video: "வீடியோ அழைப்பு ஆலோசனை",
    videoDesc: "முழுமையான மதிப்பீட்டிற்கான நேருக்கு நேர் ஆலோசனை",
    additionalSupportTitle: "கூடுதல் ஆதரவு",
    additionalSupportDesc: "ஆலோசனைக்கு அப்பாலும் முழுமையான பராமரிப்பு",
    ePrescription: "மின் பரிந்துரை",
    ePrescriptionDesc: "எப்போது வேண்டுமானாலும் அணுகக்கூடிய டிஜிட்டல் பரிந்துரை",
    medicineDelivery: "மருந்து விநியோகம்",
    medicineDeliveryDesc: "அசல் சித்த மருந்துகளின் வீட்டு வாசல் விநியோகம்",
    followup: "பின்தொடர்பு அமைப்பு",
    followupDesc: "முன்னேற்றத்தை கண்காணிக்க வழக்கமான பின்தொடர்பு",
    lifestyle: "வாழ்க்கைமுறை மற்றும் உணவு வழிகாட்டுதல்",
    lifestyleDesc: "முழுமையான நலனுக்கான தனிப்பட்ட பரிந்துரைகள்",
    processTitle: "எப்படி செயல்படுகிறது",
    processDesc: "உங்கள் குணப்படுத்தும் பயணத்தைத் தொடங்க எளிய படிகள்",
    step1: "ஆன்லைன் பதிவு செய்யவும்",
    step1Desc: "உங்கள் விருப்பமான நேரமும் ஆலோசனை முறையும் தேர்ந்தெடுக்கவும்",
    step2: "ஆலோசனை",
    step2Desc: "அறிகுறிகள், மருத்துவ வரலாறு மற்றும் அறிக்கைகளை பகிரவும்",
    step3: "பராமரிப்பு பெறுங்கள்",
    step3Desc: "மின் பரிந்துரை மற்றும் மருந்துகளைப் பெறுங்கள்",
    whyChooseTitle: "ஏன் புத்துயிர்?",
    whyChoose: [
      "விரைவான குணமடைதலும் நீடித்த முடிவுகளும்",
      "பக்கவிளைவுகள் இல்லாமல் மலிவான சிகிச்சைகள்",
      "மூலிகை மற்றும் உயர்தர தயாரிப்புகள்",
      "அறிகுறிகள் மட்டுமல்ல, முழுமையான நலனில் கவனம்",
    ],
    bookNow: "உங்கள் ஆலோசனையை பதிவு செய்யுங்கள்",
  },
};

const Services = () => {
  const { language } = useLanguage();
  const t = servicesTranslations[language];

  const consultationModes = [
    {
      icon: MessageSquare,
      title: t.chat,
      description: t.chatDesc
    },
    {
      icon: Phone,
      title: t.audio,
      description: t.audioDesc
    },
    {
      icon: Video,
      title: t.video,
      description: t.videoDesc
    }
  ];

  const additionalServices = [
    {
      icon: FileText,
      title: t.ePrescription,
      description: t.ePrescriptionDesc
    },
    {
      icon: Truck,
      title: t.medicineDelivery,
      description: t.medicineDeliveryDesc
    },
    {
      icon: RefreshCw,
      title: t.followup,
      description: t.followupDesc
    },
    {
      icon: Book,
      title: t.lifestyle,
      description: t.lifestyleDesc
    }
  ];

  const whyChooseUs = t.whyChoose;

  const process = [
    {
      step: "1",
      title: t.step1,
      description: t.step1Desc
    },
    {
      step: "2",
      title: t.step2,
      description: t.step2Desc
    },
    {
      step: "3",
      title: t.step3,
      description: t.step3Desc
    }
  ];

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">{t.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* Consultation Modes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">{t.consultationModesTitle}</h2>
              <p className="text-muted-foreground">{t.consultationModesDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {consultationModes.map((mode, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl group">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <mode.icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{mode.title}</h3>
                    <p className="text-muted-foreground">{mode.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">{t.additionalSupportTitle}</h2>
              <p className="text-muted-foreground">{t.additionalSupportDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {additionalServices.map((service, index) => (
                <Card key={index} className="border-2 hover:border-accent transition-all group">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <service.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">{t.processTitle}</h2>
              <p className="text-muted-foreground">{t.processDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {process.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="border-2 hover:border-primary transition-all">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  {index < process.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">{t.whyChooseTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {whyChooseUs.map((reason: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <p className="text-lg">{reason}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link to="/book-appointment">
                    <Calendar className="mr-2 w-5 h-5" />
                    {t.bookNow}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
};

export default Services;

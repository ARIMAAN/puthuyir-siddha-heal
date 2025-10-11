import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Brain, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// About page translations
const aboutTranslations = {
  en: {
    drTitle: "Dr. Dhivyadhashini T, BSMS",
    drDesc:
      "Siddha Physician & Founder, Puthuyir. Experienced doctor providing personalized care and attention.",
    description:
      "Puthuyir is a leading provider of natural Siddha consultations and rejuvenation therapies led by Dr. Dhivyadhashini T, BSMS. We offer a holistic approach to your health and wellbeing.",
    introDesc:
      "A pioneer in delivering natural health through Siddha medicine and rejuvenation therapy.",
  },
  ta: {
    drTitle: "டாக்டர் திவ்யதர்சினி தி., பி.எஸ்.எம்.எஸ்",
    drDesc:
      "சித்த மருத்துவர் மற்றும் புத்துயிர் நிறுவனர். தனிப்பட்ட கவனிப்பும், பரிசோதனையும் வழங்கும் அனுபவம் வாய்ந்த மருத்துவர்.",
    description:
      "புத்துயிர் என்பது டாக்டர் திவ்யதர்சினி தி, பி.எஸ்.எம்.எஸ், அவர்களின் தலைமையில் இயற்கை சித்த மருத்துவ ஆலோசனைகள் மற்றும் புத்துயிர் சிகிச்சைகளை வழங்கும் ஒரு முன்னணி நிறுவனம். நாங்கள் உங்கள் ஆரோக்கியத்திற்கும் நலனுக்கும் முழுமையான அணுகுமுறையை வழங்குகிறோம்.",
    introDesc:
      "சித்த மருத்துவம் மற்றும் புத்துயிர் சிகிச்சை மூலம் இயற்கை ஆரோக்கியத்தை வழங்கும் முன்னணி நிறுவனம்.",
  },
};

const About = () => {
  const { language } = useLanguage();
  const t = aboutTranslations[language];

  const benefits = [
    {
      icon: Sparkles,
      title:
        language === "ta"
          ? "வயதானதை தாமதப்படுத்தி உயிர்ச்சக்தியை மேம்படுத்துங்கள்"
          : "Slow down aging and improve vitality",
      description:
        language === "ta"
          ? "உயிர்ச்சக்தியை மேம்படுத்தும் புத்துயிர் நடைமுறைகள்"
          : "Rejuvenation practices that enhance your life force",
    },
    {
      icon: Shield,
      title:
        language === "ta"
          ? "நோய் எதிர்ப்பு சக்தி மற்றும் வலிமையை மேம்படுத்துங்கள்"
          : "Enhance immunity and strength",
      description:
        language === "ta"
          ? "இயற்கையாக நோய்களுக்கு எதிராக எதிர்ப்பு சக்தியை உருவாக்குங்கள்"
          : "Build resilience against illness naturally",
    },
    {
      icon: Brain,
      title:
        language === "ta"
          ? "நினைவாற்றல் மற்றும் மன தெளிவை கூர்மையாக்குங்கள்"
          : "Sharpen memory and mental clarity",
      description:
        language === "ta"
          ? "முழுமையான குணப்படுத்தலால் அறிவாற்றல் மேம்பாடு"
          : "Cognitive enhancement through holistic healing",
    },
    {
      icon: Heart,
      title:
        language === "ta"
          ? "தரமான வாழ்வுடன் நீண்ட ஆயுளை ஊக்குவிக்கவும்"
          : "Promote longevity with quality of life",
      description:
        language === "ta"
          ? "சித்த ஞானத்துடன் நீண்ட மற்றும் ஆரோக்கியமான வாழ்வு"
          : "Live longer and healthier with Siddha wisdom",
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">
              {t.drTitle}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.drDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-foreground leading-relaxed">
                    {t.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.introDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Importance of Siddha */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold text-foreground">
                {language === "ta"
                  ? "புத்துயிரில் சித்த மருத்துவத்தின் முக்கியத்துவம்"
                  : "The Importance of Siddha in Rejuvenation"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === "ta"
                  ? "சிகிச்சையைத் தாண்டி — உயிர்ச்சக்திக்கும் நீண்ட ஆயுளுக்கும் பாதை"
                  : "Beyond treatment — a path to vitality and longevity"}
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-lg text-foreground leading-relaxed">
                    {language === "ta"
                      ? "சித்த மருத்துவம் நோய்களை குணப்படுத்துவதற்காக மட்டுமல்ல — இது புத்துயிர் (காயகல்பம்) சிகிச்சைக்காகவும் வடிவமைக்கப்பட்ட ஒரு முறையாகும்."
                      : "Siddha medicine is not only about curing diseases — it's also a system designed for rejuvenation (Kaya Kalpa)."}{" "}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "ta"
                      ? "பழமையான சித்தர்கள் உண்மையான ஆரோக்கியம் என்பது உடல், மனம் மற்றும் ஆன்மாவின் சமநிலையாகும் என்று கற்றுத்தந்தனர். கவனமாக தயாரிக்கப்பட்ட மூலிகை மருந்துகள், உணவு வழிகாட்டுதல் மற்றும் வாழ்க்கைமுறை மாற்றங்கள் மூலம், சித்த மருத்துவம் அறிகுறிகளை நிர்வகிப்பதைவிடவும் அதிகமாக முழுமையான நலனுக்கான அணுகுமுறையை வழங்குகிறது."
                      : "Ancient Siddhars taught that true health is the balance of body, mind, and spirit. Through carefully formulated herbal preparations, dietary guidance, and lifestyle modifications, Siddha medicine offers a comprehensive approach to wellness that goes far beyond symptom management."}
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {language === "ta"
                      ? "சித்த புத்துயிர் சிகிச்சையின் நன்மைகள்"
                      : "Benefits of Siddha Rejuvenation"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <benefit.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-foreground">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Encouragement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-3xl font-bold">
                  {language === "ta"
                    ? "எங்கள் நோயாளிகளுக்கான செய்தி"
                    : "A Message to My Patients"}
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  {language === "ta"
                    ? "நோய்களுக்கு சிகிச்சை பெறுவதற்காக மட்டுமல்லாமல், புத்துயிர் சித்த நடைமுறைகளை உங்கள் நலனையும் நோய் தடுப்பையும் மேம்படுத்தும் வழியாகவும் ஏற்குமாறு நான் என் நோயாளிகளை ஊக்குவிக்கிறேன். உண்மையான ஆரோக்கியம் என்பது நோய் இல்லாத நிலை மட்டுமல்ல — அது முழுமையான உடல், மனம் மற்றும் ஆன்ம நலனாகும்."
                    : "I encourage my patients not only to seek treatment for illness but also to embrace Siddha practices as a way to maintain wellness and prevent disease. True health is not merely the absence of illness — it is a state of complete physical, mental, and spiritual wellbeing."}
                </p>
                <p className="font-medium text-xl">
                  {language === "ta"
                    ? "இயற்கை குணப்படுத்தலும் நீடித்த உயிர்ச்சக்திக்கும் நாம் ஒன்றாக பயணிப்போம்."
                    : "Let us journey together towards natural healing and lasting vitality."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

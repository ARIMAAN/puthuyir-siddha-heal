import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Wind, 
  Apple, 
  Sparkles, 
  Users, 
  Bone,
  Brain,
  Baby
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Treatments page translations
const treatmentsTranslations = {
  en: {
    title: "Treatments We Offer",
    subtitle: "Siddha-based therapies for lasting wellness",
    categories: [
      {
        title: "Chronic & Lifestyle Disorders",
        treatments: [
          "Diabetes Management",
          "Hypertension",
          "Obesity & Weight Loss",
          "Stress & Sleep Disorders",
        ],
      },
      {
        title: "Respiratory Health",
        treatments: [
          "Asthma",
          "Allergies",
          "Sinusitis",
          "Chronic Cough",
        ],
      },
      {
        title: "Digestive & Gut Health",
        treatments: [
          "Acidity & Gastritis",
          "Constipation",
          "Irritable Bowel (IBS)",
          "Liver & Gallbladder Support",
        ],
      },
      {
        title: "Skin & Hair Care",
        treatments: [
          "Acne & Pigmentation",
          "Psoriasis & Eczema",
          "Hair Loss & Dandruff",
          "Premature Greying",
        ],
      },
      {
        title: "Women's & Hormonal Health",
        treatments: [
          "PCOS & Hormonal Balance",
          "Infertility Support",
          "Menstrual Disorders",
          "Menopause Care",
        ],
      },
      {
        title: "Bone & Joint Health",
        treatments: [
          "Osteoarthritis",
          "Joint Pain",
          "Back & Neck Pain",
          "Bone Health",
        ],
      },
      {
        title: "Mental Health & Wellness",
        treatments: [
          "Stress & Anxiety Management",
          "Depression Support",
          "Memory Enhancement",
          "Sleep Disorders",
        ],
      },
      {
        title: "Special & Rejuvenation Care",
        treatments: [
          "Child & Elderly Care",
          "Rejuvenation & Longevity (Kaya Kalpa)",
          "Preventive Wellness Guidance",
          "Post-illness Recovery",
        ],
      },
    ],
    personalizedCareTitle: "Personalized Care for Every Condition",
    personalizedCareDesc:
      "Each treatment is tailored to your unique constitution, symptoms, and health goals. We combine traditional Siddha medicines and modern insights for holistic healing.",
    notListed:
      "Don't see your condition listed? We treat many more issues. Book a consultation to discuss your needs.",
  },
  ta: {
    title: "நாங்கள் வழங்கும் சிகிச்சைகள்",
    subtitle: "நீடித்த நலனுக்காக சித்த அடிப்படையிலான சிகிச்சைகள்",
    categories: [
      {
        title: "நாள்பட்ட மற்றும் வாழ்க்கை முறை கோளாறுகள்",
        treatments: [
          "நீரிழிவு மேலாண்மை",
          "உயர் இரத்த அழுத்தம்",
          "உடல் பருமன் மற்றும் எடை குறைப்பு",
          "மன அழுத்தம் மற்றும் தூக்கக் கோளாறுகள்",
        ],
      },
      {
        title: "சுவாச ஆரோக்கியம்",
        treatments: [
          "ஆஸ்துமா",
          "ஒவ்வாமை",
          "மூக்கடைப்பு",
          "நாள்பட்ட இருமல்",
        ],
      },
      {
        title: "செரிமான மற்றும் குடல் ஆரோக்கியம்",
        treatments: [
          "அமிலத்தன்மை மற்றும் இரைப்பை அழற்சி",
          "மலச்சிக்கல்",
          "குடல் எரிச்சல் (IBS)",
          "கல்லீரல் மற்றும் பித்தப்பை ஆதரவு",
        ],
      },
      {
        title: "தோல் மற்றும் முடி பராமரிப்பு",
        treatments: [
          "முகப்பரு மற்றும் நிறமாற்றம்",
          "சொரியாசிஸ் மற்றும் ஈக்ஸிமா",
          "முடி உதிர்தல் மற்றும் வறண்ட தலையோடு",
          "முன்கால சாம்பல்",
        ],
      },
      {
        title: "பெண்கள் மற்றும் ஹார்மோன் ஆரோக்கியம்",
        treatments: [
          "PCOS மற்றும் ஹார்மோன் சமநிலை",
          "வந்தையின்மை ஆதரவு",
          "மாதவிடாய் கோளாறுகள்",
          "மெனோபாஸ் பராமரிப்பு",
        ],
      },
      {
        title: "எலும்பு மற்றும் மூட்டு ஆரோக்கியம்",
        treatments: [
          "ஆஸ்தியோ ஆர்த்ரைடிஸ்",
          "மூட்டு வலி",
          "முதுகு மற்றும் கழுத்து வலி",
          "எலும்பு ஆரோக்கியம்",
        ],
      },
      {
        title: "மனநலம் மற்றும் நலன்",
        treatments: [
          "மன அழுத்தம் மற்றும் கவலை மேலாண்மை",
          "மன அழுத்த ஆதரவு",
          "நினைவாற்றல் மேம்பாடு",
          "தூக்கக் கோளாறுகள்",
        ],
      },
      {
        title: "சிறப்பு மற்றும் புத்துயிர் பராமரிப்பு",
        treatments: [
          "குழந்தைகள் மற்றும் முதியோர் பராமரிப்பு",
          "புத்துயிர் மற்றும் நீண்ட ஆயுள் (காயகல்பம்)",
          "முன்கூட்டிய நல வழிகாட்டுதல்",
          "நோய் பிந்தைய மீட்பு",
        ],
      },
    ],
    personalizedCareTitle: "ஒவ்வொரு நிலைக்கும் தனிப்பட்ட பராமரிப்பு",
    personalizedCareDesc:
      "ஒவ்வொரு சிகிச்சையும் உங்கள் தனிப்பட்ட உடல் அமைப்பு, அறிகுறிகள் மற்றும் ஆரோக்கிய இலக்குகளின் அடிப்படையில் தனிப்பயனாக்கப்படுகிறது. பாரம்பரிய சித்த மருந்துகளும் நவீன அறிவும் இணைந்து முழுமையான குணப்படுத்தலை வழங்குகிறோம்.",
    notListed:
      "உங்கள் நிலை பட்டியலில் இல்லையா? மேலும் பல சிக்கல்களுக்கு சிகிச்சை அளிக்கிறோம். உங்கள் தேவைகளை விவாதிக்க ஆலோசனை பதிவு செய்யுங்கள்.",
  },
};

const Treatments = () => {
  const { language } = useLanguage();
  const t = treatmentsTranslations[language];

  // Map icons to translation categories
  const iconMap = [Heart, Wind, Apple, Sparkles, Users, Bone, Brain, Baby];

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

        {/* Treatment Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {t.categories.map((category: any, index: number) => (
                <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {iconMap[index] && (() => {
                          const Icon = iconMap[index];
                          return <Icon className="w-7 h-7 text-white" />;
                        })()}
                      </div>
                      <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.treatments.map((treatment: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          <span>{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Note Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto border-2 border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">{t.personalizedCareTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.personalizedCareDesc}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {t.notListed}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
  );
};

export default Treatments;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const Treatments = () => {
  const treatmentCategories = [
    {
      icon: Heart,
      title: "Chronic & Lifestyle Disorders",
      color: "from-red-500 to-pink-500",
      treatments: [
        "Diabetes Management",
        "High Blood Pressure",
        "Obesity & Weight Loss",
        "Stress & Sleep Disorders"
      ]
    },
    {
      icon: Wind,
      title: "Respiratory Health",
      color: "from-blue-500 to-cyan-500",
      treatments: [
        "Asthma",
        "Allergies",
        "Sinusitis",
        "Chronic Cough"
      ]
    },
    {
      icon: Apple,
      title: "Digestive & Gastrointestinal Health",
      color: "from-orange-500 to-amber-500",
      treatments: [
        "Acidity & Gastritis",
        "Constipation",
        "Irritable Bowel Syndrome (IBS)",
        "Liver & Gallbladder Support"
      ]
    },
    {
      icon: Sparkles,
      title: "Skin & Hair Care",
      color: "from-purple-500 to-pink-500",
      treatments: [
        "Acne & Pigmentation",
        "Psoriasis & Eczema",
        "Hair Fall & Dandruff",
        "Premature Greying"
      ]
    },
    {
      icon: Users,
      title: "Women's & Hormonal Health",
      color: "from-pink-500 to-rose-500",
      treatments: [
        "PCOS & Hormonal Imbalance",
        "Infertility Support",
        "Menstrual Disorders",
        "Menopause Care"
      ]
    },
    {
      icon: Bone,
      title: "Musculoskeletal Health",
      color: "from-slate-500 to-zinc-500",
      treatments: [
        "Arthritis",
        "Joint Pain",
        "Back & Neck Pain",
        "Bone Health"
      ]
    },
    {
      icon: Brain,
      title: "Mental Wellbeing",
      color: "from-indigo-500 to-purple-500",
      treatments: [
        "Stress & Anxiety Management",
        "Depression Support",
        "Memory Enhancement",
        "Sleep Disorders"
      ]
    },
    {
      icon: Baby,
      title: "Special & Rejuvenation Care",
      color: "from-teal-500 to-emerald-500",
      treatments: [
        "Pediatric & Geriatric Care",
        "Rejuvenation & Longevity (Kaya Kalpa)",
        "Preventive Health Guidance",
        "Post-illness Recovery"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">Treatments We Offer</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer Siddha-based treatments that restore balance, rejuvenate the body, and promote lasting wellness.
            </p>
          </div>
        </section>

        {/* Treatment Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {treatmentCategories.map((category, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-xl group">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.treatments.map((treatment, idx) => (
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
                <h3 className="text-2xl font-bold text-foreground">Personalized Care for Every Condition</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each treatment is customized based on your unique constitution, symptoms, and health goals. 
                  We combine classical Siddha formulations with modern understanding to provide safe, 
                  effective, and holistic healing.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Don't see your condition listed? We treat many more health concerns. 
                  Book a consultation to discuss your specific needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Treatments;

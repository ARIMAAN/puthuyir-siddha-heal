import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Brain, Sparkles } from "lucide-react";

const About = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: "Slow down aging and improve vitality",
      description: "Rejuvenation practices that enhance your life force"
    },
    {
      icon: Shield,
      title: "Enhance immunity and strength",
      description: "Build resilience against illness naturally"
    },
    {
      icon: Brain,
      title: "Sharpen memory and mental clarity",
      description: "Cognitive enhancement through holistic healing"
    },
    {
      icon: Heart,
      title: "Promote longevity with quality of life",
      description: "Live longer and healthier with Siddha wisdom"
    }
  ];

  return (
    <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl font-bold text-foreground">About Dr. Dhivyadhashini, BSMS</h1>
              <p className="text-xl text-muted-foreground">
                A registered Siddha Physician passionate about holistic healing
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
                      My goal is to make Siddha medicine accessible for modern life — helping patients manage chronic conditions, restore health, and achieve long-term wellness naturally.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      With a Bachelor of Siddha Medicine and Surgery (BSMS), I combine ancient Siddha wisdom with evidence-based practice to provide personalized care that addresses the root cause of illness, not just symptoms.
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
                <h2 className="text-4xl font-bold text-foreground">The Importance of Siddha in Rejuvenation</h2>
                <p className="text-lg text-muted-foreground">
                  Beyond treatment — a path to vitality and longevity
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <p className="text-lg text-foreground leading-relaxed">
                      Siddha medicine is not only about curing diseases — it's also a system designed for rejuvenation (<strong>Kaya Kalpa</strong>).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Ancient Siddhars taught that true health is the balance of body, mind, and spirit. Through carefully formulated herbal preparations, dietary guidance, and lifestyle modifications, Siddha medicine offers a comprehensive approach to wellness that goes far beyond symptom management.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-2xl font-bold text-foreground mb-6">Benefits of Siddha Rejuvenation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <benefit.icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
                  <h3 className="text-3xl font-bold">A Message to My Patients</h3>
                  <p className="text-lg leading-relaxed opacity-90">
                    I encourage my patients not only to seek treatment for illness but also to embrace Siddha practices as a way to maintain wellness and prevent disease. True health is not merely the absence of illness — it is a state of complete physical, mental, and spiritual wellbeing.
                  </p>
                  <p className="font-medium text-xl">
                    Let us journey together towards natural healing and lasting vitality.
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

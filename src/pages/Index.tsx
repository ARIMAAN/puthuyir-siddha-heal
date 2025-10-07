import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const Index = () => {
  const highlights = [
    {
      icon: Leaf,
      title: "100% Siddha-based natural treatments",
      description: "Ancient wisdom for modern wellness"
    },
    {
      icon: MessageSquare,
      title: "Online consultation via chat, audio, or video",
      description: "Connect with Dr. Dhivyadhashini anytime"
    },
    {
      icon: FileText,
      title: "Personalized E-prescription & doorstep delivery",
      description: "Convenient care delivered to you"
    },
    {
      icon: RefreshCw,
      title: "Continuous follow-up & lifestyle guidance",
      description: "Ongoing support for lasting wellness"
    }
  ];

  const services = [
    {
      icon: Heart,
      title: "Chronic & Lifestyle Disorders",
      description: "Natural management of diabetes, hypertension, obesity, and stress"
    },
    {
      icon: Sparkles,
      title: "Rejuvenation Therapy (Kaya Kalpa)",
      description: "Ancient Siddha practices for vitality and longevity"
    },
    {
      icon: Brain,
      title: "Skin, Hair & Hormonal Care",
      description: "Holistic solutions for PCOS, acne, hair fall, and more"
    },
    {
      icon: Shield,
      title: "Digestive & Respiratory Health",
      description: "Relief from gastritis, asthma, allergies, and chronic conditions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Healing Naturally, Living Fully
              </h1>
              <p className="text-lg text-muted-foreground">
                Personalized Siddha consultations and rejuvenation therapies designed to help you restore balance, enhance vitality, and achieve long-term wellness — naturally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/book-appointment">
                    Book a Consultation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Learn More</Link>
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
            <h2 className="text-4xl font-bold text-foreground">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive Siddha treatments tailored to your unique health needs
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
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Begin Your Healing Journey?</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Take the first step towards natural wellness with personalized Siddha consultation
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-lg">
            <Link to="/book-appointment">
              Book Your Consultation Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

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

const Services = () => {
  const consultationModes = [
    {
      icon: MessageSquare,
      title: "Chat Consultation",
      description: "Text-based consultation for detailed discussions at your convenience"
    },
    {
      icon: Phone,
      title: "Audio Call Consultation",
      description: "Voice consultation for personal interaction and guidance"
    },
    {
      icon: Video,
      title: "Video Call Consultation",
      description: "Face-to-face virtual consultation for comprehensive assessment"
    }
  ];

  const additionalServices = [
    {
      icon: FileText,
      title: "E-Prescription",
      description: "Digital prescription accessible anytime"
    },
    {
      icon: Truck,
      title: "Medicine Delivery",
      description: "Doorstep delivery of authentic Siddha medicines"
    },
    {
      icon: RefreshCw,
      title: "Follow-up System",
      description: "Regular check-ins to monitor progress"
    },
    {
      icon: Book,
      title: "Lifestyle & Diet Guidance",
      description: "Personalized recommendations for holistic wellness"
    }
  ];

  const whyChooseUs = [
    "Fast recovery & long-term results",
    "Affordable treatments without side effects",
    "Herbal & high-order formulations",
    "Focus on total wellness, not just symptom relief"
  ];

  const process = [
    {
      step: "1",
      title: "Book Online",
      description: "Choose your preferred time and consultation mode"
    },
    {
      step: "2",
      title: "Consultation",
      description: "Share symptoms, medical history, and reports"
    },
    {
      step: "3",
      title: "Receive Care",
      description: "Get e-prescription & medicines delivered"
    }
  ];

  return (
    <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">Our Siddha Consultation Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide personalized consultations and Siddha-based therapies tailored to your unique health needs.
            </p>
          </div>
        </section>

        {/* Consultation Modes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Consultation Mode</h2>
              <p className="text-muted-foreground">Connect with Dr. Dhivyadhashini in the way that suits you best</p>
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
              <h2 className="text-4xl font-bold text-foreground mb-4">Additional Support</h2>
              <p className="text-muted-foreground">Comprehensive care beyond consultation</p>
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
              <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground">Simple steps to begin your healing journey</p>
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
              <h2 className="text-4xl font-bold text-center mb-12">Why Choose Puthuyir?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {whyChooseUs.map((reason, index) => (
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
                    Book Your Consultation
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

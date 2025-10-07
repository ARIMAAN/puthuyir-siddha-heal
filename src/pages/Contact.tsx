import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Linkedin, Instagram, Facebook } from "lucide-react";
import { FaTelegram, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

// Contact page translations
const contactTranslations = {
  en: {
    title: "Contact Us",
    subtitle: "Reach out to us for your queries",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Your Message",
    send: "Send",
    success: "Your message has been sent successfully!",
    error: "Failed to send message. Please try again.",
    infoTitle: "Contact Information",
    followUs: "Follow Us",
    consultationHours: "Consultation Hours",
    weekdays: "Weekdays",
    weekends: "Weekends",
    weekdaysTime: "9:00 AM - 7:00 PM",
    weekendsTime: "10:00 AM - 5:00 PM",
    emergency: "* Emergency consultations can be arranged. Please contact us.",
  },
  ta: {
    title: "தொடர்பு கொள்ளுங்கள்",
    subtitle: "உங்கள் கேள்விகளுக்கு எங்களை அணுகுங்கள்",
    name: "பெயர்",
    email: "மின்னஞ்சல்",
    subject: "தலைப்பு",
    message: "உங்கள் செய்தி",
    send: "அனுப்பு",
    success: "உங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!",
    error: "செய்தியை அனுப்ப முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    infoTitle: "தொடர்பு தகவல்",
    followUs: "எங்களை பின்தொடருங்கள்",
    consultationHours: "ஆலோசனை நேரம்",
    weekdays: "வார நாட்கள்",
    weekends: "வார இறுதிகள்",
    weekdaysTime: "காலை 9:00 - மாலை 7:00",
    weekendsTime: "காலை 10:00 - மாலை 5:00",
    emergency: "* அவசர ஆலோசனைகள் ஏற்பாடு செய்யப்படும். தயவுசெய்து எங்களை தொடர்பு கொள்ளவும்.",
  },
};

const Contact = () => {
  const { language } = useLanguage();
  const t = contactTranslations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.success);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@puthuyir.com",
      href: "mailto:contact@puthuyir.com"
    },
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      value: "+91 98765 43210",
      href: "tel:+919876543210"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Online Consultations Available",
      href: null
    }
  ];

  const socialLinks = [
    { Icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
    { Icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-600" },
    { Icon: FaTelegram, href: "#", label: "Telegram", color: "hover:text-blue-500" },
    { Icon: FaWhatsapp, href: "#", label: "WhatsApp", color: "hover:text-green-500" },
    { Icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-700" },
    { Icon: FaPinterest, href: "#", label: "Pinterest", color: "hover:text-red-600" }
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

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">{t.infoTitle}</h2>
                
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-2 hover:border-primary transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{info.title}</h3>
                          {info.href ? (
                            <a 
                              href={info.href}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Social Links */}
                <Card className="border-2">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">{t.followUs}</h3>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map(({ Icon, href, label, color }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-all ${color} hover:scale-110`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-2">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">{t.send || "Send us a Message"}</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.name} *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">{t.email} *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t.subject} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t.message} *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-32"
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        <Send className="mr-2 w-5 h-5" />
                        {t.send}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map or Additional Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto border-2">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">{t.consultationHours}</h3>
                <p className="text-muted-foreground">
                  {t.subtitle}
                </p>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{t.weekdays}</h4>
                    <p className="text-muted-foreground">{t.weekdaysTime}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{t.weekends}</h4>
                    <p className="text-muted-foreground">{t.weekendsTime}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic pt-4">
                  {t.emergency}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
  );
};

export default Contact;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { MessageSquare, Phone, Video, Calendar, Clock, User, Mail, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// BookAppointment page translations
const consultationTranslations = {
  en: {
    title: "Book Online Consultation",
    subtitle: "Book your personalized Siddha consultation now",
    name: "Name",
    age: "Age",
    gender: "Gender",
    phone: "Phone Number",
    email: "Email",
    symptoms: "Your Symptoms",
    preferredDate: "Preferred Date",
    preferredTime: "Preferred Time",
    submit: "Submit",
    success: "Your appointment has been booked successfully!",
    error: "Failed to book appointment. Please try again.",
    chat: "Chat Consultation",
    audio: "Audio Call",
    video: "Video Call",
  },
  ta: {
    title: "ஆன்லைன் ஆலோசனை பதிவு செய்யுங்கள்",
    subtitle: "உங்கள் தனிப்பட்ட சித்த ஆலோசனையை இப்போது பதிவு செய்யுங்கள்",
    name: "பெயர்",
    age: "வயது",
    gender: "பாலினம்",
    phone: "தொலைபேசி எண்",
    email: "மின்னஞ்சல்",
    symptoms: "உங்கள் அறிகுறிகள்",
    preferredDate: "விருப்பமான தேதி",
    preferredTime: "விருப்பமான நேரம்",
    submit: "பதிவுசெய்யவும்",
    success: "உங்கள் ஆலோசனை பதிவு வெற்றிகரமாக செய்யப்பட்டது!",
    error: "பதிவைச் செய்ய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    chat: "அரட்டை ஆலோசனை",
    audio: "ஆடியோ அழைப்பு",
    video: "வீடியோ அழைப்பு",
  },
};

const BookAppointment = () => {
  const { language } = useLanguage();
  const t = consultationTranslations[language];

  const [consultationType, setConsultationType] = useState("chat");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    symptoms: ""
  });

  const consultationOptions = [
    { value: "chat", label: "Chat Consultation", icon: MessageSquare },
    { value: "audio", label: "Audio Call", icon: Phone },
    { value: "video", label: "Video Call", icon: Video }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.success);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      symptoms: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

        {/* Booking Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Consultation Type */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Choose Consultation Mode</Label>
                      <RadioGroup value={consultationType} onValueChange={setConsultationType}>
                        <div className="grid md:grid-cols-3 gap-4">
                          {consultationOptions.map((option) => (
                            <label
                              key={option.value}
                              className={`relative flex flex-col items-center gap-3 p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                consultationType === option.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value={option.value} className="sr-only" />
                              <option.icon className={`w-8 h-8 ${
                                consultationType === option.value ? "text-primary" : "text-muted-foreground"
                              }`} />
                              <span className={`text-sm font-medium text-center ${
                                consultationType === option.value ? "text-primary" : "text-foreground"
                              }`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t.name}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.name} *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t.name}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t.phone} *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t.email} *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferred Schedule */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {t.preferredDate}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">{t.preferredDate} *</Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">{t.preferredTime} *</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="preferredTime"
                              name="preferredTime"
                              type="time"
                              value={formData.preferredTime}
                              onChange={handleChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {t.symptoms}
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="symptoms">{t.symptoms} *</Label>
                        <Textarea
                          id="symptoms"
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={handleChange}
                          placeholder={t.symptoms}
                          className="min-h-32"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          {/* You can also upload reports during the consultation */}
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <Button type="submit" size="lg" className="w-full">
                      {t.submit}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      {/* By booking, you agree to receive communication regarding your consultation */}
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">E-Prescription</h4>
                    <p className="text-sm text-muted-foreground">Digital prescription accessible anytime</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-semibold">Follow-up</h4>
                    <p className="text-sm text-muted-foreground">Regular check-ins included</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <h4 className="font-semibold">Quick Response</h4>
                    <p className="text-sm text-muted-foreground">We'll confirm within 24 hours</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
};

export default BookAppointment;

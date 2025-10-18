import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Calendar, FileText, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

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
    booking: "Booking...",
    success: "Your appointment has been booked successfully!",
    error: "Failed to book appointment. Please try again.",
    chat: "Chat Consultation",
    audio: "Audio Call",
    video: "Video Call",
    successTitle: "Thank you for booking!",
    successMessage: "We got your booking and will reach you back through mail, WhatsApp or phone call.",
    okButton: "OK"
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
    booking: "பதிவு செய்கிறது...",
    success: "உங்கள் ஆலோசனை பதிவு வெற்றிகரமாக செய்யப்பட்டது!",
    error: "பதிவைச் செய்ய முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    chat: "அரட்டை ஆலோசனை",
    audio: "ஆடியோ அழைப்பு",
    video: "வீடியோ அழைப்பு",
    successTitle: "முன்பதிவுக்கு நன்றி!",
    successMessage: "உங்கள் முன்பதிவைப் பெற்றுள்ளோம். மின்னஞ்சல், WhatsApp அல்லது தொலைபேசி அழைப்பு மூலம் உங்களைத் தொடர்பு கொள்வோம்.",
    okButton: "சரி"
  },
};

function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return { 
    name: localStorage.getItem("userName") || "Client",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || ""
  };
}

const steps = [
  {
    title: "Step 1: Sign In",
    desc: "Sign in with your Google account to access booking and your medical dashboard.",
  },
  {
    title: "Step 2: Complete Profile",
    desc: "Fill in your personal and health details to help us serve you better.",
  },
  {
    title: "Step 3: Book Consultant",
    desc: "Choose your consultant, select a slot, and confirm your appointment.",
  },
  {
    title: "Step 4: View Dashboard",
    desc: "See your appointment history, prescriptions, and manage your profile.",
  },
];

const BookAppointment = () => {
  const { language } = useLanguage();
  const t = consultationTranslations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    symptoms: "",
    preferredDate: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUser();

  // Fetch user data from API if token exists
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token && user) {
      fetchUserData();
    }
  }, [token, user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        // Pre-populate form with user data
        setFormData(prev => ({
          ...prev,
          name: prev.name || data.full_name || "",
          email: prev.email || data.email || "",
          phone: prev.phone || data.phone || ""
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consultant: "Dr. Dhivyadharshini",
          preferredDate: formData.preferredDate,
          symptoms: formData.symptoms,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        toast.error(data.error || t.error);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-700">How to Book a Consultant</h2>
          <div className="space-y-4 mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="border-l-4 border-green-500 bg-green-50 p-4 rounded shadow-sm">
                <div className="font-semibold text-green-800">{step.title}</div>
                <div className="text-gray-700">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-lg p-6 w-full max-w-xs shadow-inner mb-4">
              <div className="text-center text-gray-800 mb-2">
                <span className="text-lg font-semibold">🔒 Please sign in to continue</span>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                onClick={() => navigate("/signin")}
              >
                Sign In with Google
              </button>
            </div>
            <button
              className="text-gray-500 underline mt-2"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground">{t.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t.name}
                      </h3>

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
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Contact Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                          <Label htmlFor="phone">{t.phone} *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+91 98765 43210"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {t.preferredDate}
                      </h3>

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
                    </div>

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
                        </p>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t.booking}
                        </>
                      ) : (
                        t.submit
                      )}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-center">{t.successTitle}</h3>
            <p className="mb-6 text-center leading-relaxed">
              {t.successMessage}
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/dashboard");
              }}
            >
              {t.okButton}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookAppointment;

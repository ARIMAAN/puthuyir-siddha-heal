import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  // Registration State
  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const getApiBaseUrl = () => {
    const envApiUrl = (import.meta.env.VITE_API_URL || "").trim();
    if (envApiUrl) {
      return envApiUrl.replace(/\/$/, "");
    }
    return `${window.location.origin}/api`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const redirect = params.get("redirect");
    const message = params.get("message");

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      
      // Check where to redirect based on profile completion
      if (redirect === "profile") {
        // Profile incomplete - redirect to profile page
        localStorage.setItem("profileComplete", "false");
        navigate("/profile", { replace: true });
      } else {
        // Profile complete - but let's verify by fetching actual profile status
        localStorage.setItem("profileComplete", "true");
        
        // Double-check profile completion status from API
        apiClient.get("/profile")
          .then(response => {
            const profileData = response.data;
            const isComplete = profileData && 
                              profileData.profile_completed && 
                              profileData.full_name && 
                              profileData.gender && 
                              profileData.city && 
                              profileData.state && 
                              profileData.pincode;
            
            if (isComplete) {
              localStorage.setItem("profileComplete", "true");
              navigate("/dashboard", { replace: true });
            } else {
              localStorage.setItem("profileComplete", "false");
              navigate("/profile", { replace: true });
            }
          })
          .catch(() => {
            // If API call fails, assume profile is incomplete
            localStorage.setItem("profileComplete", "false");
            navigate("/profile", { replace: true });
          });
      }
    }

    // Show session expiry message
    if (message === "session_expired") {
      toast.error("Your session has expired. Please sign in again.", {
        duration: 5000,
      });
    }
  }, [location, navigate]);

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'phone') {
      handlePhoneChange(e.target.value);
    } else {
      setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChar
    };
  };

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return {
      isValid: cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone),
      cleaned: cleanPhone
    };
  };

  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 10);
    setRegisterData(prev => ({ ...prev, phone: cleanValue }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        email: signInData.email,
        password: signInData.password
      });
      const data = response.data;
      
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("profileComplete", data.profileComplete ? "true" : "false");
        localStorage.setItem("hasPassword", data.hasPassword ? "true" : "false");
        
        toast.success("Signed in successfully!");
        
        // Check if password setup is required (OAuth users)
        if (data.passwordSetupRequired) {
          toast.info("Please set up a password to secure your account");
          navigate("/auth/setup-password");
        } else if (data.profileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else if (data.needsVerification) {
        // User exists but not verified - redirect to verification
        toast.info(data.message);
        navigate(`/auth/verify-signup?email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name)}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Phone validation
    if (!validatePhoneNumber(registerData.phone).isValid) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      setLoading(false);
      return;
    }

    // Password match validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      setLoading(false);
      return;
    }

    try {
      console.log("🚀 Sending registration request...", {
        full_name: registerData.full_name,
        email: registerData.email,
        phone: registerData.phone
      });

      const response = await apiClient.post("/auth/register", {
        full_name: registerData.full_name,
        email: registerData.email,
        password: registerData.password,
        phone: validatePhoneNumber(registerData.phone).cleaned
      });

      console.log("✅ Registration successful:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Account created successfully! Please check your email for verification.");
        
        // Redirect to verification page with email and name
        navigate(`/auth/verify-signup?email=${encodeURIComponent(registerData.email)}&name=${encodeURIComponent(registerData.full_name)}`);
      } else {
        console.error("❌ Registration response indicates failure:", response.data);
        toast.error(response.data.error || "Registration failed");
      }
    } catch (err: any) {
      console.error("❌ Registration error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Use a relative path to ensure the request is handled by the current host
    // and correctly proxied by the Vite dev server.
    window.location.href = `/api/auth/google`;
  };

  const passwordValidation = validatePassword(registerData.password);
  const phoneValidation = validatePhoneNumber(registerData.phone);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Puthuyir Care
            </CardTitle>
            <p className="text-gray-600 mt-2">Your trusted Siddha healthcare partner</p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={handleSignInChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={handleSignInChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password?
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        name="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.full_name}
                        onChange={handleRegisterChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter 10-digit Indian number"
                        value={registerData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="pl-10"
                        required
                        maxLength={10}
                      />
                    </div>
                    {registerData.phone && !validatePhoneNumber(registerData.phone).isValid && (
                      <p className="text-xs text-red-600">
                        Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)
                      </p>
                    )}
                    {registerData.phone && validatePhoneNumber(registerData.phone).isValid && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Valid mobile number
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {registerData.password && (
                      <div className="text-xs space-y-1">
                        <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          At least 8 characters
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          One number
                        </div>
                        <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="w-1 h-1 rounded-full bg-current"></span>
                          One special character
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || !passwordValidation.isValid || !phoneValidation.isValid}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;

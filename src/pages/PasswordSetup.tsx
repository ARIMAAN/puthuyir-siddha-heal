import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from "lucide-react";
import apiClient from "@/utils/apiClient";

const PasswordSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and needs password setup
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first");
      navigate("/signin");
      return;
    }
  }, [navigate]);

  // Password validation function
  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      isValid: password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password) && 
               /[@$!%*?&]/.test(password)
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/auth/setup-password", {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (response.data.success) {
        toast.success("Password set up successfully!");
        
        // Update localStorage to reflect password setup completion
        localStorage.setItem("hasPassword", "true");
        
        // Redirect to profile or dashboard
        const profileComplete = localStorage.getItem("profileComplete") === "true";
        if (profileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error: any) {
      console.error("Password setup error:", error);
      toast.error(error.response?.data?.error || "Failed to set up password");
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Set Up Your Password
            </CardTitle>
            <p className="text-gray-600 mt-2">
              To secure your account, please create a strong password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                {formData.password && (
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
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      One number
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      One special character (@$!%*?&)
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
              >
                {loading ? "Setting up..." : "Set Up Password"}
              </Button>
            </form>

            {/* Security Info */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Why set up a password?</p>
                  <p>
                    A password allows you to sign in directly and provides an additional layer of security 
                    for your account, even if you prefer using Google Sign-In.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordSetup;

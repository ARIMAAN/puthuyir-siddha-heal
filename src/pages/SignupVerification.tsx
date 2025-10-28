import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail, CheckCircle, AlertCircle, User } from "lucide-react";
import apiClient from "@/utils/apiClient";

const SignupVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification link");
      navigate("/signin");
    } else {
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [email, navigate]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/verify-otp", {
        email,
        otp,
        purpose: "account_verification"
      });

      if (response.data.success) {
        // Store authentication data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userId", response.data.user_id);
        
        toast.success("Account verified successfully!");
        
        // Redirect based on profile completion
        if (response.data.redirectTo === "dashboard") {
          localStorage.setItem("profileComplete", "true");
          navigate("/dashboard");
        } else {
          localStorage.setItem("profileComplete", "false");
          navigate("/profile");
        }
      }
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        setMaxAttemptsReached(true);
        toast.error("Maximum attempts exceeded. Please request a new OTP or sign up again.");
      } else {
        toast.error(error.response?.data?.error || "OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    
    try {
      await apiClient.post("/auth/resend-otp", {
        email,
        purpose: "account_verification"
      });
      
      toast.success("New OTP sent to your email");
      setAttempts(0);
      setOtp("");
      setTimeLeft(300); // Reset timer
      setMaxAttemptsReached(false); // Reset max attempts flag
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verify Your Account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome to Puthuyir Care{name ? `, ${name}` : ''}! Please verify your email to complete your registration.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Email Display */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="w-4 h-4" />
                  OTP sent to:
                </div>
                <div className="font-medium text-gray-900">{email}</div>
                {timeLeft > 0 && (
                  <div className="text-sm text-green-600 mt-1">
                    Code expires in: {formatTime(timeLeft)}
                  </div>
                )}
                {timeLeft === 0 && (
                  <div className="text-sm text-red-600 mt-1">
                    Code has expired. Please request a new one.
                  </div>
                )}
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Check your email for the 6-digit verification code
                  </p>
                </div>

                {/* Attempts Counter */}
                {attempts > 0 && !maxAttemptsReached && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4" />
                    Attempts: {attempts}/3
                  </div>
                )}
                
                {maxAttemptsReached && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    All attempts used (3/3)
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={loading || otp.length !== 6 || timeLeft === 0 || maxAttemptsReached}
                >
                  {loading ? "Verifying..." : 
                   maxAttemptsReached ? "Max Attempts Reached" :
                   timeLeft === 0 ? "Code Expired" : "Verify & Continue"}
                </Button>
              </form>

              {/* Resend OTP or Max Attempts Actions */}
              {maxAttemptsReached ? (
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-medium">Maximum attempts reached</p>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      You've used all 3 verification attempts. Choose an option below:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={resending}
                      className="text-sm bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      {resending ? "Sending..." : "Request New OTP"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/signin")}
                      className="text-sm bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Go to Sign Up/Sign In
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={resending || (timeLeft > 240)} // Allow resend after 1 minute
                    className="text-sm"
                  >
                    {resending ? "Sending..." : timeLeft > 240 ? `Wait ${formatTime(timeLeft - 240)}` : "Resend OTP"}
                  </Button>
                </div>
              )}

              {/* Help Text */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">What happens next?</p>
                    <p>
                      After verification, you'll be redirected to complete your profile with personal information, 
                      contact details, and medical history to get the best care recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Sign In */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupVerification;

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail, CheckCircle, AlertCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";

const OAuthVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const tempToken = searchParams.get("temp_token");
  const email = searchParams.get("email");
  const isNewUser = searchParams.get("new_user") === "true";

  useEffect(() => {
    if (!tempToken || !email) {
      toast.error("Invalid verification link");
      navigate("/signin");
    }
  }, [tempToken, email, navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/api/auth/verify-oauth-otp", {
        temp_token: tempToken,
        otp,
        email
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.name);
        localStorage.setItem("userId", response.data.user_id);
        localStorage.setItem("hasPassword", response.data.hasPassword ? "true" : "false");
        
        toast.success("Account verified successfully!");
        
        // Check if password setup is required (OAuth users)
        if (response.data.passwordSetupRequired) {
          toast.info("Please set up a password to secure your account");
          navigate("/auth/setup-password");
        } else if (response.data.profileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        toast.error("Maximum attempts exceeded. Please try signing in again.");
        navigate("/signin");
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
      await apiClient.post("/api/auth/resend-oauth-otp", {
        temp_token: tempToken,
        email
      });
      
      toast.success("New OTP sent to your email");
      setAttempts(0);
      setOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isNewUser ? "Verify Your Account" : "Complete Sign In"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isNewUser 
                ? "Welcome to Puthuyir Care! Please verify your email to complete registration."
                : "Please verify your email to complete sign in."
              }
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
                {attempts > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4" />
                    Attempts: {attempts}/3
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </Button>
              </form>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-sm"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </Button>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why verify?</p>
                    <p>
                      {isNewUser 
                        ? "Email verification ensures account security and enables important notifications about your healthcare."
                        : "This additional step helps protect your account from unauthorized access."
                      }
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

export default OAuthVerification;

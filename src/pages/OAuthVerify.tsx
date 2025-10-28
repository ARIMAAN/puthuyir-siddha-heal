import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Mail } from "lucide-react";
import apiClient from "@/utils/apiClient";

const OAuthVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  
  const tempToken = searchParams.get("temp_token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!tempToken || !email) {
      toast.error("Invalid verification link");
      navigate("/signin");
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Verification session expired");
          navigate("/signin");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempToken, email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/verify-oauth", {
        temp_token: tempToken,
        otp: otp
      });

      const data = response.data;

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);

        // The profile check is now handled by the login flow, so we can simplify this.
        if (data.profileComplete) {
          localStorage.setItem("profileComplete", "true");
          toast.success("Welcome back!");
          navigate("/dashboard");
        } else {
          localStorage.setItem("profileComplete", "false");
          toast.success("Please complete your profile to continue.");
          navigate("/profile");
        }
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await apiClient.post("/auth/send-otp", {
        email: email,
        purpose: "login_verification"
      });

      if (response.data.success) {
        setCountdown(300);
        toast.success("New OTP sent to your email");
      } else {
        toast.error(response.data.error || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Secure Verification</CardTitle>
          <p className="text-muted-foreground">
            For your security, please verify your Google sign-in with the OTP sent to your email
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg bg-blue-50 p-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Mail className="h-4 w-4" />
              <span>OTP sent to: {email}</span>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            
            <Button type="submit" disabled={loading || !otp || otp.length !== 6} className="w-full">
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="text-center space-y-2">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Session expires in: <span className="font-mono font-semibold">{formatTime(countdown)}</span>
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-medium">
                    Session expired! Please request a new OTP.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resendOTP}
                    className="w-full"
                  >
                    Resend OTP
                  </Button>
                </div>
              )}
              
              {countdown > 0 && countdown < 60 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resendOTP}
                  className="w-full text-sm"
                >
                  Resend OTP Now
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/signin")}
              className="text-sm"
            >
              ← Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthVerify;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Mail, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import apiClient from "@/utils/apiClient";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Mask email for display (show first 3 characters)
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart}***@${domain}`;
    }
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  // Password validation
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

  // Start countdown timer
  const startCountdown = () => {
    setTimeLeft(300); // 5 minutes
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setStep('otp');
      startCountdown();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/auth/verify-forgot-password-otp", {
        email,
        otp
      });
      toast.success("OTP verified successfully");
      setStep('password');
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        toast.error("Maximum attempts exceeded. Please start over.");
        setStep('email');
        setAttempts(0);
        setOtp("");
      } else {
        toast.error(error.response?.data?.error || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResending(true);
    
    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      toast.success("New OTP sent to your email");
      setAttempts(0);
      setOtp("");
      startCountdown();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-100 px-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 'email' && "Forgot Password"}
              {step === 'otp' && "Verify OTP"}
              {step === 'password' && "Reset Password"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === 'email' && "Enter your email to receive a verification code"}
              {step === 'otp' && "Enter the 6-digit code sent to your email"}
              {step === 'password' && "Create a new password for your account"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1: Email Input */}
              {step === 'email' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700" 
                    disabled={loading || !email}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail className="w-4 h-4" />
                      Code sent to:
                    </div>
                    <div className="font-medium text-gray-900">{maskEmail(email)}</div>
                    {timeLeft > 0 && (
                      <div className="text-sm text-orange-600 mt-1">
                        Code expires in: {formatTime(timeLeft)}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest font-mono"
                        maxLength={6}
                        required
                      />
                    </div>

                    {attempts > 0 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                        <AlertCircle className="w-4 h-4" />
                        Attempts: {attempts}/3
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-orange-600 hover:bg-orange-700" 
                      disabled={loading || otp.length !== 6 || timeLeft === 0}
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={resending || timeLeft > 240} // Allow resend after 1 minute
                      className="text-sm"
                    >
                      {resending ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
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
                    {newPassword && (
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
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
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
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700" 
                    disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              {/* Success Message for Password Step */}
              {step === 'password' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Almost done!</p>
                      <p>
                        Create a strong password to secure your account. You'll be able to sign in with your new password immediately.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Sign In */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;

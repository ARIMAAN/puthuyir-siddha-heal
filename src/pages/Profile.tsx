import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Save, X, Mail, Lock, Phone, Shield, CheckCircle, AlertCircle, Eye, EyeOff, User, MapPin, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import apiClient from "@/utils/apiClient";

interface ProfileData {
  full_name: string;
  date_of_birth: string;
  age: number;
  gender: string;
  blood_group: string;
  contact_number: string;
  email_address: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  health_background: string;
}

interface OTPState {
  type: 'email' | null;
  isVisible: boolean;
  otp: string;
  loading: boolean;
  attempts: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    date_of_birth: "",
    age: 0,
    gender: "",
    blood_group: "",
    contact_number: "",
    email_address: "",
    street_address: "",
    city: "",
    state: "",
    pincode: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
    health_background: ""
  });

  const [otpState, setOtpState] = useState<OTPState>({
    type: null,
    isVisible: false,
    otp: "",
    loading: false,
    attempts: 0
  });


  // Validation functions for Indian phone and pincode
  const validatePhoneNumber = (phone: string) => {
    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return {
      isValid: cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone),
      cleaned: cleanPhone
    };
  };

  const validatePincode = (pincode: string) => {
    // Remove any non-digit characters for validation
    const cleanPincode = pincode.replace(/\D/g, '');
    return {
      isValid: cleanPincode.length === 6 && /^\d{6}$/.test(cleanPincode),
      cleaned: cleanPincode
    };
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch and auto-fill profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        // Fetch both user data and patient profile
        const [userResponse, profileResponse] = await Promise.all([
          apiClient.get("/api/user"),
          apiClient.get("/api/profile").catch(() => ({ data: null }))
        ]);

        const userDataResponse = userResponse.data;
        const profileData = profileResponse.data;
        
        // Store user data for OAuth provider check
        setUserData(userDataResponse);

        console.log("🔍 Profile Data Debug:", {
          profileData,
          dateOfBirth: profileData?.date_of_birth,
          dateType: typeof profileData?.date_of_birth,
          userData: userDataResponse
        });

        // Format date for HTML date input (YYYY-MM-DD)
        const formatDateForInput = (dateValue: any) => {
          if (!dateValue) {
            console.log("📅 No date value provided");
            return "";
          }
          
          console.log("📅 Formatting date:", {
            value: dateValue,
            type: typeof dateValue,
            isDate: dateValue instanceof Date
          });
          
          let date: Date;
          
          // Handle different date formats
          if (dateValue instanceof Date) {
            date = dateValue;
          } else if (typeof dateValue === 'string') {
            date = new Date(dateValue);
          } else {
            console.log("❌ Unsupported date format:", dateValue);
            return "";
          }
          
          if (isNaN(date.getTime())) {
            console.log("❌ Invalid date:", dateValue);
            return "";
          }
          
          const formatted = date.toISOString().split('T')[0];
          console.log("✅ Formatted date:", formatted);
          return formatted;
        };

        // Merge user data with profile data and auto-fill
        const mergedProfile = {
          full_name: profileData?.full_name || userDataResponse?.full_name || "",
          date_of_birth: formatDateForInput(profileData?.date_of_birth || ""),
          age: profileData?.age || calculateAge(profileData?.date_of_birth || ""),
          gender: profileData?.gender || "",
          blood_group: profileData?.blood_group || "",
          contact_number: profileData?.contact_number || userDataResponse?.phone || "",
          email_address: profileData?.email_address || userDataResponse?.email || "",
          street_address: profileData?.street_address || "",
          city: profileData?.city || "",
          state: profileData?.state || "",
          pincode: profileData?.pincode || "",
          emergency_contact_name: profileData?.emergency_contact_name || "",
          emergency_contact_relationship: profileData?.emergency_contact_relationship || "",
          emergency_contact_phone: profileData?.emergency_contact_phone || "",
          health_background: profileData?.health_background || ""
        };

        setProfile(mergedProfile);
        setOriginalProfile(mergedProfile);
        
        // Check if user has an existing password (for OTP verification logic)
        // Manual signup users already have password, OAuth users might not
        const hasPassword = userDataResponse?.has_password || userDataResponse?.oauth_provider === null;
        localStorage.setItem('hasPassword', hasPassword ? 'true' : 'false');
        
        console.log("🔐 Password status check:", {
          hasPasswordFlag: userDataResponse?.has_password,
          oauthProvider: userDataResponse?.oauth_provider,
          finalHasPassword: hasPassword,
          passwordSetupRequired: userDataResponse?.password_setup_required,
          passwordSetupCompleted: userDataResponse?.password_setup_completed
        });
        
        // Check if password setup is required and not completed
        if (userDataResponse?.password_setup_required && !userDataResponse?.password_setup_completed) {
          toast.error("Password setup must be completed before accessing profile");
          toast.info("Redirecting to password setup...");
          setTimeout(() => {
            navigate("/auth/setup-password");
          }, 2000);
          return;
        }
        
        // Set edit mode based on profile completeness
        const isProfileComplete = mergedProfile.full_name && mergedProfile.gender && 
                                 mergedProfile.city && mergedProfile.state && mergedProfile.pincode;
        setIsEditMode(!isProfileComplete);
        
        if (isProfileComplete) {
          localStorage.setItem("profileComplete", "true");
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setIsEditMode(true);
      }
    };

    fetchProfileData();
  }, []);

  // Auto-calculate age when date of birth changes
  useEffect(() => {
    if (profile.date_of_birth) {
      const age = calculateAge(profile.date_of_birth);
      setProfile(prev => ({ ...prev, age }));
    }
  }, [profile.date_of_birth]);

  // Handle input changes
  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle phone number input with validation
  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleanValue.length <= 10) {
      setProfile(prev => ({ ...prev, contact_number: cleanValue }));
      setHasChanges(true);
    }
  };

  // Handle pincode input with validation
  const handlePincodeChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    // Limit to 6 digits
    if (cleanValue.length <= 6) {
      setProfile(prev => ({ ...prev, pincode: cleanValue }));
      setHasChanges(true);
    }
  };

  // Handle emergency contact phone input with validation
  const handleEmergencyPhoneChange = (value: string) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleanValue.length <= 10) {
      setProfile(prev => ({ ...prev, emergency_contact_phone: cleanValue }));
      setHasChanges(true);
    }
  };

  // Check if sensitive fields need OTP verification
  const needsOTPVerification = (type: 'email') => {
    if (!originalProfile) return false;
    
    switch (type) {
      case 'email':
        return profile.email_address !== originalProfile.email_address;
      default:
        return false;
    }
  };

  // Send OTP for verification
  const sendOTP = async (type: 'email') => {
    try {
      await apiClient.post("/api/auth/send-otp", { 
        email: profile.email_address, 
        purpose: "profile_update" 
      });
      
      setOtpState({
        type,
        isVisible: true,
        otp: "",
        loading: false,
        attempts: 0
      });
      toast.success(`OTP sent to your email for ${type} verification`);
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // Verify OTP and save
  const verifyOTPAndSave = async (type: 'email') => {
    if (otpState.attempts >= 3) {
      toast.error("Maximum OTP attempts exceeded. Please try again later.");
      return;
    }

    setOtpState(prev => ({ ...prev, loading: true }));
    
    try {
      await apiClient.post("/api/auth/verify-otp", { 
        email: profile.email_address, 
        otp: otpState.otp, 
        purpose: "profile_update" 
      });
      
      // OTP verified, now save the specific field
      await saveSpecificField(type);
      setOtpState({ type: null, isVisible: false, otp: "", loading: false, attempts: 0 });
    } catch (error) {
      setOtpState(prev => ({ ...prev, attempts: prev.attempts + 1, loading: false }));
      toast.error("OTP verification failed");
    }
  };

  // Save specific field after OTP verification
  const saveSpecificField = async (type: 'email') => {
    let updateData: any = {};
    
    switch (type) {
      case 'email':
        updateData = { email_address: profile.email_address };
        break;
    }
    
    try {
      await apiClient.post("/api/profile", { ...profile, ...updateData, profile_completed: true });
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      setOriginalProfile({ ...profile, ...updateData });
    } catch (error) {
      toast.error(`Failed to update ${type}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if password is required for OAuth users on first profile completion
      const hasPassword = localStorage.getItem('hasPassword') === 'true';
      const isFirstTimeProfile = localStorage.getItem('profileComplete') === 'false';
      const isOAuthUser = userData?.oauth_provider !== null && userData?.oauth_provider !== undefined;
      const isPasswordRequired = isOAuthUser && !hasPassword && isFirstTimeProfile;
      
      // Validate required fields
      if (!profile.full_name || !profile.gender || !profile.city || !profile.state || !profile.pincode || !profile.contact_number) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate phone number
      const phoneValidation = validatePhoneNumber(profile.contact_number);
      if (!phoneValidation.isValid) {
        toast.error("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)");
        setLoading(false);
        return;
      }

      // Validate pincode
      const pincodeValidation = validatePincode(profile.pincode);
      if (!pincodeValidation.isValid) {
        toast.error("Please enter a valid 6-digit pincode");
        setLoading(false);
        return;
      }
      

      // Check if sensitive fields need OTP verification
      const needsEmailOTP = needsOTPVerification('email');
      
      if (needsEmailOTP) {
        toast.info(`Please verify your email changes using the verification button before saving.`);
        setLoading(false);
        return;
      }
      
      // Save profile data
      await apiClient.post("/api/profile", { ...profile, profile_completed: true });
      
      
      localStorage.setItem("profileComplete", "true");
      toast.success("Profile updated successfully!");
      setOriginalProfile(profile);
      setIsEditMode(false);
      setHasChanges(false);
      
      // Navigate to dashboard if this is initial profile completion
      if (!originalProfile) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      
      // Check if password setup is required
      if (err.response?.data?.passwordSetupRequired) {
        toast.error("Password setup must be completed before saving profile");
        toast.info("Redirecting to password setup...");
        setTimeout(() => {
          navigate("/auth/setup-password");
        }, 2000);
      } else {
        toast.error(err.response?.data?.error || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OTP Verification Modal */}
      {otpState.isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {otpState.type?.charAt(0).toUpperCase() + otpState.type?.slice(1)} Verification
            </h2>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Enter the OTP sent to your email to verify this change.
              </p>
              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpState.otp}
                  onChange={(e) => setOtpState(prev => ({ ...prev, otp: e.target.value }))}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                {otpState.attempts > 0 && (
                  <p className="text-sm text-red-600">
                    Attempts: {otpState.attempts}/3
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOtpState({ type: null, isVisible: false, otp: "", loading: false, attempts: 0 })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => verifyOTPAndSave(otpState.type!)}
                  disabled={otpState.loading || otpState.otp.length !== 6}
                  className="flex-1"
                >
                  {otpState.loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                <Button
                  variant={isEditMode ? "outline" : "default"}
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex items-center gap-2"
                >
                  {isEditMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditMode ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        disabled={!isEditMode}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={profile.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (Auto-calculated)</Label>
                      <Input
                        id="age"
                        value={profile.age || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={profile.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                        disabled={!isEditMode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blood_group">Blood Group</Label>
                      <Select
                        value={profile.blood_group}
                        onValueChange={(value) => handleInputChange('blood_group', value)}
                        disabled={!isEditMode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Secure Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Secure Contact Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email_address">Email Address *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email_address"
                          type="email"
                          value={profile.email_address}
                          onChange={(e) => handleInputChange('email_address', e.target.value)}
                          disabled={!isEditMode}
                          required
                        />
                        {isEditMode && needsOTPVerification('email') && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => sendOTP('email')}
                            className="whitespace-nowrap"
                          >
                            Verify Email
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact_number">Mobile Number *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="contact_number"
                          type="tel"
                          value={profile.contact_number}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          disabled={!isEditMode}
                          required
                          placeholder="10-digit mobile number"
                          maxLength={10}
                        />
                      </div>
                      {isEditMode && profile.contact_number && !validatePhoneNumber(profile.contact_number).isValid && (
                        <p className="text-xs text-red-600">
                          Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)
                        </p>
                      )}
                      {isEditMode && profile.contact_number && validatePhoneNumber(profile.contact_number).isValid && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Valid mobile number
                        </p>
                      )}
                    </div>
                    
                    {/* Change Password Button */}
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="text-sm text-gray-600">••••••••</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowChangePasswordModal(true)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Address Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="street_address">Street Address</Label>
                      <Input
                        id="street_address"
                        value={profile.street_address}
                        onChange={(e) => handleInputChange('street_address', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditMode}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={profile.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={!isEditMode}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={profile.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        disabled={!isEditMode}
                        required
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {isEditMode && profile.pincode && !validatePincode(profile.pincode).isValid && (
                        <p className="text-xs text-red-600">
                          Please enter a valid 6-digit pincode
                        </p>
                      )}
                      {isEditMode && profile.pincode && validatePincode(profile.pincode).isValid && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Valid pincode
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_name">Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={profile.emergency_contact_name}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={profile.emergency_contact_relationship}
                        onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_phone">Phone</Label>
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        value={profile.emergency_contact_phone}
                        onChange={(e) => handleEmergencyPhoneChange(e.target.value)}
                        disabled={!isEditMode}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {isEditMode && profile.emergency_contact_phone && !validatePhoneNumber(profile.emergency_contact_phone).isValid && (
                        <p className="text-xs text-red-600">
                          Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)
                        </p>
                      )}
                      {isEditMode && profile.emergency_contact_phone && validatePhoneNumber(profile.emergency_contact_phone).isValid && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Valid mobile number
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold">Medical Information</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="health_background">Health Background</Label>
                    <Textarea
                      id="health_background"
                      value={profile.health_background}
                      onChange={(e) => handleInputChange('health_background', e.target.value)}
                      disabled={!isEditMode}
                      rows={4}
                      placeholder="Any relevant health information, medical conditions, allergies, etc."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditMode && (
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProfile(originalProfile || profile);
                        setIsEditMode(false);
                        setHasChanges(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !hasChanges}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              To change your password, you'll be redirected to a secure page where you can update it safely.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  // Navigate to the dedicated change password page or use the existing endpoint
                  window.location.href = '/forgot-password';
                }}
                className="flex-1"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;

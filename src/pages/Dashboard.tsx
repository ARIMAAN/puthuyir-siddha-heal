import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, User, Phone, Mail, MapPin, Shield } from "lucide-react";
import apiClient from "@/utils/apiClient";

interface Booking {
  _id: string;
  consultant_id: {
    name: string;
    specialty?: string;
  };
  appointment_date: string;
  symptoms: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  status: string;
  createdAt: string;
}

interface UserData {
  _id: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  oauth_provider?: string;
  is_verified: boolean;
  google_profile?: {
    displayName: string;
    photos: { value: string }[];
    locale: string;
    verified_email: boolean;
  };
  createdAt: string;
}

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both user data and bookings
    Promise.all([
      apiClient.get("/user"),
      apiClient.get("/bookings")
    ])
      .then(([userResponse, bookingsResponse]) => {
        setUserData(userResponse.data);
        setBookings(Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading your appointments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        
        {/* User Profile Section */}
        {userData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={userData.profile_picture || userData.google_profile?.photos[0]?.value} 
                    alt={userData.full_name}
                  />
                  <AvatarFallback>
                    {userData.first_name?.[0] || userData.full_name?.[0] || 'U'}
                    {userData.last_name?.[0] || userData.full_name?.split(' ')[1]?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">Welcome back, {userData.first_name || userData.full_name}!</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.email}</span>
                  {userData.is_verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="h-4 w-4 text-green-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {userData.oauth_provider && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">Signed in via {userData.oauth_provider}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {userData.google_profile?.verified_email && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Google Verified Account</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Appointments ({bookings.length})</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No appointments yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Book your first consultation to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card key={booking._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {booking.consultant_id?.name || "Dr. Dhivyadharshini"}
                      </CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    {booking.consultant_id?.specialty && (
                      <p className="text-sm text-muted-foreground">
                        {booking.consultant_id.specialty}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {booking.appointment_date 
                              ? new Date(booking.appointment_date).toLocaleDateString()
                              : "Date not set"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Medical Beneficiary:</span> {booking.patient_name}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Contact:</span> {booking.patient_phone}
                        </div>
                        {booking.symptoms && (
                          <div className="text-sm">
                            <span className="font-medium">Symptoms:</span>
                            <p className="text-muted-foreground mt-1">{booking.symptoms}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function isSignedIn() { return !!localStorage.getItem("token"); }
function isProfileComplete() { return localStorage.getItem("profileComplete") === "true"; }
function getUserName() { return localStorage.getItem("userName") || "Client"; }

const Consultant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const consultant = {
    name: "Dr. Dhivyadhashini",
    specialty: "Siddha Medicine",
    profile: "Experienced Siddha consultant specializing in holistic health and rejuvenation therapies.",
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const redirect = params.get("redirect");
    
    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      
      // Set profile completion status based on redirect parameter
      if (redirect === "profile") {
        localStorage.setItem("profileComplete", "false");
        navigate("/profile", { replace: true });
      } else {
        localStorage.setItem("profileComplete", "true");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [location, navigate]);

  const handleBookClick = async () => {
    if (!isSignedIn()) { setShowAuthPrompt(true); return; }
    if (!isProfileComplete()) { alert("Complete your profile first."); navigate("/profile"); return; }

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ consultant: consultant.name, slot: "10:00 AM", date: new Date().toISOString().slice(0, 10) }),
    });

    if (res.ok) setBookingConfirmed(true); else alert("Booking failed.");
  };

  if (bookingConfirmed) return (
    <div className="text-center mt-10">
      <h2>✅ Appointment Confirmed!</h2>
      <p>Your appointment with <b>{consultant.name}</b> has been booked!</p>
      <button onClick={() => navigate("/dashboard")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Go to Dashboard</button>
    </div>
  );

  if (showAuthPrompt) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl mb-2">🔒 Sign in Required</h2>
        <p className="mb-4">Please sign in or create an account first.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full" onClick={() => navigate("/signin")}>Sign In / Sign Up</button>
        <button className="bg-gray-200 px-4 py-2 rounded w-full" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">{consultant.name}</h2>
      <p className="text-gray-700">{consultant.specialty}</p>
      <p className="text-gray-600 mb-4">{consultant.profile}</p>
      {isSignedIn() && <p className="text-green-700">Welcome {getUserName()}! {isProfileComplete() ? "You can book now." : "Complete your profile first."}</p>}
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleBookClick}>Book Appointment</button>
    </div>
  );
};

export default Consultant;

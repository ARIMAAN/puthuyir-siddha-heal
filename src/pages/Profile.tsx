import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", age: "", gender: "", contact: "", health: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data) setProfile(data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    localStorage.setItem("profileComplete", "true");
    navigate("/consultant");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Complete Your Profile</h2>
      <input name="name" value={profile.name} onChange={handleChange} placeholder="Full Name" required className="block mb-2 p-2 border" />
      <input name="age" value={profile.age} onChange={handleChange} placeholder="Age" required className="block mb-2 p-2 border" />
      <input name="gender" value={profile.gender} onChange={handleChange} placeholder="Gender" required className="block mb-2 p-2 border" />
      <input name="contact" value={profile.contact} onChange={handleChange} placeholder="Contact Number" required className="block mb-2 p-2 border" />
      <input name="health" value={profile.health} onChange={handleChange} placeholder="Health Background (optional)" className="block mb-2 p-2 border" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save & Continue</button>
    </form>
  );
};

export default Profile;


import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Your Appointments</h2>
      {bookings.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {bookings.map((b: any) => (
            <li key={b.id} className="mb-2 border-b pb-2">
              <div>Consultant: {b.consultant}</div>
              <div>Date: {b.date}</div>
              <div>Slot: {b.slot}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("profileComplete", "false");
      navigate("/consultant", { replace: true });
    }
  }, [location, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        navigate("/consultant");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In to Puthuyir Care</h2>
        <p className="text-center text-gray-500 mb-6">Access appointments & records</p>

        <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border px-4 py-2 rounded"/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border px-4 py-2 rounded"/>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button onClick={handleGoogleSignIn} className="flex items-center justify-center border px-4 py-2 rounded w-full hover:bg-gray-100">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2"/> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;

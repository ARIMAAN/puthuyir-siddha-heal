import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/consultant");
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default AuthCallback;

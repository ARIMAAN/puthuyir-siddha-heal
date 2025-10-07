import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// NotFound page translations
const notFoundTranslations = {
  en: {
    title: "404",
    message: "Oops! Page not found",
    backHome: "Back to Home",
  },
  ta: {
    title: "404",
    message: "உப்ஸ்! பக்கம் கிடைக்கவில்லை",
    backHome: "முகப்புக்கு திரும்பு",
  },
};

const NotFound = () => {
  const { language } = useLanguage();
  const t = notFoundTranslations[language];
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.title}</h1>
        <p className="mb-4 text-xl text-gray-600">{t.message}</p>
        <Link to="/" className="text-blue-500 underline hover:text-blue-700">
          {t.backHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

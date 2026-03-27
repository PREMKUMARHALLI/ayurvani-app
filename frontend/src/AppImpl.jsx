import React, { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { getTranslation, languageNames, suggestedQuestions, aiGreetings } from "./translations";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import PrakritiPage from "./pages/PrakritiPage";
import HealthHistoryPage from "./pages/HealthHistoryPage";
import ProfilePage from "./pages/ProfilePage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

// Axios client (credentials for cookie-based auth)
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

// Auth Context
const AuthContext = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Language Context
const LanguageContext = createContext(null);
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

// LLM Status Context
const LLMContext = createContext(null);
export const useLLM = () => {
  const ctx = useContext(LLMContext);
  if (!ctx) throw new Error("useLLM must be used within LLMProvider");
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const register = async (email, password, name, preferred_language) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      name,
      preferred_language,
    });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
  };

  const updateUser = (updates) => setUser((prev) => (prev ? { ...prev, ...updates } : prev));

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const LanguageProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("ayurvani_language") : null;
    const initial = user?.preferred_language || stored || "en";
    setLanguageState(initial);
  }, [user]);

  const setLanguage = async (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ayurvani_language", lang);
      if (user) {
        await api.put("/auth/language", { language: lang });
        updateUser({ preferred_language: lang });
      }
    } catch {
      // Keep UI state even if server update fails
    }
  };

  const t = (key) => getTranslation(key, language);

  const getSuggestedQuestions = () => suggestedQuestions[language] || suggestedQuestions.en;
  const getAiGreeting = () => aiGreetings[language] || aiGreetings.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languageNames,
        getSuggestedQuestions,
        getAiGreeting,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const LLMProvider = ({ children }) => {
  const [status, setStatus] = useState({
    mode: "offline",
    ollama: { available: false },
    cloud: { available: false },
  });

  const checkStatus = async () => {
    try {
      const { data } = await api.get("/chat/status");
      setStatus(data);
    } catch {
      setStatus({ mode: "offline", ollama: { available: false }, cloud: { available: false } });
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return <LLMContext.Provider value={{ status, checkStatus }}>{children}</LLMContext.Provider>;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ayur-light flex items-center justify-center">
        <p className="text-ayur-muted text-sm">{t("Loading...")}</p>
      </div>
    );
  }

  if (!user) return null;
  return children;
};

export default function AppImpl() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LLMProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prakriti"
              element={
                <ProtectedRoute>
                  <PrakritiPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute>
                  <HealthHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </LLMProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}


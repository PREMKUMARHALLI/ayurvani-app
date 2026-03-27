import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useLanguage, useLLM } from "../App";
import { Leaf, Home, MessageSquare, Activity, Heart, LogOut } from "lucide-react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, languageNames } = useLanguage();
  const { status } = useLLM();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", icon: Home, label: t("Dashboard") },
    { path: "/chat", icon: MessageSquare, label: t("Chat") },
    { path: "/prakriti", icon: Activity, label: t("Prakriti") },
    { path: "/health", icon: Heart, label: t("Health") },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-ayur-light text-ayur-muted">
      <header className="bg-ayur-light/80 backdrop-blur-xl border-b border-ayur-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 font-serif text-xl font-semibold text-ayur-dark">
            <Leaf className="h-7 w-7 text-ayur-primary" />
            AyurVani
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  status.mode === "local"
                    ? "bg-ayur-success/20 text-ayur-success"
                    : status.mode === "cloud"
                      ? "bg-[#7C98A1]/20 text-[#7C98A1]"
                      : "bg-ayur-danger/20 text-ayur-danger"
                }`}
                data-testid="llm-status"
              >
                {status.mode === "local" ? "Local" : status.mode === "cloud" ? "Cloud" : t("Offline")}
              </span>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-ayur-border rounded-xl px-3 py-2 text-sm"
              aria-label="Language selector"
              data-testid="language-select"
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>

            <div className="hidden sm:flex items-center gap-2">
              {user?.name ? (
                <>
                  <span className="text-sm text-ayur-muted">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-ayur-primary/90 hover:bg-ayur-primary text-white"
                    aria-label="Sign out"
                    data-testid="sign-out-btn"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">{children}</main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-ayur-light/95 backdrop-blur-xl border-t border-ayur-border">
        <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl ${
                  active ? "bg-ayur-success/20 text-ayur-success" : "text-ayur-muted hover:text-ayur-dark"
                }`}
                data-testid={`nav-${item.path}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;


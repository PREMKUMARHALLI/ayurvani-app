import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, useLanguage } from "../App";
import Layout from "../components/Layout";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white/80 border border-ayur-border rounded-3xl shadow-sm p-6">
        <h1 className="font-serif text-2xl font-semibold text-ayur-dark mb-2">{t("Welcome Back")}</h1>
        <p className="text-ayur-muted text-sm mb-5">{t("Sign in to continue your wellness journey")}</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ayur-dark" htmlFor="email">
              {t("Email")}
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full bg-white border border-ayur-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ayur-dark" htmlFor="password">
              {t("Password")}
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full bg-white border border-ayur-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
              required
              minLength={6}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-ayur-primary text-white rounded-full py-3 font-semibold hover:bg-[#3A634D] disabled:opacity-60"
            type="submit"
            data-testid="login-submit-btn"
          >
            {loading ? t("Signing in...") : t("Sign In")}
          </button>

          <div className="text-center text-sm text-ayur-muted">
            {t("Don't have an account?")}{" "}
            <Link to="/register" className="text-ayur-primary hover:underline font-medium">
              {t("Create one")}
            </Link>
          </div>

          {/* language referenced to ensure selector works on login too */}
          <div className="hidden">
            {language}
            {setLanguage}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LoginPage;


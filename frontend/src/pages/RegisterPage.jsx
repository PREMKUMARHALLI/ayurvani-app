import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, useLanguage } from "../App";
import Layout from "../components/Layout";
import { languageNames } from "../translations";

const LANG_OPTIONS = [
  { code: "en", native: languageNames.en },
  { code: "hi", native: languageNames.hi },
  { code: "kn", native: languageNames.kn },
  { code: "te", native: languageNames.te },
  { code: "ta", native: languageNames.ta },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferred_language, setPreferredLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name, preferred_language);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white/80 border border-ayur-border rounded-3xl shadow-sm p-6">
        <div className="mb-6">
          <Link to="/" className="text-ayur-muted hover:text-ayur-dark font-medium text-sm">
            {t("Back to Home")}
          </Link>
        </div>

        <h1 className="font-serif text-2xl font-semibold text-ayur-dark mb-1">{t("Create Account")}</h1>
        <p className="text-ayur-muted text-sm mb-5">Begin your Ayurvedic wellness journey.</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ayur-dark" htmlFor="name">
              {t("Full Name")}
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-ayur-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ayur-dark" htmlFor="email">
              {t("Email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-ayur-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-ayur-dark">{t("Preferred Language")}</div>
            <div className="grid grid-cols-2 gap-2">
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPreferredLanguage(l.code)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    preferred_language === l.code ? "border-ayur-primary bg-[#EBF0EA]" : "border-ayur-border hover:border-ayur-glow"
                  }`}
                >
                  <div className="font-medium text-ayur-dark">{l.native}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-ayur-primary text-white rounded-full py-3 font-semibold hover:bg-[#3A634D] disabled:opacity-60"
            data-testid="register-submit-btn"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center text-sm text-ayur-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-ayur-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RegisterPage;


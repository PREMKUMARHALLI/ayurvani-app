import React from "react";
import Layout from "../components/Layout";
import { useAuth, useLanguage } from "../App";
import { languageNames } from "../translations";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h1 className="font-serif text-3xl font-semibold text-ayur-dark tracking-tight mb-1">{t("Profile")}</h1>
          <p className="text-ayur-muted text-sm mb-4">Manage your health profile and preferences.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-ayur-border rounded-2xl p-4 bg-white">
              <div className="text-xs text-ayur-muted">{t("Account Information")}</div>
              <div className="font-semibold text-ayur-dark mt-2">{user?.name || "-"}</div>
              <div className="text-sm text-ayur-muted mt-1">{user?.email || ""}</div>
              <div className="text-xs text-ayur-muted mt-3">
                {t("Member since")}:{" "}
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
              </div>
            </div>

            <div className="border border-ayur-border rounded-2xl p-4 bg-white">
              <div className="text-xs text-ayur-muted">{t("Dominant Dosha")}</div>
              <div className="font-semibold text-ayur-dark mt-2 capitalize">
                {user?.prakriti?.dominant_dosha || "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h2 className="font-serif text-xl font-semibold text-ayur-dark mb-3">{t("Language Preference")}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(languageNames).map(([code, name]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  language === code ? "border-ayur-primary bg-[#EBF0EA]" : "border-ayur-border hover:border-ayur-glow"
                }`}
                data-testid={`profile-lang-${code}`}
              >
                <div className="font-medium text-ayur-dark">{name}</div>
              </button>
            ))}
          </div>

          <div className="text-xs text-ayur-muted mt-3">
            Language preference updates your on-device / local experience and AI response language.
          </div>
        </div>

        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <button
            type="button"
            className="w-full border border-ayur-danger text-ayur-danger rounded-full py-3 font-semibold hover:bg-ayur-danger/10"
            onClick={logout}
            data-testid="logout-btn"
          >
            {t("Sign Out")}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;


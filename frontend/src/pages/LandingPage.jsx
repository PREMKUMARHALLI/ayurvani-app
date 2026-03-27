import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useLanguage, useLLM } from "../App";
import { Leaf, Activity, MessageSquare } from "lucide-react";

const LandingPage = () => {
  const { t, language } = useLanguage();
  const { status } = useLLM();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Leaf className="h-8 w-8 text-ayur-primary" />
            <h1 className="font-serif text-3xl font-semibold text-ayur-dark">AyurVani</h1>
          </div>
          <p className="text-ayur-muted leading-relaxed">
            Ancient wisdom meets modern AI. Get culturally-aware Ayurvedic wellness support in your language.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              to="/prakriti"
              className="inline-flex items-center justify-center rounded-full bg-ayur-primary text-white px-6 py-3 font-semibold hover:bg-[#3A634D]"
              data-testid="start-assessment-btn"
            >
              Start Prakriti Assessment
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-full border-2 border-ayur-primary text-ayur-primary px-6 py-3 font-semibold hover:bg-[#EBF0EA]"
              data-testid="talk-btn"
            >
              Talk to AyurVani
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-ayur-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-ayur-primary" />
              <h3 className="font-semibold text-ayur-dark">{t("Prakriti")}</h3>
            </div>
            <p className="text-sm text-ayur-muted">Take a quick assessment to understand your Dosha profile.</p>
          </div>
          <div className="bg-white border border-ayur-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-ayur-primary" />
              <h3 className="font-semibold text-ayur-dark">{t("Chat")}</h3>
            </div>
            <p className="text-sm text-ayur-muted">Ask questions and get remedy-style guidance with safety cues.</p>
          </div>
          <div className="bg-white border border-ayur-border rounded-2xl p-4">
            <h3 className="font-semibold text-ayur-dark mb-2">{t("Offline")}</h3>
            <p className="text-sm text-ayur-muted">
              {status.mode === "local" ? "Local LLM active for offline demos." : "Works best with local/offline mode."}
            </p>
          </div>
        </div>

        <p className="text-xs text-center text-ayur-muted">
          {t("Disclaimer")}
        </p>

        <div className="hidden">
          {/* keep language variable referenced for future i18n expansion */}
          {language}
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;


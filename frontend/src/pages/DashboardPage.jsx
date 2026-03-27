import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth, useLanguage } from "../App";

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="space-y-5">
        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h1 className="font-serif text-2xl font-semibold text-ayur-dark mb-2">
            {t("Dashboard")}
          </h1>
          <p className="text-ayur-muted text-sm">
            Welcome {user?.name ? user.name : ""}! Take a quick step: quiz, chat, or track symptoms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/prakriti" className="bg-white border border-ayur-border rounded-2xl p-4 hover:bg-[#EBF0EA] transition-colors">
            <div className="font-semibold text-ayur-dark">{t("Prakriti")}</div>
            <div className="text-sm text-ayur-muted mt-1">View your Dosha analysis</div>
          </Link>
          <Link to="/chat" className="bg-white border border-ayur-border rounded-2xl p-4 hover:bg-[#EBF0EA] transition-colors">
            <div className="font-semibold text-ayur-dark">{t("Chat")}</div>
            <div className="text-sm text-ayur-muted mt-1">Ask Ayurvedic wellness questions</div>
          </Link>
          <Link to="/health" className="bg-white border border-ayur-border rounded-2xl p-4 hover:bg-[#EBF0EA] transition-colors">
            <div className="font-semibold text-ayur-dark">{t("Health")}</div>
            <div className="text-sm text-ayur-muted mt-1">Track your symptoms & timeline</div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;


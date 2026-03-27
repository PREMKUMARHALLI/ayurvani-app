import React, { useState } from "react";
import Layout from "../components/Layout";
import { useLanguage } from "../App";

const HealthHistoryPage = () => {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(5);

  const addEntry = () => {
    if (!symptom.trim()) return;
    setEntries((prev) => [
      {
        id: Date.now().toString(),
        symptom: symptom.trim(),
        severity,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSymptom("");
  };

  return (
    <Layout>
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h1 className="font-serif text-2xl font-semibold text-ayur-dark mb-2">{t("Health")}</h1>
          <p className="text-ayur-muted text-sm">{t("Track your symptoms and wellness journey") || "Track your symptoms and wellness journey."}</p>
        </div>

        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-ayur-dark">Symptom</label>
            <input
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="e.g., headache, acidity, fatigue"
              className="w-full bg-white border border-ayur-border rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
            />
            <div className="space-y-1">
              <label className="text-sm font-medium text-ayur-dark">Severity: {severity}/10</label>
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
            <button
              onClick={addEntry}
              className="w-full bg-ayur-primary text-white rounded-full py-3 font-semibold hover:bg-[#3A634D]"
              data-testid="add-entry-btn"
            >
              {t("Add Entry") || "Add Entry"}
            </button>
          </div>
        </div>

        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h2 className="font-semibold text-ayur-dark mb-3">{t("Recent Entries") || "Recent Entries"}</h2>
          {entries.length === 0 ? (
            <p className="text-ayur-muted text-sm">No entries yet.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((e) => (
                <div key={e.id} className="border border-ayur-border rounded-2xl p-4 bg-white">
                  <div className="font-medium text-ayur-dark">{e.symptom}</div>
                  <div className="text-xs text-ayur-muted mt-1">Severity: {e.severity}/10</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HealthHistoryPage;


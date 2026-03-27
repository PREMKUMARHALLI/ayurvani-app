import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { api, useAuth, useLanguage } from "../App";
import { useNavigate } from "react-router-dom";

const DOSHAS = ["vata", "pitta", "kapha"];

const QUESTIONS = [
  {
    prompt: "How is your appetite?",
    options: [
      { label: "Irregular, sometimes high, sometimes low", dosha: "vata" },
      { label: "Strong; irritable if you miss meals", dosha: "pitta" },
      { label: "Steady; can skip meals easily", dosha: "kapha" },
    ],
  },
  {
    prompt: "How is your digestion?",
    options: [
      { label: "Irregular; bloating, gas, constipation", dosha: "vata" },
      { label: "Quick; acidity issues", dosha: "pitta" },
      { label: "Slow but steady; heaviness after meals", dosha: "kapha" },
    ],
  },
  {
    prompt: "How do you handle stress?",
    options: [
      { label: "Anxiety, worry, overthinking", dosha: "vata" },
      { label: "Anger, frustration", dosha: "pitta" },
      { label: "Withdrawal, lethargy", dosha: "kapha" },
    ],
  },
  {
    prompt: "How is your sleep pattern?",
    options: [
      { label: "Light, interrupted, trouble falling asleep", dosha: "vata" },
      { label: "Moderate; may wake up hot", dosha: "pitta" },
      { label: "Deep; hard to wake up", dosha: "kapha" },
    ],
  },
  {
    prompt: "How is your skin typically?",
    options: [
      { label: "Dry, rough, thin", dosha: "vata" },
      { label: "Warm, oily; prone to acne/rashes", dosha: "pitta" },
      { label: "Thick, soft, moist", dosha: "kapha" },
    ],
  },
  {
    prompt: "How do you respond to weather changes?",
    options: [
      { label: "Worse in cold/dry; feels restless", dosha: "vata" },
      { label: "Worse in heat; becomes irritated", dosha: "pitta" },
      { label: "Worse in cold; feels heavy/slow", dosha: "kapha" },
    ],
  },
  {
    prompt: "How is your energy level?",
    options: [
      { label: "High at times; varies", dosha: "vata" },
      { label: "Sharp but burns quickly", dosha: "pitta" },
      { label: "Steady; stable energy", dosha: "kapha" },
    ],
  },
  {
    prompt: "How are your bowel habits?",
    options: [
      { label: "Irregular; changes frequently", dosha: "vata" },
      { label: "Frequent; sometimes burning", dosha: "pitta" },
      { label: "Slow; tends to feel heavy/constipated", dosha: "kapha" },
    ],
  },
  {
    prompt: "How do you prefer to eat?",
    options: [
      { label: "Light; small unpredictable meals", dosha: "vata" },
      { label: "Spicy/tangy cravings; likes strong taste", dosha: "pitta" },
      { label: "Heavy foods; likes warm, oily foods", dosha: "kapha" },
    ],
  },
  {
    prompt: "How do you feel when you don’t get enough sleep?",
    options: [
      { label: "Anxious, restless, gas/constipation", dosha: "vata" },
      { label: "Irritable; acidity increases", dosha: "pitta" },
      { label: "Groggy; overeats or feels sluggish", dosha: "kapha" },
    ],
  },
];

const PrakritiPage = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]); // store selected dosha for each question
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const total = QUESTIONS.length;

  const progressPct = useMemo(() => {
    const answered = answers.length;
    return Math.round((answered / total) * 100);
  }, [answers.length, total]);

  const currentQ = QUESTIONS[step];

  const selectAnswer = async (dosha) => {
    const nextAnswers = [...answers, dosha];
    const nextStep = step + 1;

    if (nextStep >= total) {
      const counts = { vata: 0, pitta: 0, kapha: 0 };
      for (const a of nextAnswers) counts[a] = (counts[a] || 0) + 1;
      const totalCount = nextAnswers.length;

      const vataPct = counts.vata / totalCount;
      const pittaPct = counts.pitta / totalCount;
      const kaphaPct = counts.kapha / totalCount;
      const dominant_dosha = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "vata";

      const prakriti = {
        vata: vataPct,
        pitta: pittaPct,
        kapha: kaphaPct,
        dominant_dosha,
      };

      setResult(prakriti);

      // Best-effort save to backend
      try {
        setSaving(true);
        await api.post("/prakriti/submit", { prakriti });
      } catch {
        // ignore for demo
      } finally {
        setSaving(false);
      }
    } else {
      setStep(nextStep);
      setAnswers(nextAnswers);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/70 border border-ayur-border rounded-3xl shadow-sm p-6">
          <h1 className="font-serif text-2xl font-semibold text-ayur-dark">{t("Prakriti") || "Prakriti"}</h1>
          <p className="text-ayur-muted text-sm mt-1">
            Answer {total} quick questions to understand your likely constitution (Prakriti).
          </p>

          <div className="mt-4">
            <div className="h-2 bg-ayur-border rounded-full overflow-hidden">
              <div className="h-full bg-ayur-success" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="text-xs text-ayur-muted mt-2">
              Question {Math.min(step + 1, total)}/{total}
            </div>
          </div>
        </div>

        {!result ? (
          <div className="bg-white border border-ayur-border rounded-3xl shadow-sm p-6">
            <div className="text-lg font-semibold text-ayur-dark mb-4">{currentQ.prompt}</div>
            <div className="space-y-3">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.dosha}
                  type="button"
                  onClick={() => selectAnswer(opt.dosha)}
                  className="w-full text-left bg-ayur-light hover:bg-[#EBF0EA] border border-ayur-border rounded-2xl px-4 py-3 transition-colors"
                  disabled={saving}
                  data-testid={`quiz-option-${opt.dosha}`}
                >
                  <div className="font-medium text-ayur-dark">{opt.label}</div>
                  <div className="text-xs text-ayur-muted mt-1">Select: {opt.dosha}</div>
                </button>
              ))}
            </div>

            {saving ? <p className="text-xs text-ayur-muted mt-4">Saving your Prakriti…</p> : null}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="flex-1 bg-white border border-ayur-border rounded-full py-2 font-semibold hover:bg-[#EBF0EA]"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex-1 bg-white border border-ayur-border rounded-full py-2 font-semibold hover:bg-[#EBF0EA]"
              >
                Retake
              </button>
            </div>

            <div className="hidden">{language}</div>
          </div>
        ) : (
          <div className="bg-white border border-ayur-border rounded-3xl shadow-sm p-6">
            <h2 className="font-serif text-xl font-semibold text-ayur-dark mb-3">Your Prakriti Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-ayur-border p-4">
                <div className="text-xs text-ayur-muted">Vata</div>
                <div className="text-2xl font-bold text-ayur-primary mt-1">{Math.round(result.vata * 100)}%</div>
              </div>
              <div className="rounded-2xl border border-ayur-border p-4">
                <div className="text-xs text-ayur-muted">Pitta</div>
                <div className="text-2xl font-bold text-ayur-accent mt-1">{Math.round(result.pitta * 100)}%</div>
              </div>
              <div className="rounded-2xl border border-ayur-border p-4">
                <div className="text-xs text-ayur-muted">Kapha</div>
                <div className="text-2xl font-bold text-ayur-success mt-1">{Math.round(result.kapha * 100)}%</div>
              </div>
            </div>

            <div className="mt-5 bg-ayur-light border border-ayur-border rounded-2xl p-4">
              <div className="text-sm text-ayur-muted">Dominant Dosha</div>
              <div className="text-xl font-semibold capitalize text-ayur-dark">{result.dominant_dosha}</div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="bg-ayur-primary text-white rounded-full py-3 font-semibold hover:bg-[#3A634D]"
              >
                Start Consultation
              </button>
              <button
                type="button"
                onClick={reset}
                className="bg-white border border-ayur-border text-ayur-primary rounded-full py-3 font-semibold hover:bg-[#EBF0EA]"
              >
                Retake Assessment
              </button>
            </div>

            {saving ? <p className="text-xs text-ayur-muted mt-3">Updating your profile…</p> : null}
          </div>
        )}

        <div className="text-xs text-center text-ayur-muted pt-2">
          {user?.prakriti ? "Saved to your profile." : "Save happens automatically in the background if connected."}
        </div>
      </div>
    </Layout>
  );
};

export default PrakritiPage;


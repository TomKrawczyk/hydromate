import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Moon, Sun, Clock, ChevronRight, User } from "lucide-react";

export default function Onboarding({ onSave, existingProfile }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: existingProfile?.name || "",
    weight_kg: existingProfile?.weight_kg || "",
    wake_time: existingProfile?.wake_time || "07:00",
    sleep_time: existingProfile?.sleep_time || "22:00",
    reminder_interval_minutes: existingProfile?.reminder_interval_minutes || 60,
  });
  const [saving, setSaving] = useState(false);

  const goal = form.weight_kg ? Math.round(parseFloat(form.weight_kg) * 30) : null;

  const steps = [
    {
      icon: <User className="w-10 h-10 text-violet-400" />,
      title: "Cześć! Jak masz na imię?",
      subtitle: "Podaj swoje imię, żebyśmy mogli Cię przywitać personalnie.",
      content: (
        <div>
          <label className="text-sm font-medium text-slate-500 mb-2 block">Twoje imię</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="np. Marek"
            autoFocus
            className="w-full text-3xl font-light text-center bg-white/70 border border-violet-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-700 placeholder-slate-300"
          />
          {form.name && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-slate-400 text-sm mt-3"
            >
              Miło Cię poznać, <span className="font-semibold text-violet-500">{form.name}</span>! 👋
            </motion.p>
          )}
        </div>
      ),
      valid: !!form.name.trim(),
    },
    {
      icon: <Droplets className="w-10 h-10 text-blue-400" />,
      title: "Twoje nawodnienie",
      subtitle: "Podaj swoją wagę, aby obliczyć dzienne zapotrzebowanie na wodę",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-500 mb-2 block">Twoja waga (kg)</label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="300"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="np. 70"
                className="w-full text-3xl font-light text-center bg-white/70 border border-blue-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-700 placeholder-slate-300"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
            </div>
          </div>
          {goal && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-2xl p-4 text-center"
            >
              <p className="text-blue-400 text-sm mb-1">Twój dzienny cel</p>
              <p className="text-blue-700 text-4xl font-bold">{goal} <span className="text-2xl font-light">ml</span></p>
              <p className="text-blue-400 text-xs mt-1">= {(goal / 1000).toFixed(1)} litrów dziennie</p>
            </motion.div>
          )}
        </div>
      ),
      valid: !!form.weight_kg && parseFloat(form.weight_kg) > 0,
    },
    {
      icon: <Sun className="w-10 h-10 text-amber-400" />,
      title: "Twój harmonogram",
      subtitle: "Kiedy wstajesz i idziesz spać? Nie będziemy Ci przeszkadzać w nocy.",
      content: (
        <div className="space-y-4">
          <div className="bg-white/70 rounded-2xl p-5 border border-amber-100">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-slate-600">Godzina pobudki</span>
            </div>
            <input
              type="time"
              value={form.wake_time}
              onChange={(e) => setForm({ ...form, wake_time: e.target.value })}
              className="w-full text-3xl font-light text-center bg-transparent focus:outline-none text-slate-700"
            />
          </div>
          <div className="bg-white/70 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-slate-600">Godzina snu</span>
            </div>
            <input
              type="time"
              value={form.sleep_time}
              onChange={(e) => setForm({ ...form, sleep_time: e.target.value })}
              className="w-full text-3xl font-light text-center bg-transparent focus:outline-none text-slate-700"
            />
          </div>
        </div>
      ),
      valid: !!form.wake_time && !!form.sleep_time,
    },
    {
      icon: <Clock className="w-10 h-10 text-emerald-400" />,
      title: "Częstotliwość przypomnień",
      subtitle: "Co ile minut chcesz otrzymywać przypomnienie o wypiciu wody?",
      content: (
        <div className="space-y-3">
          {[30, 45, 60, 90, 120].map((mins) => (
            <button
              key={mins}
              onClick={() => setForm({ ...form, reminder_interval_minutes: mins })}
              className={`w-full flex items-center justify-between rounded-2xl px-6 py-4 transition-all border ${
                form.reminder_interval_minutes === mins
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
                  : "bg-white/70 border-slate-100 text-slate-700 hover:border-emerald-200"
              }`}
            >
              <span className="font-medium">Co {mins} minut</span>
              {form.reminder_interval_minutes === mins && (
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      ),
      valid: true,
    },
  ];

  const currentStep = steps[step];

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setSaving(true);
      await onSave(form);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-start px-5 pt-16 pb-10">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-blue-500" : i < step ? "w-4 bg-blue-300" : "w-4 bg-slate-200"
            }`}
          />
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-blue-100 mb-5">
            {currentStep.icon}
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{currentStep.title}</h1>
          <p className="text-slate-500 text-sm leading-relaxed">{currentStep.subtitle}</p>
        </div>

        <div className="space-y-3 mb-10">{currentStep.content}</div>

        <button
          disabled={!currentStep.valid || saving}
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <>
              {step < steps.length - 1 ? "Dalej" : "Zacznij!"}
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-center text-slate-400 text-sm mt-4 py-2"
          >
            ← Wróć
          </button>
        )}
      </motion.div>
    </div>
  );
}
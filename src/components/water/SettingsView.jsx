import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sun, Moon, Clock, Scale, Save, User } from "lucide-react";

export default function SettingsView({ profile, onSave }) {
  const [form, setForm] = useState({
    weight_kg: profile.weight_kg || "",
    wake_time: profile.wake_time || "07:00",
    sleep_time: profile.sleep_time || "22:00",
    reminder_interval_minutes: profile.reminder_interval_minutes || 60,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const goal = form.weight_kg ? Math.round(parseFloat(form.weight_kg) * 30) : null;

  const handleSave = async () => {
    setSaving(true);
    const dailyGoal = Math.round(parseFloat(form.weight_kg) * 30);
    await base44.entities.UserProfile.update(profile.id, {
      ...form,
      daily_goal_ml: dailyGoal,
      onboarding_completed: true,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSave) onSave(form);
  };

  return (
    <div className="space-y-4 pt-2">
      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-1">Ustawienia</p>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Scale className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Waga</p>
            <p className="text-slate-400 text-xs">30 ml na każdy kg</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="number"
            min="30"
            max="300"
            value={form.weight_kg}
            onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
            className="w-full text-2xl font-light text-center bg-slate-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-slate-700"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
        </div>
        {goal && (
          <p className="text-center text-xs text-blue-500 mt-2 font-medium">Dzienny cel: {goal} ml</p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Harmonogram</p>
            <p className="text-slate-400 text-xs">Brak przypomnień w nocy</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-500">Wstajesz</span>
            </div>
            <input
              type="time"
              value={form.wake_time}
              onChange={(e) => setForm({ ...form, wake_time: e.target.value })}
              className="w-full text-lg font-semibold text-center bg-transparent focus:outline-none text-slate-700"
            />
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-slate-500">Śpisz</span>
            </div>
            <input
              type="time"
              value={form.sleep_time}
              onChange={(e) => setForm({ ...form, sleep_time: e.target.value })}
              className="w-full text-lg font-semibold text-center bg-transparent focus:outline-none text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Częstotliwość przypomnień</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[30, 45, 60, 90, 120].map((mins) => (
            <button
              key={mins}
              onClick={() => setForm({ ...form, reminder_interval_minutes: mins })}
              className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                form.reminder_interval_minutes === mins
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100"
                  : "bg-slate-50 border-transparent text-slate-600 hover:border-emerald-200"
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !form.weight_kg}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-2xl transition-all shadow-lg ${
          saved
            ? "bg-emerald-500 shadow-emerald-200 text-white"
            : "bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white disabled:opacity-40"
        }`}
      >
        {saving ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : saved ? (
          "✓ Zapisano!"
        ) : (
          <>
            <Save className="w-4 h-4" />
            Zapisz ustawienia
          </>
        )}
      </button>
    </div>
  );
}
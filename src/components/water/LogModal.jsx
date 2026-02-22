import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, X } from "lucide-react";

const PRESETS = [150, 200, 250, 300, 330, 500];

export default function LogModal({ onLog, onClose, reminderMode = false }) {
  const [selected, setSelected] = useState(250);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [saving, setSaving] = useState(false);

  const amount = useCustom ? parseInt(custom) || 0 : selected;

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;
    setSaving(true);
    await onLog(amount);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={!reminderMode ? onClose : undefined}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {reminderMode ? "Czas na wodę! 💧" : "Ile wypiłeś/aś?"}
            </h2>
            {reminderMode && (
              <p className="text-slate-400 text-sm mt-0.5">Podaj ile wypiłeś/aś wody</p>
            )}
          </div>
          {!reminderMode && (
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {PRESETS.map((ml) => (
            <button
              key={ml}
              onClick={() => { setSelected(ml); setUseCustom(false); }}
              className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                !useCustom && selected === ml
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                  : "border-slate-100 bg-slate-50 hover:border-blue-200"
              }`}
            >
              <Droplets className={`w-5 h-5 mb-1 ${!useCustom && selected === ml ? "text-blue-500" : "text-slate-400"}`} />
              <span className={`font-semibold text-sm ${!useCustom && selected === ml ? "text-blue-700" : "text-slate-600"}`}>
                {ml} ml
              </span>
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div
          onClick={() => setUseCustom(true)}
          className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 mb-6 cursor-text transition-all ${
            useCustom ? "border-blue-500 bg-blue-50" : "border-slate-100 bg-slate-50"
          }`}
        >
          <span className="text-slate-400 text-sm">Inna ilość:</span>
          <input
            type="number"
            min="1"
            max="2000"
            placeholder="np. 350"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setUseCustom(true); }}
            className="flex-1 bg-transparent focus:outline-none text-slate-700 font-medium text-sm"
          />
          <span className="text-slate-400 text-sm">ml</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!amount || amount <= 0 || saving}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-40 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
        >
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <>
              <Droplets className="w-5 h-5" />
              Zapisz {amount > 0 ? `${amount} ml` : ""}
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
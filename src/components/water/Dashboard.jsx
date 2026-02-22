import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Settings, History } from "lucide-react";
import WaterProgress from "./WaterProgress";
import LogModal from "./LogModal";
import HistoryView from "./HistoryView";
import SettingsView from "./SettingsView";

export default function Dashboard({ profile, logs, todayTotal, onLogWater, onEditProfile, onRefresh }) {
  const [view, setView] = useState("home"); // home | history | settings
  const [showLogModal, setShowLogModal] = useState(false);

  const goal = profile.daily_goal_ml || 2000;
  const percent = Math.min(100, Math.round((todayTotal / goal) * 100));

  const handleLog = async (ml) => {
    await onLogWater(ml);
    setShowLogModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Dzisiaj</p>
          <h1 className="text-2xl font-bold text-slate-800">Nawodnienie</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "history" ? "home" : "history")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              view === "history" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-500 shadow-sm"
            }`}
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView(view === "settings" ? "home" : "settings")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              view === "settings" ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-500 shadow-sm"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <WaterProgress todayTotal={todayTotal} goal={goal} percent={percent} />

              {/* Status message */}
              <div className="mt-5 bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    percent >= 100 ? "bg-emerald-100" : "bg-blue-100"
                  }`}>
                    <Droplets className={`w-6 h-6 ${percent >= 100 ? "text-emerald-500" : "text-blue-500"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {percent >= 100 ? "Cel osiągnięty! 🎉" : `Zostało ${goal - todayTotal} ml`}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {todayTotal} ml z {goal} ml dziennego celu
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent logs */}
              {logs.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-3">Ostatnie wpisy</p>
                  <div className="space-y-2">
                    {[...logs].reverse().slice(0, 5).map((log) => (
                      <div key={log.id} className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Droplets className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-slate-700 font-medium">{log.amount_ml} ml</span>
                        </div>
                        <span className="text-slate-400 text-sm">
                          {new Date(log.logged_at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <HistoryView goal={goal} />
            </motion.div>
          )}

          {view === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <SettingsView profile={profile} onSave={async (data) => {
                await onEditProfile(data);
                setView("home");
                await onRefresh();
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB */}
      {view === "home" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-8 py-4 rounded-full shadow-2xl shadow-blue-300 transition-all"
          >
            <Plus className="w-5 h-5" />
            Dodaj wodę
          </button>
        </div>
      )}

      {showLogModal && (
        <LogModal onLog={handleLog} onClose={() => setShowLogModal(false)} />
      )}
    </div>
  );
}
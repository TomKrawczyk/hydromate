import { motion } from "framer-motion";
import { Droplets, BellOff } from "lucide-react";
import LogModal from "./LogModal";

export default function ReminderModal({ profile, todayTotal, onLog, onDismiss }) {
  const goal = profile.daily_goal_ml || 2000;
  const remaining = Math.max(0, goal - todayTotal);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      {/* Pulsing water drop animation */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full bg-blue-400/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-blue-400/30 flex items-center justify-center"
            >
              <Droplets className="w-10 h-10 text-blue-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl"
      >
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Czas na wodę! 💧</h2>
          <p className="text-slate-400 text-sm">
            Zostało Ci jeszcze <span className="font-semibold text-blue-600">{remaining} ml</span> do celu dziennego
          </p>
        </div>

        {/* Inline log from here */}
        <LogModal onLog={onLog} onClose={onDismiss} reminderMode={true} />

        <button
          onClick={onDismiss}
          className="w-full flex items-center justify-center gap-2 text-slate-400 text-sm mt-3 py-2"
        >
          <BellOff className="w-4 h-4" />
          Przypomnij później
        </button>
      </motion.div>
    </div>
  );
}
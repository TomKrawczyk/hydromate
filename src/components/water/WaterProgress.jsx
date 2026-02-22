import { motion } from "framer-motion";

export default function WaterProgress({ todayTotal, goal, percent }) {
  // Wave animation for the bottle fill
  const fillHeight = Math.min(100, percent);

  return (
    <div className="flex flex-col items-center py-6">
      {/* Circular progress */}
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100" cy="100" r="85"
            fill="none"
            stroke="#e0f0ff"
            strokeWidth="14"
          />
          {/* Progress arc */}
          <motion.circle
            cx="100" cy="100" r="85"
            fill="none"
            stroke="url(#blueGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 85}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - fillHeight / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            key={todayTotal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-slate-800"
          >
            {(todayTotal / 1000).toFixed(2).replace(".", ",")}
          </motion.p>
          <p className="text-slate-400 text-sm font-medium">litrów</p>
          <div className="mt-1 px-3 py-0.5 rounded-full bg-blue-50">
            <p className="text-blue-500 text-xs font-semibold">{percent}%</p>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm mt-3">
        Cel: <span className="font-semibold text-slate-600">{(goal / 1000).toFixed(1)} l</span>
      </p>
    </div>
  );
}
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Droplets, TrendingUp } from "lucide-react";

export default function HistoryView({ goal }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await base44.entities.WaterLog.list("-date", 200);
      setLogs(all);
      setLoading(false);
    };
    load();
  }, []);

  // Group by date
  const byDate = logs.reduce((acc, log) => {
    const d = log.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a)).slice(0, 14);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (dateStr === today) return "Dzisiaj";
    if (dateStr === yesterday) return "Wczoraj";
    return d.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-3 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (sortedDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Droplets className="w-12 h-12 text-slate-200 mb-4" />
        <p className="text-slate-400">Brak historii</p>
        <p className="text-slate-300 text-sm">Zacznij rejestrować wodę!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-blue-400" />
        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Ostatnie 14 dni</p>
      </div>

      {sortedDates.map((date) => {
        const dayLogs = byDate[date];
        const total = dayLogs.reduce((s, l) => s + (l.amount_ml || 0), 0);
        const pct = Math.min(100, Math.round((total / goal) * 100));
        const achieved = total >= goal;

        return (
          <div key={date} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-700 capitalize">{formatDate(date)}</p>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                achieved ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              }`}>
                {achieved ? "✓ Cel!" : `${pct}%`}
              </div>
            </div>

            {/* Bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${achieved ? "bg-emerald-400" : "bg-blue-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-700 font-semibold text-sm">{total} ml</span>
              </div>
              <span className="text-slate-400 text-xs">{dayLogs.length} wpis{dayLogs.length === 1 ? "" : "ów"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
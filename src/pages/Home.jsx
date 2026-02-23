import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import Dashboard from "../components/water/Dashboard";
import Onboarding from "../components/water/Onboarding";
import ReminderModal from "../components/water/ReminderModal";
import { useNotifications } from "../components/water/useNotifications";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [todayTotal, setTodayTotal] = useState(0);
  const { requestPermission, sendNotification } = useNotifications();

  const today = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    const [profiles, todayLogs] = await Promise.all([
      base44.entities.UserProfile.list(),
      base44.entities.WaterLog.filter({ date: today }),
    ]);
    const p = profiles[0] || null;
    setProfile(p);
    setLogs(todayLogs);
    const total = todayLogs.reduce((sum, l) => sum + (l.amount_ml || 0), 0);
    setTodayTotal(total);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    loadData();
    // Request notification permission on app start
    requestPermission();
  }, [loadData]);

  // Reminder scheduler
  useEffect(() => {
    if (!profile?.onboarding_completed) return;

    const checkReminder = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const wake = profile.wake_time || "07:00";
      const sleep = profile.sleep_time || "22:00";
      const isAwakeTime = hhmm >= wake && hhmm < sleep;
      if (!isAwakeTime) return;

      const lastReminderRaw = localStorage.getItem("last_reminder_ts");
      const intervalMs = (profile.reminder_interval_minutes || 60) * 60 * 1000;
      const lastTs = lastReminderRaw ? parseInt(lastReminderRaw) : 0;
      if (Date.now() - lastTs >= intervalMs) {
        // Try native notification first (works in Android WebView / Capacitor)
        sendNotification(
          "HydroReminder 💧",
          `Czas na wodę! Pamiętaj o nawodnieniu.`,
          () => setShowReminder(true)
        );
        setShowReminder(true);
      }
    };

    checkReminder();
    const timer = setInterval(checkReminder, 60 * 1000);
    return () => clearInterval(timer);
  }, [profile]);

  const handleLogWater = async (amount_ml) => {
    const now = new Date();
    await base44.entities.WaterLog.create({
      amount_ml,
      logged_at: now.toISOString(),
      date: today,
    });
    localStorage.setItem("last_reminder_ts", Date.now().toString());
    setShowReminder(false);
    await loadData();
  };

  const handleSaveProfile = async (data) => {
    const dailyGoal = Math.round(data.weight_kg * 30);
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, {
        ...data,
        daily_goal_ml: dailyGoal,
        onboarding_completed: true,
      });
    } else {
      await base44.entities.UserProfile.create({
        ...data,
        daily_goal_ml: dailyGoal,
        onboarding_completed: true,
      });
    }
    await loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (!profile?.onboarding_completed) {
    return <Onboarding onSave={handleSaveProfile} existingProfile={profile} />;
  }

  return (
    <>
      <Dashboard
        profile={profile}
        logs={logs}
        todayTotal={todayTotal}
        onLogWater={handleLogWater}
        onEditProfile={async (data) => {
          const dailyGoal = Math.round(data.weight_kg * 30);
          await base44.entities.UserProfile.update(profile.id, {
            ...data,
            daily_goal_ml: dailyGoal,
            onboarding_completed: true,
          });
          await loadData();
        }}
        onRefresh={loadData}
      />
      {showReminder && (
        <ReminderModal
          profile={profile}
          todayTotal={todayTotal}
          onLog={handleLogWater}
          onDismiss={() => {
            localStorage.setItem("last_reminder_ts", Date.now().toString());
            setShowReminder(false);
          }}
        />
      )}
    </>
  );
}
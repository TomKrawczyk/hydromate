import { useEffect, useCallback } from "react";

/**
 * Hook do zarządzania powiadomieniami Web Notifications API.
 * Działa w przeglądarce (w tym WebView w Android Studio / Capacitor).
 */
export function useNotifications() {
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  const requestPermission = useCallback(async () => {
    if (!isSupported) return "denied";
    if (Notification.permission === "granted") return "granted";
    const result = await Notification.requestPermission();
    return result;
  }, [isSupported]);

  const sendNotification = useCallback((title, body, onClick) => {
    if (!isSupported || Notification.permission !== "granted") return;
    const n = new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [200, 100, 200],
    });
    if (onClick) n.onclick = onClick;
    return n;
  }, [isSupported]);

  return {
    isSupported,
    permission: isSupported ? Notification.permission : "denied",
    requestPermission,
    sendNotification,
  };
}
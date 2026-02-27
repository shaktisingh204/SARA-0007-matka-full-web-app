import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the current time in IST (Indian Standard Time) is before the specified target time.
 * @param targetTimeStr The target time in "HH:MM" 24-hour format, or special strings like "24 Hours".
 * @returns true if the current IST time is before the target time, or if it's always open.
 */
export function isGameOpen(targetTimeStr: string): boolean {
  if (!targetTimeStr || targetTimeStr.toLowerCase() === '24 hours' || targetTimeStr === '') {
    return true;
  }

  // Parse HH:MM
  const match = targetTimeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    // If we can't parse it, let's err on the side of caution or assume it's open
    return true;
  }

  const targetHours = parseInt(match[1], 10);
  const targetMinutes = parseInt(match[2], 10);

  // Get current time in IST
  const nowStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const nowIST = new Date(nowStr);
  const currentHours = nowIST.getHours();
  const currentMinutes = nowIST.getMinutes();

  // Compare times
  if (currentHours < targetHours) return true;
  if (currentHours === targetHours && currentMinutes < targetMinutes) return true;

  return false;
}

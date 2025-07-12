import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return Number(
    (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(
      1
    )
  );
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-yellow-600";
  if (rating >= 3.0) return "text-orange-600";
  return "text-red-600";
}

export function getRatingBadgeColor(rating: number): string {
  if (rating >= 4.5) return "bg-green-100 text-green-800";
  if (rating >= 4.0) return "bg-yellow-100 text-yellow-800";
  if (rating >= 3.0) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

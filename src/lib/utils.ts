import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(value: string) {
  const parsed = parseISO(value);

  if (!isValid(parsed)) {
    return value;
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function toDateString(value: unknown) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return new Date(value).toISOString();
  }

  if (typeof value === "object" && value !== null) {
    const maybeTimestamp = value as {
      seconds?: number;
      toDate?: () => Date;
    };

    if (typeof maybeTimestamp.toDate === "function") {
      return maybeTimestamp.toDate().toISOString();
    }

    if (typeof maybeTimestamp.seconds === "number") {
      return new Date(maybeTimestamp.seconds * 1000).toISOString();
    }
  }

  return new Date().toISOString();
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  // Math.random fallback (UUID-like random hex)
  const randomHex = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0")
  ).join("-");
  return `${prefix}-${randomHex}`;
}

import type { Language, LocalizedString } from "@/types";

export function pickText(
  value: LocalizedString,
  language: Language,
) {
  return value[language] ?? value.en;
}

export function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function wasSubmittedTooFast(key: string, cooldownMs = 15_000) {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return false;
  }

  const lastAttempt = Number(raw);
  return Number.isFinite(lastAttempt) && Date.now() - lastAttempt < cooldownMs;
}

export function markSubmitted(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, `${Date.now()}`);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

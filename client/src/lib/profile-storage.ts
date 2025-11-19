import type { InsertUserProfile } from "@shared/schema";

const PROFILE_KEY = "userProfile";
const PROFILE_ID_KEY = "profileId";

export function saveProfile(profile: InsertUserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile(): InsertUserProfile | null {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveProfileId(id: string): void {
  localStorage.setItem(PROFILE_ID_KEY, id);
}

export function getProfileId(): string | null {
  return localStorage.getItem(PROFILE_ID_KEY);
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PROFILE_ID_KEY);
}

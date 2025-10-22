// frontend/api/helpers.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Converts a relative avatar path to a full URL
 * @param avatarPath - The avatar path (can be relative or full URL)
 * @returns Full URL for the avatar
 */
export function getAvatarUrl(avatarPath?: string | null): string {
  if (!avatarPath) {
    return "https://ui-avatars.com/api/?name=User&background=random";
  }

  // If it's already a full URL (starts with http:// or https://), return as is
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }

  // If it's a relative path starting with /uploads, prepend the base URL
  if (avatarPath.startsWith("/uploads")) {
    return `${API_BASE_URL}${avatarPath}`;
  }

  // Otherwise, return as is (might be a data URL or other format)
  return avatarPath;
}

/**
 * Gets the base API URL
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
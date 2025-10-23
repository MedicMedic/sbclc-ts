import { buildAssetUrl } from "./config";

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

  // Use the centralized asset URL builder
  return buildAssetUrl(avatarPath);
}
// ==================== FIXED: src/api/config.ts ====================
/**
 * Centralized API configuration
 * This file ensures consistent API URL handling across all environments
 */

// Helper function to normalize base URL
function normalizeBaseUrl(url: string): string {
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  
  // Ensure we have a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  
  return url;
}

// Helper function to ensure path starts with single slash
function normalizePath(path: string): string {
  // Remove leading slashes, then add exactly one
  return '/' + path.replace(/^\/+/, '');
}

// Get base URL from environment or use localhost as fallback
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

/**
 * Build a complete API URL from a path
 * Handles both /api/endpoint and endpoint formats
 * 
 * @param path - API endpoint path (e.g., 'login', '/login', 'api/login', '/api/login')
 * @returns Complete URL with proper formatting
 */
export function buildApiUrl(path: string): string {
  // Normalize the path
  const normalizedPath = normalizePath(path);
  
  // Check if path already includes /api
  const hasApiPrefix = normalizedPath.startsWith('/api/');
  
  // Build the URL
  // If path already has /api, use as-is. Otherwise, prepend /api
  const finalPath = hasApiPrefix ? normalizedPath : `/api${normalizedPath}`;
  
  return `${API_BASE_URL}${finalPath}`;
}

/**
 * Get the base URL for API requests
 * Returns URL WITHOUT /api prefix (since your server.ts already has /api in routes)
 * 
 * Usage examples:
 * - client.get('/api/users') → http://localhost:5000/api/users ✓
 * - fetch(`${getApiBase()}/api/login`) → http://localhost:5000/api/login ✓
 */
export function getApiBase(): string {
  return API_BASE_URL; // NO /api suffix since server routes already have it
}

/**
 * Get the raw base URL without /api prefix
 * Use this for static assets, uploads, etc.
 */
export function getBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Build upload/asset URL
 * @param path - Path to asset (e.g., '/uploads/avatars/file.jpg')
 */
export function buildAssetUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Normalize path and combine with base URL
  const normalizedPath = normalizePath(path);
  return `${API_BASE_URL}${normalizedPath}`;
}

// Export for debugging purposes
export const API_CONFIG = {
  rawUrl: rawBaseUrl,
  baseUrl: API_BASE_URL,
  apiBase: getApiBase(),
  environment: import.meta.env.MODE || 'development',
  note: 'Server routes already include /api prefix, so getApiBase() returns base URL only',
} as const;

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', API_CONFIG);
  console.log('📝 Example calls:');
  console.log('  - Login: fetch(`${getApiBase()}/api/login`)');
  console.log('  - Users: client.get("/api/users") where client.baseURL = getApiBase()');
}
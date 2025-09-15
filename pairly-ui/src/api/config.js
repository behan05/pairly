// API endpoint configuration for client-side requests.
// Uses environment variable for base URL, falls back to production server if not set.

const BASE_ENDPOINT =
  import.meta.env.VITE_API_URL || 'https://pairly-server.onrender.com/api';

// Authentication API endpoint
export const AUTH_API = `${BASE_ENDPOINT}/auth`;

// Social auth APIs
export const GOOGLE_API = 'https://pairly-server.onrender.com/api/auth/google';
export const GITHUB_API = 'https://pairly-server.onrender.com/api/auth/github';

// User settings API endpoint
export const SETTINGS_API = `${BASE_ENDPOINT}/settings`;

// User profile API endpoint
export const PROFILE_API = `${BASE_ENDPOINT}/profile`;

// Random chat API endpoint
export const RANDOM_API = `${BASE_ENDPOINT}/random-chat`;

// Random chat API endpoint
export const BLOCK_API = `${BASE_ENDPOINT}/random-block`;

// Random chat API endpoint
export const REPORT_API = `${BASE_ENDPOINT}/random-report`;

// Friend request API endpoint
export const FRIEND_REQUEST_API = `${BASE_ENDPOINT}/friend-request`;

// Friend request API endpoint
export const PRIVATE_CHAT_API = `${BASE_ENDPOINT}/private-chat`;

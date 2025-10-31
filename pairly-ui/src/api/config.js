// Detect current environment mode
console.log('Running mode:', import.meta.env.MODE);

// API endpoint configuration for client-side requests.
// Uses environment variable for base URL, falls back to production server if not set.

const BASE_ENDPOINT =
  import.meta.env.VITE_API_URL || 'https://pairly-server.onrender.com/api';

// Authentication API endpoint
export const AUTH_API = `${BASE_ENDPOINT}/auth`;

// Social auth APIs
export const GOOGLE_API = `${BASE_ENDPOINT}/auth/google`;
export const GITHUB_API = `${BASE_ENDPOINT}/auth/github`;

// User settings API endpoint
export const SETTINGS_API = `${BASE_ENDPOINT}/settings`;

// User profile API endpoint
export const PROFILE_API = `${BASE_ENDPOINT}/profile`;
 
// Random chat API endpoint
export const BLOCKED_USERS_API = `${BASE_ENDPOINT}/blocked`;

// Feedback API endpoint
export const USER_FEEDBACK_API = `${BASE_ENDPOINT}/feedback`;

// ---------------------- RANDOM CHAT API -------------------------

// Random chat API endpoint
export const RANDOM_API = `${BASE_ENDPOINT}/random-chat`;

// Friend request API endpoint
export const FRIEND_REQUEST_API = `${BASE_ENDPOINT}/friend-request`;

// Random chat API endpoint
export const RANDOM_BLOCK_API = `${BASE_ENDPOINT}/random-block`;

// Random chat API endpoint
export const RANDOM_REPORT_API = `${BASE_ENDPOINT}/random-report`;

// ---------------------- PRIVATE CHAT API -------------------------

// Friend request API endpoint
export const PRIVATE_CHAT_API = `${BASE_ENDPOINT}/private-chat`;

// private chat API endpoint
export const PRIVATE_REPORT_API = `${BASE_ENDPOINT}/private-report`;

// Private chat API endpoint
export const PRIVATE_BLOCK_API = `${BASE_ENDPOINT}/private-block`;

export const PROPOSAL_REQUEST_API = `${BASE_ENDPOINT}/proposal-request`

// Payment
export const RAZORPAY_PAYMENT_API = `${BASE_ENDPOINT}/payments`
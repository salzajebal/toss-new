import { setAuthTokenGetter } from "@workspace/api-client-react";

export const ADMIN_TOKEN_KEY = "admin-token";

export function getAuthToken() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const session = JSON.parse(atob(payload));
    if (session.role === "admin" && typeof session.expiresAt === "number" && session.expiresAt > Date.now()) {
      return token;
    }
  } catch { /* Expired and legacy sessions require a fresh login. */ }
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  return null;
}

export function setAuthToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Setup API client auth
setAuthTokenGetter(() => {
  return getAuthToken();
});

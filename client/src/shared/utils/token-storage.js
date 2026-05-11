const ACCESS_TOKEN_KEY = "bookverse_access";

export function saveAccessToken(token) {
  if (!token) return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

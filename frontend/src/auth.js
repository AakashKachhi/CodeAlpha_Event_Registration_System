export const getToken = () => localStorage.getItem("event_token");

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("event_user") || "null");
  } catch {
    return null;
  }
};

export const saveAuth = (token, user = null) => {
  localStorage.setItem("event_token", token);

  if (user) {
    localStorage.setItem("event_user", JSON.stringify(user));
  }
};

export const clearAuth = () => {
  localStorage.removeItem("event_token");
  localStorage.removeItem("event_user");
};

export const isLoggedIn = () => Boolean(getToken());
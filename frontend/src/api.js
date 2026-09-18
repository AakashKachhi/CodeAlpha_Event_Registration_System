import axios from "axios";

const api = axios.create({
  // During development Vite proxies this path to the Express server. Set
  // VITE_API_URL when the API is deployed on a separate domain.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("event_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

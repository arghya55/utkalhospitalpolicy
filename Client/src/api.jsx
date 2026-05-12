import axios from "axios";

export const api = axios.create({
   baseURL: "https://utkalpolicybackend.onrender.com/api",
});

// 🔥 AUTO TOKEN ATTACH
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  console.log('TOKEN', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ec2-3-66-218-103.eu-central-1.compute.amazonaws.com/api";

const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      console.log(error);
    }
    return Promise.reject(error);
  }
);

export default API;

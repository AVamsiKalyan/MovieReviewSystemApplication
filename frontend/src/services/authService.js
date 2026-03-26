import axios from "axios";

const DEFAULT_API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://moviereviewsystemapplication-2.onrender.com";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
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
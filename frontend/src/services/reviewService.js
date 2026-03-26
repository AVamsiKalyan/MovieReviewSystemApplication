import axios from "axios";

const DEFAULT_API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://moviereviewsystemapplication-2.onrender.com";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/reviews`;

export const getReviewsByMovie = (movieId) => {
  return axios.get(`${API_URL}/movie/${movieId}`);
};

export const getReviewsByUser = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

export const addReview = (reviewData, token) => {
  return axios.post(API_URL, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateReview = (id, reviewData, token) => {
  return axios.put(`${API_URL}/${id}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteReviewService = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

import axios from "axios";

const API_URL = "http://localhost:8080/reviews";

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

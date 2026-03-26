import axios from "axios";

const DEFAULT_API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://moviereviewsystemapplication-2.onrender.com";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/movies`;

export const getAllMovies = () => {
  return axios.get(API_URL);
};

export const getMovieById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateMovie = (id, movieData, token) => {
  return axios.put(`${API_BASE_URL}/admin/movies/${id}`, movieData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMovie = (id, token) => {
  return axios.delete(`${API_BASE_URL}/admin/movies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createMovie = (movieData, token) => {
  return axios.post(`${API_BASE_URL}/admin/movies`, movieData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchFromImdb = (query, token) => {
  return axios.post(
    `${API_BASE_URL}/admin/movies/fetch-imdb`,
    { query },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
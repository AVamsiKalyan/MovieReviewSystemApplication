import axios from "axios";

const API_URL = "http://localhost:8080/movies";

export const getAllMovies = () => {
  return axios.get(API_URL);
};

export const getMovieById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateMovie = (id, movieData, token) => {
  return axios.put(`http://localhost:8080/admin/movies/${id}`, movieData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMovie = (id, token) => {
  return axios.delete(`http://localhost:8080/admin/movies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createMovie = (movieData, token) => {
  return axios.post(`http://localhost:8080/admin/movies`, movieData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchFromImdb = (query, token) => {
  return axios.post(
    `http://localhost:8080/admin/movies/fetch-imdb`,
    { query },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
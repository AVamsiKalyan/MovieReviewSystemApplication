import axios from "axios";

const API_URL = "http://localhost:8080/movies";

export const getAllMovies = () => {
  return axios.get(API_URL);
};

export const getMovieById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};
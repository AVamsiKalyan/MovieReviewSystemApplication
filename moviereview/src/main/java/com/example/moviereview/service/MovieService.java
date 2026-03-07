package com.example.moviereview.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.moviereview.model.Movie;
import com.example.moviereview.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }

    public Movie updateMovie(Long id, Movie movie) {
        Movie existingMovie = movieRepository.findById(id).orElseThrow();
        existingMovie.setTitle(movie.getTitle());
        existingMovie.setGenre(movie.getGenre());
        existingMovie.setDescription(movie.getDescription());
        existingMovie.setReleaseYear(movie.getReleaseYear());
        existingMovie.setAverageRating(movie.getAverageRating());
        existingMovie.setPosterUrl(movie.getPosterUrl());
        return movieRepository.save(existingMovie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}
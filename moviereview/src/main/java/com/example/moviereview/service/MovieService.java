package com.example.moviereview.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.moviereview.model.Movie;
import com.example.moviereview.repository.MovieRepository;
import com.example.moviereview.repository.ReviewRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public MovieService(MovieRepository movieRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        // ensure averageRating reflects current reviews
        for (Movie m : movies) {
            Double avg = reviewRepository.findAverageRatingByMovieId(m.getId());
            m.setAverageRating(avg != null ? avg : 0.0);
        }
        return movies;
    }

    public Movie getMovieById(Long id) {
        Movie movie = movieRepository.findById(id).orElse(null);
        if (movie != null) {
            Double avg = reviewRepository.findAverageRatingByMovieId(id);
            movie.setAverageRating(avg != null ? avg : 0.0);
        }
        return movie;
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
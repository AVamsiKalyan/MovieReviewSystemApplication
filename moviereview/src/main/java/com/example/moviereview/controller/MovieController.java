package com.example.moviereview.controller;

import com.example.moviereview.model.Movie;
import com.example.moviereview.service.MovieService;
import com.example.moviereview.service.ImdbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/movies")
public class MovieController {

    private final MovieService movieService;
    private final ImdbService imdbService;

    public MovieController(MovieService movieService, ImdbService imdbService) {
        this.movieService = movieService;
        this.imdbService = imdbService;
    }

    // Add movie
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }
    
    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return movieService.updateMovie(id, movie);
    }
    
    // Delete movie
    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
    }

    // Fetch movie data from IMDb
    @PostMapping("/fetch-imdb")
    public ResponseEntity<?> fetchFromImdb(@RequestBody Map<String, String> request) {
        String searchQuery = request.get("query");
        if (searchQuery == null || searchQuery.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Query parameter required"));
        }
        try {
            return ResponseEntity.ok(imdbService.fetchMovieData(searchQuery));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", ex.getMessage()));
        }
    }
}



@RestController
@RequestMapping("/movies")
class PublicMovieController {

    private final MovieService movieService;

    public PublicMovieController(MovieService movieService) {
        this.movieService = movieService;
    }
    
    // Get movie by id
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }
    
    // Get all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }
}
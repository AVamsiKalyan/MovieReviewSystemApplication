package com.example.moviereview.repository;

import com.example.moviereview.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Get all reviews for a specific movie
    List<Review> findByMovieId(Long movieId);

    List<Review> findByUserId(Long userId);
    
    // Calculate average rating for a movie
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.id = :movieId")
    Double findAverageRatingByMovieId(Long movieId);
}
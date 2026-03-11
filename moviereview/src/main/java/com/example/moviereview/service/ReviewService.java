package com.example.moviereview.service;

import com.example.moviereview.model.Movie;
import com.example.moviereview.model.Review;
import com.example.moviereview.repository.MovieRepository;
import com.example.moviereview.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;

    public ReviewService(ReviewRepository reviewRepository, MovieRepository movieRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
    }

    // Add Review
    public Review addReview(Review review) {

        Review savedReview = reviewRepository.save(review);

        Long movieId = review.getMovie().getId();

        // Get all reviews for this movie
        List<Review> reviews = reviewRepository.findByMovieId(movieId);

        // Calculate average rating
        double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        // Update movie average rating
        Movie movie = movieRepository.findById(movieId).orElseThrow();
        movie.setAverageRating(avgRating);

        movieRepository.save(movie);

        return savedReview;
    }

    // Get reviews by movie
    public List<Review> getReviewsByMovie(Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    // Get reviews by user
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Update existing review
    public Review updateReview(Long reviewId, Review updated) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        existing.setRating(updated.getRating());
        existing.setComment(updated.getComment());
        Review saved = reviewRepository.save(existing);

        // recalc movie average
        Long movieId = existing.getMovie().getId();
        List<Review> reviews = reviewRepository.findByMovieId(movieId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        Movie movie = movieRepository.findById(movieId).orElseThrow();
        movie.setAverageRating(avg);
        movieRepository.save(movie);

        return saved;
    }

    // Delete review
    public void deleteReview(Long reviewId) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        Long movieId = existing.getMovie().getId();
        reviewRepository.deleteById(reviewId);

        // recalc average
        List<Review> reviews = reviewRepository.findByMovieId(movieId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        Movie movie = movieRepository.findById(movieId).orElseThrow();
        movie.setAverageRating(avg);
        movieRepository.save(movie);
    }

}
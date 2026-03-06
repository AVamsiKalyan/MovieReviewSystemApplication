package com.example.moviereview.controller;

import com.example.moviereview.model.Review;
import com.example.moviereview.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Add review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    // Get reviews for a movie
    @GetMapping("/movie/{movieId}")
    public List<Review> getReviewsByMovie(@PathVariable Long movieId) {
        return reviewService.getReviewsByMovie(movieId);
    }

    // Get reviews by user
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }
}
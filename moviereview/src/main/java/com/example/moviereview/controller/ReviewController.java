package com.example.moviereview.controller;

import com.example.moviereview.model.Review;
import com.example.moviereview.service.ReviewService;
import com.example.moviereview.repository.UserRepository;
import com.example.moviereview.repository.ReviewRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository, ReviewRepository reviewRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
    }

    // Add review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        review.setUser(user);
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

    // Update review
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        var existing = reviewRepository.findById(id).orElseThrow();
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not your review");
        }
        review.setUser(user);
        return reviewService.updateReview(id, review);
    }

    // Delete review
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        var existing = reviewRepository.findById(id).orElseThrow();
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not your review");
        }
        reviewService.deleteReview(id);
    }
}
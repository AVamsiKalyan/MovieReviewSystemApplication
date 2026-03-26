package com.example.moviereview.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ImdbService {

    @Value("${omdb.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ImdbMovieData fetchMovieData(String imdbIdOrTitle) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("OMDB_API_KEY not configured. Get one from http://www.omdbapi.com/");
        }

        try {
            String url = String.format("http://www.omdbapi.com/?apikey=%s&t=%s&type=movie", 
                apiKey, imdbIdOrTitle.replace(" ", "+"));

            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);

            if (root.get("Response").asText().equals("False")) {
                throw new RuntimeException("Movie not found: " + root.get("Error").asText());
            }

            return new ImdbMovieData(
                root.get("Title").asText(),
                root.get("Genre").asText().split(",")[0].trim(), // First genre
                Integer.parseInt(root.get("Year").asText()),
                root.get("Plot").asText(),
                root.get("Poster").asText(),
                root.get("Director").asText(),
                root.get("Runtime").asText().replace(" min", ""),
                root.get("imdbID").asText()
            );
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new RuntimeException("Invalid OMDb API key. Please verify OMDB_API_KEY in backend .env");
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch from OMDB: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error parsing OMDB response: " + e.getMessage());
        }
    }

    public static class ImdbMovieData {
        public String title;
        public String genre;
        public Integer releaseYear;
        public String description;
        public String posterUrl;
        public String director;
        public String runtime;
        public String imdbId;

        public ImdbMovieData(String title, String genre, Integer releaseYear, String description, 
                             String posterUrl, String director, String runtime, String imdbId) {
            this.title = title;
            this.genre = genre;
            this.releaseYear = releaseYear;
            this.description = description;
            this.posterUrl = posterUrl;
            this.director = director;
            this.runtime = runtime;
            this.imdbId = imdbId;
        }
    }
}

import React from 'react'
import '../styles/MovieCard.css'
function MovieCard({ movie }) {
  return (
    <>
        <div className="card">
        <p className="heading">
            {movie.title}
        </p>
        <p>
            {movie.genre}
        </p>
        <p>{movie.averageRating ? `Average Rating: ${movie.averageRating.toFixed(1)}/5` : 'No ratings yet'}
        </p>
        </div>
    </>
  )
}

export default MovieCard

import React from 'react'
import '../styles/MovieCard.css'
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <>

    <Link to={`/movies/${movie.id}`} >

    <div
      className="card block hover:shadow-lg transition"
      style={{
        backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <p className="heading">{movie.title}</p>
      <p>{movie.genre}</p>
      <p>
        {movie.averageRating
          ? `Average Rating: ${movie.averageRating.toFixed(1)}/5`
          : 'No ratings yet'}
      </p>
    </div>

    </Link>
    
    </>
  );
}

export default MovieCard

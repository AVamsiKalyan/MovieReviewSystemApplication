import React from 'react'
import MovieCard from '../components/MovieCard'
import ReviewCard from '../components/ReviewCard'
import Navbar from '../components/Navbar'
import { getAllMovies } from '../services/movieService'
import { useEffect, useState } from 'react'

function HomePage() {

    const [movies,setMovies] = useState([]);

      useEffect(() => {
    getAllMovies()
      .then((response) => {
        console.log("Movies fetched successfully:", response.data);
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
     <>
      

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          All Movies
        </h1>

        {movies.length === 0 ? (
          <p className="text-gray-500">No movies found.</p>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

          </div>

        )}

      </div>
      </>
  )
}

export default HomePage

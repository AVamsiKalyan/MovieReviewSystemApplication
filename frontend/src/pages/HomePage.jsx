import React from 'react'
import MovieCard from '../components/MovieCard'
import ReviewCard from '../components/ReviewCard'
import Navbar from '../components/Navbar'
import { getAllMovies } from '../services/movieService'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

function HomePage() {

    const [movies,setMovies] = useState([]);
    const [sortOrder, setSortOrder] = useState('none');
    const [selectedGenre, setSelectedGenre] = useState('none');
    const location = useLocation();

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

    // filter movies based on selected genre first
    let filtered = movies;
    if (selectedGenre !== 'none') {
      filtered = filtered.filter(m => m.genre === selectedGenre);
    }

    // then apply search query filter
    const searchQuery = new URLSearchParams(location.search).get('q') || '';
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // build list of unique genres from all movies for selector
    const genres = Array.from(new Set(movies.map(m => m.genre).filter(Boolean)));

    // apply sorting by average rating
    const displayed = [...filtered];
    if (sortOrder === 'desc') {
      displayed.sort((a,b) => (b.averageRating||0) - (a.averageRating||0));
    } else if (sortOrder === 'asc') {
      displayed.sort((a,b) => (a.averageRating||0) - (b.averageRating||0));
    }

  return (
     <>
      

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6 text-white">
          All Movies
        </h1>

        {/* sort selectors */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="text-white mr-2">Sort by rating:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="px-2 py-1 rounded bg-gray-700 text-white"
            >
              <option value="none">None</option>
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div>
            <label className="text-white mr-2">Group by genre:</label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="px-2 py-1 rounded bg-gray-700 text-white"
            >
              <option value="none">None</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {displayed.length === 0 ? (
          <p className="text-white">No movies found.</p>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {displayed.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

          </div>

        )}

      </div>
      </>
  )
}

export default HomePage

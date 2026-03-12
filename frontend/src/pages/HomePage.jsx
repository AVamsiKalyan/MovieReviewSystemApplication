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
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-1">
            All Movies
          </h1>
          <p className="text-gray-400 text-sm">{displayed.length} title{displayed.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* filter / sort bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
          <span className="text-gray-400 text-sm font-medium mr-1">Filter &amp; Sort:</span>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Rating</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="none">Default</option>
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Genre</label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="none">All</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          {(sortOrder !== 'none' || selectedGenre !== 'none') && (
            <button
              onClick={() => { setSortOrder('none'); setSelectedGenre('none'); }}
              className="ml-auto text-xs text-gray-400 hover:text-white underline transition"
            >
              Clear filters
            </button>
          )}
        </div>

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🎬</span>
            <p className="text-white text-xl font-semibold">No movies found</p>
            <p className="text-gray-400 mt-1 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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

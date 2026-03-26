import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie, fetchFromImdb } from '../services/movieService';
import { getToken } from '../services/storageService';

function AddMoviePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    posterUrl: '',
  });

  const [imdbSearch, setImdbSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImdbSearch = async (e) => {
    e.preventDefault();
    if (!imdbSearch.trim()) {
      setError('Please enter a movie title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetchFromImdb(imdbSearch, getToken());
      const data = response.data;
      
      setForm({
        title: data.title,
        description: data.description,
        releaseYear: data.releaseYear,
        genre: data.genre,
        posterUrl: data.posterUrl,
      });
      
      setSuccess('✓ Movie data loaded from IMDb!');
      setImdbSearch('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch from IMDb. Try another title.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.genre.trim()) {
      setError('Genre is required');
      return;
    }
    if (!form.releaseYear || form.releaseYear < 1800 || form.releaseYear > new Date().getFullYear() + 5) {
      setError('Please enter a valid year');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createMovie(form, getToken());
      setSuccess('✓ Movie added successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h1 className="text-3xl font-extrabold mb-2 text-white">🎬 Add New Movie</h1>
            <p className="text-gray-400 text-sm mb-8">Search IMDb or fill in details manually.</p>

            {/* IMDb Search Section */}
            <div className="mb-8 pb-8 border-b border-gray-800">
              <label className="block text-sm font-medium mb-3 text-gray-300">Auto-fill from IMDb</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imdbSearch}
                  onChange={(e) => setImdbSearch(e.target.value)}
                  placeholder="Enter movie title..."
                  className="flex-1 px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  onKeyPress={(e) => e.key === 'Enter' && handleImdbSearch(e)}
                />
                <button
                  onClick={handleImdbSearch}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition"
                >
                  {loading ? '⏳' : '🔍'}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">💡 Tip: Enter the full movie title for better results</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="e.g. The Dark Knight"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  rows="4"
                  placeholder="Brief description of the movie..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Release Year *</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={form.releaseYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    placeholder="2024"
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Genre *</label>
                  <input
                    type="text"
                    name="genre"
                    value={form.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    placeholder="Action, Drama..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Poster URL <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="posterUrl"
                  value={form.posterUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  placeholder="https://..."
                />
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-200 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading ? '⏳ Adding...' : '✓ Add Movie'}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">📸 Preview</h3>
            {form.posterUrl ? (
              <div className="mb-4">
                <img
                  src={form.posterUrl}
                  alt={form.title}
                  className="w-full h-auto rounded-lg object-cover mb-4"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300x400?text=No+Image')}
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-gray-500">
                No poster
              </div>
            )}
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Title</p>
                <p className="text-white font-semibold">{form.title || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Genre</p>
                <p className="text-white">{form.genre || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="text-white">{form.releaseYear || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMoviePage;
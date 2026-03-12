import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../services/movieService';
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMovie(form, getToken());
      alert('Movie added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to add movie');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-2 text-white">🎬 Add New Movie</h1>
        <p className="text-gray-400 text-sm mb-8">Fill in the details below to add a movie to the collection.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
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
              <label className="block text-sm font-medium mb-2 text-gray-300">Release Year</label>
              <input
                type="number"
                name="releaseYear"
                value={form.releaseYear}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="2024"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-300">Poster URL <span className="text-gray-500 font-normal">(optional)</span></label>
            <input
              type="url"
              name="posterUrl"
              value={form.posterUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition mt-2"
          >
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMoviePage;
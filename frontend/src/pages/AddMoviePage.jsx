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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Add New Movie</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Release Year</label>
          <input
            type="number"
            name="releaseYear"
            value={form.releaseYear}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Poster URL</label>
          <input
            type="url"
            name="posterUrl"
            value={form.posterUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}

export default AddMoviePage;
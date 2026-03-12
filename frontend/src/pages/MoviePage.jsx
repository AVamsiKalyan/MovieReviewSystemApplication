import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, updateMovie, deleteMovie } from '../services/movieService';
import { getReviewsByMovie, addReview } from '../services/reviewService';
import { getToken, getRole } from '../services/storageService';
import ReviewCard from '../components/ReviewCard';

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  const role = getRole();
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    releaseYear: '',
    genre: '',
    posterUrl: '',
  });

  const loadMovie = () => {
    getMovieById(id)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error('Unable to load movie', err));
  };

  const loadReviews = () => {
    getReviewsByMovie(id)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Unable to load reviews', err));
  };

  useEffect(() => {
    loadMovie();
    loadReviews();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert('Please log in to add a review');
      return;
    }
    const reviewPayload = {
      rating: parseInt(form.rating, 10),
      comment: form.comment,
      movie: { id: parseInt(id, 10) },
    };
    try {
      await addReview(reviewPayload, token);
      setForm({ rating: 5, comment: '' });
      // refresh both the review list and movie info (average rating may have changed)
      await loadReviews();
      loadMovie();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  const startEditing = () => {
    setEditForm({
      title: movie.title || '',
      description: movie.description || '',
      releaseYear: movie.releaseYear || '',
      genre: movie.genre || '',
      posterUrl: movie.posterUrl || '',
    });
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      alert('log in');
      return;
    }
    try {
      await updateMovie(id, {
        ...editForm,
        releaseYear: parseInt(editForm.releaseYear, 10),
      }, token);
      setIsEditing(false);
      loadMovie();
    } catch (err) {
      console.error(err);
      alert('Failed to update movie');
    }
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) return;
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id, token);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete movie');
    }
  };

  if (!movie) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Movie details */}
      <div className="flex flex-col md:flex-row gap-8">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full md:w-64 rounded-2xl shadow-2xl object-cover self-start"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-4xl font-extrabold text-white leading-tight">{movie.title}</h1>
            {isAdmin && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={startEditing}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genre && (
              <span className="bg-indigo-900 text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">{movie.genre}</span>
            )}
            {movie.releaseYear && (
              <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full font-medium">{movie.releaseYear}</span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-yellow-400 text-2xl font-bold">
              {movie.averageRating ? `★ ${movie.averageRating.toFixed(1)}` : '★ —'}
            </span>
            <span className="text-gray-400 text-sm ml-1">{movie.averageRating ? '/5' : 'No ratings yet'}</span>
          </div>
          <p className="mt-4 text-gray-300 leading-relaxed text-sm">{movie.description}</p>
        </div>
      </div>

      {/* Editing form (admin) */}
      {isAdmin && isEditing && (
        <div className="border border-gray-700 p-6 rounded-2xl bg-gray-900 mb-6">
          <h3 className="text-xl font-bold mb-4 text-white">✏️ Edit Movie</h3>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-white">Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Genre</label>
              <input
                name="genre"
                value={editForm.genre}
                onChange={handleEditChange}
                className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Release Year</label>
              <input
                name="releaseYear"
                type="number"
                value={editForm.releaseYear}
                onChange={handleEditChange}
                className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Poster URL</label>
              <input
                name="posterUrl"
                value={editForm.posterUrl}
                onChange={handleEditChange}
                className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-2xl font-bold mb-5 text-white border-b border-gray-800 pb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 italic">Be the first to review!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        )}
      </div>

      {/* Add review form */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-5 text-white">✍️ Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setForm({...form, rating: n})}
                  className={`text-2xl transition ${ n <= form.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={form.rating} />
          </div>
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Comment</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full border border-gray-700 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              rows="4"
              placeholder="Share your thoughts about this movie..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default MoviePage;

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

  if (!movie) return <div className="text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Movie details */}
      <div className="flex flex-col md:flex-row space-x-0 md:space-x-6">
        {movie.posterUrl && (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full md:w-1/3 rounded-lg shadow-md mb-4 md:mb-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 text-white">{movie.title}</h1>
          {isAdmin && !isEditing && (
            <div className="space-x-2 mb-2">
              <button
                onClick={startEditing}
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
          <p className="text-gray-300 mb-1">{movie.genre}</p>
          <p className="text-gray-300 mb-1">
            Release Year: {movie.releaseYear}
          </p>
          <p className="text-yellow-500 text-xl mb-4">
            {movie.averageRating
              ? `Rating: ${movie.averageRating.toFixed(1)}/5`
              : 'No ratings yet'}
          </p>
          <p className="text-gray-200">{movie.description}</p>
        </div>
      </div>

      {/* Editing form (admin) */}
      {isAdmin && isEditing && (
        <div className="border border-gray-600 p-4 rounded bg-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Edit Movie</h3>
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
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-300">Be the first to review!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        )}
      </div>

      {/* Add review form */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-white">Add a review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-white">Rating</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-white">Comment</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg bg-gray-700 text-white"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default MoviePage;

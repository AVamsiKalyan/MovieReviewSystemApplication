import React, { useState, useEffect } from 'react';
import { getReviewsByUser, updateReview, deleteReviewService } from '../services/reviewService';
import { getUserId, getToken } from '../services/storageService';
import ReviewCard from '../components/ReviewCard';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const userId = getUserId();

  const loadReviews = () => {
    if (!userId) return;
    getReviewsByUser(userId)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('failed to fetch user reviews', err));
  };

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const startEdit = (rev) => {
    setEditingId(rev.id);
    setEditForm({ rating: rev.rating, comment: rev.comment });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      await updateReview(editingId, { rating: parseInt(editForm.rating, 10), comment: editForm.comment }, token);
      setEditingId(null);
      loadReviews();
    } catch (err) {
      console.error(err);
      alert('Failed to update review');
    }
  };

  const removeReview = async (id) => {
    const token = getToken();
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReviewService(id, token);
      loadReviews();
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  if (!userId) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <span className="text-5xl">🔒</span>
        <p className="text-white text-xl font-semibold mt-4">Please log in to see your reviews.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-8 text-white">My Reviews</h1>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">✍️</span>
          <p className="text-white text-xl font-semibold">No reviews yet</p>
          <p className="text-gray-400 mt-1 text-sm">Browse movies and share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((rev) => (
            <div key={rev.id} className="border border-gray-700 rounded-2xl bg-gray-900 overflow-hidden">
              {editingId === rev.id ? (
                <form onSubmit={submitEdit} className="p-6 space-y-4">
                  <h3 className="text-white font-semibold text-lg">✏️ Edit Review</h3>
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm font-medium">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setEditForm({...editForm, rating: n})}
                          className={`text-2xl transition ${ n <= editForm.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="rating" value={editForm.rating} />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300 text-sm font-medium">Comment</label>
                    <textarea
                      name="comment"
                      value={editForm.comment}
                      onChange={handleEditChange}
                      className="w-full border border-gray-700 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-5">
                  <ReviewCard review={rev} />
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => startEdit(rev)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => removeReview(rev.id)}
                      className="bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;

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

  if (!userId) return <div className="max-w-4xl mx-auto p-6 text-center text-white">Please log in to see your reviews.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">My Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-gray-300">You haven't written any reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="border border-gray-600 p-4 rounded-lg bg-gray-800 text-white">
              {editingId === rev.id ? (
                <form onSubmit={submitEdit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-white">Rating</label>
                    <select
                      name="rating"
                      value={editForm.rating}
                      onChange={handleEditChange}
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
                      value={editForm.comment}
                      onChange={handleEditChange}
                      className="w-full border border-gray-600 px-3 py-2 rounded-lg bg-gray-700 text-white"
                      rows="3"
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
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <ReviewCard review={rev} />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => startEdit(rev)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeReview(rev.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;

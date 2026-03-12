import React from 'react'

function ReviewCard({ review }) {
  const stars = '★★★★★'.slice(0, review.rating) + '☆☆☆☆☆'.slice(review.rating);

  return (
    <div className="border border-gray-700 rounded-2xl bg-gray-900 p-5 space-y-3 hover:border-indigo-700 transition">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold rounded-full shrink-0">
          {review.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{review.user?.name || 'Anonymous'}</div>
          <div className="text-gray-500 text-xs">
            {new Date(review.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
      <div className="text-yellow-400 text-lg tracking-wide">{stars}</div>
      <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}

export default ReviewCard


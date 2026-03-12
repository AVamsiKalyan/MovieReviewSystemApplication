import React from 'react'

function ReviewCard({ review }) {
  const stars = '★★★★★'.slice(0, review.rating) + '☆☆☆☆☆'.slice(review.rating);

  return (
    <div className="max-w-sm border border-gray-600 rounded-lg shadow-lg bg-gray-800 p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 flex items-center justify-center bg-red-500 text-white text-lg font-semibold rounded-full">
          {review.user?.name?.[0] || 'U'}
        </div>
        <div>
          <div className="text-white font-medium">{review.user?.name || 'Anonymous'}</div>
          <div className="text-gray-400 text-sm">
            {new Date(review.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex text-yellow-500 text-xl">{stars}</div>
      <p className="text-gray-200">{review.comment}</p>
    </div>
  );
}

export default ReviewCard


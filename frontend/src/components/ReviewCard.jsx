import React from 'react'

function ReviewCard({ review }) {
  const stars = '★★★★★'.slice(0, review.rating) + '☆☆☆☆☆'.slice(review.rating);

  return (
    <div className="max-w-sm border border-gray-300 rounded-lg shadow-lg bg-white p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 flex items-center justify-center bg-red-500 text-white text-lg font-semibold rounded-full">
          {review.user?.name?.[0] || 'U'}
        </div>
        <div>
          <div className="text-gray-900 font-medium">{review.user?.name || 'Anonymous'}</div>
          <div className="text-gray-600 text-sm">
            {new Date(review.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex text-yellow-500 text-xl">{stars}</div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}

export default ReviewCard


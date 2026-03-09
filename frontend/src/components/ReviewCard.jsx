import React from 'react'

function ReviewCard() {
  return (
    <>
<div className="max-w-sm border border-gray-300 rounded-lg shadow-lg bg-white p-6 space-y-4">
  <div className="flex items-center space-x-4">
    <div className="h-12 w-12 flex items-center justify-center bg-red-500 text-white text-lg font-semibold rounded-full">
      DJ
    </div>
    <div>
      <div className="text-gray-900 font-medium">Donald Jackman</div>
      <div className="text-gray-600 text-sm">Content Creator</div>
    </div>
  </div>
  <div className="flex text-red-500 text-xl">★★★★★</div>
  <p className="text-gray-700">
    I've been using Imagify for nearly two years, primarily for Instagram, and
    it has been incredibly user-friendly, making my work much easier.
  </p>
  <div className="text-red-500 font-medium cursor-pointer hover:underline">
    Read more
  </div>
</div>

    </>
  )
}

export default ReviewCard

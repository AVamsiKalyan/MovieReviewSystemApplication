import { Link } from "react-router-dom";
import React from 'react'
function Navbar() {
  return (
    <>
    <nav className="bg-gray-900 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          MovieReview
        </Link>

        {/* Search */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full px-4 py-2 rounded-lg text-black"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">

          <Link
            to="/"
            className="hover:text-gray-300 transition"
          >
            Home
          </Link>

          <Link
            to="/reviews"
            className="hover:text-gray-300 transition"
          >
            My Reviews
          </Link>

          <Link
            to="/login"
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            Register
          </Link>

        </div>

      </div>

    </nav>
  </>
  );
}

export default Navbar
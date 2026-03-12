import { Link, useNavigate, useLocation } from "react-router-dom";
import React from 'react'
import { getToken, getRole, logout } from "../services/storageService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // trigger re-render on route changes

  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get('q') || '');
  }, [location]);

  const isLoggedIn = !!getToken();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 text-white shadow-xl">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent shrink-0">
          🎬 FlickPicks
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={e => { e.preventDefault(); navigate(`/?q=${encodeURIComponent(search)}`); }}>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">

          <Link
            to="/"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Home
          </Link>

          <Link
            to="/reviews"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            My Reviews
          </Link>

          {isLoggedIn && (role === 'ADMIN' || role === 'ROLE_ADMIN') && (
            <Link
              to="/add-movie"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium transition"
            >
              + Add Movie
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-medium transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-indigo-500 text-indigo-300 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  </>
 );
}

export default Navbar
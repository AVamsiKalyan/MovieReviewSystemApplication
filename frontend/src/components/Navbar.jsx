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
    <nav className="bg-gray-900 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          FlickPicks
        </Link>

        {/* Search */}
        <div className="flex-1 mx-8">
          <form onSubmit={e => { e.preventDefault(); navigate(`/?q=${encodeURIComponent(search)}`); }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-2 rounded-lg text-black bg-white"
            />
          </form>
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

          {isLoggedIn && (role === 'ADMIN' || role === 'ROLE_ADMIN') && (
            <Link
              to="/add-movie"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Add Movie
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
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
            </>
          )}

        </div>

      </div>

    </nav>
  </>
 );
}

export default Navbar
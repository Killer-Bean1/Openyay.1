import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          OpenYay
        </Link>

        <ul className="hidden md:flex gap-6">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:underline">
              Products
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/favorites" className="hover:underline">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:underline">
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden text-white font-bold text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-purple-700 px-4 py-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="block hover:underline">
                Products
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/favorites" className="block hover:underline">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="block hover:underline">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="block hover:underline">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block hover:underline cursor-pointer w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="block hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block hover:underline">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

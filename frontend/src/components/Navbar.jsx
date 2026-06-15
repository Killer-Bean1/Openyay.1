import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isLoggedIn = !!user;
  const isBusiness = user?.role === "business";

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
              {isBusiness && (
                <li>
                  <Link to="/business-dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
              )}
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
                {isBusiness && (
                  <li>
                    <Link to="/business-dashboard" className="block hover:underline">
                      Dashboard
                    </Link>
                  </li>
                )}
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

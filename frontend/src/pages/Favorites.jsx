import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { favoriteAPI, productAPI } from "../services/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const response = await favoriteAPI.getAll();
      setFavorites(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load favorites");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(favoriteId) {
    try {
      await favoriteAPI.delete(favoriteId);
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (err) {
      alert("Failed to remove favorite");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">No favorites yet</p>
            <Link
              to="/products"
              className="text-purple-600 hover:underline font-semibold"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">Product ID: {favorite.product_id}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${favorite.product_id}`}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded text-center font-semibold hover:bg-purple-700 transition-colors"
                    >
                      View Product
                    </Link>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

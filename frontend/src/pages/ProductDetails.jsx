import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI, favoriteAPI, sellerAPI } from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn] = useState(!!localStorage.getItem("access_token"));

  useEffect(() => {
    fetchProduct();
    if (isLoggedIn) {
      checkIfFavorited();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data);
      setError(null);
      if (response.data.seller_id) {
        fetchSeller(response.data.seller_id);
      }
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSeller(sellerId) {
    try {
      const response = await sellerAPI.getContact(sellerId);
      setSeller(response.data);
    } catch (err) {
      console.error("Failed to load seller info:", err);
    }
  }

  async function checkIfFavorited() {
    try {
      const response = await favoriteAPI.getAll();
      const favorited = response.data.some((fav) => fav.product_id === parseInt(id));
      setIsFavorited(favorited);
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleFavorite() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorited) {
        const favorites = await favoriteAPI.getAll();
        const favorite = favorites.data.find((fav) => fav.product_id === product.id);
        if (favorite) {
          await favoriteAPI.delete(favorite.id);
        }
      } else {
        await favoriteAPI.add(product.id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/products")}
            className="text-purple-600 hover:underline font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate("/products")}
          className="text-purple-600 hover:underline mb-6 font-semibold"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full rounded-lg object-cover h-96"
              />
            )}
            {!product.image_url && (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            {product.category && (
              <p className="text-gray-600 mb-4 text-lg">Category: {product.category}</p>
            )}

            <div className="border-y-2 border-gray-200 py-4 mb-6">
              <p className="text-5xl font-bold text-purple-600">${product.price}</p>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-lg">
                <span className="font-semibold">Inventory:</span> {product.inventory} units available
              </p>
            </div>

            <div className="flex gap-4 flex-wrap mb-6">
              <button
                onClick={toggleFavorite}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  isFavorited
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {isFavorited ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
              </button>
            </div>

            {/* Seller Contact Section */}
            {seller && (
              <div className="border-t-2 border-gray-200 pt-6">
                <h2 className="text-2xl font-semibold mb-4">Contact Seller</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-lg">
                    <span className="font-semibold">Seller:</span> {seller.full_name}
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    <a
                      href={`mailto:${seller.email}?subject=Inquiry about ${product.title}`}
                      className="px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      📧 Email Seller
                    </a>

                    {seller.phone_number && (
                      <a
                        href={`tel:${seller.phone_number}`}
                        className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        📞 Call {seller.phone_number}
                      </a>
                    )}
                  </div>

                  {!seller.phone_number && (
                    <p className="text-sm text-gray-500">
                      Phone number not available — use email to contact this seller.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

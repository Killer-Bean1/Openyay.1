import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;

      const response = await productAPI.getAll(params);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Products</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category</label>
              <input
                type="text"
                placeholder="Filter by category..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sort</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">No sort</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {product.title}
                    </h3>
                    {product.category && (
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    )}
                    <p className="text-2xl font-bold text-purple-600 mb-2">
                      ${product.price}
                    </p>
                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {product.inventory} in stock
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

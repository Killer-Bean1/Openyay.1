import { useState, useEffect } from "react";
import { productAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    inventory: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== "business") {
      navigate("/products");
      return;
    }
    fetchMyProducts();
  }, [user]);

  async function fetchMyProducts() {
    try {
      const res = await productAPI.getMine();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productAPI.create({
        ...formData,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
      });
      setFormData({ title: "", description: "", price: "", category: "", image_url: "", inventory: "" });
      setShowAddProduct(false);
      fetchMyProducts();
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productAPI.update(editingProduct.id, {
        ...formData,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
      });
      setEditingProduct(null);
      setFormData({ title: "", description: "", price: "", category: "", image_url: "", inventory: "" });
      fetchMyProducts();
    } catch (err) {
      alert("Failed to update product");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productAPI.delete(productId);
      fetchMyProducts();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      image_url: product.image_url || "",
      inventory: product.inventory.toString(),
    });
    setShowAddProduct(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ title: "", description: "", price: "", category: "", image_url: "", inventory: "" });
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.inventory > 0 ? 1 : 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Business Dashboard</h1>
          <button
            onClick={() => { setShowAddProduct(!showAddProduct); cancelEdit(); }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            {showAddProduct ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Products</h3>
            <p className="text-4xl font-bold text-purple-600">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Inventory</h3>
            <p className="text-4xl font-bold text-purple-600">
              {products.reduce((sum, p) => sum + p.inventory, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Catalog Value</h3>
            <p className="text-4xl font-bold text-purple-600">
              ${products.reduce((sum, p) => sum + p.price * p.inventory, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {(showAddProduct || editingProduct) && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Product name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Product category"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Inventory</label>
                  <input
                    type="number"
                    name="inventory"
                    placeholder="Stock quantity"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={formData.inventory}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Product description"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-24"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={formData.image_url}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Your Products</h2>
          </div>
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No products yet. Click "+ Add Product" to get started!</p>
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div key={product.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <p className="text-sm text-gray-500">
                        {product.category && <span className="mr-3">{product.category}</span>}
                        <span className="text-purple-600 font-semibold">${product.price}</span>
                        <span className="ml-3 text-gray-400">{product.inventory} in stock</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

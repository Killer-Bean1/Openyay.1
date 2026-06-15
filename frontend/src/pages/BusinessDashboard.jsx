import { useState } from "react";
import { productAPI } from "../services/api";

export default function BusinessDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    inventory: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productAPI.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        inventory: parseInt(newProduct.inventory),
      });
      alert("Product added successfully!");
      setNewProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        image_url: "",
        inventory: "",
      });
      setShowAddProduct(false);
    } catch (err) {
      alert("Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Business Dashboard</h1>
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            {showAddProduct ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {showAddProduct && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Product name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={newProduct.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={newProduct.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Product category"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={newProduct.category}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Inventory
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    placeholder="Stock quantity"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={newProduct.inventory}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Product description"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 h-24"
                  value={newProduct.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={newProduct.image_url}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Products</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Orders</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Revenue</h3>
            <p className="text-4xl font-bold text-purple-600">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

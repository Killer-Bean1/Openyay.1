import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to OpenYay</h1>
          <p className="text-xl mb-8">
            A modern e-commerce platform connecting buyers and sellers
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
            <Link
              to="/register"
              className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors border-2 border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose OpenYay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold mb-4">Wide Selection</h3>
              <p className="text-gray-600">
                Browse thousands of products from trusted sellers
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Secure & Safe</h3>
              <p className="text-gray-600">
                Your transactions and data are protected with modern security
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-4">Direct Messaging</h3>
              <p className="text-gray-600">
                Communicate directly with sellers for inquiries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to explore?</h2>
          <Link
            to="/products"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}

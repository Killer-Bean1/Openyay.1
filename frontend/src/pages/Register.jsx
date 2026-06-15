import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      await authAPI.register(registerData);
      alert("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                placeholder="John Doe"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="password_confirm"
                placeholder="Confirm password"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={form.password_confirm}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Account Type</label>
              <select
                name="role"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={form.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="business">Business</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
        </button>

      </form>

    </div>
  );
}
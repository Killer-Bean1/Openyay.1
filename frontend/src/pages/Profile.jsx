import { useState } from "react";

export default function Profile() {
  const [user] = useState({
    full_name: "User Name",
    email: localStorage.getItem("user_email") || "user@example.com",
    role: "customer",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    alert("Profile updated successfully");
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8">User Profile</h1>

        <div className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  disabled
                  className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100"
                  value={formData.role}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gray-600 font-semibold">Full Name</label>
                <p className="text-xl text-gray-800">{user.full_name}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Email</label>
                <p className="text-xl text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-600 font-semibold">Account Type</label>
                <p className="text-xl text-purple-600 font-semibold capitalize">
                  {user.role}
                </p>
              </div>
              <div className="pt-4 flex gap-4 flex-wrap">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Customer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Orders</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Favorites</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Messages</h3>
            <p className="text-4xl font-bold text-purple-600">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
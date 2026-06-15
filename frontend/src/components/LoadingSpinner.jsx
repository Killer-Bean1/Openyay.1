export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-purple-600"></div>
        <p className="mt-6 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

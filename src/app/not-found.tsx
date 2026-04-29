export default function NotFound() {
  return (
    <div className="pt-28 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-8xl text-[#0B3C5D] mb-4">404</h1>
        <h2 className="text-2xl text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center bg-gradient-to-r from-[#0B3C5D] to-[#1ABC9C] text-white px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

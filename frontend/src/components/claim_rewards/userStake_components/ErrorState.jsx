const ErrorState = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center mt-6 shadow-lg">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f87171"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-400 mb-3">Something Went Wrong</h3>
      <p className="text-gray-400 max-w-md mx-auto">{message || "Failed to load your stakes. Please try again."}</p>
      <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
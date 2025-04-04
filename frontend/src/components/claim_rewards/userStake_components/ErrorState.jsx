const ErrorState = ({ message }) => {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-10 text-center my-10 backdrop-blur-sm shadow-lg">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-3 text-red-500">Something went wrong</h3>
      <p className="text-gray-400 max-w-md mx-auto">{message || "Failed to load your stakes. Please try again."}</p>
      <button className="mt-6 bg-white/5 border border-white/10 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-white/10 transition-all">
        Try Again
      </button>
    </div>
  )
}

export default ErrorState


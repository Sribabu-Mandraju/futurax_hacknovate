import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 text-center border border-gray-700/50 mt-6 shadow-lg">
      <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#grad)"
          strokeWidth="2"
          className="text-indigo-400"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#818cf8' }} />
              <stop offset="100%" style={{ stopColor: '#c084fc' }} />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
        No Stakes Found
      </h3>
      <p className="text-gray-400 max-w-md mx-auto">
        You haven't staked anything yet. Explore staking options to get started!
      </p>
      <button
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all"
        onClick={() => navigate("/markets")}
      >
        Explore Markets
      </button>
    </div>
  );
};

export default EmptyState;
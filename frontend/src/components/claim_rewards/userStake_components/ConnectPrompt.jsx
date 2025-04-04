const ConnectPrompt = () => {
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
              <stop offset="0%" style={{ stopColor: "#818cf8" }} />
              <stop offset="100%" style={{ stopColor: "#c084fc" }} />
            </linearGradient>
          </defs>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
        Connect Your Wallet
      </h3>
      <p className="text-gray-400 max-w-md mx-auto">
        Connect your wallet to view your staking dashboard and manage your
        stakes.
      </p>
      <button className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all">
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectPrompt;

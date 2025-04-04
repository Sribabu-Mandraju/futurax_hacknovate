const ConnectPrompt = () => {
  return (
    <div
      className="bg-gradient-to-br from-[#1a1f3d] to-[#252b3d] rounded-2xl p-12 text-center
      border border-white/5 my-10 backdrop-blur-sm shadow-xl"
    >
      <div
        className="w-20 h-20 bg-gradient-to-br from-purple-500/20 via-cyan-400/20 to-blue-500/20 rounded-full
        flex items-center justify-center mx-auto mb-8 border border-white/5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-transparent bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
        Connect Your Wallet
      </h3>
      <p className="text-gray-400 max-w-md mx-auto text-lg">
        Please connect your wallet to view your stakes and rewards
      </p>
      <button className="mt-8 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-white py-3 px-8 rounded-lg font-medium hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectPrompt;

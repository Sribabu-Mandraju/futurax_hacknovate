import { useNavigate } from "react-router-dom";
const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-gradient-to-br from-[#1a1f3d] to-[#252b3d] rounded-2xl p-12 text-center
      border border-white/5 my-10 backdrop-blur-sm shadow-xl"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 via-cyan-400/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
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
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
        No Stakes Found
      </h3>
      <p className="text-gray-400 max-w-md mx-auto text-lg">
        You don't have any active stakes yet. Start staking to see them here!
      </p>
      <button
        className="mt-8 bg-white/5 border border-white/10 text-white py-3 px-8 rounded-lg font-medium hover:bg-white/10 transition-all"
        onClick={() => navigate("/markets")}
      >
        Explore Staking Options
      </button>
    </div>
  );
};

export default EmptyState;

const DashboardHeader = ({ title, address, onRefresh, isLoading }) => {
  // Truncate address for display
  const displayAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

  return (
    <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4 md:gap-0">
      <div className="flex items-center gap-4">
        <h2 className="m-0 text-3xl font-bold bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
          {title}
        </h2>
        {address && (
          <div className="bg-white/5 rounded-full py-1.5 px-4 text-sm flex items-center gap-2 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-white">{displayAddress}</span>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={onRefresh}
          disabled={!address || isLoading}
          className={`bg-white/5 text-white border border-white/10 rounded-lg
            px-5 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer transition-all
            hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed
            w-full md:w-auto justify-center backdrop-blur-sm`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isLoading ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

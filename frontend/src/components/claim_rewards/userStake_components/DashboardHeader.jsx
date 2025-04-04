const DashboardHeader = ({ title, address, onRefresh, isLoading, stats }) => {
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h2>
          {address && (
            <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-600/50">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {displayAddress}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={!address || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 w-full md:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={isLoading ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {address && stats && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400">Total Staked</p>
            <p className="text-lg font-semibold">${stats.totalStaked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400">Wins</p>
            <p className="text-lg font-semibold text-green-400">{stats.totalWins}</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400">Losses</p>
            <p className="text-lg font-semibold text-red-400">{stats.totalLosses}</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400">Profit</p>
            <p className="text-lg font-semibold text-green-400">${stats.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <p className="text-gray-400">Loss</p>
            <p className="text-lg font-semibold text-red-400">${stats.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
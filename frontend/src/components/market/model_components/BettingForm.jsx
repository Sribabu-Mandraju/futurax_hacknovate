import React from "react";

const BettingForm = ({
  choice,
  amount,
  setAmount,
  loading,
  placeBet,
  onClose,
}) => {
  return (
    <>
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-white font-medium">Place Your Bet</h4>
          <div className="bg-gray-700 px-3 py-1 rounded-full">
            <span
              className={`text-sm font-medium ${
                choice ? "text-green-400" : "text-red-400"
              }`}
            >
              {choice ? "YES" : "NO"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-400 text-sm block mb-2">
            Bet Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 bg-gray-900 text-white rounded-lg outline-none border border-gray-700 focus:border-green-500 transition-colors"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                let val = e.target.value;

                // Allow only numbers and a single decimal point
                if (/^\d*\.?\d*$/.test(val)) {
                  setAmount(val);
                }
              }}
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              USDC
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
          <button
            className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            onClick={() => setAmount("10")}
          >
            $10
          </button>
          <button
            className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            onClick={() => setAmount("50")}
          >
            $50
          </button>
          <button
            className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            onClick={() => setAmount("100")}
          >
            $100
          </button>
          <button
            className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            onClick={() => setAmount("500")}
          >
            $500
          </button>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Minimum bet: 1 USDC. Your funds will be locked until the event
          resolves.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            choice
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          onClick={placeBet}
          disabled={loading || !amount}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Stake`
          )}
        </button>
      </div>
    </>
  );
};

export default BettingForm;

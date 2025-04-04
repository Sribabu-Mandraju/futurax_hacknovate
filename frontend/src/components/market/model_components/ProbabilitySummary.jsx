import React from "react";

const ProbabilitySummary = ({ currentYesProbability, currentNoProbability, choice }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div
        className={`bg-opacity-20 rounded-xl p-4 ${
          choice
            ? "bg-green-900 border border-green-700"
            : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Yes Probability</span>
          <span
            className={`text-lg font-bold ${
              choice ? "text-green-400" : "text-white"
            }`}
          >
            {currentYesProbability}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${currentYesProbability}%` }}
          ></div>
        </div>
      </div>

      <div
        className={`bg-opacity-20 rounded-xl p-4 ${
          !choice ? "bg-red-900 border border-red-700" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">No Probability</span>
          <span
            className={`text-lg font-bold ${
              !choice ? "text-red-400" : "text-white"
            }`}
          >
            {currentNoProbability}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${currentNoProbability}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilitySummary;
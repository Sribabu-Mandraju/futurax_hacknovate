"use client";

import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaGift,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { BettingModal } from "./BettingModal";

// Utility function to calculate probability percentage
const calculateProbability = (yesAmount, noAmount) => {
  const total = Number.parseFloat(yesAmount) + Number.parseFloat(noAmount);
  if (total === 0) return 50; // Default to 50% if no bets
  return Math.round((Number.parseFloat(yesAmount) / total) * 100);
};

// Utility function to format date
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Utility function to check if deadline has passed
const isDeadlinePassed = (deadline) => {
  return Date.now() > deadline * 1000;
};

const getColor = (percentage) => {
  if (percentage <= 30) return "url(#neonRedGradient)"; // Bright Red
  if (percentage <= 60) return "url(#neonOrangeGradient)"; // Bright Orange
  return "url(#neonGreenGradient)"; // Bright Green
};

// const SemiCircleGauge = ({ percentage }) => {
//   return (
//     <div className="w-full flex flex-col items-center mt-3">
//       {/* Progress Bar Background */}
//       <div className="relative w-32 h-3 bg-gray-800 rounded-full overflow-hidden shadow-md">
//         {/* Dynamic Progress Bar */}
//         <div
//           className={`h-full ${getColor(percentage)} rounded-full transition-all duration-500`}
//           style={{ width: `${percentage}%` }}
//         ></div>
//       </div>

//       {/* Percentage Label */}
//       <span className="mt-2 text-white font-semibold text-sm">
//         {percentage}% {percentage > 50 ? "Yes ✅" : "No ❌"}
//       </span>
//     </div>
//   );
// };

const ProbabilityBar = ({ yesPercentage }) => {
  return (
    <div className="flex flex-col items-center w-full mt-3">
      {/* Progress Bar Container */}
      <div className="relative h-2 w-full bg-black/40 backdrop-blur-xl rounded-full overflow-hidden border border-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
        {/* YES Probability - Green Neon Effect */}
        <div
          className="absolute left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-400 shadow-[0_0_12px_#34d399] transition-all duration-700 ease-in-out"
          style={{ width: `${yesPercentage}%` }}
        ></div>

        {/* NO Probability - Red Neon Effect */}
        <div
          className="absolute right-0 h-full bg-gradient-to-l from-red-500 via-rose-500 to-orange-300 shadow-[0_0_12px_#fb7185] transition-all duration-700 ease-in-out"
          style={{ width: `${100 - yesPercentage}%` }}
        ></div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between w-full mt-2 text-sm font-semibold">
        <span className="text-green-400">Yes: {yesPercentage}%</span>
        <span className="text-red-400">No: {100 - yesPercentage}%</span>
      </div>
    </div>
  );
};

const StatusBadge = ({ resolved, deadlinePassed }) => {
  if (resolved) {
    return (
      <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
        <FaCheckCircle /> Resolved
      </div>
    );
  } else if (deadlinePassed) {
    return (
      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
        <FaHourglassHalf /> Pending Result
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
        <FaClock /> Active
      </div>
    );
  }
};

const MarketCard = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [choice, setChoice] = useState(null);

  // Calculate probability based on bet amounts
  const probability = calculateProbability(data.totalYesBets, data.totalNoBets);

  // Check if deadline has passed
  const deadlinePassed = isDeadlinePassed(data.deadline);

  // Format deadline for display
  const formattedDeadline = formatDate(data.deadline);

  return (
    <>
      {/* Fixed height card container */}
      <div className="relative w-full h-[420px] rounded-xl shadow-2xl border border-gray-800 overflow-hidden hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:border-purple-500/30 transition-all duration-300 group">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-50"></div>

        {/* Main content with fixed height and scrollable if needed */}
        <div className="relative z-10 p-5 bg-gray-900 h-full flex flex-col">
          {/* Header with status badge - fixed height */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={data.image || "/placeholder.svg"}
                alt={data.description}
                className="w-[50px] h-[50px] rounded-lg shadow-md  border-gray-700 group-hover:border-purple-500/50 transition-all duration-300 object-cover"
              />
              <div className="">
                <h3 className="text-sm font-bold bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-transparent bg-clip-text ">
                  {data.description}
                </h3>
              </div>
            </div>
            {/* <StatusBadge
              resolved={data.resolved}
              deadlinePassed={deadlinePassed}
            /> */}
          </div>

          {/* Deadline display - fixed height */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <FaClock />
            <span>Deadline: {formattedDeadline}</span>
          </div>

          {/* Probability gauge - fixed height */}
          <div className="flex flex-col items-center my-4">
            {/* <p className="text-sm text-gray-400">Probability of YES</p> */}
            <ProbabilityBar yesPercentage={probability} />
            <div className="flex justify-between w-full text-xs text-gray-500 px-4 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Bet amounts display - fixed height */}
          {/* <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">YES Pool</p>
                <p className="text-lg font-bold text-green-400">
                  {data.totalYesBets} USD
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">NO Pool</p>
                <p className="text-lg font-bold text-red-400">
                  {data.totalNoBets} USD
                </p>
              </div>
            </div> */}

          {/* Conditional rendering for betting options - fixed height section */}
          <div className="h-[100px] mb-4">
            {!data.resolved && !deadlinePassed ? (
              <>
                <div className="flex gap-2 ">
                  <button
                    onClick={() => {
                      setChoice(true);
                      setModalOpen(true);
                    }}
                    className="flex-1 border-2 border-green-600/50 text-green-400 hover:text-white py- rounded-lg flex items-center justify-center gap-2 hover:bg-green-600/20 transition-all duration-300 hover:border-green-600 hover:shadow-[0_0_10px_rgba(0,200,83,0.5)]"
                  >
                    <FaArrowUp className="group-hover:translate-y-[-2px] transition-transform duration-300" />
                    <span>Buy YES</span>
                  </button>
                  <button
                    onClick={() => {
                      setChoice(false);
                      setModalOpen(true);
                    }}
                    className="flex-1 border-2 border-red-600/50 text-red-400 hover:text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600/20 transition-all duration-300 hover:border-red-600 hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                  >
                    <FaArrowDown className="group-hover:translate-y-[2px] transition-transform duration-300" />
                    <span>Buy NO</span>
                  </button>
                </div>
                <div className="text-center pt-2 text-[12px] text-zinc-400">
                  Best of Luck! May Your Stakes Yield Great Rewards.
                </div>{" "}
              </>
            ) : data.resolved ? (
              <div className="bg-gray-800/50 rounded-lg p-4 h-full flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-2">Result:</p>
                <p className="text-xl font-bold">
                  {data.winningOption ? (
                    <span className="text-green-400">YES</span>
                  ) : (
                    <span className="text-red-400">NO</span>
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-500/10 text-yellow-400 p-4 rounded-lg h-full flex items-center justify-center border border-yellow-500/20">
                <FaHourglassHalf className="mr-2" />
                <span>Waiting for result declaration</span>
              </div>
            )}
          </div>

          {/* Footer - fixed at bottom */}
          <div className="flex justify-between items-center text-gray-400 text-sm mt-auto">
            <StatusBadge
              resolved={data.resolved}
              deadlinePassed={deadlinePassed}
            />
            <div className="flex items-center gap-3">
              <FaGift className="cursor-pointer hover:text-purple-400 text-lg transition transform hover:scale-110 hover:rotate-12 duration-300" />
            </div>
          </div>
        </div>
      </div>

      <BettingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        choice={choice}
      />
    </>
  );
};

export default MarketCard;

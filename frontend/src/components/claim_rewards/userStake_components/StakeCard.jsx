"use client";

import { useState } from "react";
import { ethers } from "ethers";
import ClaimButton from "./ClaimButton";
import { formatCurrency } from "./formatter";
import StatusBadge from "./StakeBadge";
import { getSigner } from "../../../config/contract.config.js";
import EventAbi from "../../../abis/EventAbi.json";
import { formatDate } from "./formatter";
import toast from "react-hot-toast";

const StakeCard = ({ event, onClaimReward, walletAddress }) => {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundTxHash, setRefundTxHash] = useState("");
  const [refundError, setRefundError] = useState("");
  const checkOption = event.winningOption ? "YES" : "NO";

  const isWinner = event.resolved && event.selectedOption === checkOption;
  const canClaim = event.resolved && isWinner;
  const deadlineDate = new Date(event.deadline * 1000);
  const isExpired = deadlineDate < new Date();

  // Check if refund is possible (not resolved and 5+ days after deadline)
  // const refundDeadline = new Date(
  //   event.deadline * 1000 + 5 * 24 * 60 * 60 * 1000
  // ); // deadline + 5 days
  const refundDeadline = new Date(event.deadline * 1000 + 60 * 1000); // deadline + 1 minute

  const canRefund =
    !event.resolved && isExpired && new Date() >= refundDeadline;

  // Calculate potential reward (simplified example)
  const totalPool =
    Number.parseFloat(event.totalYesBets) +
    Number.parseFloat(event.totalNoBets);
  const potentialReward =
    event.selectedOption === "YES"
      ? (Number.parseFloat(event.stakedAmount) /
          Number.parseFloat(event.totalYesBets)) *
        totalPool
      : (Number.parseFloat(event.stakedAmount) /
          Number.parseFloat(event.totalNoBets)) *
        totalPool;

  const yesPercentage =
    (Number.parseFloat(event.totalYesBets) / totalPool) * 100;

  const handleRefundStake = async () => {
    try {
      setIsRefunding(true);
      setRefundError("");
      const toastId = toast.loading("Processing refund...");

      // Get signer (user's wallet)
      const signer = await getSigner();
      const eventContract = new ethers.Contract(
        event.address,
        EventAbi,
        signer
      );

      // Call refundStake function from smart contract
      const tx = await eventContract.refundStake();
      const receipt = await tx.wait();

      // Set transaction hash to display success
      setRefundTxHash(receipt.hash);

      // Show success notification
      toast.success(
        `Stake refunded successfully!\nTx Hash: ${receipt.hash.slice(
          0,
          6
        )}...${receipt.hash.slice(-6)}`,
        { id: toastId }
      );
    } catch (error) {
      console.error("Error refunding stake:", error);
      setRefundError(error.message || "Failed to refund stake");
      toast.error("Refund failed: " + (error.message || "Unknown error"), {
        id: toastId,
      });
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        isWinner ? "from-[#1a1f3d] to-[#2d2b4d]" : "from-[#1a1f3d] to-[#252b3d]"
      } 
      rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl
      border border-opacity-10 ${
        isWinner ? "border-purple-500/30" : "border-white/5"
      } backdrop-blur-sm`}
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-start">
        <h3 className="m-0 text-lg font-semibold text-white leading-tight mr-4">
          {event.description}
        </h3>
        <StatusBadge
          resolved={event.resolved}
          isWinner={isWinner}
          isExpired={isExpired}
        />
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div className="text-sm text-gray-400 font-medium">Staked</div>
              <div className="text-sm font-semibold text-white text-right">
                {formatCurrency(event.stakedAmount)}
              </div>

              <div className="text-sm text-gray-400 font-medium">
                Your Position
              </div>
              <div
                className={`text-sm font-semibold text-right ${
                  event.selectedOption === "YES"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {event.selectedOption}
              </div>

              <div className="text-sm text-gray-400 font-medium">Deadline</div>
              <div className="text-sm font-semibold text-white text-right">
                {deadlineDate.toLocaleString()}
              </div>

              {event.resolved && (
                <>
                  <div className="text-sm text-gray-400 font-medium">
                    Outcome
                  </div>
                  <div
                    className={`text-sm font-semibold text-right ${
                      event.winningOption ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {event.winningOption ? "YES" : "NO"}
                  </div>
                </>
              )}

              <div className="text-sm text-gray-400 font-medium">Pool Size</div>
              <div className="text-sm font-semibold text-white text-right">
                {formatCurrency(totalPool)}
              </div>

              {!event.resolved && (
                <>
                  <div className="text-sm text-gray-400 font-medium">
                    Potential Reward
                  </div>
                  <div className="text-sm font-semibold bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent text-right">
                    ~{formatCurrency(potentialReward)}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
            {event.image && (
              <img
                src={event.image || "/placeholder.svg"}
                alt="Event"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                  e.target.onerror = null;
                }}
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-green-600 font-semibold">
              {yesPercentage.toFixed(3)}% YES
            </span>
            <span className="text-red-600 font-semibold">
              {(100 - yesPercentage).toFixed(3)}% NO
            </span>
          </div>
          <div className="relative h-2 w-full bg-black/40 backdrop-blur-xl rounded-full overflow-hidden border border-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {/* YES Probability - Green Neon Effect */}
            <div
              className="absolute left-0 h-full bg-gradient-to-r from-green-500 via-emerald-400 to-cyan-400 shadow-[0_0_12px_#34d399] transition-all duration-700 ease-in-out"
              style={{ width: `${yesPercentage}%` }}
            ></div>

            {/* NO Probability - Red Neon Effect */}
            <div
              className="absolute right-0 h-full bg-gradient-to-l from-red-600 via-rose-500 to-orange-400 shadow-[0_0_12px_#fb7185] transition-all duration-700 ease-in-out"
              style={{ width: `${100 - yesPercentage}%` }}
            ></div>

            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

            {/* Labels */}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 flex justify-between items-center">
        {canClaim && (
          <ClaimButton
            data={event}
            onClick={() => onClaimReward(event.id)}
            amount={potentialReward}
          />
        )}

        {canRefund && (
          <div className="flex flex-col items-center">
            <button
              className={`bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-none rounded-lg
                px-5 py-2.5 font-medium cursor-pointer transition-all duration-300
                hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] active:translate-y-0 flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                ${isRefunding ? "opacity-90" : ""}`}
              onClick={handleRefundStake}
              disabled={isRefunding}
            >
              {isRefunding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Refunding...
                </>
              ) : (
                <>Refund Stake</>
              )}
            </button>

            {refundTxHash && (
              <p className="mt-3 text-sm text-green-500">
                ✅ Transaction Hash:{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${refundTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-400 hover:text-blue-300"
                >
                  {refundTxHash.slice(0, 6)}...{refundTxHash.slice(-6)}
                </a>
              </p>
            )}

            {refundError && (
              <p className="mt-3 text-sm text-red-500">Error: {refundError}</p>
            )}
          </div>
        )}

        {!event.resolved && !isExpired && (
          <div className="flex items-center text-sm text-green-500">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Active
          </div>
        )}

        {!event.resolved && isExpired && !canRefund && (
          <div className="text-sm text-yellow-500">Pending Resolution</div>
        )}

        {!event.resolved &&
          isExpired &&
          canRefund &&
          !refundTxHash &&
          !isRefunding && (
            <div className="text-xs text-amber-400">
              <span className="block mb-1">Resolution overdue</span>
              <span className="block">Refund available</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default StakeCard;

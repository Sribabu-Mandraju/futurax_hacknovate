"use client";

import { useState } from "react";
import { ethers } from "ethers";
import ClaimButton from "./ClaimButton";
import { formatCurrency, formatDate } from "./formatter";
import StatusBadge from "./StakeBadge";
import { getSigner } from "../../../config/contract.config.js";
import EventAbi from "../../../abis/EventAbi.json";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUserStakedEvents } from "../../../store/slices/userStakesSlice";

const StakeCard = ({ event, onClaimReward, walletAddress }) => {
  const dispatch = useDispatch();
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundTxHash, setRefundTxHash] = useState("");
  const [refundError, setRefundError] = useState("");
  const checkOption = event.winningOption ? "YES" : "NO";

  const isWinner = event.resolved && event.selectedOption === checkOption;
  const canClaim = event.resolved && isWinner;
  const deadlineDate = new Date(event.deadline * 1000);
  const isExpired = deadlineDate < new Date();
  const refundDeadline = new Date(event.deadline * 1000 + 60 * 1000);
  const canRefund =
    !event.resolved && isExpired && new Date() >= refundDeadline;

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

      // Step 1: Refund stake from the smart contract
      const signer = await getSigner();
      const eventContract = new ethers.Contract(
        event.address,
        EventAbi,
        signer
      );
      const tx = await eventContract.refundStake();
      const receipt = await tx.wait();
      setRefundTxHash(receipt.hash);

      // Step 2: Call backend to delete the stake after successful refund
      const deleteResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/stake/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stakeAddress: event.address,
            userAddress: walletAddress,
          }),
        }
      );

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(
          errorData.message || "Failed to delete stake from backend"
        );
      }

      const deleteData = await deleteResponse.json();
      console.log("Stake deleted from backend:", deleteData);

      // Step 3: Refetch updated stakes list
      await dispatch(fetchUserStakedEvents(walletAddress)).unwrap();

      toast.success(
        `Stake refunded and deleted successfully!\nTx Hash: ${receipt.hash.slice(
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
    <div className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-5 border-b border-gray-700/30 flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white">
          {event.description}
        </h3>
        <StatusBadge
          resolved={event.resolved}
          isWinner={isWinner}
          isExpired={isExpired}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-400">Staked:</span>
              <span className="text-white text-right">
                {formatCurrency(event.stakedAmount)}
              </span>
              <span className="text-gray-400">Position:</span>
              <span
                className={`text-right ${
                  event.selectedOption === "YES"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {event.selectedOption}
              </span>
              <span className="text-gray-400">Deadline:</span>
              <span className="text-white text-right">
                {formatDate(event.deadline)}
              </span>
              {event.resolved && (
                <>
                  <span className="text-gray-400">Outcome:</span>
                  <span
                    className={`text-right ${
                      event.winningOption ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {event.winningOption ? "YES" : "NO"}
                  </span>
                </>
              )}
              <span className="text-gray-400">Pool Size:</span>
              <span className="text-white text-right">
                {formatCurrency(totalPool)}
              </span>
              {/* {!event.resolved && (
                <>
                  <span className="text-gray-400">Potential Reward:</span>
                  <span className="text-indigo-400 text-right">
                    ~{formatCurrency(potentialReward)}
                  </span>
                </>
              )} */}
            </div>
            {/* <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{yesPercentage.toFixed(1)}% YES</span>
                <span>{(100 - yesPercentage).toFixed(1)}% NO</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
            </div> */}
          </div>
          {event.image && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600/50">
              <img
                src={event.image}
                alt="Event"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/placeholder-image.png")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-gray-700/30 flex justify-between items-center">
        {canClaim && (
          <ClaimButton
            data={event}
            amount={potentialReward}
            walletAddress={walletAddress}
          />
        )}
        {canRefund && (
          <div className="flex flex-col items-center gap-2">
            <button
              className={`bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                isRefunding ? "opacity-70" : ""
              }`}
              onClick={handleRefundStake}
              disabled={isRefunding}
            >
              {isRefunding ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Refunding...
                </>
              ) : (
                "Refund Stake"
              )}
            </button>
            {refundTxHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${refundTxHashInforme}`}
                target="_blank"
                className="text-xs text-green-400 underline"
              >
                Tx: {refundTxHash.slice(0, 6)}...{refundTxHash.slice(-6)}
              </a>
            )}
            {refundError && (
              <p className="text-xs text-red-400">{refundError}</p>
            )}
          </div>
        )}
        {!event.resolved && !isExpired && (
          <span className="text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active
          </span>
        )}
        {!event.resolved && isExpired && !canRefund && (
          <span className="text-yellow-400">Pending Resolution</span>
        )}
      </div>
    </div>
  );
};

export default StakeCard;

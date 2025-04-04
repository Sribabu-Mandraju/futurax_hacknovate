import {
  FaEthereum,
  FaCalendarAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { useState } from "react";
import StatusIndicator from "./StatusIndicator";
import { ethers } from "ethers";
import EventAbi from "../../../abis/EventAbi.json";
import { getSigner } from "../../../config/contract.config";
import { useDispatch } from "react-redux";
import { fetchBets } from "../../../store/slices/betsSlice";
import toast from "react-hot-toast";
import axios from "axios";

const EventDetailsModal = ({
  event,
  formatDate,
  getTimeRemaining,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);

  const resolveEvent = async (winningOption) => {
    setLoading(true);
    const toastId = toast.loading("Processing transaction...");

    try {
      const signer = await getSigner();
      const eventContract = new ethers.Contract(
        event.address,
        EventAbi,
        signer
      );

      const tx = await eventContract.resolveEvent(winningOption);
      toast.success("Transaction submitted successfully!", { id: toastId });
      const receipt = await tx.wait();
      setTransactionHash(receipt.transactionHash);

      // Call API to save resolved event address
      await saveResolvedEvent(event.address);

      toast.success("Event resolved successfully!", { id: toastId });
      dispatch(fetchBets());
      onClose();
    } catch (error) {
      console.error("Error resolving event:", error);
      toast.error(
        "Resolve failed: " + (error.reason || error.message || "Unknown error"),
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const saveResolvedEvent = async (stakeAddress) => {
    try {
      const loadingToast = toast.loading("Saving resolved event details...");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/stakeStatus/resolve`,
        {
          stakeAddress,
        }
      );

      if (response.status === 200) {
        toast.success("Resolved event details saved successfully!", {
          id: loadingToast,
        });
      } else {
        toast.error("Failed to save resolved event details.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error saving resolved event:", error);
      toast.error(
        "Failed to save resolved event details: " +
          (error.message || "Unknown error"),
        { id: loadingToast }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-40 overflow-hidden">
          <img
            src={event.image || "/placeholder.svg"}
            alt="Event"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-900 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100"
          >
            <FaTimesCircle />
          </button>
          <div className="absolute bottom-3 left-4">
            <StatusIndicator status={event.resolved} />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{event.description}</h2>

          <div className="grid gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <FaEthereum className="mr-2 text-purple-400" />
              <span className="font-mono">{event.address}</span>
            </div>

            <div className="flex items-center text-gray-300">
              <FaCalendarAlt className="mr-2 text-blue-400" />
              <span>{formatDate(event.deadline)}</span>
            </div>

            {!event.resolved && (
              <div className="text-yellow-400 font-medium">
                {getTimeRemaining(event.deadline)}
              </div>
            )}
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">Betting Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center text-green-400 mb-1">
                  <FaThumbsUp className="mr-2" />
                  <span className="font-medium">YES Bets</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {event.totalYesBets}
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center text-red-400 mb-1">
                  <FaThumbsDown className="mr-2" />
                  <span className="font-medium">NO Bets</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {event.totalNoBets}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3">Resolution Status</h3>

            {event.resolved ? (
              <div>
                <div className="flex items-center mb-2">
                  <FaCheckCircle className="text-green-400 mr-2" />
                  <span className="text-white font-medium">
                    This event has been resolved
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-gray-300 mr-2">Winning Option:</span>
                  {event.winningOption ? (
                    <span className="bg-green-900 text-green-300 px-3 py-1 rounded-md">
                      YES
                    </span>
                  ) : (
                    <span className="bg-red-900 text-red-300 px-3 py-1 rounded-md">
                      NO
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-white font-medium">
                  This event is still active
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => resolveEvent(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Resolve as YES"}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => resolveEvent(false)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Resolve as NO"}
            </button>
          </div>

          {transactionHash && (
            <p className="mt-4 text-sm">Transaction Hash: {transactionHash}</p>
          )}
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { getSigner } from "../../../config/contract.config.js";
import EventAbi from "../../../abis/EventAbi.json"; // Ensure this file contains your contract ABI
import toast from "react-hot-toast";
import { fetchUserStakedEvents } from "../../../store/slices/userStakesSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AiFillCheckCircle } from "react-icons/ai";

const ClaimButton = ({ data, amount, walletAddress }) => {
  const dispatch = useDispatch();
  const [claiming, setClaiming] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const fetchAddress = useCallback(async () => {
    try {
      setIsConnecting(true);
      const signer = await getSigner();
      if (!signer) {
        console.warn("No signer available");
        setUserAddress("");
        return;
      }

      const address = await signer.getAddress();

      if (address !== userAddress) {
        setUserAddress(address);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setUserAddress("");
    } finally {
      setIsConnecting(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchAddress();
    const interval = setInterval(fetchAddress, 15000);
    return () => clearInterval(interval);
  }, [fetchAddress]);

  const updateBackendState = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API_URL}/stake/updateClaim`,
        {
          eventAddress: data.address,
          userAddress: userAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Backend updated:", response.data);
    } catch (error) {
      console.error(
        "Error updating backend:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Error updating backend");
    }
  };

  const claimRewards = async () => {
    try {
      setClaiming(true);
      const signer = await getSigner();
      const eventContract = new ethers.Contract(data.address, EventAbi, signer);
      const tx = await eventContract.claimRewards();
      const receipt = await tx.wait();
      setTransactionHash(receipt.transactionHash);
      toast.success("Reward claimed successfully");
      await updateBackendState();
      dispatch(fetchUserStakedEvents());
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error("Error claiming reward");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {data.isClaimed ? (
        <div className="flex gap-2 items-center justify-center bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2.5 rounded-lg shadow-lg">
          <AiFillCheckCircle className="w-6 h-6 text-white mb-1" />
          <span className="font-semibold">Rewards Claimed</span>
        </div>
      ) : (
        <button
          className={`bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   text-white border-none rounded-lg
          px-5 py-2.5 font-medium cursor-pointer transition-all duration-300
          hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] active:translate-y-0 flex items-center justify-center gap-2
          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
          ${claiming ? "opacity-90" : ""}`}
          onClick={claimRewards}
          disabled={claiming}
        >
          {claiming ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Claiming...
            </>
          ) : (
            <>Claim Rewards</>
          )}
        </button>
      )}

      {transactionHash && (
        <p className="mt-3 text-sm text-green-500">
          ✅ Transaction Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-300"
          >
            {transactionHash.slice(0, 6)}...{transactionHash.slice(-6)}
          </a>
        </p>
      )}
    </div>
  );
};

export default ClaimButton;

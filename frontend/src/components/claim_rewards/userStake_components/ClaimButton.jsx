import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { getSigner } from "../../../config/contract.config.js";
import EventAbi from "../../../abis/EventAbi.json";
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
        setUserAddress("");
        return;
      }
      const address = await signer.getAddress();
      if (address !== userAddress) setUserAddress(address);
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
        { eventAddress: data.address, userAddress },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Backend updated:", response.data);
    } catch (error) {
      console.error("Error updating backend:", error.response?.data?.message || error.message);
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
      dispatch(fetchUserStakedEvents(walletAddress));
    } catch (error) {
      console.error("Error claiming rewards:", error);
      toast.error("Error claiming reward");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {data.isClaimed ? (
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <AiFillCheckCircle className="w-5 h-5" />
          <span>Rewards Claimed</span>
        </div>
      ) : (
        <button
          className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${claiming ? "opacity-70" : ""}`}
          onClick={claimRewards}
          disabled={claiming}
        >
          {claiming ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Claiming...
            </>
          ) : (
            "Claim Rewards"
          )}
        </button>
      )}
      {transactionHash && (
        <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" className="text-xs text-green-400 underline">
          Tx: {transactionHash.slice(0, 6)}...{transactionHash.slice(-6)}
        </a>
      )}
    </div>
  );
};

export default ClaimButton;
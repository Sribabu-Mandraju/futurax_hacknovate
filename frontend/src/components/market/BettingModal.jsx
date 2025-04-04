import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import USDC_ABI from "../../abis/USDC_Abi.json";
import EventAbi from "../../abis/EventAbi.json";
import { getSigner } from "../../config/contract.config";
import ProbabilityChart from "./model_components/ProbabilityChart";
import EventDetails from "./model_components/EventDetails";
import BettingForm from "./model_components/BettingForm";
import SuccessNotification from "./model_components/SuccessNotification";
import TabNavigation from "./model_components/TabNavigation";
import ProbabilitySummary from "./model_components/ProbabilitySummary";
import toast from "react-hot-toast";

const USDC_ADDRESS = import.meta.env.VITE_USDC_FEE_ADDRESS;

export const BettingModal = ({ isOpen, onClose, data, choice }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [probabilityData, setProbabilityData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chart");

  useEffect(() => {
    if (isOpen && data?.address) {
      fetchProbabilityData();
    }
  }, [isOpen, data]);

  const fetchProbabilityData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/stake/probabilities?eventAddress=${data.address}&interval=5`
      );
      const result = await response.json();

      if (result.trends && result.trends.length > 0) {
        const formattedData = result.trends.map((item) => ({
          timestamp: new Date(item.timestamp),
          yesProbability: parseFloat(item.yesProbability),
          noProbability: parseFloat(item.noProbability),
          totalStakes: item.totalStakes,
          yesCount: item.yesCount,
          noCount: item.noCount,
        }));
        setProbabilityData(formattedData);
      } else {
        // If no data, create some placeholder data
        setProbabilityData(getPlaceholderData());
      }
    } catch (error) {
      console.error("Error fetching probability data:", error);
      // Set fallback data
      setProbabilityData(getPlaceholderData());
    } finally {
      setDataLoading(false);
    }
  };

  const getPlaceholderData = () => {
    return [
      {
        timestamp: new Date(Date.now() - 50 * 60000),
        yesProbability: 60,
        noProbability: 40,
        totalStakes: 5,
      },
      {
        timestamp: new Date(Date.now() - 40 * 60000),
        yesProbability: 55,
        noProbability: 45,
        totalStakes: 8,
      },
      {
        timestamp: new Date(Date.now() - 30 * 60000),
        yesProbability: 58,
        noProbability: 42,
        totalStakes: 12,
      },
      {
        timestamp: new Date(Date.now() - 20 * 60000),
        yesProbability: 62,
        noProbability: 38,
        totalStakes: 15,
      },
      {
        timestamp: new Date(Date.now() - 10 * 60000),
        yesProbability: 65,
        noProbability: 35,
        totalStakes: 18,
      },
    ];
  };

  const placeBet = async () => {
    try {
      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount.");
        return;
      }
      setLoading(true);
      const toastId = toast.loading("Processing your bet...");

      const signer = await getSigner();
      const userAddress = await signer.getAddress();
      const eventContract = new ethers.Contract(data.address, EventAbi, signer);
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      const amountInUnits = ethers.parseUnits(amount.toString(), 6);

      // Check USDC balance
      const balance = await usdcContract.balanceOf(userAddress);
      if (balance < amountInUnits) {
        toast.error("Insufficient USDC balance.");
        setLoading(false);
        return;
      }

      // Approve USDC transfer
      const approveTx = await usdcContract.approve(data.address, amountInUnits);
      await approveTx.wait();
      toast.success("USDC transfer approved!", { id: toastId });

      // Place bet
      const betTx = await eventContract.placeBet(choice, amountInUnits);
      toast.success("Transaction submitted successfully!", { id: toastId });

      // Wait for the transaction to be mined
      const receipt = await betTx.wait();

      // Set transaction hash to display success
      setTransactionHash(receipt.hash);

      // Call API to store stake details
      await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/stake/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stakeAddress: data.address,
          stakedAmount: ethers.formatUnits(amountInUnits, 6),
          userAddress,
          selectedOption: choice ? "YES" : "NO",
        }),
      });

      // Refresh probability data after successful bet
      fetchProbabilityData();

      // Show success notification
      toast.success(
        `Bet placed successfully!\nTx Hash: ${receipt.hash.slice(0, 6)}...${receipt.hash.slice(-6)}`,
        { id: toastId }
      );
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error(
        "Bet failed: " + (error.reason || error.message || "Unknown error"),
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate current probabilities
  const currentYesProbability =
    probabilityData.length > 0
      ? probabilityData[probabilityData.length - 1].yesProbability
      : 50;

  const currentNoProbability =
    probabilityData.length > 0
      ? probabilityData[probabilityData.length - 1].noProbability
      : 50;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-b h-[80vh] overflow-y-auto from-gray-900 to-black p-6 rounded-2xl shadow-2xl w-[95%] max-w-2xl border border-gray-800"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl text-white font-bold">
              {data?.title || "Place Your Prediction"}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {data?.description || "Predict the outcome of this event"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === "chart" ? (
          <>
            {/* Current Probabilities */}
            <ProbabilitySummary
              currentYesProbability={currentYesProbability}
              currentNoProbability={currentNoProbability}
              choice={choice}
            />

            {/* Chart */}
            <ProbabilityChart
              dataLoading={dataLoading}
              probabilityData={probabilityData}
            />
          </>
        ) : (
          <EventDetails data={data} probabilityData={probabilityData} />
        )}

        {/* Betting Form */}
        <BettingForm
          choice={choice}
          amount={amount}
          setAmount={setAmount}
          loading={loading}
          placeBet={placeBet}
          onClose={onClose}
        />

        {/* Transaction Hash */}
        {transactionHash && (
          <div className="mt-4 p-3 bg-green-900 bg-opacity-20 border border-green-800 rounded-lg">
            <p className="text-green-400 text-sm">
              Bet confirmed! Transaction Hash:{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </a>
            </p>
          </div>
        )}

        {/* Success Notification */}
        <SuccessNotification />
      </motion.div>
    </motion.div>
  );
};
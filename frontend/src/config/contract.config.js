import { ethers } from "ethers";
import EventFactoryABI from "../abis/EventFactoryAbi.json";
import EventAbi from "../abis/EventAbi.json";

// Contract address
const eventFactoryAddress = import.meta.env.VITE_EVENT_FACTORY_ADDRESS;

// Get provider connected to MetaMask
const getProvider = async () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    throw new Error(
      "Please install MetaMask to interact with this application."
    );
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return provider;
};

// Get signer connected to MetaMask
const getSigner = async () => {
  const provider = await getProvider();
  return provider.getSigner();
};

// Get EventFactory contract instance with MetaMask signer
const getEventFactoryContract = async () => {
  if (!eventFactoryAddress || eventFactoryAddress === "") {
    throw new Error(
      "Invalid event factory address. Please check your environment variables."
    );
  }

  let provider;

  if (window.ethereum) {
    try {
      const signer = await getSigner();
      return new ethers.Contract(eventFactoryAddress, EventFactoryABI, signer);
    } catch (error) {
      console.warn("Wallet not connected. Using RPC provider instead.");
    }
  }



  // If no wallet is connected, use RPC provider
  provider = new ethers.JsonRpcProvider(RPC_URL);
  return new ethers.Contract(eventFactoryAddress, EventFactoryABI, provider);
};

export { getProvider, getSigner, getEventFactoryContract };

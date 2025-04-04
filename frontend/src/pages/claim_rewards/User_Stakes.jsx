import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/main/Navbar";
import { getSigner } from "../../config/contract.config";
import Stakes from "../../components/claim_rewards/Stakes";

const User_Stakes = () => {
  const [userAddress, setUserAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);

  // Access Redux state

  // Fetch address and staked events with error handling
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

      // Only update if address actually changed
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
    // Initial fetch
    fetchAddress();

    // Set up a less frequent polling interval
    const interval = setInterval(fetchAddress, 15000); // Reduced from 5s to 15s

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [fetchAddress]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchAddress();
  };

  console.log(userAddress)

  return (
    <>
      <Navbar />
      <Stakes address={userAddress} />
    </>
  );
};

export default User_Stakes;

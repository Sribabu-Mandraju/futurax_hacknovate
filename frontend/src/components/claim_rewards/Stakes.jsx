"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStakedEvents,
  clearStakedEvents,
} from "../../store/slices/userStakesSlice";
import StakeCard from "./userStake_components/StakeCard";
import ConnectPrompt from "./userStake_components/ConnectPrompt";
import DashboardHeader from "./userStake_components/DashboardHeader";
import LoadingState from "./userStake_components/LoadingState";
import ErrorState from "./userStake_components/ErrorState";
import EmptyState from "./userStake_components/EmptyState";
import { isAddressable } from "ethers";

const Stakes = ({ address }) => {
  const dispatch = useDispatch();
  const { stakedEvents, loading, error } = useSelector(
    (state) => state.stakedEvents
  );
  const [lastFetchedAddress, setLastFetchedAddress] = useState("");
  console.log(stakedEvents);

  useEffect(() => {
    // Only fetch if we have a valid address and it's different from the last one
    if (address && address !== lastFetchedAddress) {
      console.log(`Fetching stakes for address: ${address}`);
      dispatch(fetchUserStakedEvents(address));
      setLastFetchedAddress(address);
    } else if (!address && lastFetchedAddress) {
      // Clear stakes if address is removed
      dispatch(clearStakedEvents());
      setLastFetchedAddress("");
    }
  }, [address, dispatch, lastFetchedAddress]);

  // Handle manual refresh
  const handleRefresh = () => {
    if (address) {
      console.log(`Manually refreshing stakes for: ${address}`);
      dispatch(fetchUserStakedEvents(address));
    }
  };

  const handleClaimReward = (eventId) => {
    // Implement claim reward functionality
    console.log(`Claiming reward for event: ${eventId}`);
    // You would dispatch an action here to claim the reward
  };

  return (
    <div className=" min-h-screen mt-[80px]  text-white p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-3xl shadow-2xl overflow-hidden   border-white/5 p-6 md:p-8">
          <DashboardHeader
            title="Your Stakes"
            address={address}
            onRefresh={handleRefresh}
            isLoading={loading}
          />

          {!address && <ConnectPrompt />}

          {address && (
            <div className="mt-8">
              {loading && <LoadingState />}

              {error && <ErrorState message={error} />}

              {!loading && !error && stakedEvents.length === 0 && (
                <EmptyState />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {!loading &&
                  stakedEvents.map((event, index) => (
                    <StakeCard
                      key={index}
                      event={event}
                      walletAddress={address}
                      onClaimReward={handleClaimReward}
                    />
                  ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-400">
              Dashboard stats:{" "}
              <span className="text-white">Total staked: $10,245.00</span> •
              <span className="text-white"> Active stakes: 5</span> •
              <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent">
                {" "}
                Rewards earned: $1,245.00
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stakes;

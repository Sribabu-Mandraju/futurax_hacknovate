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

const Stakes = ({ address }) => {
  const dispatch = useDispatch();
  const { stakedEvents, loading, error } = useSelector(
    (state) => state.stakedEvents
  );
  const [lastFetchedAddress, setLastFetchedAddress] = useState("");

  useEffect(() => {
    if (address && address !== lastFetchedAddress) {
      dispatch(fetchUserStakedEvents(address));
      setLastFetchedAddress(address);
    } else if (!address && lastFetchedAddress) {
      dispatch(clearStakedEvents());
      setLastFetchedAddress("");
    }
  }, [address, dispatch, lastFetchedAddress]);

  const handleRefresh = () => {
    if (address) {
      dispatch(fetchUserStakedEvents(address));
    }
  };

  const handleClaimReward = (eventId) => {
    console.log(`Claiming reward for event: ${eventId}`);
  };

  // Calculate statistics
  // Inside Stakes component
  const stats = {
    totalStaked: stakedEvents.reduce(
      (sum, event) => sum + Number.parseFloat(event.stakedAmount || 0),
      0
    ),
    totalWins: stakedEvents.filter(
      (e) => e.resolved && e.selectedOption === (e.winningOption ? "YES" : "NO")
    ).length,
    totalLosses: stakedEvents.filter(
      (e) => e.resolved && e.selectedOption !== (e.winningOption ? "YES" : "NO")
    ).length,
    // Profit is now the sum of stakedAmount for won events
    profit: stakedEvents.reduce((sum, e) => {
      const isWinner =
        e.resolved && e.selectedOption === (e.winningOption ? "YES" : "NO");
      return isWinner ? sum + Number.parseFloat(e.stakedAmount || 0) : sum;
    }, 0),
    loss: stakedEvents.reduce(
      (sum, e) =>
        e.resolved && e.selectedOption !== (e.winningOption ? "YES" : "NO")
          ? sum + Number.parseFloat(e.stakedAmount || 0)
          : sum,
      0
    ),
  };

  return (
    <div className="min-h-screen mt-[80px] w-full max-w-7xl bg-gray-900 text-white px-4 py-8 md:p-6">
      <div className="mx-auto">
        <DashboardHeader
          title="User Portfolio"
          address={address}
          onRefresh={handleRefresh}
          isLoading={loading}
          stats={stats}
        />

        {!address && <ConnectPrompt />}

        {address && (
          <div className="mt-6">
            {loading && <LoadingState />}
            {error && <ErrorState message={error} />}
            {!loading && !error && stakedEvents.length === 0 && <EmptyState />}
            {!loading && !error && stakedEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stakedEvents.map((event, index) => (
                  <StakeCard
                    key={index}
                    event={event}
                    walletAddress={address}
                    onClaimReward={handleClaimReward}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stakes;

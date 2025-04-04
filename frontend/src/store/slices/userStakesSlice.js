import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import EventABI from "../../abis/EventAbi.json";

const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;
const provider = new ethers.JsonRpcProvider(RPC_URL);

const getEventContract = (eventAddress) => {
  return new ethers.Contract(eventAddress, EventABI, provider);
};

// Async thunk to fetch event details for the user's staked events
export const fetchUserStakedEvents = createAsyncThunk(
  "stakedEvents/fetchUserStakedEvents",
  async (userAddress, { rejectWithValue }) => {
    try {
      // Validate user address before making the API call
      if (!userAddress || typeof userAddress !== 'string' || !userAddress.trim()) {
        return rejectWithValue("Valid user address is required");
      }

      // Normalize the address format - ensure checksum format
      try {
        userAddress = ethers.getAddress(userAddress);
      } catch (e) {
        return rejectWithValue("Invalid Ethereum address format");
      }

      // Debug logs
      console.log(`Fetching stakes for address: ${userAddress}`);
      
      // Construct correct API URL - making sure this matches your backend route
      const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/stake/user/${userAddress}`;
      console.log(`API URL: ${apiUrl}`);

      // Make request with full error handling
      const response = await fetch(apiUrl);
      
      // Debug response
      console.log(`API Response Status: ${response.status}`);
      
      // Check response status
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`API Error (${response.status}): ${errorData}`);
        return rejectWithValue(`API Error (${response.status}): ${errorData}`);
      }

      const userStakes = await response.json();
      console.log(`Received user stakes:`, userStakes);

      if (!Array.isArray(userStakes) || userStakes.length === 0) {
        console.log("No stakes found for this user");
        return [];
      }

      // Fetch event details for each staked event
      const eventsWithDetails = await Promise.all(
        userStakes.map(async (stake) => {
          try {
            if (!stake.stakeAddress) {
              console.error("Missing stakeAddress in stake object:", stake);
              throw new Error("Missing stakeAddress");
            }

            const eventContract = getEventContract(stake.stakeAddress);
            const details = await eventContract.getEventDetails();

            return {
              address: stake.stakeAddress,
              description: details[0],
              deadline: Number(details[1]),
              resolved: details[2],
              winningOption: details[3],
              totalYesBets: ethers.formatUnits(details[4], 6),
              totalNoBets: ethers.formatUnits(details[5], 6),
              selectedOption: stake.selectedOption, // YES or NO from DB
              stakedAmount: stake.stakedAmount, // Amount from DB
              image: await eventContract.imageUrl(),
              isClaimed:stake.isClaimed
            };
          } catch (contractError) {
            console.error(`Error fetching details for stake:`, contractError, stake);
            // Return partial data instead of failing the whole request
            return {
              address: stake.stakeAddress || "Unknown",
              description: "Error loading event details",
              selectedOption: stake.selectedOption || "Unknown",
              stakedAmount: stake.stakedAmount || "0",
              error: true
            };
          }
        })
      );

      return eventsWithDetails;
    } catch (error) {
      console.error("Error in fetchUserStakedEvents:", error);
      return rejectWithValue(
        `Failed to fetch user staked events: ${error.message}`
      );
    }
  }
);

const stakedEventsSlice = createSlice({
  name: "stakedEvents",
  initialState: {
    stakedEvents: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStakedEvents: (state) => {
      state.stakedEvents = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStakedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStakedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.stakedEvents = action.payload;
      })
      .addCase(fetchUserStakedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stakedEvents = [];
      });
  },
});

export const { clearStakedEvents } = stakedEventsSlice.actions;
export default stakedEventsSlice.reducer;
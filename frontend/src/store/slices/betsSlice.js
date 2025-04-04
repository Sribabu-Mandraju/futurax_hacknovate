import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import EventABI from "../../abis/EventAbi.json";
import EventFactoryABI from "../../abis/EventFactoryAbi.json";

const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL;
const EVENT_FACTORY_ADDRESS = import.meta.env.VITE_EVENT_FACTORY_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);

const getEventContract = (eventAddress) => {
  return new ethers.Contract(eventAddress, EventABI, provider);
};

export const fetchBets = createAsyncThunk(
  "bets/fetchBets",
  async (_, { rejectWithValue }) => {
    try {
      const eventFactory = new ethers.Contract(
        EVENT_FACTORY_ADDRESS,
        EventFactoryABI,
        provider
      );
      const eventAddresses = await eventFactory.getDeployedEvents();

      if (!eventAddresses || eventAddresses.length === 0) {
        return [];
      }

      const eventsWithDetails = await Promise.all(
        eventAddresses.map(async (eventAddress) => {
          const eventContract = getEventContract(eventAddress);
          const details = await eventContract.getEventDetails();

          return {
            address: eventAddress,
            description: details[0],
            deadline: Number(details[1]),
            resolved: details[2],
            winningOption: details[3],
            totalYesBets: ethers.formatUnits(details[4], 6),
            totalNoBets: ethers.formatUnits(details[5], 6),
            image:await eventContract.imageUrl(),
          };
        })
      );

      return eventsWithDetails;
    } catch (error) {
      return rejectWithValue("Failed to load events. " + error.message);
    }
  }
);

const betsSlice = createSlice({
  name: "bets",
  initialState: {
    bets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.loading = false;
        state.bets = action.payload.sort((a, b) => {
          const sumA = parseFloat(a.totalYesBets) + parseFloat(a.totalNoBets);
          const sumB = parseFloat(b.totalYesBets) + parseFloat(b.totalNoBets);
          return sumB - sumA; // Sort in descending order
        });
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default betsSlice.reducer;

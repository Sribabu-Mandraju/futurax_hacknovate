import { useState, useEffect } from "react"
import { ethers } from "ethers"
import EventABI from "../../abis/EventAbi.json"
import EventFactoryABI from "../../abis/EventFactoryAbi.json"
import { FaFilter, FaSearch, FaSyncAlt, FaChartLine, FaFire, FaClock } from "react-icons/fa"
import MarketCard from "../market/MarketCard"

const EventsList = () => {
  const RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL

  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const provider = new ethers.JsonRpcProvider(RPC_URL)

  // Function to get event contract instance
  const getEventContract = (eventAddress) => {
    return new ethers.Contract(eventAddress, EventABI, provider)
  }

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    try {
      const eventFactory = new ethers.Contract(import.meta.env.VITE_EVENT_FACTORY_ADDRESS, EventFactoryABI, provider)
      const eventAddresses = await eventFactory.getDeployedEvents()
      console.log("Deployed events:", eventAddresses)

      if (!eventAddresses || eventAddresses.length === 0) {
        setEvents([])
        setFilteredEvents([])
        setLoading(false)
        return
      }

      const eventsWithDetails = await Promise.all(
        eventAddresses.map(async (eventAddress) => {
          const eventContract = getEventContract(eventAddress)
          const details = await eventContract.getEventDetails()

          // Calculate percentage for yes bets
          const totalYesBets = Number.parseFloat(ethers.formatUnits(details[4], 6))
          const totalNoBets = Number.parseFloat(ethers.formatUnits(details[5], 6))
          const totalBets = totalYesBets + totalNoBets
          const yesPercentage = totalBets > 0 ? Math.round((totalYesBets / totalBets) * 100) : 50

          // Generate a random image for demo purposes (replace with actual images in production)
          const images = [
            "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            "https://cryptologos.cc/logos/cardano-ada-logo.png",
            "https://cryptologos.cc/logos/solana-sol-logo.png",
          ]

          return {
            address: eventAddress,
            description: details[0],
            deadline: Number(details[1]),
            resolved: details[2],
            winningOption: details[3],
            totalYesBets: ethers.formatUnits(details[4], 6),
            totalNoBets: ethers.formatUnits(details[5], 6),
            yesPercentage,
            totalPool: totalYesBets + totalNoBets,
            image: images[Math.floor(Math.random() * images.length)],
            isHot: totalBets > 100, // Just for demo, mark some as "hot"
            isNew: Date.now() / 1000 - Number(details[1]) < 86400 * 3, // New if created in last 3 days
          }
        }),
      )

      setEvents(eventsWithDetails)
      setFilteredEvents(eventsWithDetails)
    } catch (error) {
      console.error("Error fetching events:", error)
      setError("Failed to load events. Please try again later." + error)
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh with animation
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchEvents().finally(() => {
      setTimeout(() => setIsRefreshing(false), 600)
    })
  }

  useEffect(() => {
    fetchEvents()

    // Set up polling for updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchEvents()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  // Filter and sort events when dependencies change
  useEffect(() => {
    let result = [...events]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((event) => event.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply category filter
    if (activeFilter === "active") {
      result = result.filter((event) => !event.resolved)
    } else if (activeFilter === "resolved") {
      result = result.filter((event) => event.resolved)
    } else if (activeFilter === "hot") {
      result = result.filter((event) => event.isHot)
    } else if (activeFilter === "new") {
      result = result.filter((event) => event.isNew)
    }

    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => b.deadline - a.deadline)
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.deadline - b.deadline)
    } else if (sortBy === "highestPool") {
      result.sort((a, b) => b.totalPool - a.totalPool)
    }

    setFilteredEvents(result)
  }, [events, searchTerm, activeFilter, sortBy])

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  // Filter button component
  const FilterButton = ({ label, value, icon }) => (
    <button
      onClick={() => setActiveFilter(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
        activeFilter === value
          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
          : "bg-[#1f273a] text-gray-300 hover:bg-[#262e44]"
      }`}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <div className="min-h-screen w-screen bg-[#0a0d14] text-white">
      {/* Hero section with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1033] to-[#0d1a33] py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Prediction Markets
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            Stake on real-world events and earn rewards. Browse available markets below and place your bets.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filter bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#131722] border border-[#1c2333] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className={`p-3 rounded-lg bg-[#1f273a] text-gray-300 hover:bg-[#262e44] transition-all duration-300 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              >
                <FaSyncAlt />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 rounded-lg bg-[#1f273a] text-gray-300 border border-[#1c2333] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highestPool">Highest Pool</option>
              </select>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <FilterButton label="All Markets" value="all" icon={<FaFilter />} />
            <FilterButton label="Active" value="active" icon={<FaClock />} />
            <FilterButton label="Resolved" value="resolved" icon={<FaChartLine />} />
            <FilterButton label="Hot" value="hot" icon={<FaFire />} />
            <FilterButton label="New" value="new" icon={<span className="text-yellow-400">★</span>} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-xl mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-blue-500 border-b-purple-500 border-l-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Loading markets...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#131722] border border-[#1c2333] rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-xl mb-2">No markets found</p>
            <p className="text-gray-500">Try changing your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#131722] border border-[#1c2333] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Markets</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {events.length}
                </p>
              </div>
              <div className="bg-[#131722] border border-[#1c2333] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Active Markets</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {events.filter((e) => !e.resolved).length}
                </p>
              </div>
              <div className="bg-[#131722] border border-[#1c2333] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Staked</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  $
                  {events
                    .reduce(
                      (acc, event) =>
                        acc + Number.parseFloat(event.totalYesBets) + Number.parseFloat(event.totalNoBets),
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-[#131722] border border-[#1c2333] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Avg. Pool Size</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  $
                  {(
                    events.reduce(
                      (acc, event) =>
                        acc + Number.parseFloat(event.totalYesBets) + Number.parseFloat(event.totalNoBets),
                      0,
                    ) / (events.length || 1)
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Markets grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <MarketCard
                  key={event.address}
                  data={{
                    ...event,
                    image: event.image,
                    description: event.description,
                    deadline: event.deadline,
                    resolved: event.resolved,
                    totalYesBets: event.totalYesBets,
                    totalNoBets: event.totalNoBets,
                    address: event.address,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination placeholder - could be implemented with actual pagination */}
        {filteredEvents.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1f273a] text-gray-300 hover:bg-[#262e44] transition-all duration-300">
                &lt;
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1f273a] text-gray-300 hover:bg-[#262e44] transition-all duration-300">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1f273a] text-gray-300 hover:bg-[#262e44] transition-all duration-300">
                3
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1f273a] text-gray-300 hover:bg-[#262e44] transition-all duration-300">
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#0d1017] border-t border-[#1c2333] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Prediction Markets
              </h3>
              <p className="text-gray-400 text-sm mt-1">Stake on real-world outcomes and earn rewards</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                FAQ
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#1c2333] text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Prediction Markets. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EventsList


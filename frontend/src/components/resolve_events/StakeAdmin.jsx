import { useState } from "react";
import { useSelector } from "react-redux";
import StatsCards from "./admin_components/StatsCards";
import SearchAndFilter from "./admin_components/SearchAndFilter";
import EventCardView from "./admin_components/EventCardView";
import EventTableView from "./admin_components/EventTableView";
import EventDetailsModal from "./admin_components/EventDetailsModal";
import Pagination from "./admin_components/Pagination";

const StakeAdmin = () => {
  const { bets, loading, error } = useSelector((state) => state.bets);
  const mockData = bets;
  const [search, setSearch] = useState("");
  const [filterResolved, setFilterResolved] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log(bets);

  // Convert timestamp to readable format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = deadline - now;

    if (remaining <= 0) return "Expired";

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);

    return `${days}d ${hours}h remaining`;
  };

  // Filter data based on search and filter
  const filteredData = mockData
    ? mockData.filter((item) => {
        const matchesSearch =
          item.address.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase());

        if (filterResolved === "all") return matchesSearch;
        if (filterResolved === "resolved")
          return matchesSearch && item.resolved;
        if (filterResolved === "unresolved")
          return matchesSearch && !item.resolved;

        return matchesSearch;
      })
    : [];

  // Calculate dashboard stats
  const totalEvents = mockData ? mockData.length : 0;
  const resolvedEvents = mockData
    ? mockData.filter((item) => item.resolved).length
    : 0;
  const totalYesBets = mockData
    ? mockData
        .reduce((sum, item) => sum + Number.parseFloat(item.totalYesBets), 0)
        .toFixed(2)
    : "0.00";
  const totalNoBets = mockData
    ? mockData
        .reduce((sum, item) => sum + Number.parseFloat(item.totalNoBets), 0)
        .toFixed(2)
    : "0.00";

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  console.log(viewMode === "table");

  const getTotalMarkets = (events) => {
    return events.length;
  };

  const getActiveMarkets = (events) => {
    const currentTime = new Date().getTime(); // Current time in milliseconds
    return events.filter((e) => !e.resolved && e.deadline * 1000 > currentTime)
      .length;
  };

  const getTotalResolved = (events) => {
    return events.filter((e) => e.resolved).length;
  };

  const getTotalPending = (events) => {
    const currentTime = new Date().getTime(); // Current time in milliseconds
    return events.filter(
      (e) => !e.resolved && e.deadline * 1000 <= currentTime
    ).length;
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full max-w-7xl mx-auto p-4 md:p-6 mt-[80px] text-white">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Staking Events Dashboard
        </h1>
        {/* <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <button
            className={`px-3 py-1.5 rounded-md ${viewMode === "card" ? "bg-purple-600" : "bg-gray-800"}`}
            onClick={() => setViewMode("card")}
          >
            Cards
          </button>
          <button
            className={`px-3 py-1.5 rounded-md ${viewMode === "table" ? "bg-purple-600" : "bg-gray-800"}`}
            onClick={() => setViewMode("table")}
          >
            Table
          </button>
        </div> */}
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalEvents={getTotalMarkets(mockData)}
        resolvedEvents={getTotalResolved(mockData)}
        activeEvents={getActiveMarkets(mockData)}
        pendingEvents={getTotalPending(mockData)}
      />

      {/* Search and Filter */}
      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        filterResolved={filterResolved}
        setFilterResolved={setFilterResolved}
      />

      {/* Content - Card View */}
      {viewMode === "card" && (
        <EventCardView
          filteredData={filteredData}
          formatDate={formatDate}
          getTimeRemaining={getTimeRemaining}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Content - Table View */}
      {viewMode === "table" && (
        <EventTableView
          filteredData={filteredData}
          formatDate={formatDate}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Pagination */}
      <Pagination
        filteredCount={filteredData.length}
        totalCount={mockData ? mockData.length : 0}
      />

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          formatDate={formatDate}
          getTimeRemaining={getTimeRemaining}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default StakeAdmin;

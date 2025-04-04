import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-800 mb-6">
      <button
        className={`py-2 px-4 font-medium text-sm ${
          activeTab === "chart"
            ? "text-green-400 border-b-2 border-green-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => setActiveTab("chart")}
      >
        Probability Chart
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm ${
          activeTab === "details"
            ? "text-green-400 border-b-2 border-green-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => setActiveTab("details")}
      >
        Event Details
      </button>
    </div>
  );
};

export default TabNavigation;
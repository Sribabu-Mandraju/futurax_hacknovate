import React from "react";

const EventDetails = ({ data }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDeadline = (seconds) => {
    if (!seconds || seconds <= 0) return "TBD";

    // Convert seconds to milliseconds (for Date object)
    const deadlineDate = new Date(Date.now() + seconds * 1000);

    // Format the date
    return deadlineDate.toLocaleString("en-US", {
      month: "long", // Example: "August"
      day: "numeric", // Example: "26"
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // Display time in 12-hour format
    });
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
      <h4 className="text-white font-medium mb-3">Event Information</h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Event ID:</span>
          <span className="text-white font-mono">
            {data?.id?.substring(0, 8) || "Not Available"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Contract Address:</span>
          <a
            href={`https://sepolia.etherscan.io/address/${data?.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-mono"
          >
            {data?.address?.substring(0, 6) +
              "..." +
              data?.address?.substring(38) || "Not Available"}
          </a>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Stakes:</span>
          <span className="text-white">
            {parseFloat(data?.totalYesBets) + parseFloat(data?.totalNoBets)}{" "}
            USDC
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">End Date:</span>
          <span className="text-white">
            {formatDate(data?.deadline) || "TBD"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

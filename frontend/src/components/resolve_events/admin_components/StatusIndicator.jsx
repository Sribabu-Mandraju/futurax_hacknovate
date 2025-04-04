import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const StatusIndicator = ({ status, deadline, tableView = false }) => {
  const [blink, setBlink] = useState(true);

  // Function to calculate time remaining
  const getTimeRemaining = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = deadline - now;
    return remaining <= 0 ? "Expired" : remaining;
  };

  useEffect(() => {
    if (!status) {
      const interval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [status]);

  const timeRemaining = getTimeRemaining(deadline);

  // Expired Status
  if (timeRemaining === "Expired" && !status) {
    return (
      <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
        Expired
      </div>
    );
  }

  // Resolved Status
  if (status) {
    return tableView ? (
      <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center justify-center">
        <FaCheckCircle className="mr-1" /> Resolved
      </div>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
        Resolved
      </span>
    );
  }

  // Active (Live) Status
  return tableView ? (
    <div className="flex items-center">
      <div
        className={`w-3 h-3 rounded-full mr-2 ${
          blink ? "bg-yellow-500" : "bg-yellow-300"
        }`}
      ></div>
      <span className="text-yellow-400 text-xs">Live</span>
    </div>
  ) : (
    <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
      <div
        className={`w-2 h-2 rounded-full mr-1.5 ${
          blink ? "bg-yellow-500" : "bg-yellow-300"
        }`}
      ></div>
      Active
    </div>
  );
};

export default StatusIndicator;

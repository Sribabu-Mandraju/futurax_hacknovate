import React from "react";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import StatusIndicator from "./StatusIndicator";

const EventTableView = ({ filteredData, formatDate, onViewDetails }) => {
  if (filteredData.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl text-center">
        <FaSearch className="mx-auto text-4xl text-gray-600 mb-3" />
        <h3 className="text-xl font-medium text-gray-400">No events found</h3>
        <p className="text-gray-500 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  // Card view for mobile screens
  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {filteredData.map((event, index) => (
        <div
          key={index}
          className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
        >
          <div className="p-4 flex items-center space-x-3 border-b border-gray-600">
            <img
              src={event.image || "/placeholder.svg"}
              alt="Event"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-white">{event.description}</h3>
              <p className="text-purple-400 font-mono text-xs mt-1">
                {event.address.substring(0, 10)}...
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Deadline:</span>
              <span className="text-gray-200">
                {formatDate(event.deadline)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              {event.resolved ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                  <FaCheckCircle className="mr-1" /> Resolved
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                  <FaTimesCircle className="mr-1" /> Active
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">YES Bets:</span>
              <span className="text-green-400">{event.totalYesBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">NO Bets:</span>
              <span className="text-red-400">{event.totalNoBets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Resolved:</span>
              <StatusIndicator
                status={event.resolved}
                deadline={event.deadline}
                tableView={true}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-750 flex justify-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center justify-center w-full"
              onClick={() => onViewDetails(event)}
            >
              <FaEye className="mr-2" /> View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Table view for larger screens
  const renderTableView = () => (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="w-full text-left">
        <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <tr>
            <th className="p-3">Event</th>
            <th className="p-3">Address</th>
            <th className="p-3">Deadline</th>
            <th className="p-3">Status</th>
            <th className="p-3">YES Bets</th>
            <th className="p-3">NO Bets</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredData.map((event, index) => (
            <tr key={index} className="hover:bg-gray-700 transition-colors">
              <td className="p-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt="Event"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="font-medium truncate max-w-[150px] lg:max-w-none">
                    {event.description.length > 25
                      ? event.description.substring(0, 25) + "..."
                      : event.description}
                  </span>
                </div>
              </td>
              <td className="p-3 text-purple-400 font-mono text-sm">
                {event.address.substring(0, 10)}...
              </td>
              <td className="p-3 text-sm">{formatDate(event.deadline)}</td>
              <td className="p-3">
                {event.resolved ? (
                  // Resolved Status
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    <FaCheckCircle className="mr-1" /> Resolved
                  </span>
                ) : event.deadline * 1000 < Date.now() ? (
                  // Expired Status
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                    <FaTimesCircle className="mr-1" /> Pending
                  </span>
                ) : (
                  // Active Status
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                    <FaTimesCircle className="mr-1" /> Active
                  </span>
                )}
              </td>
              <td className="p-3 text-green-400">{event.totalYesBets}</td>
              <td className="p-3 text-red-400">{event.totalNoBets}</td>
              {/* <td className="p-3">
                <StatusIndicator status={event.resolved} tableView={true} />
              </td> */}
              <td className="p-3">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => onViewDetails(event)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 p-2 sm:p-4">
      {renderMobileView()}
      {renderTableView()}
    </div>
  );
};

export default EventTableView;

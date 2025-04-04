import {
  FaChartLine,
  FaCheckCircle,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { MdOutlinePendingActions } from "react-icons/md";

const StatsCards = ({
  totalEvents,
  resolvedEvents,
  activeEvents,
  pendingEvents,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Events</p>
            <h3 className="text-2xl font-bold text-white">{totalEvents}</h3>
          </div>
          <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
            <FaChartLine className="text-purple-400 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Resolved Events</p>
            <h3 className="text-2xl font-bold text-white">{resolvedEvents}</h3>
          </div>
          <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
            <FaCheckCircle className="text-blue-400 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Events</p>
            <h3 className="text-2xl font-bold text-green-400">
              {activeEvents}
            </h3>
          </div>
          <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
            <IoIosTime className="text-green-400 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Pending Events</p>
            <h3 className="text-2xl font-bold text-red-400">{pendingEvents}</h3>
          </div>
          <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg">
            <MdOutlinePendingActions className="text-red-400 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;

import { FaEthereum, FaCalendarAlt, FaSearch } from "react-icons/fa"
import StatusIndicator from "./StatusIndicator"

const EventCardView = ({ filteredData, formatDate, getTimeRemaining, onViewDetails }) => {
  if (filteredData.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl text-center">
        <FaSearch className="mx-auto text-4xl text-gray-600 mb-3" />
        <h3 className="text-xl font-medium text-gray-400">No events found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredData.map((event, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
        >
          <div className="h-32 overflow-hidden relative">
            <img src={event.image || "/placeholder.svg"} alt="Event" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            <div className="absolute bottom-2 left-3">
              <StatusIndicator status={event.resolved} />
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">{event.description}</h3>

            <div className="flex items-center text-sm text-gray-400 mb-3">
              <FaEthereum className="mr-1" />
              <span className="truncate">{event.address}</span>
            </div>

            <div className="flex items-center text-sm text-gray-400 mb-3">
              <FaCalendarAlt className="mr-1" />
              <span>{formatDate(event.deadline)}</span>
            </div>

            {!event.resolved && <div className="text-xs text-yellow-400 mb-3">{getTimeRemaining(event.deadline)}</div>}

            {event.resolved && (
              <div className="flex items-center mb-3">
                <span className="text-sm mr-2">Winner:</span>
                {event.winningOption ? (
                  <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">YES</span>
                ) : (
                  <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">NO</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-gray-700 p-2 rounded-lg">
                <div className="text-xs text-gray-400">YES Bets</div>
                <div className="text-green-400 font-medium">{event.totalYesBets}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded-lg">
                <div className="text-xs text-gray-400">NO Bets</div>
                <div className="text-red-400 font-medium">{event.totalNoBets}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                onClick={() => onViewDetails(event)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventCardView


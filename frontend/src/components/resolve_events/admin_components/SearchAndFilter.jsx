import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa"

const SearchAndFilter = ({ search, setSearch, filterResolved, setFilterResolved }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address or description..."
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-gray-700 rounded-lg flex items-center px-3">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              className="bg-gray-700 text-white py-2 focus:outline-none"
              value={filterResolved}
              onChange={(e) => setFilterResolved(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center">
            <FaSortAmountDown className="mr-2" />
            <span>Sort</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilter


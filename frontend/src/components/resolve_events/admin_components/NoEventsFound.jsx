import { FaSearch } from "react-icons/fa"

const NoEventsFound = () => {
  return (
    <div className="col-span-full bg-gray-800 p-6 rounded-xl text-center">
      <FaSearch className="mx-auto text-4xl text-gray-600 mb-3" />
      <h3 className="text-xl font-medium text-gray-400">No events found</h3>
      <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
    </div>
  )
}

export default NoEventsFound


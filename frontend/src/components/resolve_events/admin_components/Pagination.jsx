const Pagination = ({ filteredCount, totalCount }) => {
    return (
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {filteredCount} of {totalCount} events
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700">Previous</button>
          <button className="px-3 py-1 bg-purple-600 rounded-md">1</button>
          <button className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700">2</button>
          <button className="px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700">Next</button>
        </div>
      </div>
    )
  }
  
  export default Pagination
  
  
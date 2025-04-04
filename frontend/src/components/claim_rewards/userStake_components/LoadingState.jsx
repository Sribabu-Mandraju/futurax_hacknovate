const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-purple-600/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-cyan-400 animate-spin"></div>
      </div>
      <p className="text-lg bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   bg-clip-text text-transparent font-medium">
        Loading your stakes...
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Please wait while we fetch your data
      </p>
    </div>
  );
};

export default LoadingState;

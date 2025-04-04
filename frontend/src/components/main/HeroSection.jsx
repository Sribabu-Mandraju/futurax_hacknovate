import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMarket, setActiveMarket] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const markets = [
    { name: "Will Bitcoin's price decline to $73,000 by the end of this month, marking a significant market correction?", probability: 68, change: 2.4, volume: "1.2K " },
    { name: "Will Shah Rukh Khan Announce His Next Film Before 1:00AM IST on 6th April 2025?", probability: 42, change: -1.8, volume: "3.4k" },
    { name: "Will Trump's call with Putin lead to progress in Ukraine peace talks?", probability: 73, change: 5.2, volume: "1.4K" },
    {
      name: "SpaceX Mars Landing",
      probability: 31,
      change: -0.7,
      volume: "2.1k",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const marketRotation = setInterval(() => {
      setActiveMarket((prev) => (prev + 1) % markets.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(marketRotation);
    };
  }, []);

  return (
    <div className=" border-red-600 sm:pb-20 px-4 mt-[80px] relative overflow-hidden bg-gray-900">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-600/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-2/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute  inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto relative z-10">
        {/* Top stats bar */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-lg p-2 mb-4 mt-2  sm:mb-4 border border-gray-700/50 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm overflow-x-auto">
            <div className="px-4 py-1 flex items-center mb-2 sm:mb-0">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-gray-400">Live</span>
              <span className="ml-2 text-gray-300">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 px-4 sm:px-0">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">BTC</span>
                <span className="text-gray-200">$84,571.66</span>
                <span className="text-green-400 ml-1">+2.4%</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">ETH</span>
                <span className="text-gray-200">$1,946.28</span>
                <span className="text-red-400 ml-1">-0.8%</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Active Traders</span>
                <span className="text-gray-200">12,845</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">24h Volume</span>
                <span className="text-gray-200">$24.3M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="flex w-full max-w-7xl mx-auto flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          {/* Left side - Main content */}
          <div
            className={`w-full lg:w-1/2 transition-all duration-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">
              Predict the Future, Trade with Confidence
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
              The next generation prediction market platform where you can trade
              on future events with real-time data, AI-powered insights, and
              unmatched liquidity.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#trending" className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-base sm:text-lg py-3 px-6 rounded-md flex items-center justify-center shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40">
                Start Trading
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="markets" className="border border-gray-700 hover:bg-gray-800 text-gray-200 text-base sm:text-lg py-3 px-6 rounded-md transition-all">
                Explore Markets
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Total Markets
                </p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  1,200+
                </p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                <p className="text-gray-400 text-xs sm:text-sm">Total Volume</p>
                <p className="text-lg sm:text-xl font-bold text-white">$120M</p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                <p className="text-gray-400 text-xs sm:text-sm">Avg. Return</p>
                <p className="text-lg sm:text-xl font-bold text-green-400">
                  +18.4%
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-400">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-sm">Regulated</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Market preview */}
          <div
            className={`w-full lg:w-1/2 transition-all duration-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
              {/* Market header */}
              <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Trending Markets
                  </h3>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-md hover:bg-gray-700 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18M3 12h18M3 18h18" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-700 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured market */}
              <div className="p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-white">
                      {markets[activeMarket].name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      Expires Apr 10, 2025
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg px-2 py-1 self-start">
                    <span className="text-xs sm:text-sm text-gray-300">
                      Volume: {markets[activeMarket].volume}
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-3 mb-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">
                      Current Probability
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      {markets[activeMarket].probability}%
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs ${
                      markets[activeMarket].change > 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {markets[activeMarket].change > 0 ? "+" : ""}
                    {markets[activeMarket].change}%
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="h-24 sm:h-32 bg-gray-800/60 rounded-lg mb-4 overflow-hidden">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path
                      d="M0,50 C50,30 100,60 150,40 C200,20 250,70 300,50 C350,30 400,40 400,50"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-md font-medium transition-colors">
                    Buy YES
                  </button>
                  <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-md font-medium transition-colors">
                    Buy NO
                  </button>
                </div>
              </div>

              {/* Market list */}
              <div className="p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-400 grid grid-cols-12 gap-2 sm:gap-4 mb-2 px-2">
                  <div className="col-span-6">Market</div>
                  <div className="col-span-3 text-right">Prob.</div>
                  <div className="col-span-3 text-right">Volume</div>
                </div>

                {markets.map((market, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      activeMarket === index
                        ? "bg-gray-700/50"
                        : "hover:bg-gray-700/30"
                    }`}
                    onClick={() => setActiveMarket(index)}
                  >
                    <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                      <div className="col-span-6 font-medium text-gray-200 text-xs sm:text-sm truncate">
                        {market.name}
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-white text-xs sm:text-sm">
                          {market.probability}%
                        </span>
                        <span
                          className={`ml-1 text-xs ${
                            market.change > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {market.change > 0 ? "+" : ""}
                          {market.change}%
                        </span>
                      </div>
                      <div className="col-span-3 text-right text-gray-300 text-xs sm:text-sm">
                        {market.volume}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS to support extra small screens
// @media (min-width: 475px) {
//   .xs\:grid-cols-3 {
//     grid-template-columns: repeat(3, minmax(0, 1fr));
//   }
// }
import React, { useState, useEffect } from "react";
import { TrendingUp, Coins, Award, Activity, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
const markets = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?w=800&auto=format&fit=crop&q=60",
    title: "ETH flipped in 2025?",
    probability: 26,
    category: "Finance",
    volume: "1.2M",
    traders: 450,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop&q=60",
    title: "Bitcoin reaches $100K?",
    probability: 40,
    category: "Finance",
    volume: "2.5M",
    traders: 890,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800&auto=format&fit=crop&q=60",
    title: "Apple launches AR glasses?",
    probability: 55,
    category: "Tech",
    volume: "800K",
    traders: 320,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1617886753890-d8cd20954125?w=800&auto=format&fit=crop&q=60",
    title: "Tesla releases a flying car?",
    probability: 15,
    category: "Tech",
    volume: "1.5M",
    traders: 670,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    title: "Ethereum 2.0 fully deployed?",
    probability: 72,
    category: "Finance",
    volume: "3.2M",
    traders: 1200,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
    title: "Stock market crashes in 2025?",
    probability: 33,
    category: "Finance",
    volume: "4.1M",
    traders: 1500,
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    title: "Google AI beats humans in coding?",
    probability: 10,
    category: "Tech",
    volume: "900K",
    traders: 420,
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=60",
    title: "SpaceX lands humans on Mars?",
    probability: 12,
    category: "Tech",
    volume: "2.8M",
    traders: 980,
  },
];

const categories = ["All", "Finance", "Tech", "Politics", "Sports"];

function MarketCard({ market, onBuy, onSell }) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-gray-700">
      <div className="relative h-40">
        <img
          src={market.image}
          alt={market.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
          <span className="text-sm bg-gray-800/80 px-2 py-1 rounded-full">
            {market.category}
          </span>
          <div className="flex items-center gap-2 bg-gray-800/80 px-2 py-1 rounded-full">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{market.volume}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{market.title}</h3>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-400">
              {market.traders} traders
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {market.probability}% probability
            </span>
          </div>
        </div>

        <div className="relative w-full h-2 bg-gray-700 rounded-full mb-4">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{ width: `${market.probability}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onBuy(market)}
            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
          >
            Buy Yes
          </button>
          <button
            onClick={() => onSell(market)}
            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Buy No
          </button>
        </div>
      </div>
    </div>
  );
}

function Predictions() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("probability");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate=useNavigate();


  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuy = (market) => {
    showToast(`Buying Yes for "${market.title}"`);
  };

  const handleSell = (market) => {
    showToast(`Buying No for "${market.title}"`);
  };

  const filteredMarkets = markets
    .filter((market) => {
      const matchesCategory =
        selectedCategory === "All" || market.category === selectedCategory;
      const matchesSearch = market.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "probability") return b.probability - a.probability;
      if (sortBy === "volume") return parseInt(b.volume) - parseInt(a.volume);
      if (sortBy === "traders") return b.traders - a.traders;
      return 0;
    });

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto mt-[80px] text-white py-8 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">
              Prediction Markets
            </h2>
            <p className="text-gray-400 mt-2">
              Trade on your beliefs about future events
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            <option value="probability">Sort by Probability</option>
            <option value="volume">Sort by Volume</option>
            <option value="traders">Sort by Traders</option>
          </select>
        </div>
      </div>

      {/* Market Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No markets found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-2xl mx-auto text-center mt-16 bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to start predicting?
        </h3>
        <p className="text-gray-400 mb-6">
          Join thousands of traders profiting from their predictions.
        </p>
        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 font-bold" onClick={()=>navigate("/markets")}>
          Enter Market
        </button>
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {notificationMessage}
        </div>
      )}
    </div>
  );
}

export default Predictions;

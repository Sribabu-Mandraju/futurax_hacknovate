import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MarketCard from "../../market/MarketCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchBets } from "../../../store/slices/betsSlice";
import { useNavigate } from "react-router-dom";
const markets = [
  {
    image: "https://via.placeholder.com/40",
    title: "ETH flipped in 2025?",
    probability: 26,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Bitcoin reaches $100K?",
    probability: 40,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Apple launches AR glasses?",
    probability: 55,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Tesla releases a flying car?",
    probability: 15,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Ethereum 2.0 fully deployed?",
    probability: 72,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Stock market crashes in 2025?",
    probability: 33,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "Google AI beats humans in coding?",
    probability: 10,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
  {
    image: "https://via.placeholder.com/40",
    title: "SpaceX lands humans on Mars?",
    probability: 12,
    buyText: "Buy Yes",
    sellText: "Buy No",
  },
];

const categories = ["All", "Finance", "Sports", "Politics"];

function MarketSection() {
  const dispatch = useDispatch();
  const { loading, error, bets } = useSelector((state) => state.bets);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBets()); // Dispatching fetchEvents on component mount
  }, [dispatch]);
  console.log(bets);
  const [selectedCategory, setSelectedCategory] = useState("All");  

  const filteredMarkets =
    selectedCategory === "All"
      ? markets
      : markets.filter((market) => market.category === selectedCategory);
  if (loading) return <SkeletonLoader />;
  return (
    <div className=" text-white w-full max-w-7xl mx-auto " id="trending">
      <div className=" mb-8 text-center mt-4">
        <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent  bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">
          Simple Steps to Start Predicting
        </h2>
        <p className="text-gray-400 mt-2">
          Get started with prediction markets in just a few steps.
        </p>
      </div>

      {/* <div className="flex justify-center gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-[12px] rounded-full ${
                selectedCategory === category
                  ? "bg-gradient-to-br from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                  : "bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

      <div className="grid grid-cols-1 w-[95%] md:full mx-auto sm:grid-cols-2 md:grid-cols-3 gap-2 ">
        {(bets.length > 6 ? bets.slice(0, 6) : bets).map((data, index) => (
          <motion.div
            key={index}
            // whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          >
            <MarketCard data={data} />
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <h3 className="text-2xl font-semibold">Ready to start predicting?</h3>
        <p className="text-gray-400 mt-2">
          Join thousands of traders profiting from their predictions.
        </p>
        <button
          className="mt-4 bg-blue-500 px-6 py-2 rounded bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-2xl"
          onClick={() => navigate("/markets")}
        >
          Enter Market
        </button>
      </div>
    </div>
  );
}
export default MarketSection;

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] animate-pulse"
        >
          {/* Icon Placeholder */}
          <div className="w-10 h-10 bg-gray-700 rounded-md mb-3"></div>

          {/* Title Placeholder */}
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>

          {/* Description Placeholder */}
          <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6 mb-3"></div>

          {/* Progress Bar Placeholder */}
          <div className="h-3 w-1/2 bg-gray-700 rounded my-3"></div>

          {/* Buttons Placeholder */}
          <div className="flex justify-between mt-4">
            <div className="w-1/3 h-8 bg-gray-700 rounded"></div>
            <div className="w-1/3 h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

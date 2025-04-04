import { useState, useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import "chart.js/auto"

export default function MarketPlace() {
  const [amount, setAmount] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState("Winnipeg Jets")
  const [betType, setBetType] = useState(null) // "yes" or "no"
  const [userBalance, setUserBalance] = useState(1000)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [notification, setNotification] = useState(null)
  const [recentTrades, setRecentTrades] = useState([])
  const [marketData, setMarketData] = useState({})
  const [showMobileTradePanel, setShowMobileTradePanel] = useState(false)

  // Initialize market data for each team
  useEffect(() => {
    const initialMarketData = {}
    teams.forEach((team) => {
      initialMarketData[team.name] = {
        yesPrice: team.yesPrice,
        noPrice: team.noPrice,
        volume: team.volume,
        history: generateRandomPriceHistory(team.yesPrice),
      }
    })
    setMarketData(initialMarketData)

    // Set up interval to simulate real-time price changes
    const interval = setInterval(() => {
      setMarketData((prevData) => {
        const newData = { ...prevData }
        teams.forEach((team) => {
          // Simulate small price movements
          const yesChange = (Math.random() - 0.5) * 2
          let newYesPrice = Number.parseFloat((prevData[team.name].yesPrice + yesChange).toFixed(1))
          // Keep prices within reasonable bounds
          newYesPrice = Math.max(1, Math.min(99, newYesPrice))
          const newNoPrice = Number.parseFloat((100 - newYesPrice).toFixed(1))

          // Add new price point to history
          const newHistory = [...prevData[team.name].history.slice(1), newYesPrice]

          newData[team.name] = {
            ...prevData[team.name],
            yesPrice: newYesPrice,
            noPrice: newNoPrice,
            history: newHistory,
          }
        })
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Generate random trades
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new trade
        const randomTeam = teams[Math.floor(Math.random() * teams.length)]
        const isYes = Math.random() > 0.5
        const randomAmount = Math.floor(Math.random() * 500) + 10

        const newTrade = {
          id: Date.now(),
          team: randomTeam.name,
          type: isYes ? "Yes" : "No",
          price: isYes ? marketData[randomTeam.name]?.yesPrice : marketData[randomTeam.name]?.noPrice,
          amount: randomAmount,
          time: new Date().toLocaleTimeString(),
        }

        setRecentTrades((prev) => [newTrade, ...prev].slice(0, 10))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [marketData])

  const placeBet = () => {
    if (!isLoggedIn) {
      setNotification({
        type: "error",
        message: "Please log in to place a bet",
      })
      return
    }

    if (amount <= 0) {
      setNotification({
        type: "error",
        message: "Please enter a valid amount",
      })
      return
    }

    if (!betType) {
      setNotification({
        type: "error",
        message: "Please select Yes or No",
      })
      return
    }

    if (amount > userBalance) {
      setNotification({
        type: "error",
        message: "Insufficient balance",
      })
      return
    }

    // Process the bet
    setUserBalance((prev) => prev - amount)

    const newTrade = {
      id: Date.now(),
      team: selectedTeam,
      type: betType === "yes" ? "Yes" : "No",
      price: betType === "yes" ? marketData[selectedTeam]?.yesPrice : marketData[selectedTeam]?.noPrice,
      amount: amount,
      time: new Date().toLocaleTimeString(),
      isUser: true,
    }

    setRecentTrades((prev) => [newTrade, ...prev].slice(0, 10))

    setNotification({
      type: "success",
      message: `Successfully placed ${betType === "yes" ? "Yes" : "No"} bet on ${selectedTeam} for $${amount}`,
    })

    // Reset bet form
    setAmount(0)
    setBetType(null)
    setShowMobileTradePanel(false)
  }

  const login = () => {
    setIsLoggedIn(true)
    setNotification({
      type: "success",
      message: "Successfully logged in",
    })
  }

  // Helper function to generate random price history
  function generateRandomPriceHistory(currentPrice) {
    const history = []
    for (let i = 0; i < 20; i++) {
      // Generate prices that trend toward the current price
      const factor = i / 20 // How close we are to the current time
      const randomVariance = (Math.random() - 0.5) * 20 * (1 - factor)
      const baseValue = 50 // Middle point
      const value = baseValue + randomVariance + (currentPrice - baseValue) * factor
      history.push(Number.parseFloat(Math.max(1, Math.min(99, value)).toFixed(1)))
    }
    return history
  }

  return (
    <div className="bg-gray-900 mt-[80px] text-white min-h-screen">
 

   

      {/* Mobile Trade Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setShowMobileTradePanel(!showMobileTradePanel)}
          className="bg-blue-600 p-4 rounded-full shadow-lg"
        >
          {showMobileTradePanel ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-3">
            <MarketOverview setSelectedTeam={setSelectedTeam} selectedTeam={selectedTeam} marketData={marketData} />
          </div>

          {/* Desktop Trade Panel */}
          <div className="hidden md:block">
            <TradePanel
              amount={amount}
              setAmount={setAmount}
              team={selectedTeam}
              betType={betType}
              setBetType={setBetType}
              placeBet={placeBet}
              isLoggedIn={isLoggedIn}
              userBalance={userBalance}
              marketData={marketData}
            />
          </div>

          {/* Recent Trades */}
          <div className="lg:col-span-3">
            <RecentTrades trades={recentTrades} />
          </div>
        </div>
      </main>

      {/* Mobile Trade Panel */}
      {showMobileTradePanel && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-90 z-10 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <TradePanel
              amount={amount}
              setAmount={setAmount}
              team={selectedTeam}
              betType={betType}
              setBetType={setBetType}
              placeBet={placeBet}
              isLoggedIn={isLoggedIn}
              userBalance={userBalance}
              marketData={marketData}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Market Overview Component
function MarketOverview({ setSelectedTeam, selectedTeam, marketData }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          President's Trophy Winner
        </h2>

        <div className="flex flex-wrap items-center justify-between mt-2">
          <p className="text-gray-400 text-sm">
            <span className="text-green-400">$47,495,712</span> 24h Volume
          </p>
          <div className="flex space-x-2 text-sm">
            <span className="bg-gray-700 px-2 py-1 rounded">1D</span>
            <span className="bg-blue-600 px-2 py-1 rounded">1W</span>
            <span className="bg-gray-700 px-2 py-1 rounded">1M</span>
            <span className="bg-gray-700 px-2 py-1 rounded">ALL</span>
          </div>
        </div>
      </div>

      {/* Real-time Graph */}
      <div className="px-6 pb-6">
        <LiveChart selectedTeam={selectedTeam} marketData={marketData} />
      </div>

      {/* Outcome List */}
      <div className="border-t border-gray-700">
        <div className="p-4 bg-gray-750 text-sm grid grid-cols-12 font-medium">
          <div className="col-span-5 sm:col-span-6">Team</div>
          <div className="col-span-3 sm:col-span-2 text-center">Yes</div>
          <div className="col-span-3 sm:col-span-2 text-center">No</div>
          <div className="hidden sm:block sm:col-span-2 text-right">24h Chg</div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {teams.map((team) => (
            <OutcomeRow
              key={team.name}
              team={team}
              setSelectedTeam={setSelectedTeam}
              isSelected={team.name === selectedTeam}
              marketData={marketData}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Outcome Row Component
function OutcomeRow({ team, setSelectedTeam, isSelected, marketData }) {
  const teamData = marketData[team.name] || team
  const priceChange = (((teamData.yesPrice - team.yesPrice) / team.yesPrice) * 100).toFixed(1)
  const isPositive = Number.parseFloat(priceChange) >= 0

  return (
    <div
      className={`grid grid-cols-12 items-center py-3 px-4 cursor-pointer hover:bg-gray-750 border-b border-gray-700 transition-colors ${
        isSelected ? "bg-gray-750" : ""
      }`}
      onClick={() => setSelectedTeam(team.name)}
    >
      <div className="col-span-5 sm:col-span-6 flex items-center">
        <img
          src={team.logo || `/placeholder.svg?height=24&width=24`}
          alt={team.name}
          className="w-6 h-6 mr-2 rounded-full"
        />
        <span className="font-medium truncate">{team.name}</span>
      </div>

      <div className="col-span-3 sm:col-span-2 text-center">
        <span className="inline-block bg-green-900 bg-opacity-30 text-green-400 px-2 py-1 rounded text-sm">
          {teamData.yesPrice}¢
        </span>
      </div>

      <div className="col-span-3 sm:col-span-2 text-center">
        <span className="inline-block bg-red-900 bg-opacity-30 text-red-400 px-2 py-1 rounded text-sm">
          {teamData.noPrice}¢
        </span>
      </div>

      <div className={`hidden sm:block sm:col-span-2 text-right ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}
        {priceChange}%
      </div>
    </div>
  )
}

// Trade Panel Component
function TradePanel({ amount, setAmount, team, betType, setBetType, placeBet, isLoggedIn, userBalance, marketData }) {
  const teamData = marketData[team] || { yesPrice: 50, noPrice: 50 }

  // Calculate potential profit
  const calculateProfit = () => {
    if (!betType || amount <= 0) return 0

    const price = betType === "yes" ? teamData.yesPrice : teamData.noPrice
    // If price is 75¢, then $100 would return $133.33 (100/0.75)
    const potentialReturn = amount / (price / 100)
    return potentialReturn - amount
  }

  const profit = calculateProfit()

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <img
            src={teams.find((t) => t.name === team)?.logo || `/placeholder.svg?height=24&width=24`}
            alt={team}
            className="w-6 h-6 mr-2 rounded-full"
          />
          {team}
        </h3>
        {isLoggedIn && (
          <div className="text-sm text-gray-400">
            Balance: <span className="text-white font-medium">${userBalance.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="bg-gray-750 p-4 rounded-lg mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Current Price</span>
          <span>Potential Profit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xl font-bold">
            {betType === "yes" ? teamData.yesPrice : betType === "no" ? teamData.noPrice : "--"}¢
          </span>
          <span className={`text-xl font-bold ${profit > 0 ? "text-green-400" : "text-gray-400"}`}>
            {profit > 0 ? `+$${profit.toFixed(2)}` : "$0.00"}
          </span>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className={`w-1/2 py-3 rounded-lg font-medium transition-colors ${
            betType === "yes"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-900 bg-opacity-30 hover:bg-opacity-50 text-green-400"
          }`}
          onClick={() => setBetType("yes")}
        >
          Yes ({teamData.yesPrice}¢)
        </button>
        <button
          className={`w-1/2 py-3 rounded-lg font-medium transition-colors ${
            betType === "no"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-900 bg-opacity-30 hover:bg-opacity-50 text-red-400"
          }`}
          onClick={() => setBetType("no")}
        >
          No ({teamData.noPrice}¢)
        </button>
      </div>

      {/* Amount Selector */}
      <div className="mb-4">
        <div className="flex justify-between">
          <label className="text-sm text-gray-400 mb-1">Amount</label>
          {amount > 0 && (
            <button onClick={() => setAmount(0)} className="text-sm text-blue-400 hover:text-blue-300">
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Math.max(0, Number.parseFloat(e.target.value) || 0))}
            className="bg-gray-750 p-3 pl-8 rounded-lg w-full text-xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[10, 50, 100, 500].map((val) => (
          <button
            key={val}
            onClick={() => setAmount((prev) => prev + val)}
            className="bg-gray-700 hover:bg-gray-650 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            +${val}
          </button>
        ))}
        <button
          onClick={() => setAmount(userBalance)}
          className="bg-gray-700 hover:bg-gray-650 px-3 py-2 rounded-lg text-sm transition-colors"
        >
          Max
        </button>
      </div>

      <button
        onClick={placeBet}
        disabled={!betType || amount <= 0}
        className={`w-full py-3 rounded-lg font-medium text-center transition-colors ${
          !betType || amount <= 0
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : betType === "yes"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {!isLoggedIn
          ? "Login to Trade"
          : !betType
            ? "Select Yes or No"
            : amount <= 0
              ? "Enter Amount"
              : `Place ${betType === "yes" ? "Yes" : "No"} Bet`}
      </button>

      <p className="text-xs text-gray-400 mt-3 text-center">
        By trading, you agree to the <span className="underline cursor-pointer hover:text-gray-300">Terms of Use</span>.
      </p>
    </div>
  )
}

// Live Chart Component
function LiveChart({ selectedTeam, marketData }) {
  const chartRef = useRef(null)

  const teamData = marketData[selectedTeam]
  if (!teamData) {
    return (
      <div className="h-64 bg-gray-750 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Loading chart data...</p>
      </div>
    )
  }

  const priceHistory = teamData.history

  // Generate time labels (last 20 minutes)
  const generateTimeLabels = () => {
    const labels = []
    const now = new Date()
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now)
      time.setMinutes(now.getMinutes() - i)
      labels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    return labels
  }

  const data = {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: "Yes Price",
        data: priceHistory,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(75, 85, 99, 0.5)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `Price: ${context.raw}¢`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(156, 163, 175, 0.7)",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        min: Math.max(0, Math.min(...priceHistory) - 10),
        max: Math.min(100, Math.max(...priceHistory) + 10),
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(156, 163, 175, 0.7)",
          callback: (value) => value + "¢",
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  return (
    <div className="h-64 bg-gray-750 rounded-lg p-2">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}

// Recent Trades Component
function RecentTrades({ trades }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-bold">Recent Trades</h3>
        <span className="text-sm text-gray-400">Last 24 hours</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-750 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
              trades.map((trade) => (
                <tr
                  key={trade.id}
                  className={`border-b border-gray-700 text-sm ${trade.isUser ? "bg-blue-900 bg-opacity-20" : ""}`}
                >
                  <td className="py-3 px-4">{trade.time}</td>
                  <td className="py-3 px-4 max-w-[150px] truncate">{trade.team}</td>
                  <td className={`py-3 px-4 ${trade.type === "Yes" ? "text-green-400" : "text-red-400"}`}>
                    {trade.type}
                  </td>
                  <td className="py-3 px-4 text-right">{trade.price}¢</td>
                  <td className="py-3 px-4 text-right">${trade.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No recent trades
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Sample Team Data
const teams = [
  {
    name: "Washington Capitals",
    yesPrice: 55,
    noPrice: 45,
    volume: 1245000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Winnipeg Jets",
    yesPrice: 39,
    noPrice: 61,
    volume: 987000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Dallas Stars",
    yesPrice: 8.1,
    noPrice: 91.9,
    volume: 456000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Boston Bruins",
    yesPrice: 72.5,
    noPrice: 27.5,
    volume: 1890000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Colorado Avalanche",
    yesPrice: 61.2,
    noPrice: 38.8,
    volume: 1567000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Tampa Bay Lightning",
    yesPrice: 48.3,
    noPrice: 51.7,
    volume: 1123000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Toronto Maple Leafs",
    yesPrice: 35.7,
    noPrice: 64.3,
    volume: 2145000,
    logo: "/placeholder.svg?height=24&width=24",
  },
  {
    name: "Vegas Golden Knights",
    yesPrice: 42.9,
    noPrice: 57.1,
    volume: 1678000,
    logo: "/placeholder.svg?height=24&width=24",
  },
]


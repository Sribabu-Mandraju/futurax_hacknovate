import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, ArrowRight, BarChart2, Zap, DollarSign, ChevronDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PredictionMarketLanding() {
  const [scrollY, setScrollY] = useState(0)
  const navigate =useNavigate();
  const [activeMarkets, setActiveMarkets] = useState([
    {
      id: 1,
      title: "Bitcoin above $100k by 2025",
      probability: 78,
      volume: "$2.4M",
      trend: "up",
      data: [
        { name: "Jan", value: 65 },
        { name: "Feb", value: 59 },
        { name: "Mar", value: 62 },
        { name: "Apr", value: 68 },
        { name: "May", value: 71 },
        { name: "Jun", value: 75 },
        { name: "Jul", value: 78 },
      ],
    },
    {
      id: 2,
      title: "AI regulation passed in EU by 2024",
      probability: 45,
      volume: "$1.2M",
      trend: "down",
      data: [
        { name: "Jan", value: 55 },
        { name: "Feb", value: 58 },
        { name: "Mar", value: 52 },
        { name: "Apr", value: 48 },
        { name: "May", value: 46 },
        { name: "Jun", value: 44 },
        { name: "Jul", value: 45 },
      ],
    },
    {
      id: 3,
      title: "SpaceX Mars landing by 2026",
      probability: 32,
      volume: "$3.7M",
      trend: "up",
      data: [
        { name: "Jan", value: 25 },
        { name: "Feb", value: 24 },
        { name: "Mar", value: 26 },
        { name: "Apr", value: 28 },
        { name: "May", value: 30 },
        { name: "Jun", value: 31 },
        { name: "Jul", value: 32 },
      ],
    },
  ])

  const [topTraders, setTopTraders] = useState([
    {
      id: 1,
      username: "futurist_prime",
      profit: "$245,320",
      accuracy: "92%",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      username: "prediction_guru",
      profit: "$187,650",
      accuracy: "88%",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      username: "market_wizard",
      profit: "$142,980",
      accuracy: "85%",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      username: "oracle_trader",
      profit: "$98,540",
      accuracy: "79%",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Alex Chen",
      role: "Crypto Analyst",
      content:
        "This platform has revolutionized how I think about future events. The liquidity and market efficiency are unmatched.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Day Trader",
      content:
        "I've been using prediction markets for years, but this platform takes it to another level with its intuitive UI and deep liquidity.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Michael Wong",
      role: "Hedge Fund Manager",
      content:
        "The real-time data and analytics provided here give me an edge in understanding market sentiment across various domains.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400">
              PredictX
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#markets" className="hover:text-cyan-400 transition-colors">
              Markets
            </a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
              How It Works
            </a>
            <a href="#leaderboard" className="hover:text-cyan-400 transition-colors">
              Leaderboard
            </a>
            <a href="#community" className="hover:text-cyan-400 transition-colors">
              Community
            </a>
          </div>
          <div>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">
              Predict the Future, Trade with Confidence
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              The next generation prediction market platform where you can trade on future events with real-time data
              and unmatched liquidity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white text-lg py-6 px-8">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200 text-lg py-6 px-8">
                Explore Markets
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Markets</h3>
              <p className="text-gray-400">
                Trade on events as they unfold with instant price updates and deep liquidity.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="bg-cyan-500/20 p-3 rounded-lg w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-gray-400">Gain insights with comprehensive data visualization and predictive tools.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Settlement</h3>
              <p className="text-gray-400">
                Get paid instantly when your predictions are correct with our smart contract system.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Overview Section */}
      <section id="markets" className="py-20 px-4 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-purple-500 text-purple-400">
              LIVE MARKETS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trade on What Matters</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our most active prediction markets with real-time odds and trading volume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeMarkets.map((market) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{market.title}</h3>
                    <Badge
                      className={
                        market.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }
                    >
                      {market.trend === "up" ? "+2.3%" : "-1.8%"}
                    </Badge>
                  </div>

                  <div className="flex justify-between mb-6">
                    <div>
                      <p className="text-gray-500 text-sm">Probability</p>
                      <p className="text-2xl font-bold">{market.probability}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Volume</p>
                      <p className="text-2xl font-bold">{market.volume}</p>
                    </div>
                  </div>

                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={market.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            borderColor: "#333",
                            borderRadius: "0.5rem",
                            color: "#fff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={market.trend === "up" ? "#10b981" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <Button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white">Trade Now</Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200">
              View All Markets
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-cyan-500 text-cyan-400">
              HOW IT WORKS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple Steps to Start Predicting</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform makes it easy to get started with prediction markets in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full hover:border-purple-500/50 transition-all">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold mb-4">Connect Wallet</h3>
                  <p className="text-gray-400">
                    Link your crypto wallet to our platform to start trading on prediction markets securely.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full hover:border-cyan-500/50 transition-all">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold mb-4">Choose Markets</h3>
                  <p className="text-gray-400">
                    Browse through our diverse range of prediction markets across various categories.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full hover:border-blue-500/50 transition-all">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold mb-4">Trade & Profit</h3>
                  <p className="text-gray-400">
                    Place your predictions, monitor the markets, and collect your profits when you're right.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Ready to start predicting?</h3>
                <p className="text-gray-400 mb-6">
                  Join thousands of traders who are already profiting from their predictions on future events.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white" onClick={()=>navigate("/markets")}>
                  Enter Market
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <h4 className="text-xl font-bold">No Hidden Fees</h4>
                    <p className="text-gray-400">Transparent fee structure with no surprises</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-400 mr-3" />
                  <div>
                    <h4 className="text-xl font-bold">Active Community</h4>
                    <p className="text-gray-400">Join thousands of active traders</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-yellow-400 mr-3" />
                  <div>
                    <h4 className="text-xl font-bold">Instant Settlements</h4>
                    <p className="text-gray-400">Get paid immediately when you win</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-20 px-4 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-blue-500 text-blue-400">
              LEADERBOARD
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Top Predictors</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet our most successful traders who consistently make accurate predictions.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800">
            <div className="bg-gray-900/80 backdrop-blur-sm p-6">
              <div className="grid grid-cols-12 text-gray-400 text-sm font-medium pb-4 border-b border-gray-800">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 md:col-span-4">Trader</div>
                <div className="col-span-3 md:col-span-4 text-right md:text-center">Profit</div>
                <div className="col-span-3 text-right">Accuracy</div>
              </div>

              {topTraders.map((trader, index) => (
                <motion.div
                  key={trader.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-12 items-center py-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <div className="col-span-1 text-center font-bold text-lg">{index + 1}</div>
                  <div className="col-span-5 md:col-span-4 flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-800">
                      <img
                        src={trader.avatar || "/placeholder.svg"}
                        alt={trader.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold">{trader.username}</p>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-4 text-right md:text-center font-bold text-green-400">
                    {trader.profit}
                  </div>
                  <div className="col-span-3 text-right font-bold">{trader.accuracy}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-gray-200">
              View Full Leaderboard
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-purple-500 text-purple-400">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join a community of traders who are already benefiting from our prediction markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/30 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
                style={{
                  background: "linear-gradient(145deg, rgba(31, 41, 55, 0.4), rgba(17, 24, 39, 0.7))",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-800">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Join Our Community</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with other traders, share insights, and stay updated on the latest prediction markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#5865F2] hover:bg-[#4752c4] text-white">Join Discord</Button>
              <Button className="bg-[#0088cc] hover:bg-[#0077b5] text-white">Join Telegram</Button>
              <Button className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white">Follow on Twitter</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-400 mb-4">
                PredictX
              </div>
              <p className="text-gray-400 mb-4">
                The next generation prediction market platform where you can trade on future events.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Markets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} PredictX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


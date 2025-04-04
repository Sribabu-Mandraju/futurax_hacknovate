import { useEffect, useState } from "react"

export default function FeatureCards() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 200)
  }, [])

  return (
    <div 
      className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'}`}
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
        <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Real-Time Markets</h3>
        <p className="text-gray-400">
          Trade on events as they unfold with instant price updates and deep liquidity.
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
        <div className="bg-cyan-500/20 p-3 rounded-lg w-fit mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
        <p className="text-gray-400">Gain insights with comprehensive data visualization and predictive tools.</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
        <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Instant Settlement</h3>
        <p className="text-gray-400">
          Get paid instantly when your predictions are correct with our smart contract system.
        </p>
      </div>
    </div>
  )
}

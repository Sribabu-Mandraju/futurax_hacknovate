import { useState, useEffect, useRef } from "react"

export default function MarketCard({ market, index }) {
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, index * 100)

    // Simple canvas chart implementation
    if (chartRef.current) {
      const canvas = chartRef.current
      const ctx = canvas.getContext("2d")
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw chart
      ctx.beginPath()
      ctx.strokeStyle = market.trend === "up" ? "#10b981" : "#ef4444"
      ctx.lineWidth = 2

      const dataPoints = market.data
      const maxValue = Math.max(...dataPoints.map((d) => d.value))
      const minValue = Math.min(...dataPoints.map((d) => d.value))
      const range = maxValue - minValue || 1

      dataPoints.forEach((point, i) => {
        const x = (i / (dataPoints.length - 1)) * width
        const y = height - ((point.value - minValue) / range) * (height * 0.8)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }
  }, [market, index])

  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{market.title}</h3>
          <div
            className={
              market.trend === "up"
                ? "bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium"
                : "bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium"
            }
          >
            {market.trend === "up" ? "+2.3%" : "-1.8%"}
          </div>
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

        <div className="h-32 w-full">
          <canvas ref={chartRef} width="300" height="120" className="w-full h-full"></canvas>
        </div>

        <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md">Trade Now</button>
      </div>
    </div>
  )
}


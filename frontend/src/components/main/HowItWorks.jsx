import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
export default function HowItWorksSection() {
  const navigate =useNavigate();
  const steps = [
    {
      number: 1,
      title: "Connect Wallet",
      description: "Link your crypto wallet to our platform to start trading on prediction markets securely."
    },
    {
      number: 2,
      title: "Choose Markets",
      description: "Browse through our diverse range of prediction markets across various categories."
    },
    {
      number: 3,
      title: "Trade & Profit",
      description: "Place your predictions, monitor the markets, and collect your profits when you're right."
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 border border-cyan-500 text-cyan-400 rounded-full text-sm font-medium">
            HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple Steps to Start Predicting</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform makes it easy to get started with prediction markets in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        <div className="mt-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Ready to start predicting?</h3>
              <p className="text-gray-400 mb-6">
                Join thousands of traders who are already profiting from their predictions on future events.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-4 py-2 rounded-md flex items-center" onClick={()=>("/markets")}>
                Enter Market
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <FeatureList />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ step, index }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100 + 100)
    
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full hover:border-purple-500/50 transition-all">
        <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
          {step.number}
        </div>
        <div className="pt-6">
          <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
          <p className="text-gray-400">{step.description}</p>
        </div>
      </div>
    </div>
  )
}

function FeatureList() {
  const features = [
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" className="stroke-blue-400"></circle>
        <line x1="2" y1="12" x2="22" y2="12" className="stroke-green-400"></line>
        <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" className="stroke-yellow-400"></path>
      </svg>
      
      ),
      title: "Decentralized",
      description: "A truly decentralized platform with no central authority."
    },
    {
     
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      title: "5% Fee On Profits",
      description: "Transparent fee structure with no surprises"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Active Community",
      description: "Join thousands of active traders"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      ),
      title: "Instant Settlements",
      description: "Get paid immediately when you win"
    }
  ]

  return (
    <div>
      {features.map((feature, index) => (
        <div key={index} className={`flex items-center ${index !== features.length - 1 ? 'mb-4' : ''}`}>
          <div className="mr-3">
            {feature.icon}
          </div>
          <div>
            <h4 className="text-xl font-bold">{feature.title}</h4>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

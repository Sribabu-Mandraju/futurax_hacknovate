import { useState, useEffect } from "react"

export default function LeaderboardSection() {
  const [topTraders, setTopTraders] = useState([
    {
      id: 1,
      username: "Rohit Mehta",
      profit: "$1000",
      accuracy: "92%",
      avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100221.jpg?t=st=1742058974~exp=1742062574~hmac=a90b7bba910f90b072b60307c34711be2d6d82b495e6d73c970becc553152d0c&w=740",
    },
    {
      id: 2,
      username: "Arjun Malhotra",
      profit: "$870",
      accuracy: "88%",
      avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100222.jpg?t=st=1742059019~exp=1742062619~hmac=71b8fc5a0ce809dad1b39ad011a07cd6f9512ecb8cd999c6d8c339bb16143f68&w=740",
    },
    {
      id: 3,
      username: "Kiran Joshi",
      profit: "$723",
      accuracy: "85%",
      avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100263.jpg?t=st=1742059045~exp=1742062645~hmac=b3c75215ee0162a2cddf8a06adb92c6d758fed1b5045da8727f3f9b0b086874f&w=740",
    },
    {
      id: 4,
      username: "Rahul Sharma",
      profit: "$558",
      accuracy: "79%",
      avatar: "https://img.freepik.com/premium-photo/men-design-logo-avatar_665280-69427.jpg?w=740",
    },
  ])

  return (
    <section id="leaderboard" className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 border border-blue-500 text-blue-400 rounded-full text-sm font-medium">
            LEADERBOARD
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Top Predictors</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Meet our most successful traders who consistently make accurate predictions.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-800">
          <div className="bg-gray-900/80 backdrop-blur-sm p-6">
            <div className="grid grid-cols-12 text-gray-400 text-sm font-medium pb-4 border-b border-gray-800">
              <div className="col-span-1 text-center font-bold text-2xl">#</div>
              <div className="col-span-5 md:col-span-4 font-bold text-2xl">Trader</div>
              <div className="col-span-3 md:col-span-4 text-right md:text-center font-bold text-2xl">Profit</div>
              <div className="col-span-3 text-right font-bold text-2xl">Accuracy</div>
            </div>  

            {topTraders.map((trader, index) => (
              <TraderRow key={trader.id} trader={trader} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="border border-gray-700 hover:bg-gray-800 text-gray-200 px-4 py-2 rounded-md flex items-center mx-auto">
            View Full Leaderboard
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function TraderRow({ trader, index }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
  }, [index])

  return (
    <div
      className={`grid grid-cols-12 items-center py-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
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
    </div>
  )
}

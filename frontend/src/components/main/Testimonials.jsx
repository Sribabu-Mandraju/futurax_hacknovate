import { useState, useEffect } from "react"

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Alex Chen",
      role: "Crypto Analyst",
      content:
        "This platform has revolutionized how I think about future events. The liquidity and market efficiency are unmatched.",
      avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100222.jpg?t=st=1742059019~exp=1742062619~hmac=71b8fc5a0ce809dad1b39ad011a07cd6f9512ecb8cd999c6d8c339bb16143f68&w=740",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Day Trader",
      content:
        "I've been using prediction markets for years, but this platform takes it to another level with its intuitive UI and deep liquidity.",
      avatar: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100221.jpg?t=st=1742058974~exp=1742062574~hmac=a90b7bba910f90b072b60307c34711be2d6d82b495e6d73c970becc553152d0c&w=740",
    },
    {
      id: 3,
      name: "Michael Wong",
      role: "Hedge Fund Manager",
      content:
        "The real-time data and analytics provided here give me an edge in understanding market sentiment across various domains.",
      avatar: "https://img.freepik.com/premium-photo/memoji-handsome-indian-guy-man-white-background-emoji-cartoon-character_826801-7986.jpg?w=740",
    },
  ])

  return (
    <section id="community" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1 border border-purple-500 text-purple-400 rounded-full text-sm font-medium">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join a community of traders who are already benefiting from our prediction markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        <div className="mt-20 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-6">Join Our Community</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with other traders, share insights, and stay updated on the latest prediction markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
  className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-md font-bold"
  onClick={() => window.open("https://discord.com/channels/1350527419114848367/", "_blank")}
>
  Join Discord
</button>

<button
  className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-4 py-2 rounded-md font-bold"
  onClick={() => window.open("https://web.telegram.org/a/", "_blank")}
>
  Join Telegram
</button>

<button
  className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white px-4 py-2 rounded-md font-bold"
  onClick={() => window.open("https://x.com/0x02AUD1T0R", "_blank")}
>
  Follow on Twitter
</button>

          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, index * 100)
  }, [index])

  return (
    <div
      className={`bg-gray-900/30 backdrop-blur-md border border-gray-800/50 rounded-xl p-6 hover:border-cyan-500/30 border-[3px] transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
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
    </div>
  )
}


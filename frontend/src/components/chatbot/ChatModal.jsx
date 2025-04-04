"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, Loader2 } from "lucide-react"
import axios from "axios"

const ChatModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hello! How can I help you with your staking questions today?" },
  ])
  const [loading, setLoading] = useState(false)
  const modalRef = useRef(null)
  const messagesEndRef = useRef(null)

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
  const GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY
  const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Animation for modal entrance
    if (modalRef.current) {
      modalRef.current.classList.add("animate-in")
    }

    // Click outside to close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Function to search the web for relevant data
  const searchWeb = async (query) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}`,
      )
      if (res.data.items) {
        return res.data.items
          .slice(0, 5)
          .map((item) => `${item.title}: ${item.snippet}`)
          .join("\n\n")
      }
      return null
    } catch (error) {
      console.error("Google Search API Error:", error)
      return null
    }
  }

  // Function to process the search results and return an exact answer
  const generateAIResponse = async (query, searchResults) => {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Given the following search results, extract the most relevant information and provide a direct, factual answer to the query: "${query}".\n\nResults:\n${searchResults}\n\nAnswer in one or two sentences only.`,
                },
              ],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
      return res.data.candidates[0]?.content.parts[0]?.text || "No relevant answer found."
    } catch (error) {
      console.error("Gemini API Error:", error)
      return "Error fetching AI response."
    }
  }

  // Function to handle user input
  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!input.trim()) return

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: input }])

    // Clear input and set loading
    const userQuery = input
    setInput("")
    setLoading(true)

    // Add typing indicator
    setMessages((prev) => [...prev, { type: "loading" }])

    try {
      // Search for information
      const searchResults = await searchWeb(userQuery)

      // Remove loading indicator
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"))

      if (!searchResults) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "I couldn't find relevant information for your query. Could you try asking something else?",
          },
        ])
        setLoading(false)
        return
      }

      // Generate AI response
      const aiResponse = await generateAIResponse(userQuery, searchResults)

      // Add bot response to chat
      setMessages((prev) => [...prev, { type: "bot", content: aiResponse }])
    } catch (error) {
      console.error("Error in chat flow:", error)
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"))
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "I'm having trouble processing your request. Please try again later.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div
        ref={modalRef}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 opacity-0 translate-y-8"
        style={{ animationDuration: "0.3s" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-white" />
            <h3 className="text-lg font-bold text-white">Staking Assistant</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-950">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "loading" ? (
                <div className="bg-gray-800 rounded-lg p-3 max-w-[80%] animate-pulse flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              ) : (
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className={message.type === "bot" ? "text-gray-100" : "text-white"}>{message.content}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 bg-gray-900 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about staking..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-r-lg ${
              loading || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatModal
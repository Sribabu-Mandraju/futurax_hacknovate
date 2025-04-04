"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import axios from "axios"

const ChatInterface = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm your real-time data assistant. Ask me about crypto, stocks, weather, news, sports, or politics.",
    },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // API configuration
  const API_URL = "http://localhost:3000" // Your Express backend URL

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Function to send message to the backend
  const sendMessage = async (message) => {
    try {
      // Simulate the OpenServ platform structure
      const payload = {
        type: "respond-chat-message",
        workspace: { id: "frontend-workspace" },
        me: { id: "frontend-agent" },
        messages: [{ message }],
      }

      // Send to your Express backend
      await axios.post(`${API_URL}/`, payload)

      // Note: The actual response comes asynchronously in a real OpenServ setup
      // For our frontend demo, we'll simulate a response after a delay

      setTimeout(async () => {
        try {
          // In a real implementation, you would have a websocket or polling mechanism
          // to receive the actual response from the agent
          // For now, we'll simulate a direct response

          const simulatedResponse = await axios.get(`${API_URL}/simulate-response`, {
            params: { query: message },
          })

          setMessages((prev) => [
            ...prev.filter((msg) => msg.type !== "loading"),
            { type: "bot", content: simulatedResponse.data.response },
          ])

          setLoading(false)
        } catch (error) {
          console.error("Error getting response:", error)
          setMessages((prev) => [
            ...prev.filter((msg) => msg.type !== "loading"),
            { type: "bot", content: "Sorry, I encountered an error processing your request." },
          ])
          setLoading(false)
        }
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== "loading"),
        { type: "bot", content: "Sorry, I couldn't connect to the data service. Please try again later." },
      ])
      setLoading(false)
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

    // Send message to backend
    await sendMessage(userQuery)
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.type === "user" ? "user-message" : "bot-message"}`}>
            {message.type === "loading" ? (
              <div className="loading-message">
                <div className="loading-bubble">
                  <div className="loading-dot" style={{ animationDelay: "0ms" }}></div>
                  <div className="loading-dot" style={{ animationDelay: "150ms" }}></div>
                  <div className="loading-dot" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            ) : (
              <div className="message-bubble">
                <div className="message-icon">{message.type === "user" ? <User size={16} /> : <Bot size={16} />}</div>
                <div className="message-content">{message.content}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crypto, stocks, weather, news..."
          className="chat-input"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`send-button ${loading || !input.trim() ? "disabled" : ""}`}
        >
          {loading ? <Loader2 className="spin-icon" /> : <Send />}
        </button>
      </form>
    </div>
  )
}

export default ChatInterface


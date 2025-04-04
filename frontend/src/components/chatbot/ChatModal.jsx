"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import axios from "axios";

const ChatModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! How can I help you with your staking questions today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Backend API URL
  const API_URL = "http://localhost:8000/chat";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.classList.add("animate-in");
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: input }]);
    const userQuery = input;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { type: "loading" }]);

    try {
      const response = await axios.post(
        API_URL,
        { message: userQuery },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));

      if (response.data && response.data.answer) {
        setMessages((prev) => [...prev, { type: "bot", content: response.data.answer }]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", content: "I'm not sure, can you ask differently?" }]);
      }
    } catch (error) {
      console.error("Error processing chat:", error);
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));
      setMessages((prev) => [...prev, { type: "bot", content: "Error connecting to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div ref={modalRef} className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 opacity-0 translate-y-8">
        <div className="bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-white" />
            <h3 className="text-lg font-bold text-white">Staking Assistant</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-950">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "loading" ? (
                <div className="bg-gray-800 rounded-lg p-3 max-w-[80%] animate-pulse flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              ) : (
                <div className={`rounded-lg p-3 max-w-[80%] ${message.type === "user" ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}>
                  <p>{message.content}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 bg-gray-900 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about staking..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-r-lg ${loading || !input.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hi there! I'm your Prediction Market Assistant powered by Akash LLM. Ask me about your stakes, market trends, or strategies to win big in prediction markets!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch staking data from Redux store
  const { stakedEvents } = useSelector((state) => state.stakedEvents);

  // Akash LLM API client configuration
  const client = axios.create({
    baseURL: "https://chatapi.akash.network/api/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-huYEDwfK_8exLv6ktAVQiQ",
    },
  });

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

  // Function to process HTML response into readable text
  const processHtmlResponse = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const body = doc.body;

    const processNode = (node) => {
      let result = "";
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent.trim();
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const tagName = child.tagName.toLowerCase();
          switch (tagName) {
            case "br":
              result += "\n";
              break;
            case "b":
            case "strong":
              result += `**${processNode(child)}**`;
              break;
            case "i":
            case "em":
              result += `*${processNode(child)}*`;
              break;
            case "p":
              result += `${processNode(child)}\n\n`;
              break;
            case "ul":
            case "ol":
              child.childNodes.forEach((li, index) => {
                if (li.tagName?.toLowerCase() === "li") {
                  result += `${
                    tagName === "ol" ? `${index + 1}.` : "-"
                  } ${processNode(li)}\n`;
                }
              });
              result += "\n";
              break;
            default:
              result += processNode(child);
          }
        }
      });
      return result.trim();
    };

    return processNode(body) || "No content available.";
  };

  // Function to generate prediction market context from stakedEvents
  const generatePredictionContext = () => {
    if (!stakedEvents || stakedEvents.length === 0) {
      return "The user has no active prediction market stakes currently.";
    }
    const totalStaked = stakedEvents.reduce(
      (sum, event) => sum + Number.parseFloat(event.stakedAmount || 0),
      0
    );
    const activeStakes = stakedEvents.filter((e) => !e.resolved).length;
    const wins = stakedEvents.filter(
      (e) => e.resolved && e.selectedOption === (e.winningOption ? "YES" : "NO")
    ).length;

    return `
      The user has ${stakedEvents.length} prediction market stakes.
      Total staked: $${totalStaked.toFixed(2)}.
      Active predictions: ${activeStakes}.
      Wins: ${wins} out of ${stakedEvents.length - activeStakes} resolved events.
      Stake details: ${stakedEvents
        .map(
          (e) =>
            `- ${e.description}: $${e.stakedAmount} on ${e.selectedOption} (Pool: $${(
              Number.parseFloat(e.totalYesBets) + Number.parseFloat(e.totalNoBets)
            ).toFixed(2)}, ${e.resolved ? `Outcome: ${e.winningOption ? "YES" : "NO"}` : "Pending"})`
        )
        .join("\n")}
    `;
  };

  // Function to get response from Akash LLM with fine-tuned prompt
  const getAkashResponse = async (query) => {
    try {
      const predictionContext = generatePredictionContext();
      const enhancedPrompt = `
        You are an expert assistant for prediction markets, powered by Akash LLM, focused on helping users succeed in real-world prediction events.
        Use the following user prediction market data to provide precise, actionable insights:
        ${predictionContext}
        
        User Query: "${query}"
        
        Guidelines:
        - Respond ONLY with the final answer (3-5 sentences max), no internal reasoning or preamble.
        - For greetings like "hi", reply briefly: "Hello! How can I assist you with prediction markets today?"
        - For other queries, focus on trends, probabilities, or strategies relevant to prediction markets.
        - Leverage real-world prediction market knowledge (e.g., event probabilities, sentiment trends) where applicable.
        - Use HTML tags (<b>, <br>, <ul>) for clarity and emphasis.
        - Avoid speculation or unrelated advice unless explicitly asked.
      `;

      const response = await client.post("/chat/completions", {
        model: "DeepSeek-R1-Distill-Llama-70B",
        messages: [
          {
            role: "system",
            content:
              "You are a prediction market expert providing concise, actionable advice.",
          },
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
      });

      const htmlContent =
        response.data.choices[0]?.message.content || "No response received.";
      return processHtmlResponse(htmlContent);
    } catch (error) {
      console.error("Akash LLM API Error:", error);
      return "Error fetching response from the AI model.";
    }
  };

  // Function to handle user input
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: input }]);
    const userQuery = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { type: "loading" }]);

    try {
      const aiResponse = await getAkashResponse(userQuery);
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));
      setMessages((prev) => [...prev, { type: "bot", content: aiResponse }]);
    } catch (error) {
      console.error("Error in chat flow:", error);
      setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I'm having trouble processing your request. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="text-lg font-bold text-white">Prediction Market Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-950">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
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
                  <p
                    className={
                      message.type === "bot"
                        ? "text-gray-100 whitespace-pre-wrap"
                        : "text-white"
                    }
                  >
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-gray-800 bg-gray-900 flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about predictions, trends, or your stakes..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-r-lg ${
              loading || !input.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
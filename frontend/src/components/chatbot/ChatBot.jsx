import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
    const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

    // Function to search the web for relevant data
    const searchWeb = async (query) => {
        try {
            const res = await axios.get(
                `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}`
            );
            if (res.data.items) {
                return res.data.items
                    .slice(0, 5)
                    .map((item) => `${item.title}: ${item.snippet}`)
                    .join("\n\n");
            }
            return null;
        } catch (error) {
            console.error("Google Search API Error:", error);
            return null;
        }
    };

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
                                    text: `Given the following search results, extract the most relevant information and provide a direct, factual answer to the query: "${query}".\n\nResults:\n${searchResults}\n\nAnswer in one or two sentences only.`
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            return res.data.candidates[0]?.content.parts[0]?.text || "No relevant answer found.";
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Error fetching AI response.";
        }
    };

    // Function to handle user input
    const handleSubmit = async () => {
        if (!input) return;
        setLoading(true);
        setResponse("");

        const searchResults = await searchWeb(input);

        if (!searchResults) {
            setResponse("No relevant information found.");
            setLoading(false);
            return;
        }

        const aiResponse = await generateAIResponse(input, searchResults);
        setResponse(aiResponse);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">AI Chatbot</h2>
            
            <textarea
                className="w-full max-w-lg p-3 border rounded-lg text-black bg-gray-100 focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter your event prompt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            
            <button
                onClick={handleSubmit}
                className={`mt-3 px-6 py-2 rounded-lg font-semibold transition ${
                    loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
            >
                {loading ? "Fetching..." : "Submit"}
            </button>

            <button
                onClick={() => navigate("/")}
                className="mt-2 text-red-400 hover:text-red-500"
            >
                ⬅ Back to Home
            </button>

            {response && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg max-w-lg">
                    <h3 className="text-lg font-semibold text-green-400">Response:</h3>
                    <p className="text-gray-300">{response}</p>
                </div>
            )}
        </div>
    );
};

export default Chatbot;

import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3000", // Your Express backend URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

export const sendChatMessage = async (message) => {
  const payload = {
    type: "respond-chat-message",
    workspace: { id: "frontend-workspace" },
    me: { id: "frontend-agent" },
    messages: [{ message }],
  }

  return api.post("/", payload)
}

export const createTask = async (taskType, input) => {
  const payload = {
    type: "do-task",
    workspace: { id: "frontend-workspace" },
    task: {
      id: `task-${Date.now()}`,
      type: taskType,
      input,
    },
  }

  return api.post("/", payload)
}

// This is a mock endpoint for simulating responses in our demo
// In a real implementation, you would use websockets or polling
export const simulateResponse = async (query) => {
  return api.get("/simulate-response", { params: { query } })
}

export default api


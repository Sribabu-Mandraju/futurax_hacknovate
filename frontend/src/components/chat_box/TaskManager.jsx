"use client"

import { useState, useEffect } from "react"
import { Clipboard, CheckCircle, XCircle, Loader2, FileText } from "lucide-react"
import axios from "axios"

const TaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTaskInput, setNewTaskInput] = useState("")
  const [taskType, setTaskType] = useState("generate-report")

  // API configuration
  const API_URL = "http://localhost:3000" // Your Express backend URL

  useEffect(() => {
    // Fetch tasks on component mount
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      // In a real implementation, you would fetch tasks from your backend
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setTasks([
          {
            id: "task-1",
            type: "generate-report",
            status: "completed",
            input: "Analyze crypto market trends",
            output: "Report generated successfully",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "task-2",
            type: "generate-report",
            status: "pending",
            input: "Stock market analysis for tech sector",
            createdAt: new Date().toISOString(),
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setLoading(false)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (!newTaskInput.trim()) return

    try {
      // Simulate the OpenServ platform structure
      const payload = {
        type: "do-task",
        workspace: { id: "frontend-workspace" },
        task: {
          id: `task-${Date.now()}`,
          type: taskType,
          input: newTaskInput,
        },
      }

      // Send to your Express backend
      await axios.post(`${API_URL}/`, payload)

      // Add the new task to the list (in a real app, you'd fetch the updated list)
      setTasks((prev) => [
        {
          id: payload.task.id,
          type: taskType,
          status: "pending",
          input: newTaskInput,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])

      setNewTaskInput("")
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Failed to create task. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="task-manager">
      <div className="task-form-container">
        <h2>Create New Task</h2>
        <form onSubmit={createTask} className="task-form">
          <div className="form-group">
            <label htmlFor="taskType">Task Type:</label>
            <select
              id="taskType"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="task-select"
            >
              <option value="generate-report">Generate Report</option>
              <option value="data-analysis">Data Analysis</option>
              <option value="market-research">Market Research</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="taskInput">Task Input:</label>
            <textarea
              id="taskInput"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Describe what you want the agent to do..."
              className="task-input"
              rows={3}
            />
          </div>

          <button type="submit" className="create-task-button" disabled={!newTaskInput.trim()}>
            Create Task
          </button>
        </form>
      </div>

      <div className="tasks-list-container">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button onClick={fetchTasks} className="refresh-button">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader2 className="spin-icon" size={24} />
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="no-tasks">
            <Clipboard size={24} />
            <p>No tasks found. Create a new task to get started.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <div className="task-type">
                    <FileText size={16} />
                    <span>{task.type}</span>
                  </div>
                  <div className="task-status">
                    {task.status === "completed" ? (
                      <CheckCircle size={16} className="status-icon completed" />
                    ) : task.status === "failed" ? (
                      <XCircle size={16} className="status-icon failed" />
                    ) : (
                      <Loader2 size={16} className="status-icon pending spin-icon" />
                    )}
                    <span>{task.status}</span>
                  </div>
                </div>
                <div className="task-content">
                  <p>
                    <strong>Input:</strong> {task.input}
                  </p>
                  {task.output && (
                    <p>
                      <strong>Output:</strong> {task.output}
                    </p>
                  )}
                </div>
                <div className="task-footer">
                  <span className="task-date">Created: {formatDate(task.createdAt)}</span>
                  <span className="task-id">ID: {task.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskManager


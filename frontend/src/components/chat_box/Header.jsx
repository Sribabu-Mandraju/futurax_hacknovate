"use client"
import { MessageSquare, Clipboard } from "lucide-react"

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>OpenServ Data Agent</h1>
      </div>
      <nav className="main-nav">
        <button className={`nav-button ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>
        <button className={`nav-button ${activeTab === "tasks" ? "active" : ""}`} onClick={() => setActiveTab("tasks")}>
          <Clipboard size={18} />
          <span>Tasks</span>
        </button>
      </nav>
    </header>
  )
}

export default Header


import MainPage from "./pages/main/MainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PredictionMarket from "./pages/prediction_market/PredictionMarket";
import MarketPlace_Page from "./pages/market_Place/MarketPlace_Page";
import CreateEvent from "./pages/create_event/CreateEvent";
import Bets from "./components/testing/Bets";
import Resolve_Events from "./pages/resolve_events/Resolve_Events";
import Chatbot from "./components/chatbot/ChatBot";
import MarketsPage from "./pages/markets/MarketsPage";
import User_Stakes from "./pages/claim_rewards/User_Stakes";
import FloatingChatButton from "./components/chatbot/FloatingChatButton";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="dark">
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/prediction_market" element={<PredictionMarket />} />
            <Route path="/addEvent" element={<CreateEvent />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/bets" element={<Bets />} />
            <Route path="/admin" element={<Resolve_Events />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/portfolio" element={<User_Stakes />} />
          </Routes>

          {/* Floating Chat Button that appears on all pages */}
          <FloatingChatButton />
        </div>
      </div>
    </Router>
  );
};

export default App;
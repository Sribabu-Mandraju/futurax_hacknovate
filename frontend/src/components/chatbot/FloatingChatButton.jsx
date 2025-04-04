
import { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import ChatModal from "./ChatModal";
import botAnimation from "./bot.json"; // Ensure the path is correct

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationContainer = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: botAnimation,
      });
      return () => anim.destroy(); // Cleanup on unmount
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Lottie Animation Button */}
      <div
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-all duration-500 ease-in-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        } ${isOpen ? "scale-0" : "scale-100"}`}
      >
        <button
          onClick={toggleChat}
          className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg bg-transparent focus:outline-none"
          aria-label="Open chat"
        >
          <div ref={animationContainer} style={{ width: "100%", height: "100%" }} />
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && <ChatModal isOpen={isOpen} onClose={toggleChat} />}
    </>
  );
};

export default FloatingChatButton;
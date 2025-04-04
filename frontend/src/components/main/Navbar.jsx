"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Home,
  PieChart,
  Shield,
} from "lucide-react";
import ConnectWallet from "./wallet/ConnectWallet";
import logo from "../../assets/logo.png";
import { getSigner } from "../../config/contract.config";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [userAddress, setUserAddress] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const adminAddress = import.meta.env.VITE_EVENT_FACTORY_OWNER_ADDRESS;
  const isAdmin = userAddress === adminAddress;
  const navRef = useRef(null);
  const location = useLocation();

  const fetchAddress = useCallback(async () => {
    try {
      const signer = await getSigner();
      if (!signer) {
        console.warn("No signer available");
        setUserAddress("");
        return;
      }

      const address = await signer.getAddress();

      // Only update if address actually changed
      if (address !== userAddress) {
        setUserAddress(address);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setUserAddress("");
    }
  }, [userAddress]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-lg py-2 shadow-lg shadow-purple-900/20"
          : "bg-black/30 backdrop-blur-md py-4"
      }`}
    >
      {/* Animated gradient border effect */}
      <div
        className={`absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent ${
          scrolled ? "opacity-100" : "opacity-70"
        }`}
      ></div>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className={`relative overflow-hidden  rounded-full ${
                scrolled ? "w-9 h-9" : "w-10 h-10"
              } transition-all duration-300`}
            >
              <img
                src={logo || "/placeholder.svg"}
                alt="futureX"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span
                className={`font-bold bg-clip-text text-transparent font bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500   group-hover:from-purple-400 group-hover:to-cyan-300 transition-all duration-300 ${
                  scrolled ? "text-xl" : "text-2xl"
                }`}
              >
                FuturaX
              </span>
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                Stake • Earn • Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              text="Home"
              icon={<Home size={16} />}
              isActive={isActive("/")}
            />
            <NavLink
              to="/markets"
              text="Markets"
              icon={<BarChart3 size={16} />}
              isActive={isActive("/markets")}
            />
            <NavLink
              to="/portfolio"
              text="Portfolio"
              icon={<PieChart size={16} />}
              isActive={isActive("/portfolio")}
            />

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
                  <Shield size={16} className="text-purple-400" />
                  <span>Admin</span>
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-200"
                  />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-black/90 backdrop-blur-xl rounded-lg shadow-lg shadow-purple-900/20 border border-purple-900/30 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Shield size={16} className="text-purple-400" />
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/addEvent"
                    className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Shield size={16} className="text-purple-400" />
                    Add Event
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Connect Wallet - Desktop */}
          <div className="hidden md:block">
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 active:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-100" />
            ) : (
              <Menu className="w-6 h-6 text-gray-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4 space-y-1 border-t border-white/10 mt-2">
          <MobileNavLink
            to="/"
            text="Home"
            icon={<Home size={18} />}
            isActive={isActive("/")}
          />
          <MobileNavLink
            to="/markets"
            text="Markets"
            icon={<BarChart3 size={18} />}
            isActive={isActive("/markets")}
          />
          <MobileNavLink
            to="/portfolio"
            text="Portfolio"
            icon={<PieChart size={18} />}
            isActive={isActive("/portfolio")}
          />

          {isAdmin && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-900/30 to-transparent my-2"></div>
              <div className="px-3 py-1 text-xs text-purple-400 uppercase tracking-wider">
                Admin Area
              </div>
              <MobileNavLink
                to="/admin"
                text="Admin Dashboard"
                icon={<Shield size={18} />}
                isActive={isActive("/admin")}
              />
              <MobileNavLink
                to="/addEvent"
                text="Add Event"
                icon={<Shield size={18} />}
                isActive={isActive("/addEvent")}
              />
            </>
          )}

          {/* Connect Wallet - Mobile */}
          <div className="pt-3 pb-1">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper Components
function NavLink({ to, text, icon, isActive }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 group ${
        isActive
          ? "text-white bg-white/5"
          : "text-gray-300 hover:text-white hover:bg-white/5"
      }`}
    >
      <span
        className={`${
          isActive
            ? "text-purple-400"
            : "text-gray-400 group-hover:text-purple-400"
        } transition-colors`}
      >
        {icon}
      </span>
      <span className="font-semibold">{text}</span>
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 ${
          isActive ? "w-4/5" : "w-0 group-hover:w-1/2"
        }`}
      ></span>
    </Link>
  );
}

function MobileNavLink({ to, text, icon, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-purple-900/20 to-transparent text-white"
          : "text-gray-300 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`${isActive ? "text-purple-400" : "text-gray-400"}`}>
        {icon}
      </span>
      <span>{text}</span>
      {isActive && (
        <span className="ml-auto">
          <div className="h-full w-1 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full"></div>
        </span>
      )}
    </Link>
  );
}

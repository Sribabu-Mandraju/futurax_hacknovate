import React from "react";
import Navbar from "../../components/main/Navbar";
import HeroSection from "../../components/main/HeroSection";
import MarketSection from "../../components/main/marketSection/MarketSection";
import HowItWorksSection from "../../components/main/HowItWorks";
import LeaderboardSection from "../../components/main/LeaderBoardSection";
import TestimonialsSection from "../../components/main/Testimonials";
import Footer from "../../components/main/Footer";

const MainPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MarketSection />
      <HowItWorksSection />
      <LeaderboardSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
};

export default MainPage;

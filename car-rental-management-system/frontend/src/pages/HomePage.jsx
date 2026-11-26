import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "../components/home/HeroSection.jsx";
import AboutSection from "../components/home/AboutSection.jsx";
import FeaturedCars from "../components/home/FeaturedCars.jsx";

function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <>
      <HeroSection />
      <FeaturedCars />
      <AboutSection />
    </>
  );
}

export default HomePage;

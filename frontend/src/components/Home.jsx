import useGetAllJobs from "@/hooks/useGetAllJobs";
import CategoryCarousel from "./CategoryCarousel";

import HeroSection from "./HeroSection";
import LatestJob from "./LatestJob";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJob />
      <Footer />
    </div>
  );
};

export default Home;

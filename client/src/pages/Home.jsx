import React from "react";
import Hero from "../components/Hero";
import LatestListing from "../components/LatestListing";
import Plans from "../components/Plans";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestListing />
      <Plans />
    </div>
  );
};

export default Home;

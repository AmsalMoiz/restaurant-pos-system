import React from "react";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/frontpic.png)`,
      }}
    >
      <h1>Welcome to the Restaurant POS System</h1>
      <Link to="/login" style={{ color: "white", marginTop: "20px" }}>
        Back to Login
      </Link>
    </div>
  );
};

export default Home;

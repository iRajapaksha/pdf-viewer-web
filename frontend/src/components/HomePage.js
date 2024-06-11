// src/components/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ auth }) => {
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    return (
      <div>
        <h1>Please login first</h1>
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Go back
        </button>
      </div>
    );
  }

  return <div>HomePage</div>;
};

export default HomePage;

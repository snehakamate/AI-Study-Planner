import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-around",
      padding: "10px",
      background: "#333",
      color: "#fff"
    }}>
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
      <Link to="/predictor" style={{ color: "#fff", textDecoration: "none" }}>Predict Study Time</Link>
      <Link to="/resources" style={{ color: "#fff", textDecoration: "none" }}>Learning Resources</Link>
    </nav>
  );
}

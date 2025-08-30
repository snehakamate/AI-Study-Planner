import React from "react";

function DashboardCard({ task, duration }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{task}</h3>
      <p>{duration}</p>
    </div>
  );
}

export default DashboardCard;

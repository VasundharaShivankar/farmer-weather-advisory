import React from "react";

const AdvisoryBox = ({ advisory }) => {
  if (!advisory || advisory.length === 0) return null;

  return (
    <div style={{
      background: "#d1f7d6",
      padding: "20px",
      margin: "20px",
      borderRadius: "10px",
      width: "400px"
    }}>
      <h3>Farmer Advisory</h3>
      {advisory.map((a, i) => (
        <p key={i} style={{ margin: "5px 0" }}>✔ {a}</p>
      ))}
    </div>
  );
};

export default AdvisoryBox;

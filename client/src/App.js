import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SearchHistory from "./pages/SearchHistory";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav>
          <Link to="/" style={{ marginRight: "20px" }}>Home</Link>
          <Link to="/search-history">Search History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-history" element={<SearchHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

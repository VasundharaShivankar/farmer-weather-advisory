import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./views/Home/Home";
import SearchHistory from "./views/SearchHistory/SearchHistory";
import './App.css';


const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <Link 
            to={to} 

            className={isActive ? 'active' : ''} 
        >
            {children}
        </Link>
    );
};

function App() {
  return (
    <BrowserRouter>
        {/* Header/Banner (Defined in App.css) */}
        <header className="App-header">
            <h1 className="app-title">Farmer Advisory Tool</h1>
        </header>

        {/* Navigation Bar (Defined in App.css) */}
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/search-history">Search History</NavLink>
        </nav>
      
        {/* Main Application Content Area */}
        <div className="app-main-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search-history" element={<SearchHistory />} />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
// client/src/components/SearchHistory.js
import React from "react";
import { Link } from "react-router-dom";

const SearchHistory = ({ onHistoryClick }) => {
    // Read from local storage (synced with Home.js logic)
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    const handleClearHistory = () => {
        localStorage.removeItem('searchHistory');
        window.location.reload(); // Simple way to refresh the list
    };
    
    return (
        <div style={{ padding: "20px", background: '#f5f5f5', borderRadius: '10px' }}>
            <h3 style={{ color: "#37474f" }}>Search History</h3>
            
            {history.length === 0 ? (
                <p style={{ fontStyle: 'italic' }}>No recent searches found.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {history.map((location, index) => (
                        <li key={index} style={{ margin: '8px 0', borderBottom: '1px dotted #ccc', paddingBottom: '5px' }}>
                            <Link 
                                to="#" 
                                onClick={() => onHistoryClick(location)}
                                style={{ textDecoration: 'none', color: '#00796b', fontWeight: 'bold' }}
                            >
                                {location}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            
            {history.length > 0 && (
                 <button 
                    onClick={handleClearHistory} 
                    style={{ marginTop: "10px", padding: "5px 10px", background: '#ef9a9a', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Clear History
                </button>
            )}
            
            <p style={{ fontSize: '0.8em', marginTop: '15px' }}>
                *Saves up to 10 locations in your browser.
            </p>
        </div>
    );
};

export default SearchHistory;
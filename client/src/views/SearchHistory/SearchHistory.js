
import React from "react";
import { Link } from "react-router-dom";
import "./SearchHistory.css"; 

const SearchHistory = ({ onHistoryClick }) => {
    
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    const handleClearHistory = () => {
        localStorage.removeItem('searchHistory');
        window.location.reload();
    };

    return (
        <div className="history-sidebar">
            <h3>📚 Search History</h3>

            {history.length === 0 ? (
                <p className="no-history">No recent searches found.</p>
            ) : (
                <ul>
                    {history.map((location, index) => (
                        <li key={index}>
                            <Link
                                to="#"
                                onClick={() => onHistoryClick(location)}
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
                    className="clear-button"
                >
                    🗑️ Clear History
                </button>
            )}

            <p className="history-note">
                History of upto 10 locations searched
            </p>
           
        </div>
    );
};

export default SearchHistory;
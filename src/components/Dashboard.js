import React, { useState, useEffect } from "react"; // Import React hooks
import { Link, Route, Routes, useNavigate } from "react-router-dom"; // Import routing components
import "./Dashboard.css"; // Import CSS styles for Dashboard
import SearchPage from "./SearchPage"; // Import SearchPage component
import ListPage from "./ListPage"; // Import ListPage component

const Dashboard = () => {
  // State to manage the saved list
  // Initialized as an empty array
  const [savedList, setSavedList] = useState([]);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // First useEffect: Load saved list from localStorage when component mounts
  useEffect(() => {
    // Retrieve saved list from localStorage
    // If no list exists, default to an empty array
    const savedListFromStorage =
      JSON.parse(localStorage.getItem("savedList")) || [];
    
    // Update state with retrieved list
    setSavedList(savedListFromStorage);
  }, []); // Empty dependency array means this runs only once on component mount

  // Second useEffect: Save saved list to localStorage whenever it changes
  useEffect(() => {
    // Store the current saved list in localStorage as a JSON string
    localStorage.setItem("savedList", JSON.stringify(savedList));
  }, [savedList]); // This effect runs every time savedList changes

  // Logout handler
  const handleLogout = () => {
    // TODO: Add any additional logout logic (clear tokens, etc.)
    // Currently just navigates to login page
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar with navigation links */}
      <div className="sidebar">
        <h1>Dashboard</h1>
        <ul>
          {/* Link to Search page */}
          <li>
            <Link to="search">Search</Link>
          </li>
          
          {/* Link to List page */}
          <li>
            <Link to="list">List</Link>
          </li>
          
          {/* Logout link */}
          <li>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content area with nested routes */}
      <div className="main-content">
        <Routes>
          {/* Default route - renders SearchPage */}
          <Route
            path="/"
            element={
              <SearchPage savedList={savedList} setSavedList={setSavedList} />
            }
          />
          
          {/* Search route - renders SearchPage */}
          <Route
            path="search"
            element={
              <SearchPage savedList={savedList} setSavedList={setSavedList} />
            }
          />
          
          {/* List route - renders ListPage */}
          <Route path="list" element={<ListPage savedList={savedList} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard; // Export Dashboard component as default
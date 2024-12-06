import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import SearchPage from "./SearchPage";
import ListPage from "./ListPage";

const Dashboard = () => {
  const [savedList, setSavedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedListFromStorage =
      JSON.parse(localStorage.getItem("savedList")) || [];
    setSavedList(savedListFromStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem("savedList", JSON.stringify(savedList));
  }, [savedList]);

  const handleLogout = () => {
    // Clear localStorage or token if needed
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Dashboard</h1>
        <ul>
          <li>
            <Link to="search">Search</Link>
          </li>
          <li>
            <Link to="list">List</Link>
          </li>
          <li>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <SearchPage savedList={savedList} setSavedList={setSavedList} />
            }
          />
          <Route
            path="search"
            element={
              <SearchPage savedList={savedList} setSavedList={setSavedList} />
            }
          />
          <Route path="list" element={<ListPage savedList={savedList} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;

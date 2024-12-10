import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTempList } from "../contexts/TempListContext";
import "./SearchPage.css";

const SearchPage = ({ savedList, setSavedList }) => {
  // State management hooks for component functionality
  // filter: stores user's current filtering input
  const [filter, setFilter] = useState("");
  
  // filteredCodes: stores HTTP codes that match the current filter
  const [filteredCodes, setFilteredCodes] = useState([]);
  
  // listName: potential future feature for named lists (currently unused)
  const [listName, setListName] = useState("");
  
  // Custom context hook to manage temporary list of HTTP codes
  // tempList: current list of selected codes
  // setTempList: function to update the temporary list
  const { tempList, setTempList } = useTempList();
  
  // Retrieve authentication token from local storage
  // Used for making authenticated API requests
  const token = localStorage.getItem("token");

  // Comprehensive list of HTTP status codes
  // Includes codes from 100 (Informational) to 999 (Custom)
  // Covers various categories: Informational, Success, Redirection, 
  // Client Errors, and Server Errors
  const commonHttpCodes = [
    "100", "101", "102", "103",  // Informational responses
    "200", "201", "202", "203", "204",  // Successful responses
    "300", "301", "302", "303", "304",  // Redirection responses
    "400", "401", "403", "404", "405",  // Client error responses
    "500", "501", "502", "503", "504",  // Server error responses
    "999"  // Custom/non-standard code
  ];

  // Effect hook to fetch saved lists when component mounts
  // Runs once when component is first rendered or when token changes
  useEffect(() => {
    // Async function to fetch saved lists from backend
    const fetchSavedList = async () => {
      try {
        // Make GET request to retrieve user's saved lists
        // Sends authentication token in headers for validation
        const response = await axios.get(
          "https://assign-back.vercel.app/api/lists/getList",
          {
            headers: { "x-auth-token": token },
          }
        );
        
        // Update savedList state with retrieved lists
        // Uses empty array as fallback if no lists exist
        setSavedList(response.data.lists || []);
      } catch (error) {
        // Log any errors during list fetching
        console.error("Error fetching saved list:", error);
      }
    };

    // Execute the fetch function
    fetchSavedList();
  }, [setSavedList, token]);

  // Handler to update filter input state
  // Triggered on every character change in filter input
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter HTTP codes based on user input
  // Supports wildcard filtering (e.g., 2xx matches 200, 201, 202)
  const handleFilter = () => {
    // Replace 'x' with regex digit matcher
    // Allows flexible filtering like 2xx, 40x, etc.
    const regex = new RegExp(`^${filter.replace(/x/g, "\\d")}`);
    
    // Filter common HTTP codes based on regex pattern
    const filtered = commonHttpCodes.filter((code) => regex.test(code));
    
    // Update state with filtered codes
    setFilteredCodes(filtered);
  };

  // Add all currently filtered codes to temporary list
  // Ensures no duplicate codes using Set
  const handleAddAll = () => {
    setTempList((prevTempList) => [
      ...new Set([...prevTempList, ...filteredCodes]),
    ]);
  };

  // Add a single code to temporary list
  // Prevents duplicates by using Set
  const handleAdd = (code) => {
    setTempList((prevTempList) => [...new Set([...prevTempList, code])]);
  };

  // Save current temporary list to backend
  const handleSave = async () => {
    // Prompt user to name their list
    const name = prompt("Enter a name for the list:");
    
    // Validate list name
    if (!name) {
      alert("List name is required.");
      return;
    }

    // Attempt to save list to backend
    try {
      await axios.post(
        "https://assign-back.vercel.app/api/lists/saveList",
        { name, codes: tempList }, // Send list name and codes
        { headers: { "x-auth-token": token } } // Authentication
      );
      
      // Clear temporary list after successful save
      setTempList([]);
    } catch (error) {
      // Log any errors during list saving
      console.error("Error saving list:", error.message);
    }
  };

  // Remove a specific code from temporary list
  const handleDelete = (codeToDelete) => {
    const newTempList = tempList.filter((code) => code !== codeToDelete);
    setTempList(newTempList);
  };

  // Remove all codes from temporary list
  // Includes a confirmation dialog to prevent accidental clearing
  const handleRemoveAll = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all items from the temporary list?"
      )
    ) {
      setTempList([]);
    }
  };

  // Render component UI
  return (
    <div className="search-page-container">
      <h1>Search Page</h1>
      
      {/* Filter section for searching HTTP codes */}
      <div className="filter-section">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Enter filter (e.g., 2xx, 203, 21x)"
        />
        <button onClick={handleFilter}>Filter</button>
        <button onClick={handleAddAll}>Add</button>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleRemoveAll} className="remove-all-button">
          Remove 
        </button>
      </div>
      
      {/* Display section for filtered HTTP code images */}
      <div className="images-section">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code) => (
            <div key={code} className="image-container">
              {/* Use http.dog API to fetch dog images for HTTP codes */}
              <img
                src={`https://http.dog/${code}.jpg`}
                alt={`Dog for code ${code}`}
                // Fallback to placeholder image if dog image fails
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <p>{code}</p>
              <button className="add-button" onClick={() => handleAdd(code)}>
                Add
              </button>
            </div>
          ))
        ) : (
          <p>No matching codes available.</p>
        )}
      </div>
      
      {/* Temporary list section */}
      <div className="saved-list-section">
        <h2>Temporary List</h2>
        {/* Show added codes or a message if list is empty */}
        {tempList.length > 0 ? (
          tempList.map((code) => (
            <div key={code} className="saved-item">
              <img
                src={`https://http.dog/${code}.jpg`}
                alt={`Dog for code ${code}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <p>{code}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(code)}
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <p>No items added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
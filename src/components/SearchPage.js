import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTempList } from "../contexts/TempListContext";
import "./SearchPage.css";

const SearchPage = ({ savedList, setSavedList }) => {
  const [filter, setFilter] = useState("");
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [listName, setListName] = useState(""); // New state for list name input
  const { tempList, setTempList } = useTempList();
  const token = localStorage.getItem("token"); // Retrieve token

  // Common HTTP codes list
  const commonHttpCodes = [
    "100",
    "101",
    "102",
    "103",
    "200",
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "300",
    "301",
    "302",
    "303",
    "304",
    "305",
    "306",
    "307",
    "308",
    "400",
    "401",
    "402",
    "403",
    "404",
    "405",
    "406",
    "407",
    "408",
    "409",
    "410",
    "411",
    "412",
    "413",
    "414",
    "415",
    "416",
    "417",
    "426",
    "428",
    "429",
    "431",
    "500",
    "501",
    "502",
    "503",
    "504",
    "505",
    "511",
    "999",
  ];

  useEffect(() => {
    // Fetch saved list from database
    const fetchSavedList = async () => {
      try {
        const response = await axios.get(
          "https://assign-back.vercel.app/api/lists/getList",
          {
            headers: { "x-auth-token": token },
          }
        );
        setSavedList(response.data.lists || []); // Updated to handle list of lists
      } catch (error) {
        console.error("Error fetching saved list:", error);
      }
    };

    fetchSavedList();
  }, [setSavedList, token]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilter = () => {
    const regex = new RegExp(`^${filter.replace(/x/g, "\\d")}`);
    const filtered = commonHttpCodes.filter((code) => regex.test(code));
    setFilteredCodes(filtered);
  };

  const handleAddAll = () => {
    setTempList((prevTempList) => [
      ...new Set([...prevTempList, ...filteredCodes]),
    ]);
  };

  const handleAdd = (code) => {
    setTempList((prevTempList) => [...new Set([...prevTempList, code])]);
  };

  const handleSave = async () => {
    const name = prompt("Enter a name for the list:");
    if (!name) {
      alert("List name is required.");
      return;
    }

    // Create or update list on server
    try {
      await axios.post(
        "https://assign-back.vercel.app/api/lists/saveList",
        { name, codes: tempList },
        { headers: { "x-auth-token": token } }
      );
      setTempList([]);
    } catch (error) {
      console.error("Error saving list:", error.message);
    }
  };

  const handleDelete = (codeToDelete) => {
    const newTempList = tempList.filter((code) => code !== codeToDelete);
    setTempList(newTempList);
  };

  const handleRemoveAll = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all items from the temporary list?"
      )
    ) {
      setTempList([]);
    }
  };

  return (
    <div className="search-page-container">
      <h1>Search Page</h1>
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
      <div className="images-section">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code) => (
            <div key={code} className="image-container">
              <img
                src={`https://http.dog/${code}.jpg`}
                alt={`Dog for code ${code}`}
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
      <div className="saved-list-section">
        <h2>Temporary List</h2>
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

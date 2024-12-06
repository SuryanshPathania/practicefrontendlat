import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListPage.css"; // Import the CSS file for styling

const ListPage = () => {
  const [savedLists, setSavedLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const token = localStorage.getItem("token"); // Retrieve token here

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(
          "https://assign-back.vercel.app/api/lists/getList",
          {
            headers: { "x-auth-token": token }, // Pass token here
          }
        );
        setSavedLists(response.data.lists || []);
      } catch (error) {
        console.error("Error fetching lists:", error.message);
      }
    };

    fetchLists();
  }, [token]);

  const handleShowImages = (list) => {
    setSelectedList(list);
  };

  const handleDeleteList = async (listId) => {
    try {
      console.log(`Deleting list with id: ${listId}`);
      await axios.delete(`https://assign-back.vercel.app/api/lists/${listId}`, {
        headers: { "x-auth-token": token },
      });
      console.log("List deleted successfully");
      setSavedLists(savedLists.filter((list) => list._id !== listId));
      if (selectedList && selectedList._id === listId) {
        setSelectedList(null);
      }
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  const handleDeleteItem = async (listId, code) => {
    try {
      console.log(
        `Deleting item with code: ${code} from list with id: ${listId}`
      );
      await axios.put(
        `https://assign-back.vercel.app/api/lists/${listId}/deleteItem`,
        { code },
        {
          headers: { "x-auth-token": token },
        }
      );
      console.log("Item deleted successfully");

      const updatedList = { ...selectedList };
      updatedList.codes = updatedList.codes.filter(
        (itemCode) => itemCode !== code
      );
      setSelectedList(updatedList);

      const updatedSavedLists = savedLists.map((list) =>
        list._id === listId ? updatedList : list
      );
      setSavedLists(updatedSavedLists);
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  return (
    <div className="list-page-container">
      <h1>Saved Lists</h1>
      <div className="saved-lists-section">
        {savedLists.length > 0 ? (
          savedLists.map((list) => (
            <div key={list._id} className="saved-list">
              <p className="list-name">{list.name}</p>
              <p className="list-date">
                Created on: {new Date(list.createdAt).toLocaleDateString()}
              </p>
              <button
                className="show-images-button"
                onClick={() => handleShowImages(list)}
              >
                Show Images
              </button>
              <button
                className="delete-list-button"
                onClick={() => handleDeleteList(list._id)}
              >
                Delete List
              </button>
            </div>
          ))
        ) : (
          <p>No lists saved yet.</p>
        )}
      </div>
      {selectedList && (
        <div className="images-section">
          <h2>{selectedList.name} - Images</h2>
          <div className="saved-list-section">
            {selectedList.codes.length > 0 ? (
              selectedList.codes.map((code, index) => (
                <div key={code} className="saved-item">
                  <img
                    src={`https://http.dog/${code}.jpg`}
                    alt={`Dog for code ${code}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        selectedList.imageLinks[index] ||
                        "https://via.placeholder.com/150";
                    }}
                  />
                  <p>{code}</p>
                  <button
                    className="delete-item-button"
                    onClick={() => handleDeleteItem(selectedList._id, code)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No items in this list.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPage;

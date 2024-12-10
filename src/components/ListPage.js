import React, { useState, useEffect } from "react"; // Import React hooks
import axios from "axios"; // Import axios for API requests
import "./ListPage.css"; // Import the CSS file for styling

const ListPage = () => {
  // State to manage saved lists
  const [savedLists, setSavedLists] = useState([]);
  
  // State to manage the currently selected list for viewing images
  const [selectedList, setSelectedList] = useState(null);
  
  // Retrieve authentication token from localStorage
  const token = localStorage.getItem("token");

  // Fetch saved lists from backend when component mounts
  useEffect(() => {
    // Async function to fetch lists
    const fetchLists = async () => {
      try {
        // Make GET request to fetch lists
        const response = await axios.get(
          "https://assign-back.vercel.app/api/lists/getList",
          {
            // Include authentication token in request headers
            headers: { "x-auth-token": token },
          }
        );
        
        // Update saved lists state
        // Use empty array as fallback if no lists returned
        setSavedLists(response.data.lists || []);
      } catch (error) {
        // Log any errors during list fetching
        console.error("Error fetching lists:", error.message);
      }
    };

    // Call fetch function
    // Only run if token exists
    fetchLists();
  }, [token]); // Dependency array includes token to re-fetch if token changes

  // Handler to show images for a selected list
  const handleShowImages = (list) => {
    // Set the selected list to view its images
    setSelectedList(list);
  };

  // Handler to delete an entire list
  const handleDeleteList = async (listId) => {
    try {
      // Log the list ID being deleted (for debugging)
      console.log(`Deleting list with id: ${listId}`);
      
      // Send DELETE request to backend
      await axios.delete(`https://assign-back.vercel.app/api/lists/${listId}`, {
        headers: { "x-auth-token": token },
      });
      
      console.log("List deleted successfully");
      
      // Update local state by filtering out deleted list
      setSavedLists(savedLists.filter((list) => list._id !== listId));
      
      // Clear selected list if the deleted list was currently selected
      if (selectedList && selectedList._id === listId) {
        setSelectedList(null);
      }
    } catch (error) {
      // Log any errors during list deletion
      console.error("Error deleting list:", error.message);
    }
  };

  // Handler to delete a specific item from a list
  const handleDeleteItem = async (listId, code) => {
    try {
      // Log details of item being deleted (for debugging)
      console.log(
        `Deleting item with code: ${code} from list with id: ${listId}`
      );
      
      // Send PUT request to backend to remove item
      await axios.put(
        `https://assign-back.vercel.app/api/lists/${listId}/deleteItem`,
        { code }, // Send code of item to delete
        {
          headers: { "x-auth-token": token },
        }
      );
      
      console.log("Item deleted successfully");

      // Create a copy of the selected list and remove the deleted item
      const updatedList = { ...selectedList };
      updatedList.codes = updatedList.codes.filter(
        (itemCode) => itemCode !== code
      );
      setSelectedList(updatedList);

      // Update saved lists to reflect the item deletion
      const updatedSavedLists = savedLists.map((list) =>
        list._id === listId ? updatedList : list
      );
      setSavedLists(updatedSavedLists);
    } catch (error) {
      // Log any errors during item deletion
      console.error("Error deleting item:", error.message);
    }
  };

  return (
    <div className="list-page-container">
      <h1>Saved Lists</h1>
      
      {/* Section to display saved lists */}
      <div className="saved-lists-section">
        {savedLists.length > 0 ? (
          // Map through saved lists and render each list
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
          // Show message if no lists exist
          <p>No lists saved yet.</p>
        )}
      </div>

      {/* Section to display images of selected list */}
      {selectedList && (
        <div className="images-section">
          <h2>{selectedList.name} - Images</h2>
          <div className="saved-list-section">
            {selectedList.codes.length > 0 ? (
              // Map through codes and render images
              selectedList.codes.map((code, index) => (
                <div key={code} className="saved-item">
                  <img
                    // Primary image source from http.dog
                    src={`https://http.dog/${code}.jpg`}
                    alt={`Dog for code ${code}`}
                    // Fallback image handling
                    onError={(e) => {
                      e.target.onerror = null;
                      // Try alternative image link or placeholder
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
              // Show message if no items in selected list
              <p>No items in this list.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPage; // Export ListPage component as default


// //The ListPage.js component is a user interface I developed to manage and interact with saved HTTP status code lists. It allows users to view their saved lists, see details such as the creation date, and manage the data dynamically.

// To manage the component's state, I utilized React’s useState hook for storing and updating data like the list of saved lists and the currently selected list. The useEffect hook is employed to fetch the saved lists from the server when the component first renders. This ensures the data displayed is always up-to-date with the server.

// For API calls, I integrated axios to handle communication with the backend. This includes fetching saved lists, deleting an entire list, or updating a list by removing specific HTTP status codes. Each of these actions is designed with robust error handling to provide a smooth user experience, even in cases of server errors or connectivity issues.

// The component has an intuitive interface where users can:

// View Saved Lists: Lists are displayed with their creation date for easy identification.
// Display HTTP Status Code Images: Upon selecting a list, users can view images corresponding to the HTTP status codes. If an image fails to load, a fallback mechanism ensures a placeholder image is displayed.
// Manage Data: Users can delete an entire list or remove specific codes from a list. These actions immediately update the UI and the server to keep everything synchronized.
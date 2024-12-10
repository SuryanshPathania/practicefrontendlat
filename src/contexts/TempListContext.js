import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for the temporary list that can be shared across components
const TempListContext = createContext();

// Provider component that wraps the app or part of the app to provide tempList state
export const TempListProvider = ({ children }) => {
  // State to manage the temporary list
  // Initialized as an empty array
  const [tempList, setTempList] = useState([]);

  // First useEffect: Load tempList from localStorage when the component mounts
  // This ensures that the list persists between page reloads
  useEffect(() => {
    // Retrieve the stored tempList from localStorage
    const storedTempList = localStorage.getItem("tempList");
    
    // If a stored list exists, parse it and set it as the current tempList
    if (storedTempList) {
      setTempList(JSON.parse(storedTempList));
    }
  }, []); // Empty dependency array means this runs only once on component mount

  // Second useEffect: Save tempList to localStorage whenever it changes
  // This ensures that any updates to the list are immediately persisted
  useEffect(() => {
    // Store the current tempList in localStorage as a JSON string
    localStorage.setItem("tempList", JSON.stringify(tempList));
  }, [tempList]); // This effect runs every time tempList changes

  // Provide the tempList state and setter function to child components
  return (
    <TempListContext.Provider value={{ tempList, setTempList }}>
      {children}
    </TempListContext.Provider>
  );
};

// Custom hook to easily use the TempListContext in other components
export const useTempList = () => {
  // Use useContext to access the TempListContext
  // Throws an error if used outside of a TempListProvider
  return useContext(TempListContext);
};
import React, { createContext, useContext, useState, useEffect } from "react";

const TempListContext = createContext();

export const TempListProvider = ({ children }) => {
  const [tempList, setTempList] = useState([]);

  useEffect(() => {
    const storedTempList = localStorage.getItem("tempList");
    if (storedTempList) {
      setTempList(JSON.parse(storedTempList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tempList", JSON.stringify(tempList));
  }, [tempList]);

  return (
    <TempListContext.Provider value={{ tempList, setTempList }}>
      {children}
    </TempListContext.Provider>
  );
};

export const useTempList = () => {
  return useContext(TempListContext);
};

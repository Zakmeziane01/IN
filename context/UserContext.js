// UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [responses, setResponses] = useState({});

  const updateResponse = (key, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [key]: value,
    }));
  };

  const getResponses = () => responses;

  return (
    <UserContext.Provider value={{ updateResponse, getResponses }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
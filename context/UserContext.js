// UserContext.js     used for storing user-specific responses. It allows you to update and retrieve response data based on a key-value pair
import React, { createContext, useState, useContext } from 'react';

/**
 * Context provider for managing user responses and providing access to update and retrieve responses.
 * @param {Object} children - The child components that will have access to the user context.
 * @returns JSX element that wraps the child components with the UserContext provider.
 */

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
// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        const fetchUserData = async (authToken) => {
            try {
                const response = await fetch('http://localhost:5000/api/user', {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Fetch user data failed:", error);
                setUser(null);
            }
        };

        if (authToken) {
            fetchUserData(authToken);
        } else {
            setUser(null);
        }
    }, [authToken]);

    return (
        <UserContext.Provider value={{ user, setAuthToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

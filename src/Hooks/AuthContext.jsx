/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = () => {
            const savedUser = localStorage.getItem('@UrbanCandy:user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        loadStorageData();
    }, []);

    const login = (userData) => {
        const userToSave = userData.user || userData;
        setUser(userToSave);
        localStorage.setItem('@UrbanCandy:user', JSON.stringify(userToSave));
        if (userData.token) {
            localStorage.setItem('@UrbanCandy:token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('@UrbanCandy:user');
        localStorage.removeItem('@UrbanCandy:token');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
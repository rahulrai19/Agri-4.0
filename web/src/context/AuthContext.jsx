import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Login failed"
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', { name, email, password });
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Registration failed"
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

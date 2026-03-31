import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAPI } from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const { ok, data } = await fetchAPI('/auth/me');
            if (ok) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
            } else {
                // If unauthorized, clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (err) {
            console.error('Failed to fetch user', err);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const switchMode = async () => {
        const newMode = user.mode === 'demo' ? 'live' : 'demo';
        try {
            const { ok, data } = await fetchAPI('/user/switch-mode', {
                method: 'POST',
                body: JSON.stringify({ mode: newMode })
            });
            if (ok) {
                const updatedUser = { ...user, mode: data.mode };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (err) {
            console.error('Switch mode error', err);
        }
        return null;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout, switchMode }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

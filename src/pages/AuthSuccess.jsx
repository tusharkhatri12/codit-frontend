import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setToken } from '../utils/api';
import { useUser } from '../context/UserContext';

export default function AuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useUser();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        const userStr = query.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                setToken(token, user);
                setUser(user);
                
                // Show a brief loading state/message? No, redirect instantly for smooth flow
                navigate('/dashboard');
            } catch (err) {
                console.error('Failed to parse Google user data', err);
                navigate('/login?error=oauth_failed');
            }
        } else {
            navigate('/login');
        }
    }, [location, navigate, setUser]);

    return (
        <div className="min-h-screen bg-[#0c1324] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">Authenticating Google Session...</p>
            </div>
        </div>
    );
}

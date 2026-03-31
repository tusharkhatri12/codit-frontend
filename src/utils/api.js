export const API_URL = import.meta.env.VITE_API_URL || 'https://codit-backend.onrender.com/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://codit-backend.onrender.com';

export const getAuthToken = () => localStorage.getItem('token');

export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const setToken = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const fetchAPI = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
};

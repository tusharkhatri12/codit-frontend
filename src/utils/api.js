const API_URL = 'http://localhost:5000/api';

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

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
};

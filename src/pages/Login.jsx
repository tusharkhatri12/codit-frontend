import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAPI, setToken } from '../utils/api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const { ok, data } = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (ok) {
                setToken(data.token, data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden w-full">
            <div className="absolute top-0 left-0 w-full p-4 sm:p-6 md:p-8 flex justify-between items-center z-10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl signature-gradient flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-sm font-bold">code</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-on-surface">Codit</span>
                </Link>
                <Link to="/signup" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer px-4 py-2">
                    Sign Up
                </Link>
            </div>

            <main className="w-full max-w-md z-10 relative mt-16 sm:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50"></div>

                <div className="bg-surface-container-lowest/80 backdrop-blur-3xl rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-outline-variant/10 relative overflow-hidden group">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 mx-auto rounded-2xl signature-gradient flex items-center justify-center text-white shadow-lg mb-4">
                            <span className="material-symbols-outlined text-2xl font-bold">lock</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-on-surface mb-2">Welcome back</h1>
                        <p className="text-sm text-on-surface-variant/80 font-medium">Enter your details to access your dashboard.</p>
                    </div>

                    <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface border border-outline-variant/30 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm mb-6">
                        <img alt="Google logo icon" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsZ4yA3vBthV1jO9bW5i-yQ_96fIARu3-vV75JXY5Y1D68N9FkZ_x6RjG6eE2H2-zL8h1UfN19F_kSj6kU7s7M8-L6Q_G-s6hRQd_K5h2J4yC1oGkQ9hZ8G9eX3yKk1jG_4ZlM8yQo9fX6E0aU6K1P8P1s7P3A2C1_5xT_3YVz5H7y9T5n8P_x8P5G6M3Q_V8T4G9W9v" />
                        Log in with Google
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Or</span>
                        <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-error/10 text-error text-sm font-medium border border-error/20 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="email">Email</label>
                            <input 
                                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40" 
                                id="email" 
                                placeholder="alex@company.com" 
                                required 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1" htmlFor="password">Password</label>
                                <a className="text-[11px] font-bold text-primary hover:underline mb-0.5" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <input 
                                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/40 pr-10" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    autoComplete="current-password"
                                    required 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                                    <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3.5 mt-4 rounded-xl signature-gradient text-white font-bold text-sm shadow-[0_8px_20px_rgba(70,71,211,0.25)] hover:shadow-[0_10px_25px_rgba(70,71,211,0.35)] active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> : 'Log In'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

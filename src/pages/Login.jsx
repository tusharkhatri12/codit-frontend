import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAPI, setToken } from '../utils/api';
import { useUser } from '../context/UserContext';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('🚀 Login attempt for:', email);
        
        try {
            const { ok, data } = await fetchAPI('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            console.log('📦 Login response:', { ok, status: data.status, error: data.error });

            if (ok) {
                console.log('✅ Login successful, updating context and redirecting...');
                setToken(data.token, data.user);
                setUser(data.user);
                navigate('/dashboard');
            } else {
                console.log('❌ Login failed:', data.error);
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('🔥 Login network/server error:', err);
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0c1324', color: '#dce1fb', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .font-headline { font-family: 'Manrope', sans-serif !important; }
                .font-body { font-family: 'Inter', sans-serif !important; }
                
                .glass-card {
                    background: rgba(46, 52, 71, 0.4);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .glow-shadow {
                    box-shadow: 0 0 40px 0 rgba(208, 188, 255, 0.06);
                }
                .input-focus-line {
                    position: relative;
                }
                .input-focus-line::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 1px;
                    background: #d0bcff;
                    transition: width 0.3s ease, left 0.3s ease;
                }
                .input-focus-line:focus-within::after {
                    width: 100%;
                    left: 0;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #d0bcff, #a078ff);
                    color: #23005c;
                }
                
                input::placeholder {
                    color: rgba(144, 143, 160, 0.4);
                }
            `}</style>

            {/* Top Navigation Shell */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-slate-50 font-headline no-underline">CODIT</Link>
                    <nav className="hidden md:flex gap-8 items-center">
                        <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors font-body text-sm font-medium no-underline">Back to Home</Link>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="px-5 py-2 rounded-xl text-indigo-400 hover:bg-white/5 transition-all duration-300 font-medium no-underline">Login</Link>
                            <Link to="/signup" className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#d0bcff] to-[#a078ff] text-[#23005c] font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)] transition-all no-underline">Sign Up</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#d0bcff]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#ffb783]/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Login Container */}
                <div className="w-full max-w-md relative z-10">
                    {/* Glassmorphic Login Card */}
                    <div className="glass-card glow-shadow rounded-[2rem] p-8 md:p-12 border border-[#464554]/15">
                        <div className="mb-10">
                            <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-[#dce1fb] mb-3">Welcome Back</h1>
                            <p className="text-[#c7c4d7] text-sm leading-relaxed">Access your RTO intelligence dashboard.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-400/10 text-red-300 text-sm font-medium border border-red-400/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-8">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold uppercase tracking-widest text-[#c7c4d7] font-label ml-1">Email Address</label>
                                <div className="input-focus-line bg-[#070d1f] rounded-xl">
                                    <input 
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        className="w-full bg-transparent border-none py-4 px-5 text-[#dce1fb] placeholder:text-[#908fa0]/40 focus:ring-0" 
                                        placeholder="name@company.com" 
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#c7c4d7] font-label ml-1">Password</label>
                                    <Link to="#" className="text-xs font-medium text-[#d0bcff] hover:text-[#a078ff] transition-colors no-underline">Forgot Password?</Link>
                                </div>
                                <div className="input-focus-line bg-[#070d1f] rounded-xl">
                                    <input 
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        className="w-full bg-transparent border-none py-4 px-5 text-[#dce1fb] placeholder:text-[#908fa0]/40 focus:ring-0" 
                                        placeholder="••••••••" 
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* CTA Button */}
                            <div className="pt-4">
                                <button 
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-[#d0bcff] to-[#a078ff] text-[#23005c] font-bold text-lg hover:shadow-[0_0_30px_rgba(208,188,255,0.3)] active:scale-[0.98] transition-all duration-200 disabled:opacity-70" 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-10 text-center">
                            <p className="text-sm text-[#c7c4d7]">
                                Don't have an account? 
                                <Link to="/signup" className="text-[#d0bcff] font-semibold hover:underline underline-offset-4 decoration-2 ml-1 no-underline">Create one now</Link>
                            </p>
                        </div>
                    </div>

                    {/* Asymmetric Decorative Element */}
                    <div className="mt-12 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#d0bcff]/30 to-transparent"></div>
                        <span className="material-symbols-outlined text-[#d0bcff]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#d0bcff]/30 to-transparent"></div>
                    </div>
                </div>
            </main>

            {/* Footer Component */}
            <footer className="bg-slate-950 w-full py-12">
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-8 mb-2">
                        <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-[#a078ff] transition-colors no-underline" href="#">Privacy</a>
                        <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-[#a078ff] transition-colors no-underline" href="#">Terms</a>
                        <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-[#a078ff] transition-colors no-underline" href="#">Security</a>
                    </div>
                    <p className="font-body text-xs uppercase tracking-widest text-slate-500">© 2024 CODIT. Secure Encryption Enabled.</p>
                </div>
            </footer>

            {/* Background texture/light leak effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIZEAMShvxACXUFV1TyrlOz_JdKEVTosgHOadIDCnimWbIupvQkHrlUps3Wz1KAfvvamj83hZ2snpRXj0wkPaiaRiwoJwpzgJAXjDDdKRRTHgDkLoYyVY1gSxNrJi6_JAEgFErqzgDLN0sUBCWdpZW0qTv99-Kobnu0nocQ8aHH1Bt9CCywbVt313_5Ah9z28KVwgTP_h-1LodqGm-necrqlI8vtQheFc91_lilAUSPj_0-eBsZutWUgYGgygnTZRamC6WwJIUNQE')" }}></div>
            </div>
        </div>
    );
}

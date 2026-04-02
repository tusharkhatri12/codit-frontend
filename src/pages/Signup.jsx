import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAPI, setToken } from '../utils/api';
import { useUser } from '../context/UserContext';

export default function Signup() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('🚀 Signup attempt for:', email);

        try {
            const name = `${firstName} ${lastName}`.trim();
            const { ok, data } = await fetchAPI('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password,
                    role: 'user' // Corrected from 'merchant' to match backend enum
                })
            });

            console.log('📦 Signup response:', { ok, status: data.status, error: data.error });

            if (ok) {
                console.log('✅ Signup successful, updating context and redirecting...');
                setToken(data.token, data.user);
                setUser(data.user);
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                console.log('❌ Signup failed:', data.error);
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            console.error('🔥 Signup network/server error:', err);
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0c1324', color: '#dce1fb', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                .glow-border {
                    position: relative;
                }
                .glow-border::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 1.5rem;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(208, 188, 255, 0.2), transparent, transparent);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                
                input::placeholder {
                    color: rgba(199, 196, 215, 0.3);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #d0bcff, #a078ff);
                    color: #23005c;
                }
            `}</style>
            
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex justify-between items-center px-8 py-4 w-full max-w-7xl mx-auto font-manrope tracking-tight">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-slate-50 no-underline">CODIT</Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors no-underline text-sm font-medium">Back to Home</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium no-underline">Login</Link>
                        <Link to="/signup" className="bg-indigo-400 text-[#23005c] px-5 py-2 rounded-xl text-sm font-bold hover:scale-95 transition-all duration-300 no-underline">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
                {/* Ambient Glow Leaks */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d0bcff] opacity-[0.06] blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#ffb783] opacity-[0.04] blur-[100px] rounded-full"></div>
                
                <div className="w-full max-w-xl relative">
                    {/* Urgency Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e3447]/50 backdrop-blur-md rounded-full border border-[#d0bcff]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb783] animate-pulse-slow"></span>
                            <span className="font-headline text-[10px] uppercase tracking-[0.15em] text-[#ffb783] font-bold">Limited Early Access Slots</span>
                        </div>
                    </div>

                    {/* Signup Card */}
                    <div className="glass-card glow-border p-8 md:p-12 rounded-[2rem] shadow-2xl">
                        <div className="text-center mb-10">
                            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-[#dce1fb] mb-4">Join CODIT</h1>
                            <p className="text-[#c7c4d7] text-lg max-w-sm mx-auto">
                                Secure your early access to CODIT today.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-400/10 text-red-300 text-sm font-medium border border-red-400/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label className="block font-label text-xs uppercase tracking-widest text-[#c7c4d7] font-semibold ml-1" htmlFor="firstName">First Name</label>
                                    <div className="relative group">
                                    <input 
                                        id="firstName"
                                        name="firstName"
                                        autoComplete="given-name"
                                        className="w-full bg-transparent border-none border-b border-[#464554]/30 text-[#dce1fb] py-4 px-0 focus:ring-0 focus:border-[#d0bcff] transition-all placeholder:text-[#c7c4d7]/30" 
                                        placeholder="John" 
                                        type="text" 
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#d0bcff] group-focus-within:w-full group-focus-within:left-0 transition-all duration-500"></div>
                                </div>
                                </div>
                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label className="block font-label text-xs uppercase tracking-widest text-[#c7c4d7] font-semibold ml-1" htmlFor="lastName">Last Name</label>
                                    <div className="relative group">
                                    <input 
                                        id="lastName"
                                        name="lastName"
                                        autoComplete="family-name"
                                        className="w-full bg-transparent border-none border-b border-[#464554]/30 text-[#dce1fb] py-4 px-0 focus:ring-0 focus:border-[#d0bcff] transition-all placeholder:text-[#c7c4d7]/30" 
                                        placeholder="Doe" 
                                        type="text" 
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#d0bcff] group-focus-within:w-full group-focus-within:left-0 transition-all duration-500"></div>
                                </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block font-label text-xs uppercase tracking-widest text-[#c7c4d7] font-semibold ml-1" htmlFor="email">Work Email</label>
                                <div className="relative group">
                                    <input 
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        className="w-full bg-transparent border-none border-b border-[#464554]/30 text-[#dce1fb] py-4 px-0 focus:ring-0 focus:border-[#d0bcff] transition-all placeholder:text-[#c7c4d7]/30" 
                                        placeholder="name@company.com" 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#d0bcff] group-focus-within:w-full group-focus-within:left-0 transition-all duration-500"></div>
                                </div>
                            </div>


                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block font-label text-xs uppercase tracking-widest text-[#c7c4d7] font-semibold ml-1" htmlFor="password">Password</label>
                                <div className="relative group flex items-center">
                                    <input 
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        className="w-full bg-transparent border-none border-b border-[#464554]/30 text-[#dce1fb] py-4 px-0 focus:ring-0 focus:border-[#d0bcff] transition-all placeholder:text-[#c7c4d7]/30 pr-10" 
                                        placeholder="••••••••" 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 text-[#c7c4d7] hover:text-[#d0bcff] transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? "visibility" : "visibility_off"}
                                        </span>
                                    </button>
                                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#d0bcff] group-focus-within:w-full group-focus-within:left-0 transition-all duration-500"></div>
                                </div>
                            </div>

                            {/* CTA */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-8 group relative overflow-hidden btn-primary text-[#23005c] py-5 rounded-2xl font-headline font-extrabold text-lg tracking-tight hover:shadow-[0_0_40px_rgba(208,188,255,0.3)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>

                            {/* Google Login Button */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#464554]/20"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="bg-[#121a2d] px-4 text-slate-500">Secure Protocol</span>
                                </div>
                            </div>

                            <a 
                                href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`}
                                className="w-full py-4 px-6 rounded-2xl bg-[#1e2536] border border-[#464554]/20 text-[#dce1fb] font-bold text-sm flex items-center justify-center gap-4 hover:bg-[#252c3e] transition-all no-underline group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </a>
                        </form>

                        {/* Login Link */}
                        <div className="mt-8 text-center">
                            <p className="text-[#c7c4d7] text-sm">
                                Already have an account? 
                                <Link to="/login" className="text-[#d0bcff] font-bold hover:underline underline-offset-4 ml-1 transition-all no-underline">Login</Link>
                            </p>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <p className="text-[#c7c4d7]/60 text-[10px] leading-relaxed max-w-[280px] mx-auto uppercase tracking-wider">
                                By signing up, you agree to our <a className="hover:text-[#d0bcff] transition-colors no-underline" href="#">Terms of Service</a> & <a className="hover:text-[#d0bcff] transition-colors no-underline" href="#">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>

                    {/* Sub-decoration */}
                    <div className="mt-12 flex justify-center gap-12 opacity-30">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#d0bcff] to-transparent"></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 w-full py-12">
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-8 mb-2">
                        <a className="font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors no-underline" href="#">Privacy</a>
                        <a className="font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors no-underline" href="#">Terms</a>
                        <a className="font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors no-underline" href="#">Security</a>
                    </div>
                    <p className="font-inter text-xs uppercase tracking-widest text-slate-500">© 2024 CODIT. Secure Encryption Enabled.</p>
                </div>
            </footer>
        </div>
    );
}

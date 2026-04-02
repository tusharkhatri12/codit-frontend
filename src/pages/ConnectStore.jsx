import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAPI } from '../utils/api';

export default function ConnectStore() {
    const navigate = useNavigate();
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = (e) => {
        e.preventDefault();
        setError('');
        
        let shop = domain.trim().toLowerCase();
        if (!shop) {
            setError('Please enter your Shopify store domain');
            return;
        }

        // Auto-format: append .myshopify.com if missing
        if (!shop.includes('.myshopify.com')) {
            shop = `${shop}.myshopify.com`;
        }
        
        // Remove protocol if user pasted it
        shop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

        setLoading(true);
        console.log("Redirecting to Shopify:", shop);

        const token = localStorage.getItem('token');
        const backendUrl = process.env.REACT_APP_API_URL || 'https://codit-backend.onrender.com';
        
        // Full page redirect to backend OAuth initiation
        // We pass the JWT token to identify the user in the callback
        window.location.href = `${backendUrl}/auth/shopify?shop=${shop}&token=${token}`;
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen flex flex-col w-full overflow-x-hidden">
            <header className="w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-sm tracking-tight border-b border-surface-container/50">
                <div className="flex items-center justify-between px-4 md:px-8 py-3 w-full">
                    <div className="flex items-center gap-4 md:gap-8">
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Codit</span>
                        <nav className="hidden md:flex items-center gap-6">
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">Onboarding</span>
                            <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">Docs</span>
                            <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">Help</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-lg cursor-pointer hover:text-indigo-600 transition-colors">settings</span>
                        </div>
                        <Link to="/login" className="text-slate-500 hover:text-indigo-600 transition-colors px-2 md:px-3 py-1.5 active:scale-95 duration-200 font-medium">Logout</Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-start pt-8 md:pt-16 pb-24 px-4 sm:px-6 relative w-full">
                <div className="w-full max-w-4xl lg:max-w-5xl mb-12 md:mb-16">
                    <div className="flex items-center justify-between relative px-2 sm:px-8">
                        <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-high -z-10">
                            <div className="h-full bg-primary w-1/6"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 rounded-full signature-gradient flex items-center justify-center text-white ring-8 ring-surface-bright shadow-md">
                                <span className="material-symbols-outlined text-lg md:text-xl">storefront</span>
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-on-surface tracking-tight text-center">Connect Shopify</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline ring-8 ring-surface-bright">
                                <span className="material-symbols-outlined text-lg md:text-xl">sync</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-on-surface-variant tracking-tight text-center">Sync Data</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline ring-8 ring-surface-bright">
                                <span className="material-symbols-outlined text-lg md:text-xl">check_circle</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-on-surface-variant tracking-tight text-center">Success</span>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full flex-grow">
                        <div className="bg-surface-container-lowest rounded-2xl md:rounded-[2rem] premium-shadow p-6 md:p-12 overflow-hidden relative w-full border border-outline-variant/10">
                            <div className="mb-6 md:mb-10">
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2 md:mb-4 block">Step 01 / 03</span>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-none mb-3 md:mb-5">Connect Shopify Store</h1>
                                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Enter your store URL to start the automated precision sync. Codit will analyze your inventory and order history in real-time to build your dashboard.</p>
                            </div>
                            
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-error/10 text-error text-sm font-medium border border-error/20 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleConnect} className="space-y-4 md:space-y-6 w-full">
                                <div className="space-y-2 w-full">
                                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="store-url">Shopify Domain</label>
                                    <div className="relative group w-full">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                                            <span className="material-symbols-outlined text-lg md:text-xl">link</span>
                                        </div>
                                        <input 
                                            className="w-full bg-surface-container-high border-none rounded-xl py-3 md:py-4 pl-12 pr-4 text-sm md:text-base text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300" 
                                            id="store-url" 
                                            placeholder="your-store.myshopify.com" 
                                            type="text" 
                                            required
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] md:text-[11px] text-outline px-1">Example: <span className="text-on-surface-variant italic">bloom-boutique.myshopify.com</span></p>
                                </div>
                                <button type="submit" disabled={loading} className="w-full signature-gradient text-white font-bold py-3 md:py-4 rounded-xl text-sm md:text-base inner-pressed active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 group shadow-md hover:shadow-lg disabled:opacity-75 relative">
                                    {loading ? (
                                        <span className="material-symbols-outlined animate-spin text-xl md:text-2xl">refresh</span>
                                    ) : (
                                        <>
                                            <span>Connect Shopify</span>
                                            <span className="material-symbols-outlined text-lg md:text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                                <div className="text-center mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/dashboard')}
                                        className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        Explore Demo instead
                                    </button>
                                </div>
                            </form>
                            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-surface-container/50 flex flex-col sm:flex-row items-center justify-between text-[11px] md:text-xs text-on-surface-variant gap-4 sm:gap-0">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm md:text-base text-emerald-600" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                                    <span className="font-semibold">OAuth 2.0 Secure Connection</span>
                                </div>
                                <a className="hover:text-primary transition-colors font-medium underline sm:no-underline" href="#">Why we need access?</a>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-72 xl:w-80 flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-6 flex-shrink-0">
                        <div className="flex-1 p-5 md:p-6 bg-surface-container-low rounded-xl md:rounded-2xl border border-outline-variant/10">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-surface-container-highest flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-primary text-sm md:text-base">database</span>
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-on-surface mb-1.5 md:mb-2">Zero Latency Sync</h3>
                            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Our edge nodes ensure your data is processed within milliseconds of the connection.</p>
                        </div>
                        <div className="flex-1 p-5 md:p-6 bg-surface-container-low rounded-xl md:rounded-2xl border border-outline-variant/10">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-surface-container-highest flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-primary text-sm md:text-base">shield</span>
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-on-surface mb-1.5 md:mb-2">Enterprise Privacy</h3>
                            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Data is encrypted at rest and in transit using bank-grade AES-256 protocols.</p>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 right-0 -z-20 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-20 blur-[100px] md:blur-[160px] pointer-events-none" style={{ background: "radial-gradient(circle, #4647d3 0%, transparent 70%)" }}></div>
            <div className="fixed top-0 left-0 -z-20 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-10 blur-[80px] md:blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, #6a37d4 0%, transparent 70%)" }}></div>
        </div>
    );
}

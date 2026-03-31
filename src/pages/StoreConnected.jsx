import React from 'react';
import { Link } from 'react-router-dom';

export default function StoreConnected() {
    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col items-center w-full overflow-x-hidden">
            <nav className="w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-sans antialiased text-sm tracking-tight flex items-center justify-between px-4 md:px-8 py-3 lg:border-none border-b border-surface-container/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Codit</span>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex gap-4">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-default">Onboarding</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <span className="material-symbols-outlined text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer hidden sm:block">settings</span>
                        <span className="material-symbols-outlined text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer hidden sm:block">notifications</span>
                        <div className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden shadow-sm">
                            <img alt="User profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUqXc-dUjbDESQipgaxYZ_RsTreRlswyHF_sL8LaM6ZdQhRZSAbGbycBpjd_mPKHQZ02WK-h0ZtVggNUsSIgzjNqqkUIeQADs7C2vUaZNkNcaRRcMGPKGnDvN0ohHo77FheN2vePnbr8P6106UZ3xCiUpN04lRIpv5Er9SF4iO6geLuQ7li4FlfMP3LwQLkCL5BPduPHCpsLMUEAUiClKFV0O6oWQBY4xzBDOjWjQKmPXPjsvYW9rDa82pzy9tXIyALbvPhTJbEF4"/>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-full max-w-4xl lg:max-w-5xl px-4 md:px-8 py-8 md:py-16 lg:py-20 flex flex-col items-center flex-grow">
                <div className="w-full max-w-2xl lg:max-w-3xl mb-12 flex justify-center px-2">
                    <div className="flex items-center justify-between w-full mb-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary -z-10 -translate-y-1/2 rounded-full"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full signature-gradient flex items-center justify-center text-white shadow-lg border-4 border-surface">
                                <span className="material-symbols-outlined text-sm md:text-base" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase bg-surface px-1">Verify</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full signature-gradient flex items-center justify-center text-white shadow-lg border-4 border-surface">
                                <span className="material-symbols-outlined text-sm md:text-base" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase bg-surface px-1">Connect</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full signature-gradient flex items-center justify-center text-white shadow-lg ring-4 ring-primary/20 border-4 border-surface">
                                <span className="material-symbols-outlined text-sm md:text-base" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase bg-surface px-1">Success</span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-[0px_8px_32px_rgba(44,47,49,0.06),0px_2px_8px_rgba(44,47,49,0.04)] border border-outline-variant/10 flex flex-col items-center text-center">
                    <div className="mb-8 md:mb-12 relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] md:blur-[60px] transform scale-150"></div>
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full signature-gradient flex items-center justify-center text-white shadow-2xl border-4 border-surface/50">
                            <span className="material-symbols-outlined text-5xl md:text-7xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight mb-3 md:mb-4">Your store is connected!</h1>
                    <p className="text-base md:text-xl text-emerald-600 font-bold mb-10 md:mb-16 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Protection is active securely
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl mx-auto mb-10 md:mb-16">
                        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 text-left flex items-start gap-4 md:gap-6 transition-transform hover:-translate-y-1 duration-300 border border-outline-variant/5">
                            <div className="p-3 md:p-4 rounded-xl bg-surface-container-lowest text-primary shadow-sm">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">inventory_2</span>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">12,482</div>
                                <div className="text-[10px] md:text-xs font-bold tracking-widest text-on-surface-variant uppercase mt-1">Orders imported</div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 text-left flex items-start gap-4 md:gap-6 transition-transform hover:-translate-y-1 duration-300 border border-outline-variant/5">
                            <div className="p-3 md:p-4 rounded-xl bg-surface-container-lowest text-error shadow-sm">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">gpp_maybe</span>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black text-error tracking-tight">47</div>
                                <div className="text-[10px] md:text-xs font-bold tracking-widest text-on-surface-variant uppercase mt-1">High-risk flags found</div>
                            </div>
                        </div>
                    </div>
                    
                    <Link to="/dashboard" className="w-full md:w-auto px-10 md:px-16 py-4 md:py-5 rounded-2xl md:rounded-full signature-gradient text-white font-bold text-base md:text-xl shadow-[0_8px_32px_rgba(70,71,211,0.3)] hover:shadow-[0_12px_40px_rgba(70,71,211,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                        Go to Dashboard
                        <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
                    </Link>
                </div>
                
                <div className="mt-12 md:mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl">
                    <div className="flex items-center sm:flex-col sm:text-center md:flex-row md:text-left gap-4 group bg-surface-container-lowest sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none shadow-sm sm:shadow-none border border-outline-variant/10 sm:border-none">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">bolt</span>
                        </div>
                        <div>
                            <div className="text-sm md:text-base font-bold text-on-surface mb-0.5 sm:mb-1">Auto-Sync</div>
                            <div className="text-xs md:text-sm text-emerald-600 font-medium">Enabled &amp; Active</div>
                        </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:text-center md:flex-row md:text-left gap-4 group bg-surface-container-lowest sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none shadow-sm sm:shadow-none border border-outline-variant/10 sm:border-none">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">security</span>
                        </div>
                        <div>
                            <div className="text-sm md:text-base font-bold text-on-surface mb-0.5 sm:mb-1">SSL Shield</div>
                            <div className="text-xs md:text-sm text-emerald-600 font-medium">Connection Secure</div>
                        </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:text-center md:flex-row md:text-left gap-4 group bg-surface-container-lowest sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none shadow-sm sm:shadow-none border border-outline-variant/10 sm:border-none">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-2xl md:text-3xl">monitoring</span>
                        </div>
                        <div>
                            <div className="text-sm md:text-base font-bold text-on-surface mb-0.5 sm:mb-1">Analysis</div>
                            <div className="text-xs md:text-sm text-emerald-600 font-medium">Real-time processing</div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto w-full py-8 text-center text-on-surface-variant bg-surface border-t border-outline-variant/10">
                <p className="text-xs md:text-sm font-bold tracking-widest uppercase">Codit Precision Analytics • © 2024</p>
            </footer>
        </div>
    );
}

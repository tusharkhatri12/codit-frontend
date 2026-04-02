import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAPI } from '../utils/api';

export default function SyncingData() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState({ ordersFound: 0, customersLinked: 0 });
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const shop = query.get('shop');

        if (!shop) {
            console.error('No shop provided for sync');
            // Mock simulation as fallback
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        navigate('/dashboard?connected=true');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 100);
            return () => clearInterval(interval);
        }

        const pollSyncStatus = async () => {
            try {
                const { ok, data: responseBody } = await fetchAPI(`/shops/sync-status?shop=${shop}`);

                if (ok && responseBody?.success) {
                    const { syncProgress, ordersFound, customersLinked, syncStatus } = responseBody.data;
                    setProgress(syncProgress || 0);
                    setStats({ 
                        ordersFound: ordersFound || 0, 
                        customersLinked: customersLinked || 0 
                    });
                    setStatus(syncStatus);
                    setError(null);

                    if (syncStatus === 'completed' || syncProgress >= 100) {
                        setTimeout(() => navigate(`/dashboard?connected=true&shop=${shop}`), 2000);
                        return true; // Stop polling
                    }
                } else {
                    console.warn('Sync status not ready or failed:', data?.error);
                    // Don't set hard error yet, might be transient
                }
            } catch (err) {
                console.error('Failed to poll sync status:', err);
                setError('Unable to reach sync server. Retrying...');
            }
            return false;
        };

        // Initial poll
        pollSyncStatus();

        // Polling interval
        const interval = setInterval(async () => {
            const finished = await pollSyncStatus();
            if (finished) clearInterval(interval);
        }, 2000);

        return () => clearInterval(interval);
    }, [navigate, location]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 text-on-surface w-full overflow-x-hidden relative">
            
            {/* Background Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>
            
            <div className="w-full max-w-5xl xl:max-w-6xl space-y-8 md:space-y-12">
                <div className="flex justify-center mb-4 md:mb-8">
                    <span className="text-3xl md:text-4xl font-black tracking-tighter signature-gradient bg-clip-text text-transparent">Codit</span>
                </div>

                <nav aria-label="Progress" className="relative w-full max-w-3xl mx-auto px-4 md:px-0">
                    <div aria-hidden="true" className="absolute top-1/2 left-4 right-4 md:left-0 md:right-0 h-0.5 bg-surface-container-high -translate-y-1/2"></div>
                    <ul className="relative flex justify-between items-center w-full">
                        <li className="flex flex-col items-center bg-surface px-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm z-10 border-4 border-surface">
                                <span className="material-symbols-outlined text-sm md:text-lg">check</span>
                            </div>
                            <span className="mt-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-on-surface-variant">Account</span>
                        </li>
                        <li className="flex flex-col items-center bg-surface px-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full signature-gradient flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 z-10 border-4 border-surface">
                                <span className="font-bold text-sm md:text-base">2</span>
                            </div>
                            <span className="mt-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-primary">Syncing</span>
                        </li>
                        <li className="flex flex-col items-center bg-surface px-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant z-10 border-4 border-surface">
                                <span className="font-bold text-sm md:text-base">3</span>
                            </div>
                            <span className="mt-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-on-surface-variant">Review</span>
                        </li>
                    </ul>
                </nav>

                <section className="bg-surface-container-lowest rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 lg:p-16 shadow-[0px_4px_24px_rgba(44,47,49,0.04),0px_2px_8px_rgba(44,47,49,0.06)] border border-outline-variant/10 text-center space-y-8 md:space-y-10 w-full">
                    <header className="space-y-3 md:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface">Syncing your Data</h1>
                        <p className="text-base md:text-lg lg:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed px-2">Analyzing order history and risk profiles to build your precision analytics dashboard.</p>
                    </header>

                    <div className="max-w-xl mx-auto space-y-3 md:space-y-4 w-full">
                        <div className="h-2 md:h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] transition-all duration-75 easelinear" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm font-medium">
                            <span className="text-primary font-bold">{progress}% Complete</span>
                            <span className="text-on-surface-variant flex items-center gap-1.5 md:gap-2">
                                <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${error ? 'bg-error' : 'bg-primary'} animate-pulse`}></span>
                                {error || 'Processing Data'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6 w-full max-w-4xl mx-auto">
                        <div className="bg-surface-container-low p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[1.5rem] text-left transition-transform hover:-translate-y-1 duration-300 shadow-sm md:shadow-none border border-outline-variant/5">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-lowest flex items-center justify-center mb-3 md:mb-5 text-primary shadow-sm">
                                <span className="material-symbols-outlined text-lg md:text-2xl">shopping_cart</span>
                            </div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-on-surface mb-1">{(stats?.ordersFound || 0).toLocaleString()}</div>
                            <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant">Orders found</div>
                        </div>
                        <div className="bg-surface-container-low p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[1.5rem] text-left transition-transform hover:-translate-y-1 duration-300 shadow-sm md:shadow-none border border-outline-variant/5">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-lowest flex items-center justify-center mb-3 md:mb-5 text-secondary shadow-sm">
                                <span className="material-symbols-outlined text-lg md:text-2xl">group</span>
                            </div>
                            <div className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-on-surface mb-1">{(stats?.customersLinked || 0).toLocaleString()}</div>
                            <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant">Customers linked</div>
                        </div>
                        <div className="bg-surface-container-low p-4 md:p-6 lg:p-8 rounded-[1rem] md:rounded-[1.5rem] text-left transition-transform hover:-translate-y-1 duration-300 shadow-sm md:shadow-none border border-outline-variant/5">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-lowest flex items-center justify-center mb-3 md:mb-5 text-error shadow-sm">
                                <span className="material-symbols-outlined text-lg md:text-2xl">security</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-on-surface">Scanning</div>
                                <span className="flex gap-0.5 md:gap-1">
                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-error rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-error rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-error rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                                </span>
                            </div>
                            <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1 md:mt-2">Risk mapping</div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center w-full">
                    <div className="lg:col-span-7 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-surface-container-high aspect-video relative shadow-md border border-outline-variant/10 w-full group">
                        <img alt="Dashboard sync visualization" className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:opacity-60 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDZ2Y51gUANn3FXflIPn9Jbc1N31YCeOFPUSiDPTN4enbKEBoux2eCQ9jnugiOlWudCWGT5S5d4okMlgoBKEIu_C7N_CqjJdCcby0oHCp6z_WSlQC8Uecgqjys6_twYgqIeddRLcoMRXhwYsZ9-BD-Z1k8VsyJ1bYgzdaSrLPphK2bC27J37JH98x7BFa0Xtu9xPAcK8aGGrofwSdOEfiw7gAiphmWSRERkD2JfO08bcpoElsspQ1n6EgGOn1OXTpuo4gDyJhial0"/>
                        <div className="absolute inset-0 signature-gradient opacity-10 md:opacity-15"></div>
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 border border-white/20">
                            <div className="p-2 md:p-3 bg-primary/20 rounded-full text-white">
                                <span className="material-symbols-outlined text-base md:text-xl">verified_user</span>
                            </div>
                            <div>
                                <p className="text-xs md:text-sm font-bold text-white tracking-tight">Enterprise Encryption Active</p>
                                <p className="text-[10px] md:text-xs text-white/80 leading-snug hidden sm:block">Your data is secured with AES-256 protocols during transit.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-5 space-y-6 md:space-y-8 px-2 md:px-4">
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">While you wait...</h3>
                            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">We are cross-referencing global blacklists and historical chargeback patterns to provide your accurate initial Risk Score.</p>
                        </div>
                        <ul className="space-y-3 md:space-y-5">
                            <li className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                                <div className="mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">check</span>
                                </div>
                                <span className="text-sm md:text-base text-on-surface font-semibold">Validating store credentials & APIs</span>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                                <div className="mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <span className="material-symbols-outlined text-[14px] md:text-[16px]">check</span>
                                </div>
                                <span className="text-sm md:text-base text-on-surface font-semibold">Downloading last 24 months of data</span>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-dashed border-outline-variant/30 opacity-70">
                                <div className="mt-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-on-surface-variant/50 flex-shrink-0">
                                    <span className="material-symbols-outlined text-[14px] md:text-[16px] animate-spin">refresh</span>
                                </div>
                                <span className="text-sm md:text-base text-on-surface-variant italic font-medium">Generating predictive behavior models</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 pt-8 md:pt-12 border-t border-outline-variant/10 w-full px-4 md:px-0">
                    <p className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-[0.1em] text-center sm:text-left">
                        ESTIMATED TIME: <span className="text-primary">{Math.max(1, Math.ceil((100 - progress) * 0.05))} SECONDS</span>
                    </p>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl md:rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95 shadow-sm" onClick={() => navigate('/dashboard')}>
                        Cancel Sync
                    </button>
                </footer>
            </div>
        </main>
    );
}

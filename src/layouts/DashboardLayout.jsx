import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { fetchAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import TourManager from '../tour/TourManager';

export default function DashboardLayout() {
    const { user, switchMode, logout, loading: userLoading } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitchMode = async () => {
        setSwitching(true);
        try {
            const updatedUser = await switchMode();
            if (updatedUser && updatedUser.mode === 'live') {
                const shopOk = await checkShopConnection();
                if (!shopOk) {
                    navigate('/connect');
                }
            }
        } catch (err) {
            console.error('Failed to switch mode', err);
        } finally {
            setSwitching(false);
        }
    };

    const checkShopConnection = async () => {
        try {
            const { ok, data } = await fetchAPI('/shops');
            return ok && data.count > 0;
        } catch (err) {
            return false;
        }
    };

    const getPageTitle = () => {
        if (location.pathname.includes('/orders')) return 'Orders';
        if (location.pathname.includes('/risk-patterns')) return 'Risk Patterns';
        if (location.pathname.includes('/analytics')) return 'Analytics';
        if (location.pathname.includes('/settings')) return 'Settings';
        return 'Dashboard';
    };

    const getSearchPlaceholder = () => {
        if (location.pathname.includes('/orders')) return 'Search orders, customers...';
        return 'Search everything...';
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!user && !userLoading) return null;

    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer select-none font-medium text-sm ` +
        (isActive 
            ? "text-[#d0bcff] font-bold bg-[#2e3447]/50 scale-95 duration-150 shadow-[0_0_15px_rgba(208,188,255,0.1)]" 
            : "text-slate-400 hover:bg-[#151b2d] hover:text-white");

    return (
        <div className="flex bg-[#0c1324] text-[#dce1fb] h-full min-h-screen overflow-hidden font-body antialiased">
            <TourManager />
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`h-screen w-64 fixed left-0 top-0 flex flex-col bg-[#0c1324] font-headline z-50 overflow-y-auto transform transition-transform duration-300 border-r border-outline-variant/10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="mb-10 px-2">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black tracking-tighter text-[#d0bcff]">CODIT</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Technical Prestige</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2 flex-grow">
                        <NavLink to="/dashboard" end className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                            <span className="material-symbols-outlined">dashboard</span>
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink id="tour-nav-orders" to="/dashboard/orders" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span>Orders</span>
                        </NavLink>
                        <NavLink to="/dashboard/risk-patterns" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                            <span className="material-symbols-outlined">security</span>
                            <span>Risk Patterns</span>
                        </NavLink>
                        <NavLink to="/dashboard/analytics" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                            <span className="material-symbols-outlined">analytics</span>
                            <span>Analytics</span>
                        </NavLink>
                        <NavLink to="/dashboard/settings" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </NavLink>
                    </nav>

                    <div className="mt-8 space-y-4">
                        {/* Mode Toggle Section (Sidebar Upgrade) */}
                        <div className={`p-4 rounded-2xl border ${user?.mode === 'live' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#2e3447]/40 border-outline-variant/10'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${user?.mode === 'live' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {user?.mode === 'live' ? 'Live System' : 'Internal Demo'}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${user?.mode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                            </div>
                            <button 
                                onClick={handleSwitchMode}
                                disabled={switching}
                                className={`w-full py-2.5 px-3 rounded-xl text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                                    user?.mode === 'live' 
                                    ? 'bg-[#151b2d] text-slate-300 hover:text-white' 
                                    : 'bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed shadow-[0_0_15px_rgba(208,188,255,0.2)]'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">{user?.mode === 'live' ? 'science' : 'rocket_launch'}</span>
                                {switching ? 'Switching...' : (user?.mode === 'live' ? 'Switch to Demo' : 'Go Live')}
                            </button>
                        </div>

                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-error/80 hover:text-error hover:bg-error/5 rounded-xl transition-all cursor-pointer font-medium text-sm">
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-64 min-h-screen flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden">
                
                {/* TopNavBar Component Integration */}
                <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 w-full bg-[#1b2336]/40 backdrop-blur-md border-b border-outline-variant/5 shadow-[0_20px_50px_rgba(208,188,255,0.06)] font-headline text-sm">
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                        <button className="lg:hidden text-slate-400 hover:text-white transition-colors shrink-0" onClick={() => setSidebarOpen(true)}>
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                        
                        <div className="hidden md:flex relative items-center w-full max-w-md focus-within:ring-1 focus-within:ring-[#d0bcff]/30 rounded-full bg-surface-container-lowest transition-all">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">search</span>
                            <input className="w-full bg-transparent border-none focus:ring-0 pl-12 py-2.5 text-on-surface text-xs md:text-sm" placeholder={getSearchPlaceholder()} type="text"/>
                        </div>
                        
                        <h2 className="text-lg font-black tracking-tighter text-on-surface md:hidden">{getPageTitle()}</h2>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        {/* Live Status Indicator */}
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border ${user?.mode === 'live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.mode === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {user?.mode === 'live' ? 'Live System' : 'Demo Mode'}
                        </div>

                        <button 
                            id="tour-start-tour"
                            onClick={() => window.dispatchEvent(new CustomEvent('start-product-tour'))}
                            className="hidden lg:flex items-center gap-2 text-slate-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-lg">explore</span>
                            Tour
                        </button>

                        <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-4">
                            <div className="relative group cursor-pointer">
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors" title="Notifications">notifications</span>
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full"></span>
                            </div>
                            
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    className="flex items-center gap-3 cursor-pointer p-0.5 rounded-full border-2 border-primary/20 hover:border-primary/40 transition-all overflow-hidden"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center text-primary font-black text-xs">
                                        {user?.avatar ? (
                                            <img alt="User profile" className="w-full h-full object-cover" src={user.avatar}/>
                                        ) : (
                                            getUserInitials()
                                        )}
                                    </div>
                                </div>

                                {/* Profile Dropdown Redesigned */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/10 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right backdrop-blur-xl">
                                        <div className="px-5 py-4 border-b border-outline-variant/10 mb-2">
                                            <p className="text-sm font-black text-on-surface">{user?.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        
                                        <div className="px-2 flex flex-col gap-1">
                                            <div className="flex mt-1 items-center justify-between px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span>Plan: {user?.plan}</span>
                                                <button className="text-primary hover:underline lowercase font-bold">Upgrade</button>
                                            </div>
                                            
                                            <button 
                                                onClick={handleSwitchMode}
                                                className="w-full flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-[#2e3447] rounded-xl transition-all text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg text-primary">{user?.mode === 'live' ? 'science' : 'rocket_launch'}</span>
                                                <span>{user?.mode === 'live' ? 'Enter Simulation' : 'Activate Live Mode'}</span>
                                            </button>
                                            
                                            <Link 
                                                to="/dashboard/settings"
                                                className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-[#2e3447] rounded-xl transition-all text-sm font-medium"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <span className="material-symbols-outlined text-lg text-slate-400">settings</span>
                                                <span>System Settings</span>
                                            </Link>
                                            
                                            <div className="h-[1px] bg-outline-variant/10 my-1 mx-2"></div>
                                            
                                            <button 
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-3 py-3 text-error/80 hover:text-error hover:bg-error/10 rounded-xl transition-all text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg">logout</span>
                                                <span>Terminate Session</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Rendered Here */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
                
                {/* Sticky Bottom Gradient for depth (from Stitch) */}
                <div className="fixed bottom-0 lg:left-64 right-0 h-24 bg-gradient-to-t from-[#0c1324] to-transparent pointer-events-none z-10"></div>
            </main>
        </div>
    );
}

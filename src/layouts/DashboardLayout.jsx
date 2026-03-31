import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { fetchAPI } from '../utils/api';
import { useUser } from '../context/UserContext';

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
            ? "bg-white text-indigo-600 shadow-sm font-semibold border-l-4 border-indigo-600 pl-3" 
            : "text-slate-600 hover:bg-slate-100 border-l-4 border-transparent pl-3");

    return (
        <div className="flex bg-slate-50 text-slate-900 h-full min-h-screen overflow-hidden font-body antialiased">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`h-screen w-72 fixed left-0 top-0 flex flex-col bg-slate-50 font-sans z-50 overflow-y-auto transform transition-transform duration-300 border-r border-slate-200/50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 flex flex-col gap-1">
                    <div className="mb-8 px-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">Codit AI</h1>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1 leading-none">Fraud Protection</p>
                            </div>
                        </div>
                    </div>

                    {/* Mode Toggle Section (Sidebar) */}
                    <div className="px-2 mb-8">
                        <div className={`p-3 rounded-2xl border ${user?.mode === 'live' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200'} transition-all`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${user?.mode === 'live' ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {user?.mode === 'live' ? 'Live Mode' : 'Demo Mode'}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${user?.mode === 'live' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`}></div>
                            </div>
                            <button 
                                onClick={handleSwitchMode}
                                disabled={switching}
                                className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                                    user?.mode === 'live' 
                                    ? 'bg-white text-slate-600 hover:bg-slate-50' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">{user?.mode === 'live' ? 'science' : 'rocket_launch'}</span>
                                {switching ? 'Switching...' : (user?.mode === 'live' ? 'Switch to Demo' : 'Go Live')}
                            </button>
                        </div>
                    </div>
                    
                    <nav className="flex flex-col gap-1 flex-1">
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
                </div>

                <div className="mt-auto pt-4 p-6 flex flex-col gap-1 border-t border-slate-200/50">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl mb-6 text-white shadow-lg shadow-indigo-500/20">
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1 leading-none">Current Plan</p>
                        <p className="text-sm font-bold mb-3 leading-none capitalize">{user?.plan || 'Starter'} Plan</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95">Manage Plan</button>
                    </div>
                    <a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer font-medium text-sm">
                        <span className="material-symbols-outlined text-sm">contact_support</span>
                        <span>Support</span>
                    </a>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer font-medium text-sm">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-72 min-h-screen flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden bg-white">
                
                {/* Unified Header */}
                <header className="w-full sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50">
                    <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 w-full h-[72px]">
                        <div className="flex items-center gap-4 flex-1">
                            <button className="lg:hidden text-slate-500 hover:text-indigo-600 transition-colors shrink-0" onClick={() => setSidebarOpen(true)}>
                                <span className="material-symbols-outlined text-2xl">menu</span>
                            </button>
                            <h2 className="text-xl font-bold tracking-tighter text-slate-900 hidden sm:block whitespace-nowrap min-w-[120px]">{getPageTitle()}</h2>
                            <span className="text-xl font-black tracking-tighter text-slate-900 sm:hidden whitespace-nowrap">Codit</span>

                            <div className="hidden md:flex relative items-center bg-slate-100 rounded-full px-4 py-1.5 flex-1 max-w-md xl:max-w-lg transition-all border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white">
                                <span className="material-symbols-outlined text-slate-400 text-lg mr-2 shrink-0">search</span>
                                <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-700 placeholder-slate-400" placeholder={getSearchPlaceholder()} type="text"/>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 md:gap-5 shrink-0 ml-4">
                            {/* Mode Badge (Header) */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${user?.mode === 'live' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user?.mode === 'live' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                {user?.mode === 'live' ? 'Live' : 'Demo'}
                            </div>

                            <button 
                                id="tour-start-tour"
                                onClick={() => window.dispatchEvent(new CustomEvent('start-product-tour'))}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[14px]">explore</span>
                                Product Tour
                            </button>

                            <button className="p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors rounded-full relative active:scale-95">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            
                            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block mx-1"></div>
                            
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-all"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'User'}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{user?.role || 'Member'}</p>
                                    </div>
                                    {user?.avatar ? (
                                        <img alt="User profile" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10 shadow-sm bg-slate-200" src={user.avatar}/>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-indigo-50">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                </div>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        
                                        <div className="px-2 flex flex-col gap-1">
                                            <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600">
                                                <span>Plan</span>
                                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg uppercase text-[9px]">{user?.plan}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600">
                                                <span>Environment</span>
                                                <span className={`${user?.mode === 'live' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} px-2 py-0.5 rounded-lg uppercase text-[9px]`}>{user?.mode}</span>
                                            </div>
                                            
                                            <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                                            
                                            <button 
                                                onClick={handleSwitchMode}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg text-slate-400">{user?.mode === 'live' ? 'science' : 'rocket_launch'}</span>
                                                <span>{user?.mode === 'live' ? 'Switch to Demo' : 'Go Live Now'}</span>
                                            </button>
                                            
                                            <Link 
                                                to="/dashboard/settings"
                                                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-sm font-medium"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <span className="material-symbols-outlined text-lg text-slate-400">settings</span>
                                                <span>Account Settings</span>
                                            </Link>
                                            
                                            <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                                            
                                            <button 
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg text-red-400">logout</span>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Rendered Here */}
                <Outlet />

            </main>
        </div>
    );
}

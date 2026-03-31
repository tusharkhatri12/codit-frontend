import React, { useState } from 'react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('General');

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
            <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Configuration</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your Codit integration, team members, and security preferences.</p>
            </div>

            {/* Settings Layout */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
                
                {/* Sidebar Navigation (Tabs in mobile, Sidebar in desktop) */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {['General', 'AI Engine', 'Team Members', 'Billing', 'API & Integrations'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'bg-slate-200 text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Settings Content */}
                <div className="flex-1 space-y-6 w-full">
                    {activeTab === 'General' && (
                        <div className="space-y-6">
                            {/* Profile Section */}
                            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/50">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Store Profile</h3>
                                
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                                    <div className="w-20 h-20 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm relative group overflow-hidden">
                                        <span className="material-symbols-outlined text-3xl">storefront</span>
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <span className="material-symbols-outlined text-white text-xl">edit</span>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-white border border-slate-200-high text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm mb-2">
                                            Upload Logo
                                        </button>
                                        <p className="text-xs text-slate-500">Recommended size: 256x256px. Max 2MB.</p>
                                    </div>
                                </div>

                                <form className="space-y-4 max-w-xl">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Store Name</label>
                                        <input type="text" defaultValue="Acme Electronics" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200-high rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Support Email</label>
                                        <input type="email" defaultValue="support@acme-electronics.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200-high rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Timezone</label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200-high rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-900 appearance-none cursor-pointer">
                                            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                            <option>(GMT+00:00) Coordinated Universal Time</option>
                                            <option>(GMT+01:00) Central European Time</option>
                                        </select>
                                    </div>
                                </form>
                            </section>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button className="px-5 py-2 hover:bg-slate-50 text-slate-500 text-sm font-medium rounded-xl transition-colors">Discard</button>
                                <button className="px-5 py-2 signature-gradient text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'AI Engine' && (
                        <div className="space-y-6">
                            {/* Protection Level Section */}
                            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/50">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">Global Protection Level</h3>
                                    <span className="px-3 py-1 bg-slate-200 rounded-full text-[10px] font-bold tracking-widest uppercase">Auto-Pilot</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-6">Adjusting this slider impacts the leniency of Codit's AI models. Stricter settings reduce fraud but may increase false positives.</p>

                                <div className="space-y-8">
                                    {/* Slider Mockup */}
                                    <div className="relative pt-6 pb-2">
                                        <div className="absolute top-0 left-0 text-[10px] font-bold text-tertiary">Lenient</div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">Balanced</div>
                                        <div className="absolute top-0 right-0 text-[10px] font-bold text-error">Strict</div>
                                        
                                        <div className="w-full h-2 bg-slate-200 rounded-full relative">
                                            <div className="absolute top-0 left-0 h-full w-1/2 signature-gradient rounded-l-full"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                                        </div>
                                    </div>

                                    {/* Sub-settings Toggles */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/50">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Auto-cancel High Risk</h4>
                                                <p className="text-xs text-slate-500 mt-1">Orders scoring over 90/100 will be instantly canceled.</p>
                                            </div>
                                            {/* Toggle switch */}
                                            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer flex-shrink-0">
                                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/50">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Require WhatsApp Verification</h4>
                                                <p className="text-xs text-slate-500 mt-1">Prompt 2FA for orders scoring between 60-89.</p>
                                            </div>
                                            {/* Toggle switch */}
                                            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer flex-shrink-0">
                                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200/50 opacity-60">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Behavioral Fingerprinting</h4>
                                                <p className="text-xs text-slate-500 mt-1">Track mouse movement and typing speed.</p>
                                            </div>
                                            {/* Toggle switch off */}
                                            <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer flex-shrink-0">
                                                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button className="px-5 py-2 hover:bg-slate-50 text-slate-500 text-sm font-medium rounded-xl transition-colors">Discard</button>
                                <button className="px-5 py-2 signature-gradient text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity">Save AI Preferences</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Placeholder for other tabs */}
                    {['Team Members', 'Billing', 'API & Integrations'].includes(activeTab) && (
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/50 flex flex-col items-center justify-center min-h-[400px] text-center">
                            <span className="material-symbols-outlined text-6xl text-surface-container-high mb-4">construction</span>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{activeTab} Settings</h3>
                            <p className="text-sm text-slate-500 max-w-sm">This settings pane is currently under construction. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

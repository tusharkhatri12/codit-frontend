import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background text-on-surface w-full overflow-x-hidden pt-4 md:pt-0">
            {/* TopNavBar */}
            <nav className="w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none flex items-center justify-between px-4 md:px-6 py-3">
                <div className="flex items-center gap-4 md:gap-8">
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Codit</span>
                    
                    <button className="md:hidden text-slate-500 absolute right-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>

                    <div className="hidden md:flex gap-6 items-center">
                        <a className="font-sans antialiased text-sm tracking-tight text-indigo-600 dark:text-indigo-400 font-semibold transition-colors" href="#">Features</a>
                        <a className="font-sans antialiased text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors" href="#">Pricing</a>
                        <a className="font-sans antialiased text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors" href="#">About</a>
                        <a className="font-sans antialiased text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors" href="#">Blog</a>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="font-sans antialiased text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors active:scale-95 duration-200">
                        Login
                    </Link>
                    <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold active:scale-95 duration-200 shadow-sm hover:opacity-90 transition-opacity">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-surface-container shadow-xl flex flex-col p-4 animate-in slide-in-from-top-4">
                        <a className="py-3 px-4 font-semibold text-indigo-600 border-b border-surface-container/30" href="#">Features</a>
                        <a className="py-3 px-4 font-medium text-slate-500 border-b border-surface-container/30" href="#">Pricing</a>
                        <a className="py-3 px-4 font-medium text-slate-500 border-b border-surface-container/30" href="#">About</a>
                        <a className="py-3 px-4 font-medium text-slate-500 border-b border-surface-container/30" href="#">Blog</a>
                        <div className="flex flex-col gap-3 pt-4">
                            <Link className="text-center font-bold text-slate-700 py-2 hover:bg-slate-50 rounded-lg" to="/login">Login</Link>
                            <Link className="w-full py-3 rounded-xl bg-primary text-white font-bold text-center shadow-md" to="/signup">Get Started</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-16 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-primary/10">
                        <span className="material-symbols-outlined text-xs md:text-sm">verified_user</span>
                        Introducing Codit Obsidian
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-on-surface mb-6 md:mb-8 leading-[1.05] md:leading-[0.9]">
                        Stop Losing Money on <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Fake COD Orders</span>
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
                        Codit detects risky orders, verifies customers via WhatsApp, and prevents costly RTO losses — automatically.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-20 w-full md:w-auto px-4">
                        <Link to="/signup" className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:opacity-90 transition-all active:scale-95 px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold flex items-center justify-center gap-2">
                            Get Started <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                        <button className="w-full sm:w-auto bg-surface-container-highest text-on-surface px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold hover:bg-surface-container-high transition-colors">
                            View Demo
                        </button>
                    </div>

                    {/* Mockup Preview */}
                    <div className="relative max-w-6xl mx-auto w-full px-2 md:px-0 mt-8">
                        <div className="absolute -top-12 -left-12 w-48 md:w-64 h-48 md:h-64 bg-primary/20 md:bg-primary/10 rounded-full blur-2xl md:blur-3xl opacity-50 pointer-events-none"></div>
                        <div className="absolute -bottom-12 -right-12 w-48 md:w-64 h-48 md:h-64 bg-secondary/20 md:bg-secondary/10 rounded-full blur-2xl md:blur-3xl opacity-50 pointer-events-none"></div>
                        
                        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative">
                            <div className="bg-surface rounded-xl md:rounded-2xl overflow-hidden border border-outline-variant/10 aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]">
                                <img 
                                    alt="Modern analytics dashboard interface showing risk scores, delivery maps, and transaction volume charts in a clean minimalist style" 
                                    className="w-full h-full object-cover opacity-95 mix-blend-multiply" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYmlsLmcY3LNrwQDyjSYiCkBCsOaqJ76iXrIUEVOC4m_WPmCbvsX8wUlh8Aytsp1qdggzufb5vdWKWvY4_l077Qg9r99Bbh9LAJ-6xyO82VksTZcV9D0i6pOM2OJ6_zPdGtAMcdLPcSiwo7IZ2_jlSYpr5lvsucOjUbnT5OIVLSWG81XQ6yJrCvRkYaoNZLqJZArtUkaqo6D0Pb2adncvIImLMVcymwtrA29IIwQUR8_gIGQb6g1ll0n7TqkJP3zpsgkK62x2zqqY"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem Section */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-surface-container-low w-full">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-10 md:mb-16 text-center">Why COD Orders Are Killing Your Profits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 cursor-default">
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0px_4px_24px_rgba(44,47,49,0.04),0px_2px_8px_rgba(44,47,49,0.06)] hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-error/10 text-error flex items-center justify-center mb-5 md:mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">dangerous</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Fake orders increase RTO</h3>
                            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Unverified cash-on-delivery orders lead to Return-to-Origin (RTO) rates as high as 40%, draining your inventory.</p>
                        </div>
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0px_4px_24px_rgba(44,47,49,0.04),0px_2px_8px_rgba(44,47,49,0.06)] hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-error/10 text-error flex items-center justify-center mb-5 md:mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">local_shipping</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Logistics cost wasted</h3>
                            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Shipping costs for returned orders are non-refundable, essentially burning money for every failed delivery attempt.</p>
                        </div>
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0px_4px_24px_rgba(44,47,49,0.04),0px_2px_8px_rgba(44,47,49,0.06)] hover:-translate-y-1 transition-transform">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-error/10 text-error flex items-center justify-center mb-5 md:mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">money_off</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Cash flow blocked</h3>
                            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Inventory stuck in transit for weeks restricts your ability to reinvest in growth and new stock.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-20 md:py-32 px-4 md:px-6 w-full relative overflow-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
                        <div className="lg:w-1/2 w-full text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-10 md:mb-12">How Codit Works</h2>
                            <div className="space-y-8 md:space-y-12 text-left w-full mx-auto max-w-lg lg:max-w-none">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl md:text-2xl shadow-md border-4 border-surface">1</div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold mb-2">Detect Risk</h4>
                                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">Our AI engine analyzes 50+ data points to flag suspicious shipping addresses and phone numbers instantly.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl md:text-2xl shadow-md border-4 border-surface">2</div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold mb-2">Verify via WhatsApp</h4>
                                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">Automated verification messages are sent to customers. They confirm with a single tap before you ship.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl md:text-2xl shadow-md border-4 border-surface">3</div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold mb-2">Save Money</h4>
                                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">Only real, confirmed orders are fulfilled. Your RTO drops, and your profits soar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
                            <div className="aspect-square bg-surface-container rounded-[2rem] md:rounded-[3rem] p-4 sm:p-8 flex items-center justify-center overflow-hidden relative border border-outline-variant/10 shadow-inner">
                                <div className="absolute inset-0 opacity-20 md:opacity-30">
                                    <img 
                                        alt="Conceptual visualization of data flowing through a network of glowing lines, symbolizing AI risk detection and verification systems" 
                                        className="w-full h-full object-cover" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOxjT6tlT86T7KycOGj6ktDK-2U0izEx1NWfHbO6wFUBLgW14ay5ikEldJU7SjvEjefJkwHc0CG4tkBKCIpC_Wk4dFUP1apLNhZF8Ay62zbrXK1PFPY8MuZO-3N-2GFMSS_Km15zGTrAAtCjIrz6rxzt7aE4BEIcwqITYb_l8QxTnomEOC2CLeRSaOFCYjhHsr9pq3FRVATE2sqi1GZW7dyGAicKNNyjsGvmQN7a9sIHn4Fe5wseBJo_N6MH4U0KJJzAjL8Xz34b4"
                                    />
                                </div>
                                
                                <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl w-full max-w-sm relative z-10 shadow-[0px_8px_32px_rgba(44,47,49,0.1)] border border-white/50 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E5F9EA] flex items-center justify-center shrink-0 border border-[#25D366]/20 shadow-sm">
                                            <span className="material-symbols-outlined text-[#25D366]">chat</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">WhatsApp Verification</p>
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">Sent Just Now</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#E5F9EA] text-[#0A2610] p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-sm mb-4 md:mb-5 shadow-sm ml-4">
                                        <p className="text-xs md:text-sm font-medium leading-snug">Hi Rahul! Please confirm your COD order <span className="font-bold text-[#25D366]">#4592</span> by clicking the button below.</p>
                                        <p className="text-[9px] md:text-[10px] text-right text-black/40 mt-1 uppercase tracking-widest font-bold">Codit Automated Agent</p>
                                    </div>
                                    
                                    <button className="w-full py-3 md:py-3.5 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#20bd5a] hover:shadow-lg active:scale-95 transition-all outline outline-offset-2 outline-transparent focus:outline-[#25D366]/50">
                                        Confirm Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section (Bento Grid Style) */}
            <section className="py-16 md:py-24 px-4 md:px-6 bg-surface w-full overflow-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-10 md:mb-16 text-center">Engineered for Shopify Stores</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                        {/* Large Feature */}
                        <div className="md:col-span-2 bg-surface-container-lowest p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-outline-variant/10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                            <div className="mb-6 md:mb-8">
                                <div className="bg-primary/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">psychology</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-tight">Risk Scoring Engine</h3>
                                <p className="text-sm md:text-base lg:text-lg text-on-surface-variant max-w-md leading-relaxed">Our proprietary algorithm cross-references historical data across thousands of stores to identify <span className="bg-error/10 text-error px-1 rounded italic">"serial returners"</span> before they cost you.</p>
                            </div>
                            <div className="h-40 md:h-48 bg-surface-container rounded-xl md:rounded-2xl relative overflow-hidden border border-outline-variant/5">
                                <img 
                                    className="w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105" 
                                    data-alt="Technical data visualization with risk score meters and heat maps indicating geographic fraud concentrations" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp48T1sSccaiSQwdYvbIWSqUEAQuP_HxwvyyOi2_YR1WSj6-m7TpTSV5f0HbWpctDW4K03hpsq3jMB0Nu9nGjATr2ba8v6GT1KP0mmIAMmsZ4p4Jm9HLTp6Cqq6rOE5Zd8heMvOVn61BF0RT_ri19vVd8HDl35Hz-zO-u0Bjq3FnywMY_UN3KzWjcohTIZdO20BDWKQIpi7gb8-TOaHxWgjNgWRfo_SWPm-VTcSl7EmyeXnsI0i5WMMQI89YXLSaUjeyrMleDc0Lc"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-container/50 to-transparent"></div>
                            </div>
                        </div>

                        {/* Small Features */}
                        <div className="bg-primary text-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-center relative overflow-hidden group shadow-md hover:shadow-lg transition-shadow">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                            <span className="material-symbols-outlined text-white text-3xl md:text-4xl mb-4 md:mb-5 drop-shadow-sm group-hover:-translate-y-1 transition-transform">chat_bubble</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">WhatsApp Confirmation</h3>
                            <p className="text-white/80 text-sm md:text-base leading-relaxed">98% open rates ensure your customers see the verification request immediately.</p>
                        </div>
                        
                        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-outline-variant/10 shadow-sm hover:-translate-y-1 transition-all group">
                            <div className="bg-secondary/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">map</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Pincode Fraud Detection</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">Automatically flag high-risk geographic areas known for failed COD deliveries.</p>
                        </div>
                        
                        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-outline-variant/10 shadow-sm hover:-translate-y-1 transition-all group">
                            <div className="bg-tertiary/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-tertiary group-hover:text-white transition-colors text-tertiary">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">block</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Blacklist Management</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">Share and access a global database of known fraudulent customers across our network.</p>
                        </div>
                        
                        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-outline-variant/10 shadow-sm hover:-translate-y-1 transition-all group">
                            <div className="bg-emerald-500/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">monitoring</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 tracking-tight">Dashboard Insights</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">Real-time metrics on how much money you've saved and your current RTO reduction.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-16 md:py-20 px-4 md:px-6 bg-slate-900 border-y border-slate-800 text-white w-full">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-10 md:gap-12 text-center w-full">
                    <div className="w-full md:w-auto p-4 md:p-0">
                        <p className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2 md:mb-3 tracking-tighter">₹12Cr+</p>
                        <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50">Saved for Merchants</p>
                    </div>
                    <div className="w-full md:w-auto p-4 md:p-0">
                        <p className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600 mb-2 md:mb-3 tracking-tighter">40%</p>
                        <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50">Reduction in RTO</p>
                    </div>
                    <div className="w-full md:w-auto p-4 md:p-0">
                        <p className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-primary mb-2 md:mb-3 tracking-tighter">5M+</p>
                        <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50">Orders Analyzed</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 md:py-32 px-4 md:px-6 w-full">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-5 tracking-tight text-slate-900">Transparent Pricing</h2>
                        <p className="text-base md:text-lg text-on-surface-variant font-medium mx-auto max-w-lg leading-relaxed">Pick a plan that fits your current store volume.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                        
                        {/* Starter */}
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] border border-outline-variant/15 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col group">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4 md:mb-5 bg-surface-container px-3 py-1 inline-block rounded-md self-start">Starter</p>
                            <div className="mb-6 md:mb-8 pb-6 border-b border-surface-container">
                                <span className="text-3xl font-medium text-slate-400 align-top mr-1">₹</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">1,999</span>
                                <span className="text-lg text-on-surface-variant font-medium ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Up to 500 orders/mo</li>
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Basic Risk Engine</li>
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> WhatsApp Verification</li>
                            </ul>
                            <Link to="/signup" className="w-full flex items-center justify-center py-4 bg-surface-container-high text-slate-700 hover:text-slate-900 hover:bg-surface-variant rounded-xl font-bold text-sm transition-colors active:scale-[0.98]">
                                Choose Starter
                            </Link>
                        </div>
                        
                        {/* Growth (Featured) */}
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] border-2 border-primary relative flex flex-col shadow-[0_12px_40px_-15px_rgba(70,71,211,0.3)] transform md:-translate-y-4 md:scale-105 z-10 w-full mb-6 md:mb-0 mt-6 md:mt-0">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">Most Popular</div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4 md:mb-5 bg-primary/10 px-3 py-1 inline-block rounded-md self-start">Growth</p>
                            <div className="mb-6 md:mb-8 pb-6 border-b border-surface-container">
                                <span className="text-3xl font-medium text-primary/70 align-top mr-1">₹</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">4,999</span>
                                <span className="text-lg text-on-surface-variant font-medium ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm font-bold text-slate-800"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Up to 2,500 orders/mo</li>
                                <li className="flex items-start gap-3 text-sm font-bold text-slate-800"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Advanced AI Risk Scoring</li>
                                <li className="flex items-start gap-3 text-sm font-bold text-slate-800"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Custom WhatsApp Flows</li>
                                <li className="flex items-start gap-3 text-sm font-bold text-slate-800"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Pincode Fraud Detection</li>
                            </ul>
                            <Link to="/signup" className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98]">
                                Choose Growth
                            </Link>
                        </div>
                        
                        {/* Scale */}
                        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] border border-outline-variant/15 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col group">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-4 md:mb-5 bg-surface-container px-3 py-1 inline-block rounded-md self-start">Scale</p>
                            <div className="mb-6 md:mb-8 pb-6 border-b border-surface-container">
                                <span className="text-3xl font-medium text-slate-400 align-top mr-1">₹</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">12,499</span>
                                <span className="text-lg text-on-surface-variant font-medium ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Unlimited orders</li>
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Global Blacklist Access</li>
                                <li className="flex items-start gap-3 text-sm font-medium text-on-surface"><span className="material-symbols-outlined text-primary text-base mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span> Dedicated Account Manager</li>
                            </ul>
                            <Link to="/signup" className="w-full flex items-center justify-center py-4 bg-surface-container-high text-slate-700 hover:text-slate-900 hover:bg-surface-variant rounded-xl font-bold text-sm transition-colors active:scale-[0.98]">
                                Choose Scale
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 md:py-24 px-4 md:px-6 w-full pb-32">
                <div className="max-w-6xl mx-auto bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24 text-center text-white relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(70,71,211,0.4)]">
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                        <img 
                            alt="Abstract dynamic fluid shapes in shades of indigo and purple create a sense of professional movement and energy" 
                            className="w-full h-full object-cover scale-110" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnKox-FF7XvPffm67xyRNwQIeAdJ5V33UiT7aV_P82FHDqAHwsM2D9ymcWXtn0syXzMy6JaRlbD8X-oxQs_MKT6cWIHFjI4zJMLo91BjkBRUFSHDTfaB_qarwZnrXAYLpRYLb7SVNq2A0et1ABYFU--OAwWyEfBIzEQ9D94jpVlPUf9eBbIm867uDp_2A8zwF1Hlrd2fUmFb5XuS2HJWbSKH6YLS2ePNCU5YtkYyPYKaLvcr-PaJVJ47UBU4vWNq8Qk0vjBftOhDg"
                        />
                    </div>
                    
                    <div className="relative z-10 w-full flex flex-col items-center">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1]">Start Protecting <br className="hidden md:block" />Your Orders Today</h2>
                        <p className="text-base sm:text-lg md:text-xl text-on-primary/90 mb-10 md:mb-14 max-w-xl lg:max-w-2xl mx-auto">Join 1,000+ Shopify brands that have already optimized their cash-on-delivery operations and scaled their margins.</p>
                        <Link to="/signup" className="bg-white text-primary px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-center inline-flex shadow-white/10">
                            Connect Your Store
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-slate-950 w-full py-10 md:py-12 px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8">
                    <div className="flex flex-col items-center md:items-start gap-3 md:gap-4 text-center md:text-left">
                        <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Codit</span>
                        <p className="font-sans text-xs md:text-sm font-medium leading-relaxed text-slate-500 max-w-xs">
                            © 2024 Codit AI. All rights reserveds.<br/>Precision Analytics for Shopify.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
                        <a className="font-sans text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors" href="#">Features</a>
                        <a className="font-sans text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors" href="#">Pricing</a>
                        <a className="font-sans text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors" href="#">Contact</a>
                        <a className="font-sans text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors" href="#">Privacy Policy</a>
                        <a className="font-sans text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

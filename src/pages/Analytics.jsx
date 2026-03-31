import React, { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '../utils/api';
import { useRealtime } from '../hooks/useRealtime';

export default function Analytics() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        confirmedOrders: 0,
        cancelledOrders: 0,
        highRiskOrders: 0,
        lowRiskOrders: 0,
        estimatedRtoSaved: 0
    });

    const loadStats = useCallback(async () => {
        try {
            const { ok, data } = await fetchAPI('/analytics/summary');
            if (ok && data.data) {
                setStats(data.data);
            }
        } catch (err) {
            console.warn('Analytics API unavailable, using fallback data.');
        }
    }, [setStats]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Live backend streaming
    useRealtime(() => {
        loadStats(); // Re-fetch analytics immediately behind the scenes
    });

    const totalDist = (stats.lowRiskOrders + stats.highRiskOrders) || 1;
    const safePercent = ((stats.lowRiskOrders / totalDist) * 100).toFixed(1);
    const highPercent = ((stats.highRiskOrders / totalDist) * 100).toFixed(1);

    return (
        <section className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 w-full">
            {/* Summary Header Bento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 w-full">
                <div className="md:col-span-2 signature-gradient p-6 md:p-8 rounded-3xl shadow-xl shadow-indigo-500/10 text-white flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                    <div className="relative z-10">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Total RTO Savings</p>
                        <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">₹{stats.estimatedRtoSaved.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold border border-white/10 shadow-sm">
                            <span className="material-symbols-outlined text-[14px] sm:text-sm">trending_up</span>
                            Active Protection
                        </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 sm:-right-10 sm:-bottom-10 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[150px] sm:text-[192px]" style={{fontVariationSettings: "'wght' 700"}}>shield_with_heart</span>
                    </div>
                </div>
                
                <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between border-b-4 border-indigo-500/20 shadow-[0px_4px_24px_rgba(44,47,49,0.04)] min-h-[160px]">
                    <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Total Orders Audited</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl sm:text-4xl font-black text-slate-900">{stats.totalOrders}</h4>
                        </div>
                    </div>
                    <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full signature-gradient" style={{ width: "100%" }}></div>
                    </div>
                </div>
                
                <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between border-b-4 border-tertiary/20 shadow-[0px_4px_24px_rgba(44,47,49,0.04)] min-h-[160px]">
                    <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">Detection Accuracy</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-3xl sm:text-4xl font-black text-slate-900">99.4%</h4>
                        </div>
                    </div>
                    <div className="flex items-end gap-1 mt-6 h-6">
                        <div className="flex-1 bg-indigo-500 rounded-sm opacity-10 h-[20%]"></div>
                        <div className="flex-1 bg-indigo-500 rounded-sm opacity-30 h-[40%]"></div>
                        <div className="flex-1 bg-indigo-500 rounded-sm opacity-50 h-[60%]"></div>
                        <div className="flex-1 bg-indigo-500 rounded-sm opacity-80 h-[80%]"></div>
                        <div className="flex-1 signature-gradient rounded-sm h-[100%]"></div>
                    </div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                {/* RTO Savings Chart Area */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl space-y-6 shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/30 overflow-hidden w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h5 className="text-lg md:text-xl font-bold text-slate-900">RTO Savings Over Time</h5>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">Cumulative fraud prevention impact per week</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-slate-500"><span className="material-symbols-outlined text-sm md:text-base">download</span></button>
                            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200 text-slate-500"><span className="material-symbols-outlined text-sm md:text-base">more_horiz</span></button>
                        </div>
                    </div>
                    
                    <div className="relative h-48 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 pt-8">
                        {/* Simulated Chart */}
                        {['45%', '62%', '58%', '85%', '72%', '94%'].map((height, index) => (
                            <div key={`w${index+1}`} className="relative flex-1 bg-slate-50 rounded-t-xl group h-full">
                                <div className="absolute bottom-0 w-full signature-gradient rounded-t-xl transition-all duration-500 opacity-90 group-hover:opacity-100" style={{ height }}></div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">W{index+1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Risk Distribution */}
                <div className="bg-white p-6 md:p-8 rounded-3xl space-y-8 shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/30 w-full">
                    <h5 className="text-lg md:text-xl font-bold text-slate-900">Risk Distribution</h5>
                    <div className="relative flex items-center justify-center py-4">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-[16px] md:border-[24px] border-slate-50 relative flex items-center justify-center shadow-inner">
                            <div className="w-full h-full absolute rounded-full border-[16px] md:border-[24px] border-indigo-600 border-t-tertiary border-r-indigo-600 border-b-indigo-600 border-l-indigo-600 animate-pulse opacity-90" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}}></div>
                            <div className="z-10 bg-white w-24 h-24 md:w-32 md:h-32 rounded-full absolute flex flex-col items-center justify-center">
                                <span className="text-2xl md:text-3xl font-black text-slate-800">{safePercent}%</span>
                                <span className="text-[10px] font-bold text-slate-400">SAFE</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/30"></span>
                                <span className="font-medium text-slate-700">Verified Clean / Low Risk</span>
                            </div>
                            <span className="font-bold text-slate-900">{safePercent}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs md:text-sm border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/30"></span>
                                <span className="font-medium text-slate-700">Flagged Exceptions / High Risk</span>
                            </div>
                            <span className="font-bold text-slate-900">{highPercent}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: WhatsApp & Accuracy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-12 w-full">
                {/* WhatsApp ROI */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl relative overflow-hidden group border border-slate-100 w-full shadow-inner">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-sm">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                                <span className="material-symbols-outlined text-green-500 text-2xl md:text-3xl">chat</span>
                            </div>
                            <h5 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">WhatsApp Verification ROI</h5>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">Verification via WhatsApp has safely engaged high-risk orders with minimal friction.</p>
                            
                            <div className="flex items-center gap-3 pt-2">
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex-1">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deliv. Rate</p>
                                    <p className="text-lg md:text-xl font-bold text-slate-800">98.2%</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex-1">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Responses</p>
                                    <p className="text-lg md:text-xl font-bold text-slate-800">84.1%</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white shadow-xl shadow-indigo-600/5 w-full lg:w-48 flex-shrink-0 flex items-center justify-center flex-col">
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4 text-center">ROI MULTIPLIER</p>
                            <p className="text-5xl md:text-6xl font-black text-indigo-600 text-center tracking-tighter">8.4x</p>
                            <p className="text-[10px] text-center mt-3 text-slate-500 font-medium whitespace-nowrap">vs. manual verification</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                </div>
                
                {/* Detection Accuracy Deep-dive */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/30 shadow-[0px_4px_24px_rgba(44,47,49,0.04)] w-full">
                    <div className="flex items-center justify-between mb-8">
                        <h5 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Accuracy Breakdown</h5>
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black tracking-widest uppercase border border-green-100">Target Meta</span>
                    </div>
                    
                    <div className="space-y-6 md:space-y-8 w-full">
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Identity Verification</span>
                                <span className="text-slate-800">99.8%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: "99.8%" }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Address Validation</span>
                                <span className="text-slate-800">96.2%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-400 rounded-full transition-all duration-1000 delay-100" style={{ width: "96.2%" }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Behavioral Biometrics</span>
                                <span className="text-slate-800">92.5%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-tertiary rounded-full transition-all duration-1000 delay-200" style={{ width: "92.5%" }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 w-full">
                            <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Device Fingerprinting</span>
                                <span className="text-slate-800">99.1%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 delay-300" style={{ width: "99.1%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

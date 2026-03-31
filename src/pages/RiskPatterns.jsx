import React, { useState, useEffect, useCallback } from 'react';
import { fetchAPI, setToken, getAuthToken } from '../utils/api';
import { useRealtime } from '../hooks/useRealtime';

export default function RiskPatterns() {
    const [stats, setStats] = useState({
        activeThreats: 0,
        preventedLoss: 0,
        detectionAccuracy: 100,
        pincodeAnomalies: { peak: 0, hourlyDistribution: new Array(24).fill(0), riskLevel: 'LOW' },
        ipVelocity: { attemptsPerMinute: 0, threshold: 5, riskLevel: 'LOW' },
        phoneReputation: { voipDetected: 0, landlineMismatch: 0, blacklistMatches: 0, riskLevel: 'LOW' },
        aiInsight: { title: 'Network stable.', description: 'Scanning.' },
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(null);
    const [upgrading, setUpgrading] = useState(false);

    // Explicit Front-End Route Guard (Pre-fetch trap)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isLocalPlanRestricted = user && user.plan !== 'growth';

    const loadStats = useCallback(async (isInitial = true) => {
        if (isLocalPlanRestricted) {
            setAccessDenied({
                message: "This sophisticated capability requires an upgraded subscription tier to access correctly.",
                requiredPlan: "growth"
            });
            setLoading(false);
            return;
        }

        if (isInitial) setLoading(true);
        try {
            const { ok, data } = await fetchAPI('/risk/patterns');
            if (ok && data.data) {
                setStats(data.data);
                setAccessDenied(null);
            } else if (!ok && data?.error === 'FEATURE_LOCKED') {
                setAccessDenied(data);
            }
        } catch (err) {
            console.warn('Backend unavailable, using fallback data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats(true);
    }, [loadStats]);

    // WebSockets connection
    useRealtime(() => {
        loadStats(false);
    });

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hrs ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            const { ok, data } = await fetchAPI('/user/upgrade', {
                method: 'POST',
                body: JSON.stringify({ plan: 'growth' })
            });

            if (ok && data.plan === 'growth') {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.plan = 'growth';
                    setToken(getAuthToken(), user);
                }
                window.location.reload();
            } else {
                alert(data?.error || "Upgrade failed.");
            }
        } catch (err) {
            console.error("Upgrade error", err);
            alert("Network error.");
        } finally {
            setUpgrading(false);
        }
    };

    if (accessDenied) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center items-center min-h-[70vh]">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-tertiary-container/40 max-w-lg text-center w-full relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 text-tertiary-container/20 border text-[150px] material-symbols-outlined pointer-events-none">lock_outline</div>
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-indigo-500/30">
                        <span className="material-symbols-outlined text-4xl text-white">auto_awesome</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4 relative z-10">Unlock Advanced Risk Intelligence</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto relative z-10">
                        Maximize your defense autonomously with real-time heuristic modeling and dynamic metrics.
                    </p>

                    <ul className="text-left space-y-3 mb-8 relative z-10 max-w-[200px] mx-auto">
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <span className="material-symbols-outlined text-indigo-500 text-[20px]">check_circle</span>
                            Pincode Fraud Detection
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <span className="material-symbols-outlined text-indigo-500 text-[20px]">check_circle</span>
                            AI Risk Scoring
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <span className="material-symbols-outlined text-indigo-500 text-[20px]">check_circle</span>
                            Custom WhatsApp Flows
                        </li>
                    </ul>

                    <button 
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        className="signature-gradient text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 w-full relative z-10 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        {upgrading ? <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> : 'Upgrade to Growth'}
                    </button>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center relative z-10">
                         <span className="px-3 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none border border-slate-200 shadow-sm">Enterprise Features</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 w-full flex-grow">
            {/* Hero Stats / Summary */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Threats</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeThreats}</h3>
                        <span className="text-error font-semibold text-xs flex items-center bg-error-container/20 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-sm mr-1">warning</span> Detected
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Prevented Loss</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹{stats.preventedLoss.toLocaleString()}</h3>
                        <span className="text-indigo-600 font-semibold text-xs flex items-center bg-primary-container/20 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-sm mr-1">shield</span> Safe
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50 sm:col-span-2 md:col-span-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Detection Accuracy</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.detectionAccuracy}%</h3>
                        <span className="text-slate-500 font-semibold text-xs flex items-center bg-slate-200 px-2 py-1 rounded-full">
                            <span className="material-symbols-outlined text-sm mr-1">verified</span> AI
                        </span>
                    </div>
                </div>
            </section>

            {/* Risk Pattern Grid (Bento Style) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                {/* Pattern 1: Pincode Anomalies (Large) */}
                <div className="lg:col-span-8 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200/50 w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-indigo-600">location_on</span>
                                <h4 className="text-xl font-bold tracking-tight text-slate-900 text-wrap">Pincode Anomalies</h4>
                            </div>
                            <p className="text-sm text-slate-500 max-w-md">High-frequency orders originating from disparate locations using the same delivery zone signature.</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full ${stats.pincodeAnomalies.riskLevel === 'CRITICAL' ? 'bg-error-container text-error' : stats.pincodeAnomalies.riskLevel === 'MODERATE' ? 'bg-tertiary-container text-tertiary' : 'bg-slate-200 text-slate-600'} text-[10px] font-bold uppercase tracking-widest whitespace-nowrap`}>{stats.pincodeAnomalies.riskLevel} Risk</span>
                    </div>

                    {/* Visual Mock Chart: Bar Chart for Anomalies */}
                    <div className="h-48 flex items-end gap-1 md:gap-3 mb-6 w-full relative">
                        <div className="flex-1 signature-gradient rounded-t-lg h-[85%] relative">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold shadow-lg">Peak: {stats.pincodeAnomalies.peak}</div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter mx-1">
                        <span>Dynamic Distribution Loaded</span>
                    </div>
                </div>

                {/* Pattern 2: IP Velocity Spikes (Vertical) */}
                <div className="lg:col-span-4 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200/50 flex flex-col w-full">
                    <div className="mb-6">
                        <span className="material-symbols-outlined text-tertiary mb-4 block text-3xl">bolt</span>
                        <h4 className="text-xl font-bold tracking-tight text-slate-900 mb-2">IP Velocity Spikes</h4>
                        <span className={`px-3 py-1 rounded-full ${stats.ipVelocity.riskLevel === 'CRITICAL' ? 'bg-error-container text-error' : 'bg-tertiary-container/30 text-tertiary border-tertiary/20'} text-[10px] font-bold uppercase tracking-widest inline-block mb-4 border`}>{stats.ipVelocity.riskLevel} Risk</span>
                        <p className="text-sm text-slate-500">Multiple checkout attempts from the same IP address within a 60-second window.</p>
                    </div>
                    <div className="mt-auto space-y-4 w-full">
                        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Velocity Tracked</span>
                                <span className="text-xs font-bold text-slate-700">{stats.ipVelocity.attemptsPerMinute} req/min</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="signature-gradient h-full" style={{ width: `${Math.min((stats.ipVelocity.attemptsPerMinute / stats.ipVelocity.threshold) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pattern 3: Phone Reputation */}
                <div className="lg:col-span-6 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200/50 w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">phone_callback</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold tracking-tight text-slate-800">Phone Reputation</h4>
                                <p className="text-xs text-slate-500">Cross-referencing burner phone databases.</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full ${stats.phoneReputation.riskLevel === 'HIGH' ? 'bg-error-container text-error' : 'bg-slate-200 text-slate-900'} text-[10px] font-bold uppercase tracking-widest whitespace-nowrap`}>{stats.phoneReputation.riskLevel} Risk</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                            <span className="text-sm font-medium text-slate-700">VOIP Range Detected</span>
                            <span className="text-sm text-slate-500 font-mono">{stats.phoneReputation.voipDetected} attempts</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                            <span className="text-sm font-medium text-slate-700">Landline Discrepancy</span>
                            <span className="text-sm text-slate-500 font-mono">{stats.phoneReputation.landlineMismatch} attempts</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Global Blacklist Match</span>
                            <span className={`text-sm font-bold font-mono ${stats.phoneReputation.blacklistMatches > 0 ? 'text-error' : 'text-slate-500'}`}>{stats.phoneReputation.blacklistMatches} matches</span>
                        </div>
                    </div>
                </div>

                {/* Pattern 4: AI Insights */}
                <div className="lg:col-span-6 signature-gradient rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden text-white w-full">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Insight of the day</span>
                        </div>
                        <h4 className="text-2xl font-black mb-4 leading-tight text-white">{stats.aiInsight.title}</h4>
                        <p className="text-sm opacity-90 mb-6 max-w-md">{stats.aiInsight.description}</p>
                        <button className="bg-white text-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-slate-50 transition-colors w-full sm:w-auto active:scale-95">
                            Apply Global Shield
                        </button>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.15]">
                        <span className="material-symbols-outlined text-[150px] md:text-[200px]">psychology</span>
                    </div>
                </div>
            </section>

            {/* Detailed Analysis Log */}
            <section className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/50 overflow-hidden w-full">
                <div className="px-4 md:px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-bold tracking-tight text-slate-800">Live Risk Feed</h3>
                    <div className="flex gap-2">
                        <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">All Patterns</button>
                        <button className="text-xs font-bold px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">Critical Only</button>
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="px-4 md:px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-4 md:px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                                <th className="px-4 md:px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pattern Status</th>
                                <th className="px-4 md:px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Score</th>
                                <th className="px-4 md:px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500 text-sm">Scanning networks...</td>
                                </tr>
                            ) : stats.recentActivity.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500 text-sm">No suspicious network activity found.</td>
                                </tr>
                            ) : (
                                stats.recentActivity.map((activity) => {
                                    const isCritical = activity.riskLevel === 'CRITICAL';
                                    const isHigh = activity.riskLevel === 'HIGH';
                                    const isMedium = activity.riskLevel === 'MEDIUM';

                                    const dotColor = isCritical ? 'bg-error' : isHigh ? 'bg-orange-500' : 'bg-tertiary';
                                    const scoreClass = isCritical ? 'bg-error-container text-error' : isHigh ? 'bg-orange-100 text-orange-700' : 'bg-tertiary-container text-tertiary';
                                    
                                    return (
                                        <tr key={activity._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-4 md:px-8 py-4 text-sm font-medium text-slate-700">{timeAgo(activity.createdAt)}</td>
                                            <td className="px-4 md:px-8 py-4 text-sm text-slate-500">#{activity.orderNumber}</td>
                                            <td className="px-4 md:px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                                                    <span className="text-sm font-medium text-slate-800">{activity.riskLevel} SUSPICION FLAG</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4">
                                                <span className={`px-2 py-0.5 rounded-full ${scoreClass} text-[10px] font-bold`}>{activity.riskScore}/100</span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 text-right">
                                                <button className="text-indigo-600 font-bold text-xs hover:underline">Review</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

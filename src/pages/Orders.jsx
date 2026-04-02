import React, { useState, useEffect, useCallback } from 'react';
import { fetchAPI, API_URL } from '../utils/api';
import { useRealtime } from '../hooks/useRealtime';
import OrderDetailsModal from '../components/OrderDetailsModal';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total: 1, pages: 1 });
    const [isDemo, setIsDemo] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [metrics, setMetrics] = useState({ aiCatchRate: 0, preventedLoss: 0, systemHealth: 'Optimal', aiNodesActive: 3, weeklyImprovement: 0, flaggedAttempts: 0 });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const buildQueryStrings = useCallback(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        
        if (activeTab === 'flagged') params.append('riskLevel', 'HIGH'); 
        if (activeTab === 'verified') params.append('orderStatus', 'confirmed');
        if (activeTab === 'pending') params.append('orderStatus', 'pending_review');
        if (activeTab === 'held') params.append('orderStatus', 'held');
        if (activeTab === 'canceled') params.append('orderStatus', 'canceled');
        if (activeTab === 'awaiting_payment') params.append('paymentStatus', 'pending');
        if (activeTab === 'payment_completed') params.append('paymentStatus', 'paid');
        
        if (dateRange === 'last30') {
            const past = new Date();
            past.setDate(past.getDate() - 30);
            params.append('startDate', past.toISOString());
            params.append('endDate', new Date().toISOString());
        }
        
        params.append('page', pagination.page);
        return params.toString();
    }, [debouncedSearch, activeTab, dateRange, pagination.page]);

    const loadOrders = useCallback(async (isInitialLoad = true) => {
        if (isInitialLoad) setLoading(true);
        try {
            const qs = buildQueryStrings();
            const { ok, data } = await fetchAPI(`/orders?${qs}`);
            if (ok && data) {
                setOrders(data.data || []);
                if (data.pagination) setPagination(p => ({ ...p, total: data.pagination.total, pages: data.pagination.pages }));
                setIsDemo(!!data.isDemoData);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            console.warn('Backend unavailable, using mock orders.');
            setError('Failed to connect to backend.');
        } finally {
            setLoading(false);
            setIsLiveRefreshing(false);
        }
    }, [buildQueryStrings]);

    useEffect(() => {
        loadOrders(true);

        // Load system metrics
        (async () => {
            try {
                const { ok, data } = await fetchAPI('/analytics/system-metrics');
                if (ok && data.data) setMetrics(prev => ({ ...prev, ...data.data }));
            } catch (e) { console.warn('System metrics unavailable.'); }
        })();
    }, [loadOrders]);

    // Attach Webhooks live bindings securely
    useRealtime((payload) => {
        // Realtime pulse triggered, re-fetch silently!
        setIsLiveRefreshing(true);
        loadOrders(false);
    });

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString([], { day: '2-digit', month: 'short' }) + ' | ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const qs = buildQueryStrings();
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/export?${qs}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `codit_orders_export_${new Date().getTime()}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch(err) {
            console.error("Export Error: ", err);
        } finally {
            setIsExporting(false);
        }
    };

    const viewOrderDetails = async (orderId) => {
        setDetailLoading(true);
        setSelectedOrder(null);

        // Demo orders have IDs like "mock-0" — can't query the backend
        if (String(orderId).startsWith('mock-')) {
            const mockOrder = orders.find(o => o._id === orderId);
            if (mockOrder) {
                const score = mockOrder.riskScore || 0;
                const riskReasons = [];
                const fraudSignals = [];

                if (score > 70) riskReasons.push('Critical risk score detected');
                if (mockOrder.totalPrice > 2000) {
                    riskReasons.push(`High order value (₹${mockOrder.totalPrice.toLocaleString()})`);
                    fraudSignals.push(`High-value COD attempt (₹${mockOrder.totalPrice.toLocaleString()})`);
                }
                if (mockOrder.orderStatus === 'cancelled') {
                    riskReasons.push('Order was cancelled');
                }
                riskReasons.push('New customer — no prior order history');
                fraudSignals.push('First-time customer with no order history');

                setSelectedOrder({
                    ...mockOrder,
                    orderId: mockOrder.orderNumber,
                    phone: mockOrder.phone || 'N/A',
                    totalPrice: mockOrder.totalPrice,
                    orderStatus: mockOrder.orderStatus,
                    whatsappStatus: mockOrder.whatsappDeliveryStatus || 'pending',
                    riskScore: score,
                    riskLevel: mockOrder.riskLevel,
                    riskReasons,
                    customerStats: { totalOrders: 1, confirmedOrders: mockOrder.orderStatus === 'confirmed' ? 1 : 0, canceledOrders: mockOrder.orderStatus === 'canceled' ? 1 : 0 },
                    fraudSignals,
                    recommendation: score > 70 ? 'Cancel' : score > 40 ? 'Review' : 'Safe',
                    finalDecision: mockOrder.finalDecision,
                    decisionReason: mockOrder.decisionReason
                });
            }
            setDetailLoading(false);
            return;
        }

        try {
            const { ok, data } = await fetchAPI(`/orders/${orderId}/details`);
            if (ok && data.data) {
                setSelectedOrder(data.data);
            } else {
                setError('Failed to load order intelligence');
            }
        } catch (e) {
            console.error('[Detail Fetch Error]', e);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleRelease = async (orderId) => {
        try {
            setOrders(prev => prev.filter(o => o._id !== orderId));
            const { ok } = await fetchAPI(`/orders/${orderId}/release`, { method: 'POST' });
            if (!ok) {
                loadOrders(false);
                setError('Failed to release order');
            } else {
                loadOrders(false);
            }
        } catch (e) {
            loadOrders(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Are you sure you want to CANCEL this order? This action cannot be undone.')) return;
        try {
            setOrders(prev => prev.filter(o => o._id !== orderId));
            const { ok } = await fetchAPI(`/orders/${orderId}/cancel`, { method: 'POST' });
            if (!ok) {
                loadOrders(false);
                setError('Failed to cancel order');
            } else {
                loadOrders(false);
            }
        } catch (e) {
            loadOrders(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isModeDemo = user.mode === 'demo';

    return (
        <div className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto w-full flex-grow">
            {/* Live Status Banner */}
            <div className={`mb-8 flex items-center justify-between p-4 ${isModeDemo ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20 status-glow-green'} rounded-2xl border transition-all animate-in fade-in slide-in-from-top-4 duration-500`}>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isModeDemo ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'} animate-pulse`}>
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {isModeDemo ? 'info' : 'security'}
                        </span>
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${isModeDemo ? 'text-amber-400' : 'text-emerald-400'} font-headline`}>
                            {isModeDemo ? 'Viewing Demo Orders' : 'Live Order Protection Active'}
                        </p>
                        <p className={`text-xs ${isModeDemo ? 'text-amber-400/70' : 'text-emerald-400/70'}`}>
                            {isModeDemo ? 'Sample orders for evaluation. Connect Shopify for real data.' : 'Scanning active transactions for potential fraud patterns.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Efficiency</p>
                        <p className="text-sm font-bold text-on-surface">99.98%</p>
                    </div>
                    <button className={`px-4 py-2 ${isModeDemo ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'} text-xs font-bold rounded-lg border transition-all`}>
                        View Logs
                    </button>
                </div>
            </div>

            {/* Filters & Actions Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline mb-1">Order Pipeline</h2>
                        <p className="text-sm text-on-surface-variant">Real-time oversight of technical and commercial transactions.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[240px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input 
                                type="text" 
                                placeholder="Search Order ID, Customer..." 
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPagination(p=>({...p, page:1})) }}
                                className="w-full bg-surface-container-lowest border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary/30 text-on-surface placeholder:text-slate-500"
                            />
                        </div>
                        <div 
                            onClick={() => { setDateRange(prev => prev === 'last30' ? null : 'last30'); setPagination(p=>({...p, page:1})) }}
                            className={`flex items-center gap-2 bg-surface-container-low p-2 rounded-xl cursor-pointer transition-all hover:bg-surface-container-highest/50 ${dateRange === 'last30' ? 'ring-1 ring-primary/40' : ''}`}
                        >
                            <span className="material-symbols-outlined text-sm text-slate-400 ml-1">calendar_today</span>
                            <span className={`text-xs font-medium ${dateRange === 'last30' ? 'text-primary' : 'text-on-surface'}`}>Last 30 Days</span>
                            <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
                        </div>
                        <button 
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed font-bold rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <span className="material-symbols-outlined text-sm">{isExporting ? 'refresh' : 'ios_share'}</span>
                            <span className="text-sm">{isExporting ? 'Exporting...' : 'Export Report'}</span>
                        </button>
                    </div>
                </div>

                {/* Tabbed Navigation */}
                <div id="tour-filter-bar" className="flex items-center gap-2 overflow-x-auto pb-2 table-scrollbar">
                    {[
                        { id: 'all', label: 'All Orders' },
                        { id: 'flagged', label: 'Flagged', color: 'text-error' },
                        { id: 'verified', label: 'Verified', color: 'text-emerald-400' },
                        { id: 'pending', label: 'Review', color: 'text-tertiary' },
                        { id: 'held', label: 'Held', color: 'text-orange-400' },
                        { id: 'canceled', label: 'Canceled' },
                        { id: 'awaiting_payment', label: 'Awaiting Payment' },
                        { id: 'payment_completed', label: 'Payment Received' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setPagination(p=>({...p, page:1}))}}
                            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                                activeTab === tab.id 
                                ? 'bg-primary text-on-primary' 
                                : `text-slate-400 hover:bg-surface-container-highest/50 hover:text-on-surface`
                            } ${activeTab === tab.id && tab.color ? tab.color : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table Container */}
            <div id="tour-orders-table" className="bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/5">
                <div className="overflow-x-auto table-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-outline-variant/10">
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Order ID & Date</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">AI Risk Score</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">WhatsApp</th>
                                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant text-sm font-medium">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
                                            Loading intelligent pipeline...
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant text-sm font-medium">No order data found for current filters.</td>
                                </tr>
                            ) : (
                                orders.map(order => {
                                    const init = order.customer?.firstName?.charAt(0) || '?';
                                    const isCritical = order.riskLevel === 'CRITICAL' || order.riskLevel === 'HIGH';
                                    const isMedium = order.riskLevel === 'MEDIUM';
                                    const riskColor = isCritical ? 'text-error' : isMedium ? 'text-tertiary' : 'text-emerald-400';
                                    const riskBg = isCritical ? 'bg-error' : isMedium ? 'bg-tertiary' : 'bg-emerald-500';
                                    const riskTag = isCritical ? 'High Risk' : isMedium ? 'Medium Risk' : 'Low Risk';
                                    const riskLabel = isCritical ? 'Critical' : isMedium ? 'Review' : 'Safe';
                                    const riskTagStyles = isCritical ? 'bg-error/10 text-error border-error/20' : isMedium ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                                    return (
                                        <tr key={order._id} className="group hover:bg-surface-container-highest/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-on-surface">#{order.orderNumber}</p>
                                                <p className="text-[10px] text-on-surface-variant">{formatDate(order.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${isCritical?'bg-error/10 text-error':isMedium?'bg-tertiary/10 text-tertiary':'bg-primary/10 text-primary'} flex items-center justify-center font-bold text-xs`}>
                                                        {init}{order.customer?.lastName?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-semibold">{order.customer?.firstName} {order.customer?.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold">₹{(order.totalPrice || 0).toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-on-surface-variant">{order.customer?.phone || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-32 group/risk relative cursor-help" title={order.riskReasons?.join(', ')}>
                                                    <div className="flex justify-between mb-1">
                                                        <span className={`text-[10px] ${riskColor}`}>{riskLabel}</span>
                                                        <span className="text-[10px] font-bold">{order.riskScore}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                                                        <div className={`h-full ${riskBg} rounded-full transition-all duration-500`} style={{ width: `${order.riskScore}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${riskTagStyles}`}>
                                                    {riskTag}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span 
                                                    className={`material-symbols-outlined text-lg ${order.whatsappDeliveryStatus === 'delivered' || order.whatsappDeliveryStatus === 'read' ? 'text-emerald-500' : 'text-slate-600'}`}
                                                    style={{ fontVariationSettings: order.whatsappDeliveryStatus === 'delivered' || order.whatsappDeliveryStatus === 'read' ? "'FILL' 1" : "" }}
                                                >
                                                    chat
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {activeTab === 'held' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleRelease(order._id)}
                                                                className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all uppercase"
                                                            >
                                                                Release
                                                            </button>
                                                            <button 
                                                                onClick={() => handleCancel(order._id)}
                                                                className="px-3 py-1.5 bg-error text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all uppercase"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => viewOrderDetails(order._id)}
                                                                className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                                title="View Intelligence"
                                                            >
                                                                <span className="material-symbols-outlined text-sm text-[18px]">visibility</span>
                                                            </button>
                                                            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                                <span className="material-symbols-outlined text-sm text-[18px]">more_vert</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10">
                    <p className="text-xs text-on-surface-variant">
                        Showing <span className="text-on-surface font-bold">{orders.length}</span> of <span className="text-on-surface font-bold">{pagination.total}</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setPagination(p => ({...p, page: Math.max(1, p.page - 1)}))}
                            disabled={pagination.page <= 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-highest transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-on-primary text-xs font-bold">
                            {pagination.page}
                        </button>
                        
                        <button 
                            onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                            disabled={pagination.page >= (pagination.pages || 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-highest transition-all disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Metrics Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Catch Rate Card */}
                <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">psychology</span>
                        </div>
                        <span className={`text-xs font-bold ${metrics.weeklyImprovement >= 0 ? 'text-emerald-400' : 'text-error'} flex items-center gap-1`}>
                            <span className="material-symbols-outlined text-xs">
                                {metrics.weeklyImprovement >= 0 ? 'trending_up' : 'trending_down'}
                            </span> 
                            {metrics.weeklyImprovement >= 0 ? '+' : ''}{metrics.weeklyImprovement}%
                        </span>
                    </div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">AI Catch Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold text-on-surface font-headline">{metrics.aiCatchRate}%</h3>
                        <span className="text-[10px] text-on-surface-variant">of total revenue</span>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary rounded-full group-hover:shadow-[0_0_10px_rgba(208,188,255,0.5)] transition-all duration-1000" 
                            style={{ width: `${metrics.aiCatchRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Prevented Losses Card */}
                <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">Target Reached</span>
                    </div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">Prevented Losses</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold text-on-surface font-headline">₹{(metrics.preventedLoss || 0).toLocaleString()}</h3>
                        <span className="text-[10px] text-on-surface-variant">this week</span>
                    </div>
                    <div className="mt-4 flex gap-1 items-end h-8">
                        {[0.4, 0.7, 0.6, 0.9, 1, 0.6, 0.8].map((h, i) => (
                            <div 
                                key={i} 
                                className="bg-primary/40 w-full rounded-t-sm transition-all duration-500 group-hover:bg-primary" 
                                style={{ height: `${h * 100}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* System Health Card */}
                <div className="glass-card p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl ${metrics.systemHealth === 'Critical' ? 'bg-error/10 text-error' : 'bg-emerald-500/10 text-emerald-400'} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-xl">hub</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 ${metrics.systemHealth === 'Critical' ? 'bg-error' : 'bg-emerald-400'} rounded-full animate-pulse`}></span>
                            <span className={`text-[10px] font-bold ${metrics.systemHealth === 'Critical' ? 'text-error' : 'text-emerald-400'}`}>
                                {metrics.systemHealth.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">System Health</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold text-on-surface font-headline">{metrics.systemHealth}</h3>
                        <span className="text-[10px] text-on-surface-variant">Latency: 14ms</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-tighter">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                            <span className="text-on-surface-variant">API: OK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                            <span className="text-on-surface-variant">Risk Engine: OK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-400">{metrics.aiNodesActive > 0 ? 'check_circle' : 'error'}</span>
                            <span className="text-on-surface-variant">{metrics.aiNodesActive} Nodes</span>
                        </div>
                    </div>
                </div>
            </div>

            {(selectedOrder || detailLoading) && (
                <OrderDetailsModal
                    order={selectedOrder}
                    loading={detailLoading}
                    onClose={() => { setSelectedOrder(null); setDetailLoading(false); }}
                />
            )}
        </div>
    );
}

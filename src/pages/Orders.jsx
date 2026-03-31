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
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-grow">
            {isModeDemo && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">Viewing Demo Orders</p>
                            <p className="text-xs text-amber-700">These are sample orders for evaluation. Connect Shopify to see your real store data.</p>
                        </div>
                    </div>
                </div>
            )}

            {!isModeDemo && (
                 <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm mb-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Live Order Protection Active</p>
                        <p className="text-xs text-emerald-700">Monitoring real-time Shopify webhooks for mystore.myshopify.com</p>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center bg-slate-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                    <button onClick={() => { setActiveTab('all'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}>All Orders</button>
                    <button onClick={() => { setActiveTab('flagged'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'flagged' ? 'bg-white shadow-sm text-error' : 'text-slate-500 hover:text-slate-900'}`}>Flagged</button>
                    <button onClick={() => { setActiveTab('verified'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'verified' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-900'}`}>Verified</button>
                    <button onClick={() => { setActiveTab('pending'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-900'}`}>Review</button>
                    <button onClick={() => { setActiveTab('held'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'held' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}>Held</button>
                    <button onClick={() => { setActiveTab('canceled'); setPagination(p=>({...p, page:1}))}} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === 'canceled' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-900'}`}>Canceled</button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-auto min-w-[200px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Search order ID or phone..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPagination(p=>({...p, page:1})) }}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-sm"
                        />
                    </div>

                    <div onClick={() => { setDateRange(prev => prev === 'last30' ? null : 'last30'); setPagination(p=>({...p, page:1})) }} className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border cursor-pointer transition-colors flex-1 md:flex-auto justify-center ${dateRange === 'last30' ? 'bg-primary-container/30 border-primary text-primary' : 'bg-white border-slate-200/50 hover:bg-slate-50 text-slate-700'}`}>
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        <span className="text-sm font-medium whitespace-nowrap">Last 30 Days</span>
                    </div>

                    <button onClick={handleExport} disabled={isExporting} className="signature-gradient text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-70 disabled:hover:opacity-70">
                        {isExporting ? <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> : <><span className="material-symbols-outlined text-[18px]">download</span> Export Report</>}
                    </button>
                </div>
            </div>

            {/* Orders Table Section */}
            <section id="tour-orders-table" className="bg-white rounded-[24px] shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/50 overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Order ID</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Customer</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Amount</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Contact</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">AI Risk Score</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Risk Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">Action Taken</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">WhatsApp</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm font-medium">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map(order => {
                                    const init = order.customer?.firstName?.charAt(0) || '?';
                                    const isCritical = order.riskLevel === 'CRITICAL';
                                    const isHigh = order.riskLevel === 'HIGH';
                                    const isMedium = order.riskLevel === 'MEDIUM';
                                    const isLow = order.riskLevel === 'LOW';
                                    
                                    const riskColorClass = isCritical ? 'error' : isHigh ? 'orange-600' : isMedium ? 'tertiary' : 'emerald-600';
                                    const riskBgClass = isCritical ? 'bg-error' : isHigh ? 'bg-orange-500' : isMedium ? 'bg-tertiary' : 'bg-emerald-500';
                                    const riskBgContainer = isCritical ? 'bg-error-container text-on-error-container' : isHigh ? 'bg-orange-100 text-orange-700' : isMedium ? 'bg-tertiary-container text-tertiary' : 'bg-emerald-100 text-emerald-700';

                                    return (
                                        <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">#{order.orderNumber}</span>
                                                    <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${isCritical?'bg-error-container/20 text-error':isMedium?'bg-tertiary-container/20 text-tertiary':'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold text-xs`}>
                                                        {init}
                                                    </div>
                                                    <span className="text-sm font-medium">{order.customer?.firstName} {order.customer?.lastName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-black text-slate-900">₹{(order.totalPrice || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">call</span>
                                                    <span className="text-sm text-slate-500">{order.customer?.phone || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="w-full max-w-[120px] group/risk relative cursor-help" title={order.riskReasons?.join(', ') || 'No specific risk factors detected'}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className={`text-[10px] font-bold text-${riskColorClass}`}>{order.riskScore} / 100</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className={`h-full ${riskBgClass} rounded-full transition-all duration-500`} style={{ width: `${order.riskScore}%` }}></div>
                                                    </div>
                                                    
                                                    {/* Custom Tooltip */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover/risk:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                                        <p className="font-bold border-b border-white/10 pb-1 mb-1 uppercase tracking-widest">Intelligence Insights</p>
                                                        <ul className="space-y-1">
                                                            {order.riskReasons && order.riskReasons.length > 0 ? (
                                                                order.riskReasons.map((r, i) => <li key={i} className="flex items-start gap-1"><span className="text-emerald-400">•</span> {r}</li>)
                                                            ) : (
                                                                <li>No significant risk patterns detected.</li>
                                                            )}
                                                        </ul>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${riskBgContainer}`}>
                                                    {order.riskLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                        order.finalDecision === 'auto_confirm' ? 'bg-emerald-100 text-emerald-700' :
                                                        order.finalDecision === 'manual_review' ? 'bg-orange-100 text-orange-700' :
                                                        order.finalDecision === 'hold' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {order.finalDecision ? order.finalDecision.replace('_', ' ') : 'PENDING'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-1 truncate max-w-[120px]" title={order.decisionReason}>
                                                        {order.decisionReason || 'Waiting for reply'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                                    {order.whatsappDeliveryStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {activeTab === 'held' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => handleRelease(order._id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg hover:bg-emerald-200 transition-colors uppercase tracking-tighter"
                                                                title="Release and Confirm Order"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                                Release
                                                            </button>
                                                            <button 
                                                                onClick={() => handleCancel(order._id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-black rounded-lg hover:bg-rose-200 transition-colors uppercase tracking-tighter"
                                                                title="Cancel Order Manually"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                                Drop
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => viewOrderDetails(order._id)} className="tour-details-btn px-4 py-1.5 bg-slate-200 text-slate-900 text-[10px] font-black rounded-lg hover:bg-slate-300 transition-all uppercase tracking-widest shadow-sm">
                                                            Details
                                                        </button>
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
                <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                        Total Base <span className="text-slate-900 font-bold">{pagination.total}</span> entries matched
                    </p>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setPagination(p => ({...p, page: Math.max(1, p.page - 1)}))}
                            disabled={pagination.page <= 1}
                            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">{pagination.page}</button>
                        
                        <button 
                            onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                            disabled={pagination.page >= (pagination.pages || 1)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-30">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Insight Bento Grid (Asymmetric) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/50 flex flex-col justify-between min-h-[160px]">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">AI Catch Rate</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{metrics.aiCatchRate}%</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{metrics.weeklyImprovement >= 0 ? '+' : ''}{metrics.weeklyImprovement}% improvement this week</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-[0px_4px_24px_rgba(44,47,49,0.04)] border border-slate-200/50 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-error text-lg">dangerous</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Prevented Losses</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">₹{(metrics.preventedLoss || 0).toLocaleString()}</h3>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <span className="material-symbols-outlined text-9xl translate-x-1/4 translate-y-1/4">account_balance_wallet</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-4">Across {metrics.flaggedAttempts} flagged high-risk attempts</p>
                </div>
                <div className={`p-6 rounded-[24px] shadow-lg text-white flex flex-col justify-between min-h-[160px] ${
                    metrics.systemHealth === 'Critical' ? 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/20' :
                    metrics.systemHealth === 'Moderate' ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20' :
                    'signature-gradient shadow-primary/20'
                }`}>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-white text-lg">rocket_launch</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">System Health</span>
                        </div>
                        <h3 className="text-3xl font-black">{metrics.systemHealth}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex -space-x-2">
                            {Array.from({ length: metrics.aiNodesActive }, (_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/20"></div>
                            ))}
                        </div>
                        <p className="text-xs font-medium">{metrics.aiNodesActive} AI Nodes active</p>
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

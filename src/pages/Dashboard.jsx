import React, { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '../utils/api';
import OrderDetailsModal from '../components/OrderDetailsModal';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        confirmedOrders: 0,
        canceledOrders: 0,
        highRiskOrders: 0,
        lowRiskOrders: 0,
        estimatedRtoSaved: 0,
        advancePaymentsCollected: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [heldOrders, setHeldOrders] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testOrderData, setTestOrderData] = useState({
        phone: '',
        totalPrice: '',
        shippingCity: '',
        billingCity: '',
        isNewCustomer: true
    });
    const [orderDetail, setOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('connected') === 'true') {
            setSuccessMessage(`Shopify store connected successfully. Live protection enabled.`);
            // Clean URL after 3 seconds or immediately? 
            // Better to show it for a while.
            const timer = setTimeout(() => setSuccessMessage(''), 8000);
            
            // Clean URL query params to avoid re-triggering on refresh
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path:newurl},'',newurl);
            
            return () => clearTimeout(timer);
        }
    }, []);

    const loadHeldOrders = useCallback(async () => {
        try {
            const { ok, data } = await fetchAPI('/orders/held');
            if (ok && data.data) {
                setHeldOrders(data.data);
            }
        } catch (err) {
            console.warn('Could not fetch held orders.');
        }
    }, []);

    const handleRelease = async (orderId) => {
        setActionLoading(orderId + '-release');
        try {
            const { ok } = await fetchAPI(`/orders/${orderId}/release`, { method: 'POST' });
            if (!ok) throw new Error('Release failed');
            
            const { ok: statsOk, data: statsData } = await fetchAPI('/analytics/summary');
            if (statsOk && statsData.data) setStats(prev => ({ ...prev, ...statsData.data }));
            await loadHeldOrders();
        } catch (err) {
            console.error('Release failed', err);
            await loadHeldOrders();
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Are you sure you want to CANCEL this order?')) return;
        setActionLoading(orderId + '-cancel');
        
        try {
            const { ok } = await fetchAPI(`/orders/${orderId}/cancel`, { method: 'POST' });
            if (!ok) throw new Error('Cancel failed');
            
            const { ok: statsOk, data: statsData } = await fetchAPI('/analytics/summary');
            if (statsOk && statsData.data) setStats(prev => ({ ...prev, ...statsData.data }));
            await loadHeldOrders();
        } catch (err) {
            console.error('Cancel failed', err);
            await loadHeldOrders();
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateTestOrder = async (e) => {
        e.preventDefault();
        setActionLoading('create-test');
        try {
            const { ok, data } = await fetchAPI('/orders/demo-create', {
                method: 'POST',
                body: JSON.stringify({
                    phone: testOrderData.phone,
                    totalPrice: testOrderData.totalPrice,
                    isNewCustomer: testOrderData.isNewCustomer,
                    shippingAddress: { city: testOrderData.shippingCity },
                    billingAddress: { city: testOrderData.billingCity }
                })
            });

            if (ok) {
                setIsTestModalOpen(false);
                setTestOrderData({ phone: '', totalPrice: '', shippingCity: '', billingCity: '', isNewCustomer: true });
                
                const { ok: statsOk, data: statsData } = await fetchAPI('/analytics/summary');
                if (statsOk && statsData.data) setStats(prev => ({ ...prev, ...statsData.data }));
                await loadHeldOrders();

                if (window.tourInstance) {
                    window.tourInstance.show('orders-table');
                }
            } else {
                alert('Failed to create test order: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Failed to create test order', err);
        } finally {
            setActionLoading(null);
        }
    };

    const viewOrder = async (orderId) => {
        setDetailLoading(true);
        setOrderDetail(null);
        try {
            const { ok, data } = await fetchAPI(`/orders/${orderId}/details`);
            if (ok && data.data) {
                setOrderDetail(data.data);
            }
        } catch (err) {
            console.error('Failed to load order details', err);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const { ok, data } = await fetchAPI('/analytics/summary');
                if (ok && data.data) setStats(prev => ({ ...prev, ...data.data }));
                await loadHeldOrders();
            } catch (err) {
                console.error('Dashboard load failed');
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, [loadHeldOrders]);

    const [showInitialLoader, setShowInitialLoader] = useState(true);
    const [loaderMessage, setLoaderMessage] = useState('Initializing Risk Engine...');

    useEffect(() => {
        const messages = [
            'Initializing Risk Engine...',
            'Syncing Deterministic Guard Protocols...',
            'Fetching Strategic Order Intelligence...'
        ];
        let msgIndex = 0;
        const interval = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            setLoaderMessage(messages[msgIndex]);
        }, 1000);

        const timer = setTimeout(() => {
            setShowInitialLoader(false);
            clearInterval(interval);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDemo = user.mode === 'demo';

    if (showInitialLoader) {
        return (
            <div className="fixed inset-0 z-[200] bg-[#0c1324] flex flex-col items-center justify-center overflow-hidden">
                {/* Ambient Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[80px]"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    {/* Stylized Spinner */}
                    <div className="relative w-24 h-24 mb-12">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-2 border-secondary/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl animate-pulse">shield_locked</span>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black text-on-surface tracking-tighter uppercase leading-none">CODIT OS</h2>
                        <div className="flex flex-col items-center gap-2">
                             <div className="h-4 flex items-center">
                                <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {loaderMessage}
                                </p>
                             </div>
                             <div className="w-48 h-1 bg-[#2e3447] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary animate-progress-fast"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes progress-fast {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                    .animate-progress-fast {
                        animation: progress-fast 3s linear forwards;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-10 w-full max-w-7xl mx-auto flex-grow">
            {/* Success Banner for Shopify Connection */}
            {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg backdrop-blur-md animate-in slide-in-from-top-4 duration-500">
                    <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-400">{successMessage}</p>
                </div>
            )}

            {/* Demo/Live Status Banner Styled for Dark Theme */}
            {isDemo && (
                <div className="bg-[#2e3447]/40 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-lg backdrop-blur-md animate-in fade-in duration-500 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-full text-amber-500"><span className="material-symbols-outlined">info</span></div>
                        <div>
                            <p className="text-sm font-black text-on-surface uppercase tracking-tighter">Simulation Active</p>
                            <p className="text-xs text-slate-400">Inject orders to see the deterministic engine in action.</p>
                        </div>
                    </div>
                    <button id="tour-create-test-btn" onClick={() => setIsTestModalOpen(true)} className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed text-[10px] font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(208,188,255,0.2)] hover:opacity-90 transition-all active:scale-95">Create Test Order</button>
                </div>
            )}

            <section id="tour-dashboard-header" className="max-w-4xl space-y-2">
                <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface uppercase leading-tight">CODIT INSIGHTS</h2>
                <p className="text-slate-400 text-sm md:text-lg font-body">Real-time fraud detection and order management for enterprise scale.</p>
            </section>
            
            {/* Metric Cards (Bento Grid Style) */}
            <section id="tour-metrics-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                <div className="glass-card purple-glow p-6 rounded-2xl flex flex-col gap-4 group hover:bg-[#2e3447]/60 transition-all">
                    <div className="flex justify-between items-start">
                        <span className="text-primary material-symbols-outlined">inventory_2</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">TOTAL</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-on-surface">{stats.totalOrders.toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Total Orders</p>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 border-l-2 border-error/40 hover:border-error transition-all group">
                    <div className="flex justify-between items-start">
                        <span className="text-error material-symbols-outlined">gpp_maybe</span>
                        <span className="text-[10px] font-bold text-error/60 uppercase tracking-widest leading-none">URGENT</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-on-surface text-error">{stats.highRiskOrders.toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">High Risk Orders</p>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 border-l-2 border-emerald-500/40 hover:border-emerald-500 transition-all group">
                    <div className="flex justify-between items-start">
                        <span className="text-emerald-400 material-symbols-outlined">check_circle</span>
                        <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest leading-none">VERIFIED</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-on-surface text-emerald-400">{stats.confirmedOrders.toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Confirmed Orders</p>
                    </div>
                </div>

                <div className="glass-card purple-glow p-6 rounded-2xl flex flex-col gap-4 border-l-2 border-primary/40 hover:border-primary transition-all group">
                    <div className="flex justify-between items-start">
                        <span className="text-primary material-symbols-outlined">payments</span>
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest leading-none">SECURED</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-on-surface">₹{(stats.advancePaymentsCollected || 0).toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Instant Recovery Active</p>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 border-l-2 border-secondary/40 hover:border-secondary transition-all group">
                    <div className="flex justify-between items-start">
                        <span className="text-secondary material-symbols-outlined">energy_savings_leaf</span>
                        <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest leading-none">REVENUE</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-on-surface">₹{(stats.estimatedRtoSaved || 0).toLocaleString()}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">AI Prevention Profit</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                <div className="lg:col-span-2 space-y-6">
                    <div id="tour-recent-activity" className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <h3 className="text-xl font-bold text-on-surface font-headline uppercase tracking-tight">Recent Activity</h3>
                            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Monitor Stream</button>
                        </div>
                        
                        <div className="overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/5">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-outline-variant/10 bg-surface-container-high/30">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Order ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Risk Index</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-500 tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                        stats.recentActivity.map(order => (
                                            <tr key={order._id} className="hover:bg-[#2e3447]/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm font-bold text-primary">#{order.orderNumber}</span>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{order.phone}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-black text-on-surface">₹{(order.totalPrice || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                        order.riskLevel === 'CRITICAL' ? 'bg-error/20 text-error' :
                                                        order.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-emerald-500/20 text-emerald-400'
                                                    }`}>{order.riskLevel}</span>
                                                </td>
                                                 <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {order.paymentRequired && (
                                                            <span className={`material-symbols-outlined text-lg ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} title={order.paymentStatus === 'paid' ? 'Secured' : 'Pending Verification'}>
                                                                {order.paymentStatus === 'paid' ? 'verified' : 'hourglass_bottom'}
                                                            </span>
                                                        )}
                                                        <button onClick={() => viewOrder(order._id)} className="p-2 rounded-xl bg-surface-container-highest opacity-0 group-hover:opacity-100 transition-all text-primary hover:bg-primary hover:text-on-primary">
                                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest italic opacity-40">Zero Inbound Signals</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div id="tour-held-orders" className="glass-card p-6 rounded-2xl border border-outline-variant/10 shadow-xl flex flex-col h-full min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-on-surface font-headline uppercase leading-none">Security Hold</h3>
                            <span className="bg-error text-on-error-container text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">{heldOrders.length}</span>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                            {heldOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-700">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-4xl text-emerald-400" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-on-surface uppercase tracking-tighter">All Safe</h4>
                                    <p className="text-xs text-slate-500 mt-1">No orders pending manual verification.</p>
                                </div>
                            ) : (
                                heldOrders.map(order => (
                                    <div key={order._id} className="bg-[#2e3447]/40 p-5 rounded-2xl border border-outline-variant/10 group hover:border-primary/30 transition-all">
                                        <div className="flex justify-between mb-4">
                                            <div>
                                                <p className="font-mono text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">#{order.orderNumber}</p>
                                                <p className="text-[10px] font-bold text-error uppercase mt-1 leading-none tracking-tighter">Deterministic Block</p>
                                            </div>
                                            <span className="material-symbols-outlined text-error/30 group-hover:text-error transition-colors">shield_with_heart</span>
                                        </div>
                                        <p className="text-2xl font-black text-on-surface mb-6 leading-none">₹{(order.totalPrice || 0).toLocaleString()}</p>
                                        <div className="flex gap-2">
                                            <button 
                                                disabled={actionLoading === order._id + '-release'}
                                                onClick={() => handleRelease(order._id)} 
                                                className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                            >
                                                {actionLoading === order._id + '-release' ? '...' : 'Release'}
                                            </button>
                                            <button 
                                                disabled={actionLoading === order._id + '-cancel'}
                                                onClick={() => handleCancel(order._id)} 
                                                className="flex-1 py-3 bg-error/10 text-error text-[10px] font-black rounded-xl hover:bg-error hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                            >
                                                {actionLoading === order._id + '-cancel' ? '...' : 'Terminate'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Payment Info / Quick Insights Panel from Stitch */}
                        <div className="mt-8 pt-8 border-t border-outline-variant/10 space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-sm text-on-surface flex items-center gap-2 uppercase tracking-tight">
                                    <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                                    Node Status
                                </h4>
                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-primary/20 text-primary uppercase tracking-widest">Active</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Uptime Index</span>
                                    <span className="font-black text-emerald-400">99.98%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Capture Rate</span>
                                    <span className="font-black text-primary text-sm leading-none">84.2%</span>
                                </div>
                                <div className="flex justify-between text-xs items-center">
                                    <span className="text-slate-500 font-medium">Detection Layer</span>
                                    <span className="flex items-center gap-1.5 text-secondary font-black">
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                        Neural
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {orderDetail && (
                <OrderDetailsModal 
                    order={orderDetail} 
                    loading={detailLoading} 
                    onClose={() => setOrderDetail(null)} 
                    onOrderUpdate={async () => {
                        const { ok: statsOk, data: statsData } = await fetchAPI('/analytics/summary');
                        if (statsOk && statsData.data) setStats(prev => ({ ...prev, ...statsData.data }));
                        await loadHeldOrders();
                    }}
                />
            )}

            {isTestModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div id="tour-simulation-form" className="bg-surface-container rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-outline-variant/10 animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-[#2e3447]/40 border-b border-outline-variant/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">Inject Signal</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Order Simulation Node</p>
                            </div>
                            <button onClick={() => setIsTestModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-highest text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleCreateTestOrder} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Identification</label>
                                <input type="text" required placeholder="+91 99999 99999" value={testOrderData.phone} onChange={(e) => setTestOrderData({...testOrderData, phone: e.target.value})} className="w-full px-5 py-3.5 bg-[#151b2d] border border-outline-variant/10 rounded-2xl focus:border-primary/50 text-on-surface outline-none transition-all placeholder:text-slate-600 font-mono text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Gross Amount (INR)</label>
                                    <input type="number" required placeholder="0.00" value={testOrderData.totalPrice} onChange={(e) => setTestOrderData({...testOrderData, totalPrice: e.target.value})} className="w-full px-5 py-3.5 bg-[#151b2d] border border-outline-variant/10 rounded-2xl focus:border-primary/50 text-on-surface outline-none transition-all placeholder:text-slate-600 font-mono text-sm" />
                                </div>
                                <div className="flex items-center gap-3 pt-6 pl-2">
                                    <input id="new-customer-sim" type="checkbox" checked={testOrderData.isNewCustomer} onChange={(e) => setTestOrderData({...testOrderData, isNewCustomer: e.target.checked})} className="w-5 h-5 rounded-lg border-outline-variant/20 bg-[#151b2d] text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                                    <label htmlFor="new-customer-sim" className="text-xs font-bold text-slate-400 cursor-pointer select-none">New Entry</label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Shipping Node</label>
                                    <input type="text" required placeholder="City" value={testOrderData.shippingCity} onChange={(e) => setTestOrderData({...testOrderData, shippingCity: e.target.value})} className="w-full px-5 py-3.5 bg-[#151b2d] border border-outline-variant/10 rounded-2xl focus:border-primary/50 text-on-surface outline-none transition-all placeholder:text-slate-600 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Billing Node</label>
                                    <input type="text" required placeholder="City" value={testOrderData.billingCity} onChange={(e) => setTestOrderData({...testOrderData, billingCity: e.target.value})} className="w-full px-5 py-3.5 bg-[#151b2d] border border-outline-variant/10 rounded-2xl focus:border-primary/50 text-on-surface outline-none transition-all placeholder:text-slate-600 text-sm" />
                                </div>
                            </div>
                            <button id="tour-inject-btn" type="submit" disabled={actionLoading === 'create-test'} className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-2xl font-black uppercase text-xs transition-all shadow-[0_0_20px_rgba(208,188,255,0.2)] active:scale-95 disabled:opacity-50 tracking-widest mt-4">
                                {actionLoading === 'create-test' ? 'Transmitting...' : 'Inject Test Signal'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

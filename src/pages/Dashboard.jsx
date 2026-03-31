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
    const [metrics, setMetrics] = useState({ aiCatchRate: 0, preventedLoss: 0, systemHealth: 'Optimal', aiNodesActive: 3, weeklyImprovement: 0, flaggedAttempts: 0 });

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
        const previousActivity = [...stats.recentActivity];
        
        try {
            const { ok } = await fetchAPI(`/orders/${orderId}/release`, { method: 'POST' });
            if (!ok) throw new Error('Release failed');
            
            // Refresh counts and list
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDemo = user.mode === 'demo';
    const totalRisk = (stats.lowRiskOrders + stats.highRiskOrders) || 1;
    const getPercent = (val) => Math.round((val / totalRisk) * 100);

    return (
        <div className="p-4 md:p-8 space-y-8 w-full max-w-7xl mx-auto flex-grow bg-white">
            {isDemo && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-600"><span className="material-symbols-outlined">info</span></div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">Demo Mode Active</p>
                            <p className="text-xs text-amber-700">Simulate orders to test the risk engine.</p>
                        </div>
                    </div>
                    <button id="tour-create-test-btn" onClick={() => setIsTestModalOpen(true)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all">Create Test Order</button>
                </div>
            )}

            {!isDemo && (
                 <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600"><span className="material-symbols-outlined">hub</span></div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Connected to Store</p>
                        <p className="text-xs text-emerald-700">Live protection active for your Shopify store.</p>
                    </div>
                </div>
            )}

            <section id="tour-dashboard-header" className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 uppercase">CODIT Insights</h1>
                <p className="text-slate-500 text-sm font-medium">Real-time fraud detection and order management.</p>
            </section>
            
            <section id="tour-metrics-section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Orders</p>
                    <h2 className="text-3xl font-black text-slate-900">{stats.totalOrders.toLocaleString()}</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">High Risk</p>
                    <h2 className="text-3xl font-black text-slate-900 text-rose-600">{stats.highRiskOrders.toLocaleString()}</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Confirmed</p>
                    <h2 className="text-3xl font-black text-slate-900 text-emerald-600">{stats.confirmedOrders.toLocaleString()}</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">RTO Saved</p>
                    <h2 className="text-3xl font-black text-slate-900">₹{(stats.estimatedRtoSaved || 0).toLocaleString()}</h2>
                </div>
            </section>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 w-full">
                <div className="lg:col-span-2 space-y-8">
                    <div id="tour-recent-activity" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Recent Activity</h3>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">Order</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500">Risk</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase text-slate-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                        stats.recentActivity.map(order => (
                                            <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs font-bold text-slate-900">#{order.orderNumber}</span>
                                                    <p className="text-[10px] text-slate-400">{order.phone}</p>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-700">₹{(order.totalPrice || 0).toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                                                        order.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                                                        order.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                    }`}>{order.riskLevel}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => viewOrder(order._id)} className="text-xs font-bold text-indigo-600 hover:underline px-2 py-1">VIEW</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-xs font-medium italic">No recent activity detected.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div id="tour-held-orders" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Held Orders</h3>
                            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">{heldOrders.length}</span>
                        </div>
                        <div className="space-y-4">
                            {heldOrders.length === 0 ? (
                                <div className="text-center py-10 opacity-40">
                                    <span className="material-symbols-outlined text-4xl block mb-2">verified_user</span>
                                    <p className="text-xs font-medium italic">All safe.</p>
                                </div>
                            ) : (
                                heldOrders.map(order => (
                                    <div key={order._id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="flex justify-between mb-2">
                                            <p className="font-mono text-[10px] font-bold text-slate-500">#{order.orderNumber}</p>
                                            <p className="text-[10px] font-bold text-rose-600 uppercase">HOLD</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 mb-4">₹{(order.totalPrice || 0).toLocaleString()}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRelease(order._id)} className="flex-1 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-all">RELEASE</button>
                                            <button onClick={() => handleCancel(order._id)} className="flex-1 py-2 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg hover:bg-rose-600 hover:text-white transition-all">CANCEL</button>
                                        </div>
                                    </div>
                                ))
                            )}
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 uppercase">Create Test Order</h2>
                            <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleCreateTestOrder} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Phone</label>
                                <input type="text" required value={testOrderData.phone} onChange={(e) => setTestOrderData({...testOrderData, phone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Amount</label>
                                    <input type="number" required value={testOrderData.totalPrice} onChange={(e) => setTestOrderData({...testOrderData, totalPrice: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none" />
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                    <input type="checkbox" checked={testOrderData.isNewCustomer} onChange={(e) => setTestOrderData({...testOrderData, isNewCustomer: e.target.checked})} className="w-4 h-4" />
                                    <label className="text-xs font-bold text-slate-600">New Customer</label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Shipping City</label>
                                    <input type="text" required value={testOrderData.shippingCity} onChange={(e) => setTestOrderData({...testOrderData, shippingCity: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Billing City</label>
                                    <input type="text" required value={testOrderData.billingCity} onChange={(e) => setTestOrderData({...testOrderData, billingCity: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none" />
                                </div>
                            </div>
                            <button type="submit" disabled={actionLoading === 'create-test'} className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase text-xs transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                {actionLoading === 'create-test' ? 'Injecting...' : 'Inject Test Order'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

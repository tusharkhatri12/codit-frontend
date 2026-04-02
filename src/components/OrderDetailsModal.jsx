import React, { useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function OrderDetailsModal({ order: initialOrder, onClose, loading, onOrderUpdate }) {
    const [order, setOrder] = useState(initialOrder);
    const [simulating, setSimulating] = useState(null);

    // Sync local order state when prop changes
    React.useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    if (!order && !loading) return null;

    const handleSimulateReply = async (reply) => {
        setSimulating(reply);
        try {
            const { ok, data } = await fetchAPI(`/orders/${order._id || order.id}/simulate-reply`, {
                method: 'POST',
                body: JSON.stringify({ reply })
            });

            if (ok && data.data) {
                setOrder(data.data);
                // Trigger parent refresh if provided
                if (onOrderUpdate) onOrderUpdate(data.data);
            } else {
                alert('Simulation failed');
            }
        } catch (err) {
            console.error('Simulation error', err);
        } finally {
            setSimulating(null);
        }
    };

    const getRiskColorClasses = (level) => {
        if (level === 'CRITICAL') return 'bg-error/10 text-error border-error/20';
        if (level === 'HIGH') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        if (level === 'MEDIUM') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-[#151b2d] border border-outline-variant/10 rounded-[32px] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 scrollbar-v" onClick={e => e.stopPropagation()}>
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Neural Processing...</p>
                    </div>
                ) : order && (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-outline-variant/5 flex justify-between items-center bg-[#2e3447]/20">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Order Intelligence</p>
                                <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">#{order.orderId || order.orderNumber}</h2>
                            </div>
                            <button id="tour-close-modal-btn" onClick={onClose} className="p-3 rounded-2xl bg-surface-container-highest text-slate-400 hover:text-white transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Order Overview Grid */}
                        <div className="p-8 grid grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Amount</p>
                                <p className="text-xl font-black text-on-surface">₹{(order.totalPrice || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    order.orderStatus === 'canceled' ? 'bg-error/20 text-error' : 
                                    order.orderStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 
                                    order.orderStatus === 'held' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-slate-500/20 text-slate-400'
                                }`}>{(order.orderStatus || 'new').replace('_', ' ')}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comm Link</p>
                                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-surface-container-highest text-slate-400">
                                    {(order.whatsappStatus || 'pending')}
                                </span>
                            </div>
                        </div>

                        {/* Partial Payment Securing */}
                        {order.paymentRequired && (
                            <div className={`mx-8 p-6 rounded-2xl border mb-6 transition-all ${order.paymentStatus === 'paid' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className={`material-symbols-outlined ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>payments</span>
                                    <h3 className="text-xs font-black text-on-surface uppercase tracking-widest">Asset Securing</h3>
                                    <span className={`ml-auto px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                                        order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>{order.paymentStatus}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Amount</p>
                                        <p className="text-lg font-black text-on-surface leading-none">₹{(order.paymentAmount || 100).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col justify-end items-end">
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (order.paymentLink) {
                                                    navigator.clipboard.writeText(order.paymentLink);
                                                    alert('Payment link copied!');
                                                }
                                            }}
                                            className="px-4 py-2 bg-primary text-on-primary-fixed text-[9px] font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest"
                                        >
                                            Copy Link
                                        </button>
                                        {order.paymentStatus === 'pending' && order.paymentLink && (
                                            <a href={order.paymentLink} target="_blank" rel="noreferrer" className="text-[9px] font-black text-primary mt-2 uppercase tracking-widest hover:underline underline-offset-4 decoration-2">Inspect Link</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Risk Intelligence Section */}
                        <div className="px-8 pb-8 space-y-6">
                            <div className="p-6 glass-card rounded-3xl border border-outline-variant/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">security</span>
                                    <h3 className="text-xs font-black text-on-surface uppercase tracking-widest">Risk Intelligence</h3>
                                </div>
                                
                                <div className="flex items-center gap-6 mb-8">
                                    <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-2xl shadow-lg transition-all ${
                                        order.riskScore >= 70 ? 'bg-error text-on-error shadow-error/20' : 
                                        order.riskScore >= 40 ? 'bg-orange-500 text-white shadow-orange-500/20' : 
                                        'bg-emerald-500 text-white shadow-emerald-500/20'
                                    }`}>
                                        {order.riskScore}
                                        <span className="text-[8px] opacity-70 leading-none mt-1">INDEX</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getRiskColorClasses(order.riskLevel)}`}>
                                            {order.riskLevel}
                                        </span>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Neural Score (0-100)</p>
                                    </div>
                                </div>

                                {order.riskReasons && order.riskReasons.length > 0 && (
                                    <div className="space-y-3">
                                        {order.riskReasons.map((reason, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/5 group hover:border-primary/20 transition-all">
                                                <span className="material-symbols-outlined text-primary text-sm mt-0.5">radar</span>
                                                <span className="text-xs font-medium text-slate-300 leading-relaxed">{reason}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Customer historical profile */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 rounded-2xl bg-surface-container-high/30 border border-outline-variant/5 text-center transition-all hover:bg-surface-container-high/50">
                                    <p className="text-xl font-black text-on-surface">{order.customerStats?.totalOrders || 0}</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center transition-all hover:bg-emerald-500/10">
                                    <p className="text-xl font-black text-emerald-400">{order.customerStats?.confirmedOrders || 0}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Verified</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-error/5 border border-error/10 text-center transition-all hover:bg-error/10">
                                    <p className="text-xl font-black text-error">{order.customerStats?.canceledOrders || 0}</p>
                                    <p className="text-[9px] font-black text-error/60 uppercase tracking-widest mt-1">Aborted</p>
                                </div>
                            </div>

                            {/* WhatsApp Lifecycle */}
                            <div id="tour-whatsapp-section" className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                                    <span className="material-symbols-outlined text-6xl text-primary">chat_bubble</span>
                                </div>
                                
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-primary">forum</span>
                                    <h3 className="text-xs font-black text-on-surface uppercase tracking-widest">Comm Interaction</h3>
                                    <span className="ml-auto px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest rounded">Simulation</span>
                                </div>
                                
                                <div className="bg-[#151b2d] rounded-2xl p-5 border border-outline-variant/10 mb-6 relative shadow-inner">
                                    <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                                        "{order.whatsappMessage || `Hi! Please confirm your COD order of ₹${(order.totalPrice || 0).toLocaleString()}. Reply YES to confirm or NO to cancel.`}"
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75"></span>
                                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse delay-150"></span>
                                        </div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                            {order.whatsappStatus === 'sent' ? 'Intercept Link Active' : `State: ${order.whatsappStatus}`}
                                        </p>
                                    </div>
                                </div>

                                {order.whatsappStatus === 'sent' ? (
                                    <div className="flex gap-3">
                                        <button 
                                            id="tour-simulate-yes"
                                            onClick={() => handleSimulateReply('YES')}
                                            disabled={simulating}
                                            className="flex-1 py-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-2xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                        >
                                            {simulating === 'YES' ? '...' : 'Signal YES'}
                                        </button>
                                        <button 
                                            onClick={() => handleSimulateReply('NO')}
                                            disabled={simulating}
                                            className="flex-1 py-4 bg-error/10 text-error text-[10px] font-black rounded-2xl border border-error/20 hover:bg-error hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                                        >
                                            {simulating === 'NO' ? '...' : 'Signal NO'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-4 bg-[#151b2d] rounded-2xl border border-outline-variant/10">
                                        <div className={`p-2 rounded-full ${order.whatsappStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'}`}>
                                            <span className="material-symbols-outlined text-lg">
                                                {order.whatsappStatus === 'confirmed' ? 'verified' : 'cancel'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-on-surface uppercase tracking-tight">Signal Received</p>
                                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                User transmitted <span className={order.whatsappStatus === 'confirmed' ? 'text-emerald-400' : 'text-error'}>{order.whatsappStatus === 'confirmed' ? 'YES' : 'NO'}</span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Final Decision Protocol */}
                            {(order.finalDecision || order.decisionReason) && (
                                <div className={`p-6 rounded-3xl border transition-all ${
                                    order.finalDecision === 'hold' ? 'bg-error/5 border-error/20' : 
                                    order.finalDecision === 'manual_review' ? 'bg-orange-500/5 border-orange-500/20' : 
                                    'bg-primary/5 border-primary/20'
                                }`}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`material-symbols-outlined ${
                                            order.finalDecision === 'auto_confirm' ? 'text-emerald-400' : 
                                            order.finalDecision === 'manual_review' ? 'text-orange-400' :
                                            'text-error'
                                        }`}>
                                            {order.finalDecision === 'auto_confirm' ? 'verified_user' : 
                                             order.finalDecision === 'manual_review' ? 'rate_review' :
                                             'pan_tool_alt'}
                                        </span>
                                        <h3 className="text-xs font-black text-on-surface uppercase tracking-widest">Final Decision Protocol</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            order.finalDecision === 'auto_confirm' ? 'bg-emerald-500/20 text-emerald-400' : 
                                            order.finalDecision === 'manual_review' ? 'bg-orange-500/20 text-orange-400' :
                                            'bg-error/20 text-error'
                                        }`}>
                                            {(order.finalDecision || 'pending').replace('_', ' ')}
                                        </span>
                                        <p className="text-slate-300 text-xs font-medium leading-relaxed italic">
                                            "{order.decisionReason || 'Waiting for customer activity or analysis...'}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* AI Prediction Hub */}
                            <div className="pt-6 border-t border-outline-variant/10">
                                <div className="p-8 rounded-[32px] bg-gradient-to-br from-primary to-primary-container text-center shadow-xl shadow-primary/20">
                                    <p className="text-[10px] font-black text-on-primary-fixed/60 uppercase tracking-[0.2em] mb-3">AI Prediction Output</p>
                                    <h4 className="text-3xl font-black text-on-primary-fixed uppercase tracking-tighter leading-none mb-1">
                                        {order.recommendation}
                                    </h4>
                                    <div className="flex justify-center items-center gap-2 mt-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-on-primary-fixed/80"></span>
                                        <p className="text-[10px] font-black text-on-primary-fixed/80 uppercase tracking-widest">Confidence: {order.riskScore < 30 ? 'High' : order.riskScore > 70 ? 'Extreme' : 'Nominal'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

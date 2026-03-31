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
                // We don't close the modal, let user see the outcome
            } else {
                alert('Simulation failed');
            }
        } catch (err) {
            console.error('Simulation error', err);
        } finally {
            setSimulating(null);
        }
    };

    const getRiskColor = (level) => {
        if (level === 'CRITICAL') return { bg: '#fef2f2', text: '#b91c1c', badge: '#fee2e2', border: '#fca5a5' };
        if (level === 'HIGH') return { bg: '#fff7ed', text: '#c2410c', badge: '#ffedd5', border: '#fdba74' };
        if (level === 'MEDIUM') return { bg: '#fffbeb', text: '#b45309', badge: '#fef3c7', border: '#fcd34d' };
        return { bg: '#f0fdf4', text: '#15803d', badge: '#dcfce7', border: '#86efac' };
    };

    const getRecommendationStyle = (rec) => {
        if (rec === 'Cancel') return { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5' };
        if (rec === 'Review') return { background: '#fffbeb', color: '#b45309', border: '1px solid #fcd34d' };
        return { background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' };
    };

    const riskColors = order ? getRiskColor(order.riskLevel) : {};

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#6366f1', animation: 'spin 1s linear infinite' }}>hourglass_top</span>
                        <p style={{ color: '#64748b', fontWeight: 600, marginTop: 16 }}>Analyzing order intelligence...</p>
                    </div>
                ) : order && (
                    <>
                        {/* Header */}
                        <div style={styles.header}>
                            <div>
                                <p style={styles.headerLabel}>ORDER INTELLIGENCE</p>
                                <h2 style={styles.headerTitle}>#{order.orderId}</h2>
                            </div>
                            <button onClick={onClose} style={styles.closeBtn}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Order Overview */}
                        <div style={styles.section}>
                            <div style={styles.grid4}>
                                <div style={styles.infoCell}>
                                    <p style={styles.label}>AMOUNT</p>
                                    <p style={styles.valueXl}>₹{(order.totalPrice || 0).toLocaleString()}</p>
                                </div>
                                <div style={styles.infoCell}>
                                    <p style={styles.label}>STATUS</p>
                                    <span style={{
                                        ...styles.badge,
                                        background: 
                                            order.orderStatus === 'canceled' ? '#fee2e2' : 
                                            order.orderStatus === 'confirmed' ? '#dcfce7' : 
                                            order.orderStatus === 'pending_review' ? '#fef3c7' :
                                            order.orderStatus === 'held' ? '#ffedd5' :
                                            '#f1f5f9',
                                        color: 
                                            order.orderStatus === 'canceled' ? '#b91c1c' : 
                                            order.orderStatus === 'confirmed' ? '#15803d' : 
                                            order.orderStatus === 'pending_review' ? '#b45309' :
                                            order.orderStatus === 'held' ? '#c2410c' :
                                            '#475569'
                                    }}>{(order.orderStatus || 'new').replace('_', ' ').toUpperCase()}</span>
                                </div>
                                <div style={styles.infoCell}>
                                    <p style={styles.label}>PHONE</p>
                                    <p style={styles.value}>{order.phone}</p>
                                </div>
                                <div style={styles.infoCell}>
                                    <p style={styles.label}>WHATSAPP</p>
                                    <span style={{ ...styles.badge, background: '#f1f5f9', color: '#475569' }}>
                                        {(order.whatsappStatus || 'pending').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Risk Analysis */}
                        <div style={{ ...styles.section, borderBottom: '1px solid #f1f5f9' }}>
                            <div style={styles.sectionHeader}>
                                <span className="material-symbols-outlined" style={{ color: riskColors.text, fontSize: 20 }}>shield</span>
                                <h3 style={styles.sectionTitle}>Risk Analysis</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 24, fontWeight: 900, color: '#fff',
                                    background: order.riskScore >= 70 ? '#ef4444' : order.riskScore >= 40 ? '#f97316' : '#22c55e',
                                    boxShadow: `0 4px 12px ${order.riskScore >= 70 ? 'rgba(239,68,68,0.3)' : order.riskScore >= 40 ? 'rgba(249,115,22,0.3)' : 'rgba(34,197,94,0.3)'}`
                                }}>
                                    {order.riskScore}
                                </div>
                                <div>
                                    <span style={{
                                        ...styles.badge,
                                        background: riskColors.badge,
                                        color: riskColors.text,
                                        border: `1px solid ${riskColors.border}`
                                    }}>{order.riskLevel}</span>
                                    <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Weighted score (0–100)</p>
                                </div>
                            </div>
                            {order.riskReasons && order.riskReasons.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {order.riskReasons.map((reason, i) => (
                                        <div key={i} style={styles.reasonRow}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14, color: riskColors.text, marginTop: 2 }}>report</span>
                                            <span style={{ fontSize: 13, color: '#475569' }}>{reason}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customer History */}
                        <div style={{ ...styles.section, borderBottom: '1px solid #f1f5f9' }}>
                            <div style={styles.sectionHeader}>
                                <span className="material-symbols-outlined" style={{ color: '#6366f1', fontSize: 20 }}>person_search</span>
                                <h3 style={styles.sectionTitle}>Customer History</h3>
                            </div>
                            <div style={styles.grid3}>
                                <div style={{ ...styles.statBox, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{order.customerStats?.totalOrders || 0}</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Total</p>
                                </div>
                                <div style={{ ...styles.statBox, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <p style={{ fontSize: 24, fontWeight: 900, color: '#15803d' }}>{order.customerStats?.confirmedOrders || 0}</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: 1 }}>Confirmed</p>
                                </div>
                                <div style={{ ...styles.statBox, background: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <p style={{ fontSize: 24, fontWeight: 900, color: '#b91c1c' }}>{order.customerStats?.canceledOrders || 0}</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 1 }}>Canceled</p>
                                </div>
                            </div>
                        </div>

                        {/* Fraud Signals */}
                        {order.fraudSignals && order.fraudSignals.length > 0 && (
                            <div style={{ ...styles.section, borderBottom: '1px solid #f1f5f9' }}>
                                <div style={styles.sectionHeader}>
                                    <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: 20 }}>warning</span>
                                    <h3 style={styles.sectionTitle}>Fraud Signals</h3>
                                    <span style={{ ...styles.badge, background: '#fff7ed', color: '#c2410c', marginLeft: 'auto' }}>{order.fraudSignals.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {order.fraudSignals.map((signal, i) => (
                                        <div key={i} style={styles.signalRow}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f97316', flexShrink: 0 }}>error</span>
                                            <p style={{ fontSize: 13, fontWeight: 500, color: '#9a3412' }}>{signal}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Simulation Lifecycle */}
                        <div style={{ ...styles.section, borderBottom: '1px solid #f1f5f9', background: '#f0f9ff' }}>
                            <div style={styles.sectionHeader}>
                                <span className="material-symbols-outlined" style={{ color: '#0ea5e9', fontSize: 20 }}>chat_bubble</span>
                                <h3 style={styles.sectionTitle}>WhatsApp Lifecycle (SIMULATION)</h3>
                                <span style={{ ...styles.badge, background: '#e0f2fe', color: '#0369a1', marginLeft: 'auto' }}>DEMO</span>
                            </div>
                            
                            <div style={{ background: '#fff', borderRadius: '12px 12px 12px 2px', padding: 12, border: '1px solid #e0f2fe', marginBottom: 16, maxWidth: '90%', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                <p style={{ fontSize: 13, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                                    {order.whatsappMessage || `Hi! Please confirm your COD order of ₹${(order.totalPrice || 0).toLocaleString()}. Reply YES to confirm or NO to cancel.`}
                                </p>
                                <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', marginTop: 4, textAlign: 'right', textTransform: 'uppercase' }}>
                                    {order.whatsappStatus === 'sent' ? 'Sent just now' : `Status: ${order.whatsappStatus}`}
                                </p>
                            </div>

                            {order.whatsappStatus === 'sent' ? (
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button 
                                        onClick={() => handleSimulateReply('YES')}
                                        disabled={simulating}
                                        style={{ ...styles.simulateBtn, background: '#10b981' }}
                                    >
                                        {simulating === 'YES' ? '...' : 'CONFIRM (YES)'}
                                    </button>
                                    <button 
                                        onClick={() => handleSimulateReply('NO')}
                                        disabled={simulating}
                                        style={{ ...styles.simulateBtn, background: '#f43f5e' }}
                                    >
                                        {simulating === 'NO' ? '...' : 'REJECT (NO)'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#fff', borderRadius: 10, border: '1px solid #e0f2fe' }}>
                                    <span className="material-symbols-outlined" style={{ color: order.whatsappStatus === 'confirmed' ? '#10b981' : '#f43f5e', fontSize: 18 }}>
                                        {order.whatsappStatus === 'confirmed' ? 'check_circle' : 'cancel'}
                                    </span>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#475569', margin: 0 }}>
                                        User replied <span style={{ color: order.whatsappStatus === 'confirmed' ? '#10b981' : '#f43f5e' }}>{order.whatsappStatus === 'confirmed' ? 'YES' : 'NO'}</span>. Flow complete.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Final Decision */}
                        {(order.finalDecision || order.decisionReason) && (
                            <div style={{ ...styles.section, borderBottom: '1px solid #f1f5f9', background: order.finalDecision === 'hold' ? '#fff1f2' : order.finalDecision === 'manual_review' ? '#fffbeb' : '#f8fafc' }}>
                                <div style={styles.sectionHeader}>
                                    <span className="material-symbols-outlined" style={{ 
                                        color: order.finalDecision === 'auto_confirm' ? '#15803d' : 
                                               order.finalDecision === 'manual_review' ? '#b45309' :
                                               order.finalDecision === 'hold' ? '#b91c1c' :
                                               '#475569',
                                        fontSize: 20 
                                    }}>
                                        {order.finalDecision === 'auto_confirm' ? 'verified_user' : 
                                         order.finalDecision === 'manual_review' ? 'rate_review' :
                                         order.finalDecision === 'hold' ? 'pan_tool_alt' :
                                         'cancel'}
                                    </span>
                                    <h3 style={styles.sectionTitle}>Final Decision Logic</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{
                                        ...styles.badge,
                                        width: 'fit-content',
                                        background: order.finalDecision === 'auto_confirm' ? '#dcfce7' : 
                                                    order.finalDecision === 'manual_review' ? '#ffedd5' :
                                                    order.finalDecision === 'hold' ? '#fee2e2' :
                                                    '#f1f5f9',
                                        color: order.finalDecision === 'auto_confirm' ? '#15803d' : 
                                               order.finalDecision === 'manual_review' ? '#c2410c' :
                                               order.finalDecision === 'hold' ? '#b91c1c' :
                                               '#475569',
                                        fontSize: 12,
                                        padding: '6px 12px'
                                    }}>
                                        {(order.finalDecision || 'pending').replace('_', ' ').toUpperCase()}
                                    </span>
                                    <p style={{ color: '#475569', fontSize: 13, fontWeight: 500, marginTop: 8 }}>
                                        {order.decisionReason || 'Waiting for customer activity or analysis...'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recommendation */}
                        <div style={styles.section}>
                            <div style={styles.sectionHeader}>
                                <span className="material-symbols-outlined" style={{ color: '#6366f1', fontSize: 20 }}>auto_awesome</span>
                                <h3 style={styles.sectionTitle}>AI Prediction</h3>
                            </div>
                            <div style={{
                                ...getRecommendationStyle(order.recommendation),
                                padding: '16px 24px',
                                borderRadius: 12,
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                            }}>
                                {order.recommendation}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modal: {
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    loadingContainer: {
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        padding: '24px 24px 20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: '#94a3b8',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 900,
        color: '#0f172a',
        margin: 0,
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 8,
        color: '#94a3b8',
        transition: 'background 0.2s',
    },
    section: {
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#0f172a',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        margin: 0,
    },
    grid4: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },
    grid3: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
    },
    infoCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: 700,
        color: '#94a3b8',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        margin: 0,
    },
    value: {
        fontSize: 14,
        fontWeight: 600,
        color: '#475569',
        margin: 0,
        marginTop: 2,
    },
    valueXl: {
        fontSize: 18,
        fontWeight: 900,
        color: '#0f172a',
        margin: 0,
    },
    badge: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 4,
    },
    reasonRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
    },
    signalRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        padding: '10px 14px',
        borderRadius: 10,
    },
    statBox: {
        padding: '14px 12px',
        borderRadius: 14,
        textAlign: 'center',
    },
    simulateBtn: {
        flex: 1,
        padding: '10px 0',
        border: 'none',
        borderRadius: 12,
        color: '#fff',
        fontSize: 11,
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textTransform: 'uppercase',
        letterSpacing: 1
    }
};

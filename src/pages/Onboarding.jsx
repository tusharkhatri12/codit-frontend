import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI, setToken, getAuthToken } from '../utils/api';
import './Onboarding.css';

export default function Onboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSelectPlan = async (planType) => {
        setLoading(true);
        setError('');

        try {
            const { ok, data } = await fetchAPI('/user/select-plan', {
                method: 'POST',
                body: JSON.stringify({ plan: planType })
            });

            if (ok) {
                // Update local storage user cleanly
                const userString = localStorage.getItem('user');
                if (userString) {
                    const user = JSON.parse(userString);
                    user.plan = data.plan;
                    user.mode = data.mode;
                    user.isOnboarded = data.isOnboarded;
                    // Keep same token, just update user explicitly
                    setToken(getAuthToken(), user);
                }
                
                // Route towards dashboard seamlessly!
                navigate('/dashboard');
            } else {
                setError(data.error || 'Failed to select plan. Please try again.');
            }
        } catch (err) {
            setError('Network error. Failed to connect to backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <div className="onboarding-header">
                <h1>Choose your plan</h1>
                <p>Select the subscription tier that perfectly fits your Shopify store volume to unlock real-time intelligence.</p>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <div className="plans-grid">
                
                {/* Starter Plan */}
                <div className="plan-card">
                    <h2 className="plan-name">Starter Plan</h2>
                    <div className="plan-price">$49<span>/mo</span></div>
                    <p className="plan-description">Essential fraud engine bounds perfect for growing DTC brands optimizing basics natively.</p>
                    
                    <ul className="features-list">
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Up to <strong>500 orders/month</strong></span>
                        </li>
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Basic Risk Engine Verification</span>
                        </li>
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Standard WhatsApp Verification</span>
                        </li>
                    </ul>

                    <button 
                        className="select-btn select-btn-starter" 
                        onClick={() => handleSelectPlan('starter')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Select Starter'}
                    </button>
                </div>

                {/* Growth Plan (Highlighted) */}
                <div className="plan-card growth-plan">
                    <div className="popular-badge">Most Popular</div>
                    <h2 className="plan-name">Growth Plan</h2>
                    <div className="plan-price">$199<span>/mo</span></div>
                    <p className="plan-description">Advanced autonomous capabilities enabling exact behavioral metrics mapping securely dynamically.</p>
                    
                    <ul className="features-list">
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Up to <strong>2500 orders/month</strong></span>
                        </li>
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span><strong>Advanced AI</strong> Risk Scoring Metrics</span>
                        </li>
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Custom WhatsApp Interactive Flows</span>
                        </li>
                        <li className="feature-item">
                            <span className="feature-icon">check_circle</span>
                            <span>Pincode & Geolocation Fraud Detection</span>
                        </li>
                    </ul>

                    <button 
                        className="select-btn select-btn-growth" 
                        onClick={() => handleSelectPlan('growth')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Select Growth'}
                    </button>
                </div>

            </div>
        </div>
    );
}

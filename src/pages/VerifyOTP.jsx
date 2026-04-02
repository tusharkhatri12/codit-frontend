import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAPI } from '../utils/api';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const email = query.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) return setError('Please enter the full code');

        setLoading(true);
        setError('');

        try {
            const { ok, data } = await fetchAPI('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ email, otp: otpString })
            });

            if (ok) {
                // Success! Give a moment for effect then redirect
                setTimeout(() => navigate('/login?verified=true'), 1500);
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setResendLoading(true);
        setError('');
        try {
            const { ok } = await fetchAPI('/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            if (ok) {
                setTimer(60);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0].focus();
            } else {
                setError('Failed to resend. Check your connection.');
            }
        } catch (err) {
            setError('Error resending OTP.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] font-inter flex flex-col items-center justify-center p-6 relative overflow-hidden">
             {/* Ambient Background Glows */}
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md glass-card p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-3xl">mark_email_unread</span>
                    </div>
                    <h1 className="text-3xl font-black font-headline tracking-tighter uppercase mb-2">Check your email</h1>
                    <p className="text-on-surface-variant text-sm font-medium">We've sent a 6-digit security code to <br /><span className="text-primary font-bold">{email}</span></p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-[11px] font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-10">
                    <div className="flex justify-between gap-2 md:gap-4">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-full h-14 md:h-16 text-center text-2xl font-black bg-[#151b2d] border border-outline-variant/20 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-on-surface outline-none"
                            />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <button
                            type="submit"
                            disabled={loading || otp.join('').length < 6}
                            className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(208,188,255,0.2)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying Node...' : 'Verify Identity'}
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-on-surface-variant font-medium">
                                Didn't receive the code?
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={timer > 0 || resendLoading}
                                    className={`ml-2 font-black uppercase tracking-widest text-[10px] transition-colors ${timer > 0 ? 'text-slate-600' : 'text-primary hover:text-secondary'}`}
                                >
                                    {resendLoading ? 'Sending...' : timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                                </button>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Encoded Verification ACTIVE</p>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ backgroundColor: '#0c1324', color: '#dce1fb', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

                .material-symbols-outlined {
                    font-family: 'Material Symbols Outlined';
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-smoothing: antialiased;
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }

                .font-headline { font-family: 'Manrope', sans-serif !important; }
                .font-body { font-family: 'Inter', sans-serif !important; }

                .gradient-text {
                    background: linear-gradient(135deg, #d0bcff 0%, #a078ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #d0bcff 0%, #a078ff 100%);
                    color: #23005c;
                    font-family: 'Manrope', sans-serif;
                    font-weight: 700;
                    transition: all 0.2s ease;
                    box-shadow: 0 0 40px rgba(208, 188, 255, 0.2);
                }
                .btn-primary:hover {
                    box-shadow: 0 0 60px rgba(208, 188, 255, 0.35);
                    transform: translateY(-2px);
                }
                .btn-primary:active { transform: scale(0.96); }

                .btn-secondary {
                    background: rgba(46, 52, 71, 0.4);
                    backdrop-filter: blur(20px);
                    color: #dce1fb;
                    border: 1px solid rgba(70, 69, 84, 0.3);
                    font-family: 'Manrope', sans-serif;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .btn-secondary:hover {
                    background: rgba(46, 52, 71, 0.7);
                    border-color: rgba(208, 188, 255, 0.3);
                }

                .glass {
                    background: rgba(46, 52, 71, 0.4);
                    backdrop-filter: blur(20px);
                }

                .hero-glow {
                    background: radial-gradient(circle at 50% -20%, rgba(208, 188, 255, 0.12) 0%, rgba(12, 19, 36, 0) 70%);
                }

                .animated-orb {
                    width: 380px;
                    height: 380px;
                    background: radial-gradient(circle at 30% 30%, #d0bcff 0%, #6d3bd7 50%, #0c1324 100%);
                    filter: blur(60px);
                    border-radius: 50%;
                    animation: float-orb 8s ease-in-out infinite alternate;
                    opacity: 0.55;
                    position: relative;
                }

                @keyframes float-orb {
                    0% { transform: translateY(0px) scale(1); }
                    100% { transform: translateY(-40px) scale(1.08); }
                }

                @keyframes float-card-1 {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-14px); }
                }
                @keyframes float-card-2 {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(14px); }
                }
                @keyframes float-card-3 {
                    0% { transform: translateY(-6px); }
                    100% { transform: translateY(10px); }
                }

                .float-1 { animation: float-card-1 6s ease-in-out infinite alternate; }
                .float-2 { animation: float-card-2 7s ease-in-out infinite alternate; }
                .float-3 { animation: float-card-3 5s ease-in-out infinite alternate; }

                .data-stream {
                    background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(208, 188, 255, 0.04) 1px, rgba(208, 188, 255, 0.04) 2px);
                    background-size: 100% 4px;
                    animation: scroll-stream 20s linear infinite;
                }
                @keyframes scroll-stream {
                    from { background-position: 0 0; }
                    to { background-position: 0 100%; }
                }

                .feature-card {
                    background: #191f31;
                    border: 1px solid rgba(70, 69, 84, 0.08);
                    border-radius: 1.25rem;
                    transition: all 0.25s ease;
                }
                .feature-card:hover {
                    background: #23293c;
                    transform: translateY(-4px);
                    border-color: rgba(208, 188, 255, 0.15);
                }

                .step-card {
                    background: #191f31;
                    border-radius: 1.25rem;
                    transition: all 0.25s ease;
                }
                .step-card:hover { background: #23293c; }

                .glow-border {
                    position: relative;
                }
                .glow-border::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 1px;
                    border-radius: 1.5rem;
                    background: linear-gradient(135deg, rgba(208, 188, 255, 0.25), transparent 60%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }

                .pricing-card {
                    background: #151b2d;
                    border: 1px solid rgba(70, 69, 84, 0.1);
                    border-radius: 1.5rem;
                    transition: all 0.25s ease;
                }
                .pricing-card:hover {
                    border-color: rgba(208, 188, 255, 0.25);
                    box-shadow: 0 20px 60px rgba(208, 188, 255, 0.06);
                }
                .pricing-card.featured {
                    border-color: rgba(208, 188, 255, 0.4);
                    background: #191f31;
                    box-shadow: 0 20px 60px rgba(208, 188, 255, 0.12);
                }

                .mobile-menu {
                    background: rgba(12, 19, 36, 0.97);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(70, 69, 84, 0.2);
                }

                .indigo-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(208, 188, 255, 0.3), transparent);
                }

                /* Pulse animation for the live indicator */
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

                .nav-glass {
                    background: rgba(12, 19, 36, 0.5);
                    backdrop-filter: blur(24px);
                    border-bottom: 1px solid rgba(70, 69, 84, 0.1);
                    transition: all 0.3s ease;
                }
                .nav-glass.scrolled {
                    background: rgba(12, 19, 36, 0.85);
                    box-shadow: 0 20px 40px rgba(208, 188, 255, 0.04);
                }

                section { position: relative; }
            `}</style>

            {/* ─── Navigation ─── */}
            <nav className={`nav-glass fixed top-0 w-full z-50 ${scrolled ? 'scrolled' : ''}`}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9' }}>CODIT</div>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden-mobile">
                        <a href="#how-it-works" className="font-headline" style={{ color: '#c7c4d7', fontWeight: 500, textDecoration: 'none', fontSize: '0.925rem', transition: 'color 0.2s' }}
                            onMouseOver={e => e.target.style.color = '#d0bcff'} onMouseOut={e => e.target.style.color = '#c7c4d7'}>
                            How It Works
                        </a>
                        <a href="#solutions" className="font-headline" style={{ color: '#c7c4d7', fontWeight: 500, textDecoration: 'none', fontSize: '0.925rem', transition: 'color 0.2s' }}
                            onMouseOver={e => e.target.style.color = '#d0bcff'} onMouseOut={e => e.target.style.color = '#c7c4d7'}>
                            Solutions
                        </a>
                    </div>

                    {/* Desktop CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hidden-mobile">
                        <Link to="/login" style={{ color: '#c7c4d7', textDecoration: 'none', fontWeight: 500, fontSize: '0.925rem', transition: 'color 0.2s' }}
                            onMouseOver={e => e.target.style.color = '#d0bcff'} onMouseOut={e => e.target.style.color = '#c7c4d7'}>
                            Login
                        </Link>
                        <Link to="/signup" className="btn-primary font-headline" style={{ padding: '0.6rem 1.4rem', borderRadius: '0.75rem', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block' }}>
                            Get Early Access
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="show-mobile" style={{ background: 'none', border: 'none', color: '#c7c4d7', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu" style={{ padding: '1rem 1.5rem 1.5rem' }}>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.875rem 0', color: '#c7c4d7', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(70,69,84,0.2)' }}>How It Works</a>
                        <a href="#solutions" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.875rem 0', color: '#c7c4d7', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(70,69,84,0.2)' }}>Solutions</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.875rem 0', color: '#c7c4d7', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(70,69,84,0.2)' }}>Pricing</a>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', padding: '0.875rem', color: '#c7c4d7', textDecoration: 'none', fontWeight: 600, borderRadius: '0.75rem', background: 'rgba(46,52,71,0.4)' }}>Login</Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary font-headline" style={{ textAlign: 'center', padding: '0.875rem', textDecoration: 'none', borderRadius: '0.75rem', display: 'block' }}>Get Early Access</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* ─── Hero Section ─── */}
            <section className="hero-glow" style={{ paddingTop: '8rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    {/* Live badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(46,52,71,0.5)', border: '1px solid rgba(70,69,84,0.2)', marginBottom: '2rem' }}>
                        <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d0bcff', display: 'inline-block' }}></span>
                        <span className="font-headline" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d0bcff' }}>
                            Currently onboarding a limited number of D2C brands manually.
                        </span>
                    </div>

                    {/* H1 */}
                    <h1 className="font-headline" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.75rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#dce1fb', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Stop Fake <span className="gradient-text">COD Orders</span><br />Before Shipping
                    </h1>

                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#c7c4d7', maxWidth: '42rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                        Reduce RTO losses by 20–30% using WhatsApp verification and AI-powered risk scoring — before orders are dispatched.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/signup" className="btn-primary font-headline" style={{ padding: '1.1rem 2.5rem', borderRadius: '1rem', fontSize: '1.1rem', textDecoration: 'none', display: 'inline-block' }}>
                            Get Early Access
                        </Link>
                        <p style={{ fontSize: '0.8rem', color: '#908fa0', fontWeight: 500 }}>
                            Free during early access. No credit card required. Lock in discounted founder pricing.
                        </p>
                    </div>
                </div>

                {/* Abstract Animated Orb Visual */}
                <div style={{ maxWidth: '72rem', margin: '5rem auto 0', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0', minHeight: '420px' }}>
                    <div className="data-stream" style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}></div>
                    <div style={{ position: 'relative' }}>
                        <div className="animated-orb"></div>
                        {/* Floating Metric Cards */}
                        <div className="glass float-1" style={{ position: 'absolute', top: '-2.5rem', left: '-6rem', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(70,69,84,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(208,188,255,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#d0bcff', fontSize: '1.25rem' }}>verified</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6rem', color: '#908fa0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>Risk Score</p>
                                <p className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4ade80' }}>98/100 Safe</p>
                            </div>
                        </div>

                        <div className="glass float-2" style={{ position: 'absolute', top: '50%', right: '-6rem', transform: 'translateY(-50%)', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(70,69,84,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(255,183,131,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#ffb783', fontSize: '1.25rem' }}>analytics</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6rem', color: '#908fa0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>RTO Savings</p>
                                <p className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dce1fb' }}>₹1.2M Saved</p>
                            </div>
                        </div>

                        <div className="glass float-3" style={{ position: 'absolute', bottom: '-2.5rem', left: '20%', padding: '1.25rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(70,69,84,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(208,188,255,0.15)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#d0bcff', fontSize: '1.25rem' }}>psychology</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6rem', color: '#908fa0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>Neural Analysis</p>
                                <p className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dce1fb' }}>Pattern Locked</p>
                            </div>
                        </div>

                        {/* Geometric Core */}
                        <div style={{ position: 'absolute', inset: 0, margin: 'auto', width: '11rem', height: '11rem', border: '1px solid rgba(208,188,255,0.3)', borderRadius: '1.5rem', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                            <div style={{ width: '7rem', height: '7rem', border: '1px solid rgba(208,188,255,0.5)', borderRadius: '1rem', transform: 'rotate(12deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ color: '#d0bcff', fontSize: '3.5rem', opacity: 0.8, transform: 'rotate(-57deg)' }}>security</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="indigo-divider"></div>

            {/* ─── Problem Section ─── */}
            <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0c1324' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '4rem' }}>
                        COD Orders Are <span style={{ color: '#ffb783' }}>Killing Your Margins</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: 'dangerous', title: 'Fake Orders', desc: 'Competitors and pranksters clogging your inventory with non-existent addresses.' },
                            { icon: 'payments', title: 'High RTO Costs', desc: 'Paying double shipping and handling fees for items that never reach the customer.' },
                            { icon: 'person_off', title: 'Manual Verification', desc: 'Scaling teams just to call every customer is expensive and prone to error.' },
                        ].map((item, i) => (
                            <div key={i} className="feature-card" style={{ padding: '2rem', textAlign: i === 1 ? 'center' : 'left', background: i === 1 ? 'linear-gradient(180deg, #191f31 0%, #151b2d 100%)' : undefined, transform: i === 1 ? 'scale(1.04)' : undefined }}>
                                <div style={{ width: '3rem', height: '3rem', background: 'rgba(255,183,131,0.1)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', margin: i === 1 ? '0 auto 1.5rem' : '0 0 1.5rem 0' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#ffb783', fontSize: '1.4rem' }}>{item.icon}</span>
                                </div>
                                <h3 className="font-headline" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#dce1fb' }}>{item.title}</h3>
                                <p style={{ color: '#c7c4d7', lineHeight: 1.7, fontSize: '0.95rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="indigo-divider"></div>

            {/* ─── Solutions Section (Stitch Design) ─── */}
            <section id="solutions" style={{ padding: '6rem 1.5rem', backgroundColor: '#070d1f' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', overflow: 'hidden' }}>

                    {/* Section Header */}
                    <div style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.875rem', background: 'rgba(46,52,71,0.5)', borderRadius: '9999px', border: '1px solid rgba(70,69,84,0.2)', marginBottom: '1.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d0bcff', boxShadow: '0 0 8px #d0bcff', display: 'inline-block' }}></span>
                            <span className="font-headline" style={{ color: '#d0bcff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>The Next Standard</span>
                        </div>
                        <h2 className="font-headline" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                            Engineered for High-Scale <br /><span style={{ color: '#d0bcff' }}>D2C Operations</span>
                        </h2>
                        <p style={{ color: '#c7c4d7', fontSize: '1.05rem', maxWidth: '42rem', lineHeight: 1.75 }}>
                            Codit eliminates operational friction by securing every customer touchpoint with enterprise-grade intent verification and predictive risk scoring.
                        </p>
                    </div>

                    {/* Metric Bento Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                        {/* Metric 1 */}
                        <div style={{ background: '#151b2d', padding: '2rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', cursor: 'default', transition: 'background 0.25s' }}
                            onMouseOver={e => e.currentTarget.style.background = '#1e2540'}
                            onMouseOut={e => e.currentTarget.style.background = '#151b2d'}>
                            <span className="font-headline" style={{ color: '#d0bcff', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', display: 'block' }}>Core Performance</span>
                            <div>
                                <h3 className="font-headline" style={{ fontSize: '3.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem', lineHeight: 1 }}>25%</h3>
                                <p style={{ color: '#c7c4d7', fontSize: '0.9rem', lineHeight: 1.65 }}>Reduced RTO by leveraging predictive intent verification and AI-driven scrubbing.</p>
                            </div>
                            <div style={{ marginTop: '1.5rem', height: '4px', borderRadius: '9999px', background: '#2e3447', overflow: 'hidden' }}>
                                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #d0bcff, #a078ff)' }}></div>
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div style={{ background: '#151b2d', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative', minHeight: '220px' }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #151b2d 35%, rgba(21,27,45,0.85) 60%, transparent)', zIndex: 2 }}></div>
                            <div style={{ position: 'relative', zIndex: 3, padding: '2rem' }}>
                                <span className="font-headline" style={{ color: '#ffb783', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.875rem' }}>Operational Alpha</span>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, maxWidth: '18rem' }}>
                                    Logistics Savings: <span style={{ color: '#ffb783' }}>15%</span>
                                </h3>
                                <p style={{ color: '#c7c4d7', fontSize: '0.875rem', marginTop: '0.875rem', maxWidth: '22rem', lineHeight: 1.65 }}>
                                    Optimized route distribution and ghost order elimination directly impact your bottom line.
                                </p>
                            </div>
                            {/* Abstract background glow */}
                            <div style={{ position: 'absolute', right: '-2rem', top: '50%', transform: 'translateY(-50%)', width: '14rem', height: '14rem', background: 'radial-gradient(circle, rgba(208,188,255,0.12), transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>
                        </div>
                    </div>

                    {/* Solution Pillars */}
                    <div style={{ marginBottom: '4rem' }}>
                        <p className="font-headline" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#d0bcff', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2.5rem' }}>Engineered Pillars</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { icon: 'verified_user', color: '#d0bcff', bg: 'rgba(160,120,255,0.15)', title: 'WhatsApp Verification', desc: <>Real-time intent confirmation, reducing fake orders by <strong style={{ color: '#d0bcff' }}>40%</strong> through automated chat verification loops.</> },
                                { icon: 'psychology', color: '#ffb783', bg: 'rgba(255,183,131,0.15)', title: 'AI Risk Scoring', desc: "Predictive modeling to identify 'Ghost' customers and repeat RTO offenders before they enter your warehouse queue." },
                                { icon: 'location_on', color: '#c4c1fb', bg: 'rgba(196,193,251,0.12)', title: 'Address Correction', desc: 'Smart scrubbing of incomplete or gibberish addresses, ensuring delivery success even with imperfect user input.' },
                                { icon: 'dynamic_feed', color: '#dce1fb', bg: 'rgba(255,255,255,0.08)', title: 'Batch Processing', desc: 'Handle thousands of orders instantly with automated workflows designed for flash-sale volatility and high velocity.' },
                            ].map((p, i) => (
                                <div key={i} className="glass glow-border" style={{ padding: '2rem', borderRadius: '1.5rem', transition: 'background 0.25s' }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(46,52,71,0.65)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(46,52,71,0.4)'}>
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: p.color, fontSize: '1.4rem' }}>{p.icon}</span>
                                    </div>
                                    <h4 className="font-headline" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.75rem' }}>{p.title}</h4>
                                    <p style={{ color: '#c7c4d7', fontSize: '0.875rem', lineHeight: 1.7 }}>{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Industry-Specific Optimization */}
                    <div style={{ background: '#151b2d', borderRadius: '2rem', padding: 'clamp(2rem, 5vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
                        {/* Right glow */}
                        <div style={{ position: 'absolute', right: 0, top: 0, width: '33%', height: '100%', background: 'linear-gradient(to left, rgba(208,188,255,0.08), transparent)', pointerEvents: 'none' }}></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                            <div>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', lineHeight: 1.2 }}>
                                    Industry-Specific<br />Optimization
                                </h3>
                                <p style={{ color: '#c7c4d7', marginBottom: '2.5rem', maxWidth: '28rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                    Our logic adapts to the unique risk profiles of different retail categories, ensuring balance between conversion and security.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { dot: '#d0bcff', label: 'Apparel Brands', desc: 'Minimize sizing-related returns and seasonal RTO spikes during high-volume drops.' },
                                        { dot: '#ffb783', label: 'Electronics', desc: 'Verify high-ticket COD intent to eliminate logistics fraud and carrier insurance losses.' },
                                        { dot: '#c4c1fb', label: 'Home Decor', desc: "Smart address scrubbing for bulky, high-cost shipping items that can't afford redelivery." },
                                    ].map((uc, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div style={{ marginTop: '0.45rem', width: '8px', height: '8px', borderRadius: '50%', background: uc.dot, flexShrink: 0 }}></div>
                                            <div>
                                                <h5 className="font-headline" style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{uc.label}</h5>
                                                <p style={{ color: '#c7c4d7', fontSize: '0.85rem', lineHeight: 1.65 }}>{uc.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Dashboard visual */}
                            <div style={{ borderRadius: '1.25rem', overflow: 'hidden', aspectRatio: '16/10', background: '#0c1324', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA96CgueQQKK6avEvF-PPgxymN6N9VUtQEEBHPKEVtC8TlUW_wvLRh4O4v2OyeAXAtSVfFdcZfxq1syfzsvyLP2LvLWcmEkaCzC0pF3npCzoiqvmtWZKHRJXO89SizPZQPFlTT0ZdLjloqfDxX48lhLsBbtZ9LRCE1xzbgEYlqYdrbi3IGQ3vLicDbnAkWXqm8OvLQv8PGmIs4-Bs4hc_pXeOL98_lyViR5OEmAE-9KJzzelyzcqZiS-Vz9ux8uoGs_KbMm57QDuro"
                                    alt="Futuristic CODIT analytics dashboard with delivery route map and dark obsidian theme"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="indigo-divider"></div>

            {/* ─── How It Works (Stitch Zigzag Design) ─── */}
            <section id="how-it-works" style={{ padding: '7rem 1.5rem', backgroundColor: '#0c1324' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    {/* Section Header */}
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(46,52,71,0.5)', border: '1px solid rgba(70,69,84,0.25)', marginBottom: '1.25rem' }}>
                            <span className="font-headline" style={{ color: '#d0bcff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>The Operational Protocol</span>
                        </div>
                        <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#dce1fb', marginBottom: '1rem' }}>
                            The Intelligence Layer Between<br />Order &amp; Dispatch
                        </h2>
                        <p style={{ color: '#c7c4d7', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.7, fontSize: '1rem' }}>
                            CODIT synchronizes your storefront with high-precision AI to automate verification, analyze risk, and execute dispatch logic without human intervention.
                        </p>
                    </div>

                    {/* Vertical Zigzag Steps */}
                    <div style={{ position: 'relative' }}>
                        {/* Central glowing connector line — desktop only */}
                        <div className="hiw-connector" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, rgba(208,188,255,0.1), rgba(208,188,255,0.7) 30%, rgba(208,188,255,0.7) 70%, rgba(208,188,255,0.1))', boxShadow: '0 0 18px rgba(208,188,255,0.25)' }}></div>

                        {/* ── Step 1: Store Integration ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }} className="hiw-row">
                            <div style={{ textAlign: 'right', paddingRight: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', background: '#23293c', border: '1px solid rgba(208,188,255,0.3)', color: '#d0bcff', fontWeight: 700, marginBottom: '1.25rem' }}>1</div>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Store Integration</h3>
                                <p style={{ color: '#c7c4d7', lineHeight: 1.75, fontSize: '0.95rem' }}>Seamlessly bridge your commercial stack. CODIT creates a real-time bilateral sync with Shopify, Magento, and WooCommerce, ingesting every order metadata point as it occurs.</p>
                            </div>
                            <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(70,69,84,0.18)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(208,188,255,0.04), transparent)', pointerEvents: 'none' }}></div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#d0bcff' }}>hub</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ height: '8px', width: '96px', background: 'rgba(208,188,255,0.2)', borderRadius: '4px' }}></div>
                                        <div style={{ height: '8px', width: '128px', background: 'rgba(70,69,84,0.25)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(12,19,36,0.5)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.375rem', background: 'rgba(149,191,71,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#95BF47', fontWeight: 800, fontSize: '0.8rem' }}>S</div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Shopify Plus</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#d0bcff', background: 'rgba(208,188,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Active</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(12,19,36,0.5)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.375rem', background: 'rgba(235,103,15,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EB670F', fontWeight: 800, fontSize: '0.8rem' }}>M</div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Magento 2.4</span>
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#d0bcff', background: 'rgba(208,188,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Syncing</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Step 2: Automated Verification ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }} className="hiw-row">
                            <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(70,69,84,0.18)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-3rem', left: '-3rem', width: '12rem', height: '12rem', background: 'rgba(208,188,255,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(37,211,102,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#25D366', fontSize: '1.1rem' }}>chat</span>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>Verification Stream</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ padding: '0.875rem 1rem', background: '#151b2d', borderRadius: '0.75rem 0.75rem 0.75rem 0', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '80%' }}>
                                        <p style={{ fontSize: '0.7rem', color: '#908fa0', marginBottom: '0.3rem' }}>CODIT AI:</p>
                                        <p style={{ fontSize: '0.875rem', color: '#dce1fb' }}>Hello Alex, please confirm your order #8922 via a quick tap.</p>
                                    </div>
                                    <div style={{ padding: '0.875rem 1rem', background: 'rgba(208,188,255,0.1)', borderRadius: '0.75rem 0.75rem 0 0.75rem', border: '1px solid rgba(208,188,255,0.2)', maxWidth: '80%', marginLeft: 'auto' }}>
                                        <p style={{ fontSize: '0.7rem', color: '#d0bcff', marginBottom: '0.3rem' }}>Customer:</p>
                                        <p style={{ fontSize: '0.875rem', color: '#dce1fb' }}>Yes, confirmed. Thank you!</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(68,65,115,0.4)', color: '#c4c1fb', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, borderRadius: '0.375rem' }}>Intent: Verified Positive</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', background: '#23293c', border: '1px solid rgba(208,188,255,0.3)', color: '#d0bcff', fontWeight: 700, marginBottom: '1.25rem' }}>2</div>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Automated Verification</h3>
                                <p style={{ color: '#c7c4d7', lineHeight: 1.75, fontSize: '0.95rem' }}>Instantly trigger WhatsApp verification flows. Our AI analyzes customer intent in real-time — interpreting natural language replies to confirm delivery details or spot potential buyer remorse before shipping.</p>
                            </div>
                        </div>

                        {/* ── Step 3: AI Risk Analysis ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }} className="hiw-row">
                            <div style={{ textAlign: 'right', paddingRight: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', background: '#23293c', border: '1px solid rgba(208,188,255,0.3)', color: '#d0bcff', fontWeight: 700, marginBottom: '1.25rem' }}>3</div>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>AI Risk Analysis</h3>
                                <p style={{ color: '#c7c4d7', lineHeight: 1.75, fontSize: '0.95rem' }}>Every order is audited against a matrix of 100+ variables. From velocity checks and IP geolocation to behavioral history and address validity — nothing bypasses the filter.</p>
                            </div>
                            <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(70,69,84,0.18)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#070d1f', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#908fa0', marginBottom: '0.4rem' }}>Risk Score</p>
                                        <p className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d0bcff' }}>12/100</p>
                                    </div>
                                    <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#070d1f', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#908fa0', marginBottom: '0.4rem' }}>Integrity</p>
                                        <p className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffb783' }}>High</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    {[
                                        { label: 'IP Validity', pct: 92, good: true },
                                        { label: 'History', pct: 85, good: true },
                                        { label: 'Address Match', pct: 40, good: false },
                                    ].map(row => (
                                        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <span className="material-symbols-outlined" style={{ color: row.good ? '#d0bcff' : '#ffb783', fontSize: '1rem' }}>{row.good ? 'check_circle' : 'error'}</span>
                                            <div style={{ flex: 1, height: '6px', background: '#2e3447', borderRadius: '9999px', overflow: 'hidden' }}>
                                                <div style={{ width: `${row.pct}%`, height: '100%', background: row.good ? '#d0bcff' : '#ffb783' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: '#908fa0', minWidth: '80px', textAlign: 'right' }}>{row.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Step 4: Decision Engine ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="hiw-row">
                            <div className="glass" style={{ borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(70,69,84,0.18)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(208,188,255,0.25)', background: 'rgba(208,188,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg, #d0bcff, #a078ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ color: '#23005c', fontSize: '1.1rem' }}>rocket_launch</span>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dce1fb' }}>Auto-Release</p>
                                                <p style={{ fontSize: '0.7rem', color: '#908fa0' }}>Score &lt; 20. Verified intent.</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined" style={{ color: '#d0bcff' }}>chevron_right</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(70,69,84,0.2)', background: 'rgba(12,19,36,0.4)', opacity: 0.65 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: '#2e3447', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ color: '#dce1fb', fontSize: '1.1rem' }}>visibility</span>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dce1fb' }}>Manual Review</p>
                                                <p style={{ fontSize: '0.7rem', color: '#908fa0' }}>Score 20–60. Flagged anomalies.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,180,171,0.2)', background: 'rgba(255,180,171,0.05)', opacity: 0.65 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: '#93000a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ color: '#ffb4ab', fontSize: '1.1rem' }}>block</span>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dce1fb' }}>Automated Hold</p>
                                                <p style={{ fontSize: '0.7rem', color: '#908fa0' }}>Score &gt; 60. High fraud risk.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '3rem' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', background: '#23293c', border: '1px solid rgba(208,188,255,0.3)', color: '#d0bcff', fontWeight: 700, marginBottom: '1.25rem' }}>4</div>
                                <h3 className="font-headline" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Decision Engine</h3>
                                <p style={{ color: '#c7c4d7', lineHeight: 1.75, fontSize: '0.95rem' }}>The final authority. Safe orders are instantly released to your WMS, while suspicious activity is held for review or automatically cancelled based on your custom business logic.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="indigo-divider"></div>

            {/* ─── Metrics Section ─── */}
            <section style={{ padding: '5rem 1.5rem', backgroundColor: '#070d1f' }}>
                <div style={{ maxWidth: '60rem', margin: '0 auto', background: 'linear-gradient(135deg, #191f31 0%, #151b2d 100%)', padding: '3.5rem 2.5rem', borderRadius: '2.5rem', border: '1px solid rgba(70,69,84,0.12)', textAlign: 'center' }}>
                    <h2 className="font-headline" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '3rem', color: '#dce1fb' }}>See the Impact in Real Numbers</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem' }}>
                        {[
                            { label: 'Prevented Loss (per 100 orders)', value: '₹3,240', accent: '#d0bcff', note: 'Based on avg. shipping & handling savings' },
                            { label: 'RTO Reduction', value: '20–30%', accent: '#ffb783', note: 'For verified D2C brands' },
                            { label: 'High-Risk Orders Blocked', value: '18+', accent: '#d0bcff', note: 'Flagged this week (avg)' },
                        ].map((m, i) => (
                            <div key={i}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: m.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>{m.label}</p>
                                <p className="font-headline" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, color: '#dce1fb', lineHeight: 1 }}>{m.value}</p>
                                <p style={{ fontSize: '0.75rem', color: '#908fa0', marginTop: '0.5rem', fontStyle: 'italic' }}>{m.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="indigo-divider"></div>

            {/* ─── Demo Section ─── */}
            <section style={{ padding: '7rem 1.5rem', backgroundColor: '#0c1324' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div style={{ background: '#070d1f', padding: '2rem', borderRadius: '1.75rem', border: '1px solid rgba(70,69,84,0.12)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { n: 1, text: 'Create test order in your dashboard', active: false },
                                { n: 2, text: 'Receive WhatsApp confirmation in seconds', active: false },
                                { n: 3, text: "Simulate a 'Ghost' or 'Real' response", active: false },
                                { n: 4, text: 'Watch CODIT hold the fake order', active: true },
                            ].map(step => (
                                <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#0c1324', borderRadius: '0.875rem', border: step.active ? '2px solid rgba(208,188,255,0.3)' : '2px solid transparent' }}>
                                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: step.active ? 'linear-gradient(135deg, #d0bcff, #a078ff)' : 'rgba(208,188,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: step.active ? '#23005c' : '#d0bcff', flexShrink: 0 }}>
                                        {step.n}
                                    </div>
                                    <span style={{ fontWeight: step.active ? 700 : 500, color: step.active ? '#dce1fb' : '#c7c4d7', fontSize: '0.9rem' }}>{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1.5rem', lineHeight: 1.15 }}>
                            See CODIT <span className="gradient-text">in Action</span>
                        </h2>
                        <p style={{ color: '#c7c4d7', lineHeight: 1.75, fontSize: '1.05rem', marginBottom: '2rem' }}>
                            Experience how our intelligence layer protects your store in real-time. From the first ping to the final decision, witness the RTO reduction engine.
                        </p>
                        <Link to="/signup" className="btn-primary font-headline" style={{ display: 'inline-block', padding: '1rem 2rem', borderRadius: '1rem', textDecoration: 'none', fontSize: '1rem' }}>
                            Try the Live Demo
                        </Link>
                    </div>
                </div>
            </section>

<div className="indigo-divider"></div>

            {/* ─── Early Access Benefits ─── */}
            <section style={{ padding: '7rem 1.5rem', backgroundColor: '#0c1324' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#dce1fb' }}>Why Join CODIT Early?</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {[
                            { icon: 'free_cancellation', title: 'Free During Beta', desc: 'Zero subscription fees while we refine the tech.' },
                            { icon: 'support_agent', title: 'Priority Support', desc: 'Direct access to the founders and dev team.' },
                            { icon: 'savings', title: 'Lifetime Discount', desc: 'Locked-in early bird pricing for life.' },
                            { icon: 'architecture', title: 'Shape Product', desc: 'Suggest features that fit your specific workflow.' },
                            { icon: 'rocket_launch', title: 'First Moves', desc: 'Get a head start over competitors on RTO tech.' },
                        ].map((b, i) => (
                            <div key={i} className="feature-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'default' }}>
                                <div style={{ width: '3rem', height: '3rem', background: 'rgba(208,188,255,0.1)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', transition: 'background 0.2s' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#d0bcff', fontSize: '1.3rem' }}>{b.icon}</span>
                                </div>
                                <h4 className="font-headline" style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#dce1fb', fontSize: '1rem' }}>{b.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#c7c4d7', lineHeight: 1.6 }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section style={{ padding: '7rem 1.5rem', backgroundColor: '#070d1f' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', position: 'relative' }}>
                    <div className="glass" style={{ borderRadius: '3rem', padding: 'clamp(3rem, 8vw, 5rem)', border: '1px solid rgba(208,188,255,0.2)', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '16rem', height: '16rem', background: 'rgba(208,188,255,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16rem', height: '16rem', background: 'rgba(208,188,255,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2 className="font-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#dce1fb', marginBottom: '2rem', lineHeight: 1.1 }}>
                                Start Preventing Fake<br />COD Orders Today
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                                <Link to="/signup" className="btn-primary font-headline" style={{ padding: '1.25rem 3rem', borderRadius: '1.25rem', fontSize: '1.15rem', textDecoration: 'none', display: 'inline-block' }}>
                                    Get Early Access
                                </Link>
                                <p style={{ color: '#d0bcff', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                    Limited onboarding slots available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer style={{ backgroundColor: '#0c1324', padding: '3rem 1.5rem', borderTop: '1px solid rgba(70,69,84,0.15)' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="font-headline" style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f1f5f9' }}>CODIT</div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {['Privacy', 'Terms', 'Security', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ color: '#908fa0', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                                onMouseOver={e => e.target.style.color = '#d0bcff'} onMouseOut={e => e.target.style.color = '#908fa0'}>
                                {l}
                            </a>
                        ))}
                    </div>
                    <div style={{ color: '#908fa0', fontSize: '0.875rem' }}>© 2025 CODIT · coditai.in</div>
                </div>
            </footer>

            {/* Responsive utilities */}
            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: block !important; }
                    .animated-orb { width: 260px !important; height: 260px !important; }
                    .float-1, .float-2, .float-3 { display: none; }
                    .hiw-connector { display: none !important; }
                    .hiw-row { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 0 !important; }
                    .hiw-row > div:first-child { padding-right: 0 !important; text-align: left !important; }
                    .hiw-row > div:last-child { padding-left: 0 !important; }
                }
                @media (min-width: 769px) {
                    .show-mobile { display: none !important; }
                }
            `}</style>
        </div>
    );
}

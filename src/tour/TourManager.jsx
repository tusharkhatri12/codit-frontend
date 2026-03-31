import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initTour } from './productTour';

export default function TourManager() {
    const navigate = useNavigate();
    const location = useLocation();
    const tourRef = useRef(null);

    useEffect(() => {
        // Initialize tour once
        if (!tourRef.current) {
            tourRef.current = initTour(navigate);
        }

        const handleStartTour = () => {
            if (tourRef.current) {
                // If on orders page, we might want to go back to dashboard first for a full experience
                if (location.pathname.includes('/orders')) {
                    navigate('/dashboard');
                    setTimeout(() => tourRef.current.start(), 500);
                } else {
                    tourRef.current.start();
                }
            }
        };

        window.addEventListener('start-tour', handleStartTour);

        // Auto-trigger for new users
        const hasSeenTour = localStorage.getItem('codit_tour_seen');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Only auto-trigger if logged in, hasn't seen tour, and on dashboard
        if (!hasSeenTour && user.token && (location.pathname === '/dashboard' || location.pathname === '/dashboard/')) {
            setTimeout(() => {
                tourRef.current.start();
                localStorage.setItem('codit_tour_seen', 'true');
            }, 2000); // 2 second delay for first-time load
        }

        return () => {
            window.removeEventListener('start-tour', handleStartTour);
        };
    }, [navigate, location]);

    return null; // Side-effect only component
}

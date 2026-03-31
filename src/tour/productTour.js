import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const tourButtons = [
    {
        classes: 'shepherd-button-secondary',
        text: 'Exit',
        type: 'cancel'
    },
    {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
    }
];

export const initTour = (navigate) => {
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'codit-tour-theme shadow-2xl rounded-2xl border border-slate-200',
            scrollTo: { behavior: 'smooth', block: 'center' },
            cancelIcon: {
                enabled: true
            },
            buttons: tourButtons
        }
    });

    // Helper to wait for elements (Handles route changes)
    const waitForElement = (selector, maxAttempts = 15) => {
        return new Promise((resolve) => {
            let attempts = 0;
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (attempts++ < maxAttempts) {
                    setTimeout(check, 300);
                } else {
                    resolve(null);
                }
            };
            check();
        });
    };

    // Step 1: Welcome
    tour.addStep({
        id: 'welcome',
        text: 'Welcome to CODIT. This dashboard helps you prevent fake COD orders and recover lost revenue.',
        attachTo: {
            element: '#tour-dashboard-header',
            on: 'bottom'
        },
        buttons: [
            {
                classes: 'shepherd-button-primary',
                text: 'Product Tour',
                action: function() {
                    const hasTestBtn = document.querySelector('#tour-create-test-btn');
                    if (hasTestBtn) {
                        return this.next();
                    } else {
                        // Skip directly to orders if no test button (Live mode)
                        return this.show('orders-table');
                    }
                }
            }
        ]
    });

    // Step 2: Create Test Order (INTERACTIVE)
    tour.addStep({
        id: 'create-test',
        text: 'Let\'s see the AI in action. Click "Create Test Order" to open the simulation form.',
        attachTo: {
            element: '#tour-create-test-btn',
            on: 'bottom'
        },
        advanceOn: {
            selector: '#tour-create-test-btn',
            event: 'click'
        },
        buttons: [
            {
                classes: 'shepherd-button-secondary',
                text: 'Exit',
                action: function() { return this.cancel(); }
            }
        ]
    });

    // Step 2.5: Simulation Modal (INTERACTIVE FORM)
    tour.addStep({
        id: 'test-modal',
        text: 'Go ahead and fill in some test details (try a high amount like ₹10,000!) and then click "Inject Test Order".',
        attachTo: {
            element: '#tour-simulation-form',
            on: 'right' // Move to right to avoid overlapping the inputs
        },
        modalOverlayOpeningActive: false, // NUCLEAR FIX: Disable the blocking overlay for this step
        canClickTarget: true,
        advanceOn: {
            selector: '#tour-inject-btn',
            event: 'click'
        },
        buttons: [
            {
                classes: 'shepherd-button-secondary',
                text: 'Back',
                action: function() { return this.back(); }
            }
        ]
    });

    // Step 3: Orders Table Overview
    tour.addStep({
        id: 'orders-table',
        text: 'Success! Your test order is now in the system. Let\'s explore how we analyzed it.',
        attachTo: {
            element: '#tour-orders-table',
            on: 'top'
        },
        beforeShowPromise: function() {
            return new Promise(async (resolve) => {
                const currentPath = window.location.pathname;
                if (currentPath !== '/dashboard/orders') {
                    navigate('/dashboard/orders');
                }
                await waitForElement('#tour-orders-table');
                resolve();
            });
        },
        buttons: tourButtons
    });

    // Step 4: AI Risk Intelligence
    tour.addStep({
        id: 'risk-intelligence',
        text: 'Every order gets a Risk Score from 1-100. Our AI analyzes 50+ signals including IP health, phone history, and behavioral patterns.',
        attachTo: {
            element: '#tour-header-score',
            on: 'bottom'
        },
        buttons: tourButtons
    });

    // Step 5: Automated Decision Engine
    tour.addStep({
        id: 'decision-engine',
        text: 'Based on the score, CODIT makes a decision. High-risk orders are "Auto-Held" to prevent RTO losses until they are verified.',
        attachTo: {
            element: '#tour-header-action',
            on: 'bottom'
        },
        buttons: tourButtons
    });

    // Step 6: WhatsApp Confirmation Pulse
    tour.addStep({
        id: 'whatsapp-pulse',
        text: 'We automatically send WhatsApp confirmation pulses. You can track real-time delivery and customer confirmation status here.',
        attachTo: {
            element: '#tour-header-whatsapp',
            on: 'bottom'
        },
        buttons: tourButtons
    });

    // Step 7: Filtering & Intelligence
    tour.addStep({
        id: 'filter-intelligence',
        text: 'Use these filters to quickly find high-risk orders or export detailed fraud reports for your manual audits.',
        attachTo: {
            element: '#tour-filter-bar',
            on: 'bottom'
        },
        buttons: tourButtons
    });

    // Step 8: Detailed Intelligence View
    tour.addStep({
        id: 'whatsapp-section',
        text: 'For deep-dive analysis, click "Details" on any order to see the raw intelligence signals flagging the order.',
        attachTo: {
            element: '.tour-details-btn',
            on: 'left'
        },
        beforeShowPromise: function() {
            return waitForElement('.tour-details-btn');
        },
        buttons: tourButtons
    });

    // Step 9: Simulate Pulse Result (Modal interaction)
    tour.addStep({
        id: 'simulate-yes',
        text: 'By clicking "Release" or "Drop", you teach our AI risk engine to become even more accurate for your specific store.',
        attachTo: {
            element: '#tour-simulate-yes',
            on: 'top'
        },
        beforeShowPromise: function() {
            return new Promise(async (resolve) => {
                const detailsBtn = document.querySelector('.tour-details-btn');
                if (detailsBtn) detailsBtn.click();
                await waitForElement('#tour-simulate-yes');
                resolve();
            });
        },
        buttons: tourButtons
    });

    // Step 10: Performance Tracking
    tour.addStep({
        id: 'held-orders-final',
        text: 'Finally, track your "Prevented Losses" on the dashboard to see exactly how much revenue CODIT is saving you.',
        attachTo: {
            element: '#tour-metrics-section',
            on: 'top'
        },
        beforeShowPromise: function() {
            return new Promise(async (resolve) => {
                const closeBtn = document.querySelector('#tour-close-modal-btn');
                if (closeBtn) closeBtn.click();
                navigate('/dashboard');
                await waitForElement('#tour-metrics-section');
                resolve();
            });
        },
        buttons: [
            {
                classes: 'shepherd-button-primary',
                text: 'Finish Tour',
                action: function() { return this.complete(); }
            }
        ]
    });

    return tour;
};

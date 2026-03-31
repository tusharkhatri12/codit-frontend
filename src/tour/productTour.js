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
                action: function () {
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

    // Step 2: Create Test Order
    tour.addStep({
        id: 'create-test',
        text: 'Start by creating a test order to see our AI risk engine in action.',
        attachTo: {
            element: '#tour-create-test-btn',
            on: 'bottom'
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
                    resolve(null); // Continue anyway after timeout
                }
            };
            check();
        });
    };

    // Step 3: Orders Table (Navigate to Orders)
    tour.addStep({
        id: 'orders-table',
        text: 'This is where all your incoming orders appear. We monitor them in real-time.',
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
        }
    });

    // Step 4: WhatsApp Confirmation (Click Details)
    tour.addStep({
        id: 'whatsapp-section',
        text: 'Our AI analyzes each order. Click "Details" to see why this order was flagged.',
        attachTo: {
            element: '.tour-details-btn',
            on: 'left'
        },
        beforeShowPromise: function() {
            return waitForElement('.tour-details-btn');
        }
    });

    // Step 5: Simulate YES (Modal interaction)
    tour.addStep({
        id: 'simulate-yes',
        text: 'This simulates a customer confirming their order via WhatsApp. Our AI uses this feedback to refine its risk model.',
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
        }
    });

    // Step 6: Held Orders (Close Modal and Return)
    tour.addStep({
        id: 'held-orders',
        text: 'High-risk orders are automatically held here to prevent RTO losses until they are verified.',
        attachTo: {
            element: '#tour-held-orders',
            on: 'bottom'
        },
        beforeShowPromise: function() {
            return new Promise(async (resolve) => {
                const closeBtn = document.querySelector('#tour-close-modal-btn');
                if (closeBtn) closeBtn.click();
                
                // Return to dashboard if we are on orders page
                const currentPath = window.location.pathname;
                if (currentPath !== '/dashboard') {
                    navigate('/dashboard');
                }
                
                await waitForElement('#tour-held-orders');
                resolve();
            });
        }
    });

    // Step 7: Metrics
    tour.addStep({
        id: 'metrics',
        text: 'Your performance metrics show exactly how much revenue CODIT is saving for your store.',
        attachTo: {
            element: '#tour-metrics-section',
            on: 'top'
        },
        buttons: [
            {
                classes: 'shepherd-button-primary',
                text: 'Finish Tour',
                type: 'next'
            }
        ]
    });

    return tour;
};

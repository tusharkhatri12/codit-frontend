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
                text: 'Show Me How',
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

    // Step 2: Create Test Order
    tour.addStep({
        id: 'create-test',
        text: 'Start by creating a test order to see our AI risk engine in action.',
        attachTo: {
            element: '#tour-create-test-btn',
            on: 'bottom'
        }
    });

    // Step 3: Orders Table (Navigate to Orders)
    tour.addStep({
        id: 'orders-table',
        text: 'This is where all your incoming orders appear. We monitor them in real-time.',
        attachTo: {
            element: '#tour-orders-table',
            on: 'top'
        },
        beforeShowPromise: function() {
            return new Promise((resolve) => {
                navigate('/dashboard/orders');
                // Give some time for the page to load
                setTimeout(resolve, 500);
            });
        }
    });

    // Step 4: WhatsApp Section (Assuming user clicks' Details' or we show it generally)
    tour.addStep({
        id: 'whatsapp-section',
        text: 'CODIT automatically sends WhatsApp confirmation messages to your customers.',
        attachTo: {
            element: '#tour-whatsapp-section',
            on: 'bottom'
        },
        beforeShowPromise: function() {
            return new Promise((resolve) => {
                // If there are orders, trigger the first one's detail to show the modal
                // For the tour, we expect at least one test order or demo order
                const detailBtn = document.querySelector('.tour-details-btn');
                if (detailBtn) {
                  detailBtn.click();
                  setTimeout(resolve, 600); // Wait for modal animation
                } else {
                  console.warn('Tour: Details button not found');
                  resolve();
                }
            });
        }
    });

    // Step 5: Simulate YES
    tour.addStep({
        id: 'simulate-yes',
        text: 'Click <b>CONFIRM (YES)</b> to simulate a real customer confirming their order.',
        attachTo: {
            element: '#tour-simulate-yes',
            on: 'top'
        },
        advanceOn: { selector: '#tour-simulate-yes', event: 'click' }
    });

    // Step 6: Held Orders (Nav back to Dashboard)
    tour.addStep({
        id: 'held-orders',
        text: 'High-risk or unconfirmed orders are automatically held to prevent RTO losses.',
        attachTo: {
            element: '#tour-held-orders',
            on: 'left'
        },
        beforeShowPromise: function() {
            return new Promise((resolve) => {
                // Close modal first using the new specific ID
                const closeBtn = document.querySelector('#tour-close-modal-btn');
                if (closeBtn) closeBtn.click();
                
                navigate('/dashboard');
                setTimeout(resolve, 500);
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

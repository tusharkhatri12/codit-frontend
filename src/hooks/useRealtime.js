import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../utils/api';

let socketInstance = null;

export const useRealtime = (onUpdateCallback) => {
    useEffect(() => {
        // Initialize socket once to prevent memory leaks across components
        if (!socketInstance) {
            socketInstance = io(BACKEND_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });
            
            socketInstance.on('connect', () => {
                console.log('✅ Connected to Real-time Stream');
            });
        }

        const handleUpdate = (data) => {
            console.log('⚡ Received DASHBOARD_UPDATE event from server', data);
            if (onUpdateCallback) {
                onUpdateCallback(data);
            }
        };

        // Bind the event specifically for this mounted component
        socketInstance.on('DASHBOARD_UPDATE', handleUpdate);

        // Cleanup the listener to avoid infinite ghost callbacks when unmounting
        return () => {
            socketInstance.off('DASHBOARD_UPDATE', handleUpdate);
        };
    }, [onUpdateCallback]);
};

// NotificationBrandComponent.tsx
import React, { useEffect, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface NotificationBrandComponentProps {
    userId: string;
}

const NotificationBrandComponent: React.FC<NotificationBrandComponentProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        // Initialize Stomp client
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:6969/websocket?userid=${userId}`),
            debug: (msg) => console.log('STOMP Debug:', msg),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/notifications', (message) => {
                    if (message.body) {
                        setNotifications((prevNotifications) => [...prevNotifications, message.body]);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
            },
        });

        stompClient.activate();

        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [userId]);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationBrandComponent;

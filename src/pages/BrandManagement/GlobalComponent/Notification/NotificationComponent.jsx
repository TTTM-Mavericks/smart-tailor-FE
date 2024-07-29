import React, { useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const userId = "a";  // Replace with actual user ID or email

    const showMessage = useCallback((message) => {
        console.log('Received message:', message);
        setNotifications(prev => [...prev, message]);
    }, []);

    useEffect(() => {
        const socketUrl = 'http://localhost:6969/websocket';
        let client = null;

        const connectWebSocket = () => {
            client = new Client({
                webSocketFactory: () => new SockJS(socketUrl),
                connectHeaders: { userid: userId },
                debug: (str) => console.log("STOMP: " + str),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            client.onConnect = (frame) => {
                setConnectionStatus('Connected');
                console.log('Connected: ' + frame);

                client.subscribe('/topic/messages', (message) => {
                    showMessage(JSON.parse(message.body).message);
                });

                client.subscribe('/user/topic/private-messages', (message) => {
                    showMessage(JSON.parse(message.body).message);
                });

                client.subscribe('/topic/global-notifications', (message) => {
                    showMessage(JSON.parse(message.body).message);
                });

                client.subscribe('/user/topic/private-notifications', (message) => {
                    showMessage(JSON.parse(message.body).message);
                });
            };

            client.onStompError = (frame) => {
                setConnectionStatus('Error');
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            };

            client.onWebSocketError = (event) => {
                setConnectionStatus('WebSocket Error');
                console.error('WebSocket error', event);
            };

            client.onDisconnect = () => {
                setConnectionStatus('Disconnected');
                console.log('Disconnected');
            };

            client.activate();
        };

        connectWebSocket();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [userId, showMessage]);

    return (
        <div>
            <h1>Realtime Notifications</h1>
            <p>Connection Status: {connectionStatus}</p>
            <div id="notifications">
                {notifications.map((notification, index) => (
                    <div key={index}>{notification}</div>
                ))}
            </div>
        </div>
    );
};

export default NotificationComponent;
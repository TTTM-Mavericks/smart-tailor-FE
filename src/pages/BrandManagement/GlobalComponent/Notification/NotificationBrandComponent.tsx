import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

interface Notification {
    message: string;
}

const NotificationBrandComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const userId = "a";  // Assign the current user's username

    useEffect(() => {
        const socket = new SockJS('http://localhost:6969/websocket?userid=' + userId);
        const stompClient = Stomp.over(socket);

        stompClient.debug = (str) => {
            console.log(str);
        };

        stompClient.connect({}, (frame: any) => {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/topic/messages', (message: any) => {
                showMessage(JSON.parse(message.body));
            });

            stompClient.subscribe('/user/topic/private-messages', (message: any) => {
                showMessage(JSON.parse(message.body));
            });

            stompClient.subscribe('/topic/global-notifications', (message: any) => {
                showMessage(JSON.parse(message.body));
            });

            stompClient.subscribe('/user/topic/private-notifications', (message: any) => {
                showMessage(JSON.parse(message.body));
            });
        }, (error: string) => {
            console.log('Error: ' + error);
        });

        return () => {
            stompClient.disconnect(() => {
                console.log('Disconnected');
            });
        };
    }, [userId]);

    function showMessage(notification: Notification) {
        console.log(notification.message);
        setNotifications(prevNotifications => [...prevNotifications, notification]);
    }

    return (
        <div>
            <h1>Realtime Notifications</h1>
            <div id="notifications">
                {notifications.map((notification, index) => (
                    <div key={index}>{notification.message}</div>
                ))}
            </div>
            {/* <button onClick={sendMessage}>Send Private Message</button> */}
        </div>
    );
};

export default NotificationBrandComponent;

import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const TestComponent: React.FC = () => {
    useEffect(() => {
        const socket = new SockJS('http://localhost:6969/websocket?userid=a');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log('Connected: ', frame);
            stompClient.subscribe('/topic/test', (message) => {
                console.log('Received message: ', message.body);
            });
        }, (error) => {
            console.error('STOMP Connection Error: ', error);
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('Disconnected');
                });
            }
        };
    }, []);

    return <div>Check the console for STOMP messages.</div>;
};

export default TestComponent;

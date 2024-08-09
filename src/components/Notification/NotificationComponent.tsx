import { useEffect, useState } from "react";

export const NotificationComponent = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const websocketUrl = 'ws://localhost:6969/websocket?userid=5k01bR19DF1093'; // Đảm bảo dùng 'ws' thay vì 'http'

    useEffect(() => {
        const websocket = new WebSocket(websocketUrl);

        websocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.onmessage = (event) => {
            console.log('Message received:', event.data);
            var data = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, data.message]);
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            websocket.close();
        };
    }, [websocketUrl]);

    return (
        <div>
            <h1>NOTIFICATION</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

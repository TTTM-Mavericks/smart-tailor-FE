import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { UserInterface } from "../../models/UserModel";

export const NotificationComponent = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const userStorage = Cookies.get('userAuth');
    if (!userStorage) return;
    const userParse: UserInterface = JSON.parse(userStorage)
    const websocketUrl = `ws://localhost:6969/websocket?userid=${userParse.userID}`; // Đảm bảo dùng 'ws' thay vì 'http'

    useEffect(() => {
        const websocket = new WebSocket(websocketUrl);

        websocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.onmessage = (event) => {
            console.log('Message received:', event.data);
            var data = JSON.parse(event.data);
            console.log(data);
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

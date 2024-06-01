import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import io from "socket.io-client";
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, IconButton, Badge, Avatar } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Interface for Notification data
interface NotificationInterface {
    notiID?: any;
    baseUserID?: UserInterFace;
    targetUserID?: string;
    messageType?: string;
    content?: string;
    sender?: string;
    action?: string;
    actionID?: any;
    message?: string;
    status?: boolean;
    dateTime?: string;
}

// Interface for User data
interface UserInterFace {
    userID?: number;
    username?: string;
    password?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    gender?: string;
    role?: string;
    subRole?: string;
    imgUrl?: string;
    status?: string;
    language?: string;
    isFirstLogin?: boolean;
    followed?: boolean;
}

const ManageNotificationScreens = () => {
    const [data, setData] = useState<NotificationInterface[]>([]);

    // WebSocket connection instance
    const socket = io('ws://localhost:6969');
    const stompClient = Stomp.over(socket);

    useEffect(() => {
        // Fetch initial notification data
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:6969/api/v1/notification/get-all-notification?userid=1&target_userid=2`);
                const getData = await response.json();
                if (getData) {
                    setData(getData.data);
                } else {
                    console.log(getData.data);
                }
            } catch (error) {
                console.error("An error occurred during data fetching:", error);
            }
        };

        fetchData();

        // Connect to WebSocket
        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
            // Subscribe to notifications topic
            stompClient.subscribe('/topic/public', (message) => {
                const newNotification: NotificationInterface = JSON.parse(message.body);
                // Update state with new notification
                setData((prevData) => [newNotification, ...prevData]);
            });
        });

        // Cleanup function to disconnect from WebSocket
        return () => {
            stompClient.disconnect();
        };
    }, [stompClient]);

    const handleMarkAllRead = async () => {
        const fetchData = async () => {
            try {
                const promises = data.map(async (noti) => {
                    const isActive = noti.baseUserID && noti.baseUserID.status === "ACTIVE";

                    if (isActive) {
                        const response = await fetch(`http://localhost:6969/api/v1/notification/un-read-notification?noti_id=${noti.notiID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        if (response.status === 200) {
                            const updatedData = await response.json();
                            // Update the state with the updated data
                            setData((prevData) =>
                                prevData.map((item) =>
                                    item.notiID === noti.notiID ? { ...item, status: true } : item
                                )
                            );
                        } else {
                            console.log("An error occurred:", await response.json());
                        }
                    }
                });

                await Promise.all(promises);
            } catch (error) {
                console.error("An error occurred during data fetching:", error);
            }
        };

        fetchData();
    };

    const handleMarkIsRead = async (clickedItem: NotificationInterface) => {
        try {
            const response = await fetch(`http://localhost:6969/api/v1/notification/un-read-notification?noti_id=${clickedItem.notiID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Update the status of the clicked item locally
                setData(prevData => prevData.map(item => {
                    if (item.notiID === clickedItem.notiID) {
                        return { ...item, status: true }; // Mark the clicked item as read
                    }
                    return item;
                }));
            } else {
                console.log("An error occurred:", await response.json());
            }
        } catch (error) {
            console.error("An error occurred during data fetching:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Notifications
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleMarkAllRead}
                style={{ marginBottom: '20px' }}
            >
                Mark All as Read
            </Button>
            <List>
                {data.map((notification) => (
                    <ListItem key={notification.notiID} button>
                        <Avatar>
                            <NotificationsIcon />
                        </Avatar>
                        <ListItemText
                            primary={notification.action}
                            secondary={`${notification.baseUserID?.username} - ${new Date(notification.dateTime!).toLocaleString()}`}
                            style={{ textDecoration: notification.status ? 'line-through' : 'none', marginLeft: "2%" }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="mark as read" onClick={() => handleMarkIsRead(notification)}>
                                <CheckIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ManageNotificationScreens;

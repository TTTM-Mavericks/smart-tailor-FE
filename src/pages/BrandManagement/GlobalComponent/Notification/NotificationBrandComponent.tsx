import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import io from "socket.io-client";
import { Button, Divider, IconButton, Menu, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

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

const NotificationBrandComponent = () => {
    const [anchorOpenNotification, setAnchorOpenNotification] = React.useState<null | HTMLElement>(null);
    const [data, setData] = useState<NotificationInterface[]>([]);

    // Pop Up Notification
    const [openPopup, setOpenPopup] = React.useState<boolean>(false);

    const _handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const _handleClosePopup = () => {
        setOpenPopup(false);
    };

    const _handleCloseNotification = () => {
        setAnchorOpenNotification(null);
    };

    const _handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOpenNotification(event.currentTarget);
    };

    // Create a WebSocket connection instance
    const socket = io('ws://localhost:6969');
    const stompClient = Stomp.over(socket);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:6969/api/v1/notification/get-all-notification?userid=1&target_userid=2`);
                const getData = await response.json();
                if (getData.status === 200) {
                    setData(getData.data);
                } else {
                    console.log(getData.data);
                }
            } catch (error) {
                console.error("An error occurred during data fetching:", error);
            }
        };
        fetchData();

        // Connect to WebSocket only once
        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
            // Subscribe to notifications topic
            stompClient.subscribe('/topic/public', (message: any) => {
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

    const _handleMarkAllRead = () => {
        const fetchData = async () => {
            try {
                const promises = data.map(async (noti) => {
                    const isActive = noti.baseUserID && noti.baseUserID.status === "ACTIVE";

                    if (isActive) {
                        const response = await fetch(`http://localhost:6969/api/v1/notification/un-read-notification?noti_id=${noti.notiID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                // 'Authorization': `Bearer ${tokenString}`,
                            },
                            // Uncomment the following line if you need to send data in the request body
                            // body: JSON.stringify(params),
                        });
                        console.log("notiid" + noti.notiID);

                        if (response.status === 200) {
                            const updatedData = await response.json();
                            // Update the state with the updated data
                            setData((prevData) =>
                                prevData.map((item) =>
                                    item.notiID === noti.notiID ? updatedData : item
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

    const _handleMarkIsRead = async (clickedItem: NotificationInterface) => {
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


    const newNotificationsCount = data.filter(item => !item.status).length;

    return (
        <div>
            <IconButton>
                <Badge
                    badgeContent={newNotificationsCount}
                    color="error"
                    onClick={_handleClickNotification}
                >
                    <NotificationsOutlinedIcon />
                </Badge>
                <Menu
                    anchorEl={anchorOpenNotification}
                    open={Boolean(anchorOpenNotification)}
                    onClose={_handleCloseNotification}
                    style={{ height: "70%", minWidth: "200px", borderRadius: "10px" }}
                >
                    {data.map((item) => (
                        <div key={item.notiID} style={{ borderRadius: '8px', marginBottom: '8px', position: 'relative', backgroundColor: item.status ? 'rgba(162,222,82,0.1)' : 'rgba(234,49,62,0.1)' }} onClick={_handleMarkIsRead} >
                            <div onClick={() => _handleMarkIsRead(item)} style={{ padding: '12px', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', top: '12px', right: '12px', borderRadius: '4px', padding: '4px 8px', backgroundColor: item.status ? 'rgba(162,222,82,0.6)' : 'rgba(234,49,62,0.6)', color: '#fff' }}>
                                    <span>{item.status ? 'Readed' : 'News'}</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#333' }}>{item.baseUserID?.username}</p>
                                    <p style={{ fontSize: '12px', fontWeight: '400', marginBottom: '2px', color: '#555' }}>{item.action === 'FOLLOW' ? `${item.action} You` : `${item.action} your post`}</p>
                                    <p style={{ fontSize: '11px', fontWeight: '400', color: '#888' }}>{item.dateTime}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Divider component="li" />
                    <div style={{ padding: "8px", display: "flex", justifyContent: "flex-end", backgroundColor: "#fafbfd", borderTop: '1px solid #eee' }}>
                        <Button onClick={_handleMarkAllRead} style={{ color: "#666", marginRight: '8px' }}>Mark all as read</Button>
                        <Button onClick={_handleOpenPopup} style={{ color: "#666" }}>View All</Button>
                    </div>
                </Menu>

                <Dialog open={openPopup} onClose={_handleClosePopup} PaperProps={{
                    style: {
                        backgroundColor: "white",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                        width: "100%"
                    },
                }}>
                    <DialogTitle>All Notifications</DialogTitle>
                    <DialogContent>
                        {data.map((item) => (
                            <div key={item.notiID} style={{ borderRadius: '8px', marginBottom: '8px', position: 'relative', backgroundColor: item.status ? 'rgba(162,222,82,0.1)' : 'rgba(234,49,62,0.1)' }}>
                                <div onClick={() => _handleMarkIsRead(item)} style={{ padding: '12px', cursor: 'pointer' }}>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', borderRadius: '4px', padding: '4px 8px', backgroundColor: item.status ? 'rgba(162,222,82,0.6)' : 'rgba(234,49,62,0.6)', color: '#fff' }}>
                                        <span>{item.status ? 'Readed' : 'News'}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#333' }}>{item.baseUserID?.username}</p>
                                        <p style={{ fontSize: '12px', fontWeight: '400', marginBottom: '2px', color: '#555' }}>{item.action === 'FOLLOW' ? `${item.action} You` : `${item.action} your post`}</p>
                                        <p style={{ fontSize: '11px', fontWeight: '400', color: '#888' }}>{item.dateTime}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={_handleClosePopup}>Close</Button>
                    </DialogActions>
                </Dialog>
            </IconButton>
        </div>
    );
};

export default NotificationBrandComponent;

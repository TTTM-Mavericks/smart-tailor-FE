import React, { useState, useEffect } from 'react';
import { Stomp } from '@stomp/stompjs';
import io from "socket.io-client";
import { MenuItem, Button, Divider, IconButton, Menu, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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

const NotificationWithSocketIOScreen = () => {
    const [anchorOpenNotification, setAnchorOpenNotification] = React.useState<null | HTMLElement>(null);
    const [data, setData] = useState<NotificationInterface[]>([]);

    // Pop Up Notification
    const [openPopup, setOpenPopup] = React.useState(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const handleCloseNotification = () => {
        setAnchorOpenNotification(null);
    };

    const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOpenNotification(event.currentTarget);
    };

    // Create a WebSocket connection instance
    // const socket = io('ws://localhost:6969');
    // const stompClient = Stomp.over(socket);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:6969/api/v1/notification/get-all-notification?userid=1&target_userid=2`);
    //             const getData = await response.json();
    //             if (getData.success === 200) {
    //                 setData(getData.data);
    //             } else {
    //                 console.log(getData.data);
    //             }
    //         } catch (error) {
    //             console.error("An error occurred during data fetching:", error);
    //         }
    //     };
    //     fetchData();

    //     // Connect to WebSocket only once
    //     stompClient.connect({}, () => {
    //         console.log('Connected to WebSocket');
    //         // Subscribe to notifications topic
    //         stompClient.subscribe('/topic/public', (message: any) => {
    //             const newNotification: NotificationInterface = JSON.parse(message.body);
    //             // Update state with new notification
    //             setData((prevData) => [newNotification, ...prevData]);
    //         });
    //     });

    //     // Cleanup function to disconnect from WebSocket
    //     return () => {
    //         stompClient.disconnect();
    //     };

    // }, [stompClient]);

    const handleMarkIsRead = async (event: NotificationInterface) => {
    };

    // const handleMarkAllRead = (event: any) => {
    //     const fetchData = async () => {
    //         // const tokenStorage = localStorage.getItem('access_token');
    //         // const userStorage = localStorage.getItem('userData');

    //         // if (userStorage) {
    //         //     const userParse = JSON.parse(userStorage);

    //         //     if (tokenStorage) {
    //         //         const tokenString = JSON.parse(tokenStorage);

    //         // const params = {};

    //         try {
    //             const promises = event.map(async (noti: any) => {
    //                 console.log(noti.baseUserID.status);
    //                 localStorage.setItem('test', noti.baseUserID.status)
    //                 if (noti.baseUserID.status === "ACTIVE") {
    //                     const response = await fetch(`http://localhost:6969/api/v1/notification/un-read-notification?noti_id=9`, {
    //                         method: 'PUT',
    //                         // headers: {
    //                         //     'Content-Type': 'application/json',
    //                         //     'Authorization': `Bearer ${tokenString}`,
    //                         // },
    //                         // body: JSON.stringify(params),
    //                     });

    //                     if (response.status === 200) {
    //                         const data = await response.json();
    //                         setData(data);
    //                     } else {
    //                         console.log("lỗi data hay gì đó ");
    //                     }
    //                 }
    //             });

    //             await Promise.all(promises);
    //         } catch (error) {
    //             console.error("An error occurred during data fetching:", error);
    //         }
    //         // }
    //         // }
    //         // };

    //         fetchData();
    //     };
    // }

    const handleMarkAllRead = () => {
        const fetchData = async () => {
            try {
                const promises = data.map(async (noti) => {
                    const isActive = noti.baseUserID && noti.baseUserID.status === "ACTIVE";

                    if (isActive) {
                        const response = await fetch(`http://localhost:6969/api/v1/notification/un-read-notification?noti_id=${noti.notiID}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                // Add 'Authorization' header if needed
                                // 'Authorization': `Bearer ${tokenString}`,
                            },
                            // Uncomment the following line if you need to send data in the request body
                            // body: JSON.stringify(params),
                        });

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

    const handleConfirmClearAll = () => {
        if (window.confirm('Are you sure you want to clear all?')) {
            handleClearAll();
        }
    };

    const handleClearAll = () => {
        alert('Cleared All');
    };

    return (
        <div>
            <IconButton>
                <Badge
                    badgeContent={data.length}
                    color="error"
                    onClick={handleClickNotification}
                >
                    <NotificationsOutlinedIcon />
                </Badge>
                <Menu
                    anchorEl={anchorOpenNotification}
                    open={Boolean(anchorOpenNotification)}
                    onClose={handleCloseNotification}
                    style={{ height: "70%" }}
                >
                    {/* {notifications.map((notification: any) => (
                        <MenuItem
                            key={notification.id}
                            onClick={handleCloseNotification}
                            sx={{ bgcolor: badgeClicked ? 'rgba(0, 0, 0, 0.5)' : undefined, color: "black" }} // Set background color to black when clicked
                        >
                            <a
                                href={notification.message}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {notification.message}
                            </a>
                        </MenuItem>
                    ))} */}
                    {data.map((item) => (
                        <div key={item.notiID} style={{ borderRadius: '8px' }}>
                            <div onClick={() => handleMarkIsRead(item)}>
                                {!item.status ? (
                                    <div style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(234,49,62,1)' }}>
                                        <span>New</span>
                                    </div>
                                ) : (
                                    <div style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(162,222,82,1)' }}>
                                        <span>Read</span>
                                    </div>
                                )}
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: '500' }}>{item.baseUserID?.username}</p>
                                    <p style={{ fontSize: '11px', fontWeight: '400' }}>{item.action === 'FOLLOW' ? `${item.action} You` : `${item.action} your post`}</p>
                                    <p style={{ fontSize: '11px', fontWeight: '400' }}>{item.dateTime}</p>
                                    <p style={{ fontSize: '11px', fontWeight: '400' }}>{item.baseUserID?.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Divider component="li" />
                    <div style={{ position: "sticky", bottom: 0, padding: "8px", display: "flex", justifyContent: "flex-end", backgroundColor: "#fafbfd" }}>
                        <Button onClick={handleMarkAllRead} style={{ color: "black" }}>Mark all as read</Button>
                        <Button onClick={handleOpenPopup} style={{ color: "black" }}>View All</Button>
                        <Button onClick={handleConfirmClearAll} style={{ color: "black" }}>Clear All</Button>
                    </div>
                </Menu>
                <Dialog open={openPopup} onClose={handleClosePopup} PaperProps={{
                    style: {
                        backgroundColor: "#ad9090",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                        width: "100%"
                    },
                }}>
                    <DialogTitle>All Notifications</DialogTitle>
                    <DialogContent>
                        {data.map((item) => (
                            <div key={item.notiID} style={{ borderRadius: '8px' }}>
                                <div onClick={() => handleMarkIsRead(item)}>
                                    {!item.status ? (
                                        <div style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(234,49,62,1)' }}>
                                            <span>New</span>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(162,222,82,1)' }}>
                                            <span>Read</span>
                                        </div>
                                    )}
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>{item.baseUserID?.username}</p>
                                        <p style={{ fontSize: '11px', fontWeight: '400' }}>{item.action === 'FOLLOW' ? `${item.action} You` : `${item.action} your post`}</p>
                                        <p style={{ fontSize: '11px', fontWeight: '400' }}>{item.dateTime}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePopup}>Close</Button>
                    </DialogActions>
                </Dialog>
            </IconButton>
        </div>
    );
};

export default NotificationWithSocketIOScreen;

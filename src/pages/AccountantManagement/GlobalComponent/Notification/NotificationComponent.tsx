import * as React from "react";
import { MenuItem, Button, Divider, IconButton, Menu, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const NotificationComponent = () => {
    const [anchorOpenNotification, setAnchorOpenNotification] = React.useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = React.useState<any>([]);
    const prevNotificationsCount = React.useRef<number>(0);
    const [badgeVariant, setBadgeVariant] = React.useState<'dot' | 'standard'>('dot');
    const [badgeClicked, setBadgeClicked] = React.useState<boolean>(false);

    React.useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 3000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART');
            const newData = await response.json();

            const isNewNotification = newData.length > prevNotificationsCount.current;

            if (isNewNotification && badgeVariant !== 'dot') {
                setBadgeVariant('dot');
            } else if (!isNewNotification && badgeVariant === 'dot') {
                setBadgeVariant('standard');
            }

            prevNotificationsCount.current = newData.length;
            setNotifications(newData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOpenNotification(event.currentTarget);
        setBadgeClicked(true);
    };

    const handleCloseNotification = () => {
        setAnchorOpenNotification(null);
        setBadgeClicked(false);
    };

    const handleMarkAllAsRead = () => {
        setBadgeVariant("standard");
        setBadgeClicked(false);
    };

    const [openPopup, setOpenPopup] = React.useState<boolean>(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <IconButton>
            <Badge
                badgeContent={prevNotificationsCount.current > 0 ? prevNotificationsCount.current : null}
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
                {notifications.map((notification: any) => (
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
                ))}
                <Divider component="li" />
                <div style={{ position: "sticky", bottom: 0, padding: "8px", display: "flex", justifyContent: "flex-end", backgroundColor: "#fafbfd" }}>
                    <Button onClick={handleMarkAllAsRead} style={{ color: "black" }}>Mark all as read</Button>
                    <Button onClick={handleOpenPopup} style={{ color: "black" }}>View All</Button>
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
                    {notifications.map((notification: any) => (
                        <MenuItem key={notification.id} color="black">{notification.message}</MenuItem>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup}>Close</Button>
                </DialogActions>
            </Dialog>
        </IconButton>
    );
};

export default NotificationComponent;

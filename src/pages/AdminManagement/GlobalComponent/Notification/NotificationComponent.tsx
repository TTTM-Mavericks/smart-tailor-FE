import * as React from "react";
import { MenuItem, Button, Divider, IconButton, Menu, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const NotificationComponent = () => {
    const [anchorOpenNotification, setAnchorOpenNotification] = React.useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = React.useState<any>([]);
    const [badgeVariant, setBadgeVariant] = React.useState<"dot" | "standard">("standard");

    React.useEffect(() => {
        const storedBadgeVariant = localStorage.getItem('badgeVariant');
        if (storedBadgeVariant === "dot") {
            setBadgeVariant("dot");
        } else {
            setBadgeVariant("standard");
        }

        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_CHART');
                const newData = await response.json();

                setNotifications(newData);
                if (newData.length > notifications.length) {
                    setBadgeVariant("dot");
                    localStorage.setItem('badgeVariant', 'dot')
                } else {
                    setBadgeVariant("standard");
                    localStorage.setItem('badgeVariant', 'standard')
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleClickNotification = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOpenNotification(event.currentTarget);
        setBadgeVariant("standard");
        localStorage.setItem('badgeVariant', 'standard')
    };

    const handleCloseNotification = () => {
        setAnchorOpenNotification(null);
    };

    const handleMarkAllAsRead = () => {
        setBadgeVariant("standard");
        localStorage.setItem('badgeVariant', 'standard');
    };

    const [openPopup, setOpenPopup] = React.useState(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <IconButton>
            <Badge
                color="error"
                variant={badgeVariant}
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
                    <MenuItem key={notification.id} onClick={handleCloseNotification}>
                        <a
                            key={notification.id}
                            href={notification.message}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {notification.message}
                        </a>
                    </MenuItem>
                ))}
                <Divider component="li" />
                <div style={{ position: "sticky", bottom: 0, padding: "8px", display: "flex", justifyContent: "flex-end", backgroundColor: "#fafbfd" }} >
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
        </IconButton >
    );
};

export default NotificationComponent;

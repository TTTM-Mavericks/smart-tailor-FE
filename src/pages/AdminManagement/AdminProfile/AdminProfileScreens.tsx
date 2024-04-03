import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Container, Paper, Avatar, Modal, TextField, Button, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';

interface AdminProfileScreensData {
    userID: number;
    username: string;
    email: string;
    imgUrl: string;
}

const AdminProfileScreens: React.FC = () => {
    const [userData, setUserData] = useState<AdminProfileScreensData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedImgUrl, setEditedImgUrl] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userID = localStorage.getItem('userID');
                if (!userID) {
                    throw new Error('User ID not found in local storage');
                }

                const apiUrl = ``;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUserData(userData.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditOpen = () => {
        if (userData) {
            setEditedName(userData.username);
            setEditedEmail(userData.email);
            setEditedImgUrl(userData.imgUrl);
            setEditOpen(true);
        }
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditSave = async () => {
        try {
            if (!userData || userData.userID === undefined) {
                throw new Error('User data or user ID is missing');
            }

            const updatedUserData: AdminProfileScreensData = { ...userData, username: editedName, email: editedEmail, imgUrl: editedImgUrl };
            console.log(updatedUserData);

            const userID = localStorage.getItem("userID")
            const response = await fetch(`https://host.whearapp.tech/api/v1/user/update-user-by-userid`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedUserData, userID }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            setUserData(updatedUserData);
            setEditOpen(false);
            Swal.fire(
                'Edit Success!',
                'User information updated successfully!',
                'success'
            );
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Logout',
                text: "Are you sure you want to logout",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, I want to logout'
            });
            if (result.isConfirmed) {
                localStorage.clear();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                Swal.fire(
                    'Cancel Logout',
                    'You cancelled the logout proccess!!!',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h4" align="center" gutterBottom>Your Profile</Typography>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    userData && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar alt="User Avatar" src={userData.imgUrl} style={{ width: 150, height: 150, marginBottom: 20 }} />
                            <Typography variant="h6" gutterBottom>ID: {userData.userID}</Typography>
                            <Typography variant="h6" gutterBottom>Name: {userData.username}</Typography>
                            <Typography variant="h6" gutterBottom>Email: {userData.email}</Typography>

                            <div style={{ display: "flex" }}>
                                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleEditOpen} style={{ marginTop: 20 }}>
                                    Edit
                                </Button>

                                <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginTop: 20, marginLeft: "20px" }}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )
                )}

                {/* Edit Modal */}
                <Modal open={editOpen} onClose={handleEditClose}>
                    <Container maxWidth="sm" style={{ marginTop: '20vh', backgroundColor: 'white', padding: 20 }}>
                        <Typography variant="h5" align="center" gutterBottom>Edit Profile</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Name" variant="outlined" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" variant="outlined" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Image URL"
                                    variant="outlined"
                                    value={editedImgUrl}
                                    onChange={(e) => setEditedImgUrl(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setEditedImgUrl(URL.createObjectURL(e.target.files[0]));
                                    }
                                }} />
                            </Grid>

                        </Grid>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <Button variant="contained" color="primary" onClick={handleEditSave}>
                                Save Changes
                            </Button>
                        </div>
                    </Container>
                </Modal>
            </Paper>
        </Container>
    );
};

export default AdminProfileScreens;

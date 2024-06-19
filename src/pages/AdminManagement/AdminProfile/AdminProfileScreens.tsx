import React, { useEffect, useRef, useState } from 'react';
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({ clothesImages: [] as string[], });
    const [files, setFiles] = useState<string[]>([]);


    const _handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            const imageUrls = await _handleUploadToCloudinary(selectedFiles);

            setFiles((prevFiles) => [...prevFiles, ...imageUrls]);
            setFormData((prevFormData) => ({
                ...prevFormData,
                clothesImages: [...prevFormData.clothesImages, ...imageUrls],
            }));
        } else {
            setFiles([]);
        }
    };


    const _handleUploadToCloudinary = async (files: FileList): Promise<string[]> => {
        try {
            const cloud_name = "dby2saqmn";
            const preset_key = "whear-app";
            const folder_name = "test";
            const formData = new FormData();
            formData.append("upload_preset", preset_key);
            formData.append("folder", folder_name);

            const uploadedUrls: string[] = [];

            for (const file of Array.from(files)) {
                formData.append("file", file);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();

                if (responseData.secure_url) {
                    const imageUrl = responseData.secure_url;
                    uploadedUrls.push(imageUrl);
                } else {
                    console.error("Error uploading image to Cloudinary. Response:", responseData);
                }
            }

            return uploadedUrls;
        } catch (error) {
            console.error("Error uploading images to Cloudinary:", error);
            return [];
        }
    };


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

    const _handleEditOpen = () => {
        if (userData) {
            setEditedName(userData.username);
            setEditedEmail(userData.email);
            setEditedImgUrl(userData.imgUrl);
            setEditOpen(true);
        }
    };

    const _handleEditClose = () => {
        setEditOpen(false);
    };

    const _handleEditSave = async () => {
        try {
            if (!userData || userData.userID === undefined) {
                throw new Error('User data or user ID is missing');
            }

            const updatedUserData: AdminProfileScreensData = { ...userData, username: editedName, email: editedEmail, imgUrl: editedImgUrl };

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

    const _handleLogout = async () => {
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
                                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={_handleEditOpen} style={{ marginTop: 20 }}>
                                    Edit
                                </Button>

                                <Button variant="contained" color="secondary" onClick={_handleLogout} style={{ marginTop: 20, marginLeft: "20px" }}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    )
                )}

                {/* Edit Modal */}
                <Modal open={editOpen} onClose={_handleEditClose}>
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

                            <Grid item xs={12}>
                                <input type="file" multiple onChange={_handleChange}
                                    ref={fileInputRef} />
                                {files.map((imageUrl, index) => (
                                    <img key={index} src={imageUrl} alt={`Image ${index}`} />
                                ))}
                                <Typography>Bebebe</Typography>
                            </Grid>

                        </Grid>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <Button variant="contained" color="primary" onClick={_handleEditSave}>
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

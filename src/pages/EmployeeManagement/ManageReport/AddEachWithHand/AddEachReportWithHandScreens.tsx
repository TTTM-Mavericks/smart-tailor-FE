import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

interface User {
    id: number;
    registrarId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
}

interface AddReportWithHandsFormProps {
    closeCard: () => void;
    addNewUser: (addedNewUser: User) => void
}

const AddEachReportWithHand: React.FC<AddReportWithHandsFormProps> = ({ closeCard, addNewUser }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        registrarId: "string",
        name: "string",
        age: 1,
        phone: "string",
        email: "string",
        address: "string",
        city: "string",
        zipCode: 1
    });

    // const [files, setFiles] = useState<string[]>([]);

    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFiles = e.target.files;

    //     if (selectedFiles && selectedFiles.length > 0) {
    //         const imageUrls = await uploadToCloudinary(selectedFiles);
    //         setFiles((prevFiles) => [...prevFiles, ...imageUrls]);
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             imgUrl: [...prevFormData.imgUrl, ...imageUrls],
    //         }));
    //     } else {
    //         setFiles([]);
    //     }
    // };

    // const uploadToCloudinary = async (files: FileList): Promise<string[]> => {
    //     try {
    //         const cloud_name = "dby2saqmn";
    //         const preset_key = "whear-app";
    //         const folder_name = "test";
    //         const formData = new FormData();
    //         formData.append("upload_preset", preset_key);
    //         formData.append("folder", folder_name);

    //         const uploadedUrls: string[] = [];

    //         for (const file of Array.from(files)) {
    //             formData.append("file", file);

    //             const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
    //                 method: "POST",
    //                 body: formData,
    //             });

    //             const responseData = await response.json();

    //             if (responseData.secure_url) {
    //                 const imageUrl = responseData.secure_url;
    //                 console.log(imageUrl);
    //                 uploadedUrls.push(imageUrl);
    //             } else {
    //                 console.error("Error uploading image to Cloudinary. Response:", responseData);
    //             }
    //         }

    //         return uploadedUrls;
    //     } catch (error) {
    //         console.error("Error uploading images to Cloudinary:", error);
    //         return [];
    //     }
    // };

    const _handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const _handleSubmit = async () => {
        try {
            console.log('Form Data:', JSON.stringify(formData));

            const response = await fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            console.log('Response:', responseData);

            if (responseData) {
                addNewUser(responseData);
                Swal.fire(
                    'Add Success!',
                    'User has been updated!',
                    'success'
                )

            } else {
                Swal.fire(
                    'Add User fail!',
                    'Please check information!',
                    'error'
                );
            }
        } catch (err: any) {
            console.error('Error:', err);
            Swal.fire(
                'Add fail!',
                `${err.message || 'Unknown error'}`,
                'error'
            );
        }
    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <Box style={{
            height: '500px',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
                width: 0,
                backgroundColor: '#f5f5f5',
            }
        }}>
            <div>
                <Typography variant="h5" align="center">
                    {t(codeLanguage + '000051')}
                </Typography>
                <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeCard}>
                    <CloseIcon />
                </IconButton>
                <Box height={50} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="registrarId"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="registrarId"
                            value={formData.registrarId}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="name"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="name"
                            value={formData.name}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="age"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="age"
                            value={formData.age}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="phone"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="phone"
                            value={formData.phone}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="email"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="email"
                            value={formData.email}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="address"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="address"
                            value={formData.address}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="city"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="city"
                            value={formData.city}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="outline-basic"
                            label="zipCode"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '100%' }}
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                </Grid>
                <div
                    onClick={closeCard}
                    style={{ textAlign: 'center', alignItems: 'center', marginTop: '3rem' }}
                >
                    <Button onClick={_handleSubmit} style={{ backgroundColor: "#EC6208", color: "white" }}>
                        Submit
                    </Button>
                </div>
            </div>
        </Box>
    );
}

export default AddEachReportWithHand;
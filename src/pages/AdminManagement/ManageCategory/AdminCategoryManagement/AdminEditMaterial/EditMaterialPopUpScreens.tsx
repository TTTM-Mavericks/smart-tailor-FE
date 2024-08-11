import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Category } from "../../../../../models/AdminCategoryExcelModel";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { CancelOutlined } from "@mui/icons-material";
import { primaryColor, redColor } from "../../../../../root/ColorSystem";

interface EditCategoryPopUpScreenFormProps {
    fid: {
        categoryID: string
        categoryName: string;
    };
    editClose: () => void;
    updateCategory: (updatedCategory: Category) => void;
}

const EditMCategoryPopUpScreens: React.FC<EditCategoryPopUpScreenFormProps> = ({ fid, editClose, updateCategory }) => {
    const [formData, setFormData] = React.useState({
        categoryID: fid.categoryID,
        categoryName: fid.categoryName
    });

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const _handleSubmit = async () => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.updateCategory}`;
            const response = await axios.put(apiUrl, {
                ...formData
            });

            console.log("formData" + formData);

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.data.status === 200) {
                editClose()

                updateCategory({ ...formData });
                Swal.fire(
                    `Updated Category Success!`,
                    `Updated Category Success!`,
                    'success'
                );
            }

            if (response.data.status === 409) {
                editClose()

                Swal.fire(
                    `Updated Category Fail!`,
                    `Updated Category Fail!`,
                    'error'
                );
            }

            if (response.data.status === 400) {
                editClose()

                Swal.fire(
                    `Updated Category Fail!`,
                    `Updated Category Fail!`,
                    'error'
                );
            }
            sessionStorage.setItem("obj", JSON.stringify(formData));


            editClose(); // Close the edit modal after successful update
        } catch (error) {
            editClose()

            console.error('Update Error:', error);
            Swal.fire(
                `Updated Category Fail!`,
                `Updated Category Fail!`,
                'error'
            );
        }
    };

    return (
        <Box
            sx={{
                height: '222px',
                overflowY: 'auto',
                position: 'relative',
                padding: 3,
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                scrollbarWidth: 'none', // For Firefox
            }}
        >
            <Typography variant="h5" align="left">
                Edit Category
            </Typography>

            <IconButton
                aria-label="close"
                onClick={editClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: '#EC6208',
                    transition: 'all 0.2s',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        bgcolor: 'rgba(236, 98, 8, 0.1)',
                    },
                }}
            >
                <CancelOutlined />
            </IconButton>

            <Box mt={6}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField
                            name="categoryName"
                            id="categoryName"
                            label="Category Name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={formData.categoryName}
                            onChange={_handleChange}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box
                mt={4}
                display="flex"
                justifyContent="right"
                gap={2}
            >
                <Button
                    onClick={editClose}
                    variant="outlined"
                    sx={{
                        borderRadius: "8px",
                        borderColor: "white",
                        color: "white",
                        backgroundColor: `${redColor}`,
                        '&:hover': {
                            borderColor: "white",
                            bgcolor: `${redColor}`,
                        },
                        width: "15%",
                    }}
                >
                    {t(codeLanguage + '000055')}
                </Button>
                <Button
                    onClick={_handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: `${primaryColor}`,
                        width: "15%",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        '&:hover': {
                            bgcolor: `${primaryColor}`,
                        },
                    }}
                >
                    {t(codeLanguage + '000060')}
                </Button>
            </Box>
        </Box>

    );
}

export default EditMCategoryPopUpScreens;

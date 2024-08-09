import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Material } from "../../../../../models/AdminMaterialExcelModel";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { CancelOutlined } from "@mui/icons-material";
import { primaryColor, redColor } from "../../../../../root/ColorSystem";
import { border, borderColor } from "@mui/system";

interface EditMaterialPopUpScreenFormProps {
    fid: {
        categoryName: string;
        materialName: string;
        hsCode: number;
        basePrice: number;
        unit: string;
        materialID: string;
    };
    editClose: () => void;
    updateMaterial: (updatedMaterial: Material) => void;
}

const EditMaterialPopUpScreens: React.FC<EditMaterialPopUpScreenFormProps> = ({ fid, editClose, updateMaterial }) => {
    const [formData, setFormData] = React.useState({
        categoryName: fid.categoryName,
        materialName: fid.materialName,
        hsCode: fid.hsCode,
        basePrice: fid.basePrice,
        unit: fid.unit,
    });

    const MATERIALID = fid.materialID

    /**
     * Tracking Change of Each Fields
     * @param e 
     */
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

    /**
     * Update The Material
     */
    const _handleSubmit = async () => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.updateMaterial + `/${MATERIALID}`}`;

            const response = await axios.put(apiUrl, {
                ...formData
            });

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.data.status === 200) {
                updateMaterial({ ...formData, materialID: MATERIALID });
                Swal.fire(
                    `${t(codeLanguage + '000069')}`,
                    `${t(codeLanguage + '000070')}`,
                    'success'
                );
            }
            if (response.data.status === 400) {
                Swal.fire(
                    `${t(codeLanguage + '000071')}`,
                    `${t(codeLanguage + '000072')}`,
                    'error'
                );
            }
            sessionStorage.setItem("obj", JSON.stringify(formData));
            editClose(); // Close the edit modal after successful update
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire(
                `${t(codeLanguage + '000071')}`,
                `${t(codeLanguage + '000072')}`,
                'error'
            );
        }
    };

    return (
        <Box
            sx={{
                height: '400px',
                overflowY: 'auto',
                bgcolor: '#f5f5f5',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                '-ms-overflow-style': 'none',  // IE and Edge
                'scrollbar-width': 'none',     // Firefox
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Edit Material
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

            <Grid container spacing={3}>
                {['categoryName', 'materialName', 'hsCode', 'basePrice'].map((field, index) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            name={field}
                            id={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                            variant="outlined"
                            fullWidth
                            value={formData[field]}
                            onChange={_handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    borderColor: `${primaryColor}`,  // Default border color
                                    '&:hover fieldset': {
                                        borderColor: `${primaryColor}`,  // Primary color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: `${primaryColor}`,  // Primary color when focused
                                    },
                                },
                            }}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <TextField
                        name="unit"
                        id="unit"
                        label="Unit"
                        variant="outlined"
                        fullWidth
                        value={formData.unit}
                        onChange={_handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: '#5858FA',
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 4, justifyContent: "right" }}>
                <Grid item xs={2}>
                    <Button
                        onClick={editClose}
                        variant="outlined"
                        fullWidth
                        sx={{
                            bgcolor: `${redColor}`,
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            borderColor: "white",
                            '&:hover': {
                                bgcolor: `${redColor}`,
                                borderColor: `${primaryColor}`,  // Primary color on hover
                            },
                        }}
                    >
                        {t(codeLanguage + '000055')}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        onClick={_handleSubmit}
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: `${primaryColor}`,
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: `${primaryColor}`,
                            },
                        }}
                    >
                        {t(codeLanguage + '000060')}
                    </Button>
                </Grid>
            </Grid>
        </Box>

    );
}

export default EditMaterialPopUpScreens;

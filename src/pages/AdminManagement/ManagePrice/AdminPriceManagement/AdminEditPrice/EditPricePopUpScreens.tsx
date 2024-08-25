import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { LaborQuantity } from "../../../../../models/LaborQuantityModel";
import { CancelOutlined } from "@mui/icons-material";
import { primaryColor, redColor } from "../../../../../root/ColorSystem";
import { borderColor } from "@mui/system";
import { __getToken } from "../../../../../App";

interface EditPricePopUpScreenFormProps {
    fid: {
        laborQuantityID: string,
        laborQuantityMinQuantity: number,
        laborQuantityMaxQuantity: number,
        laborQuantityMinPrice: number,
        laborQuantityMaxPrice: number
    };
    editClose: () => void;
    updateLaborQuantity: (updatedLaborQuantity: LaborQuantity) => void;
}

const EditPricePopUpScreens: React.FC<EditPricePopUpScreenFormProps> = ({ fid, editClose, updateLaborQuantity }) => {
    const laborQuantityID = fid.laborQuantityID;

    const [formData, setFormData] = React.useState({
        laborQuantityMinQuantity: fid.laborQuantityMinQuantity,
        laborQuantityMaxQuantity: fid.laborQuantityMaxQuantity,
        laborQuantityMinPrice: fid.laborQuantityMinPrice,
        laborQuantityMaxPrice: fid.laborQuantityMaxPrice
    });

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        if (!isNaN(numValue) && numValue >= 0) {
            setFormData(prevState => ({
                ...prevState,
                [name]: numValue
            }));
        }
    };

    const validateInputs = (): boolean => {
        return (
            formData.laborQuantityMinQuantity >= 0 &&
            formData.laborQuantityMaxQuantity >= 0 &&
            formData.laborQuantityMinPrice >= 0 &&
            formData.laborQuantityMaxPrice >= 0
        );
    };

    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const _handleSubmit = async () => {
        try {
            const apiUrl = `${baseURL}${versionEndpoints.v1}${featuresEndpoints.labor_quantity}${functionEndpoints.laborQantity.updateLaborQuantity}/${laborQuantityID}`;
            const response = await axios.put(apiUrl, formData, {
                headers: {
                    Authorization: `Bearer ${__getToken()}`
                }
            });

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.status === 200) {
                Swal.fire(
                    'Edit Price Success!',
                    'Please check the information!',
                    'success'
                );
                editClose();
            } else {
                Swal.fire(
                    'Edit Price Failed!',
                    'Please check the information!',
                    'error'
                );
                editClose();
            }

            sessionStorage.setItem("obj", JSON.stringify(formData));
            editClose();
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire(
                'Edit Price Failed!',
                'Please check the information!',
                'error'
            );
            editClose();
        }
    };

    return (
        <Box style={{ height: '250px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Price
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

            <Box height={20} />
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <TextField
                        name="laborQuantityMinQuantity"
                        id="laborQuantityMinQuantity"
                        label="Min Quantity"
                        variant="outlined"
                        type="number"
                        size="small"
                        inputProps={{ min: "0", step: "1" }}
                        sx={{ minWidth: "100%" }}
                        value={formData.laborQuantityMinQuantity}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="laborQuantityMaxQuantity"
                        id="laborQuantityMaxQuantity"
                        label="Max Quantity"
                        variant="outlined"
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.laborQuantityMaxQuantity}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="laborQuantityMinPrice"
                        id="laborQuantityMinPrice"
                        label="Min Price"
                        variant="outlined"
                        inputProps={{ min: "0", step: "1" }}
                        type="number"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.laborQuantityMinPrice}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="laborQuantityMaxPrice"
                        id="laborQuantityMaxPrice"
                        label="Max Price"
                        variant="outlined"
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.laborQuantityMaxPrice}
                        onChange={_handleChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
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
};

export default EditPricePopUpScreens;

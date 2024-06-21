import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/system';
import { Material } from '../../../../models/BrandMaterialExcelModel';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';

const brandName = "LA LA LISA BRAND";

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewMaterial: (addNewMaterial: Material) => void;
}

const AnimatedTextField = styled(TextField)(({ theme }) => ({
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    '&:focus': {
        boxShadow: `${theme.palette.primary.main} 0px 0px 0px 2px`,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const AddEachMaterialWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewMaterial }) => {
    const [formData, setFormData] = useState({
        categoryName: 'Category',
        materialName: 'mATERIAL',
        price: 110000000,
        unit: 'm'
    });

    const _handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const _handleSubmit = async () => {
        try {
            if (!validateFormData()) return;

            console.log('Form Data:', JSON.stringify(formData));

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.addManual}`, {
                ...formData,
                brandName
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const responseData = response.data;
            console.log('Response:', responseData);

            if (responseData) {
                addNewMaterial(responseData);
                toast.success('Material added successfully');
            } else {
                toast.error('Failed to add material. Please check the information.');
            }
        } catch (err: any) {
            console.error('Error:', err);
            toast.error(`Failed to add material. ${err.message || 'Unknown error'}`);
        }
    };

    const validateFormData = () => {
        const { categoryName, materialName, price, unit } = formData;

        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>0-9]/;
        if (specialCharsRegex.test(categoryName) || specialCharsRegex.test(materialName)) {
            toast.error('Category Name and Material Name should not contain special characters or numbers');
            return false;
        }

        if (price <= 10000) {
            toast.error('Price should be more than 10000');
            return false;
        }

        const unitRegex = /^[a-zA-Z]+$/;
        if (!unitRegex.test(unit) || !['m', 'kg', 'l', 'mg'].includes(unit)) {
            toast.error('Unit should only contain "m", "kg", "l", or "mg"');
            return false;
        }

        return true;
    };

    const { t, i18n } = useTranslation();
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ToastContainer />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" align="center" mt={3} mb={2}>
                    Add Material
                </Typography>
                <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={closeCard}>
                    <CloseIcon />
                </IconButton>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={10}>
                        <AnimatedTextField
                            fullWidth
                            label="Category Name"
                            variant="outlined"
                            size="small"
                            name="category_name"
                            value={formData.categoryName}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <AnimatedTextField
                            fullWidth
                            label="Material Name"
                            variant="outlined"
                            size="small"
                            name="material_name"
                            value={formData.materialName}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <AnimatedTextField
                            fullWidth
                            label="Price"
                            variant="outlined"
                            size="small"
                            name="price"
                            value={formData.price}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <AnimatedTextField
                            fullWidth
                            label="Unit"
                            variant="outlined"
                            size="small"
                            name="unit"
                            value={formData.unit}
                            onChange={_handleFormChange}
                        />
                    </Grid>
                    {/* <Grid item xs={10}>
                        <AnimatedTextField
                            fullWidth
                            label="HS Code"
                            variant="outlined"
                            size="small"
                            name="hsCode"
                            value={formData.hsCode}
                            onChange={_handleFormChange}
                        />
                    </Grid> */}
                </Grid>
            </Box>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <StyledButton onClick={_handleSubmit} variant="contained" color="primary">
                    {t('Submit')}
                </StyledButton>
                <StyledButton onClick={closeCard} variant="contained" color="info">
                    {t('Cancel')}
                </StyledButton>
            </Box>
        </Box>
    );
};

export default AddEachMaterialWithHand;
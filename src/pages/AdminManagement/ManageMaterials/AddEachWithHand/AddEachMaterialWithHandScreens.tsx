import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Material } from '../../../../models/AdminMaterialExcelModel';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewMaterial: (addedNewMaterial: Material) => void
}

const AddEachMaterialWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewMaterial }) => {

    // ---------------UseState Variable---------------//
    const [formData, setFormData] = useState({
        categoryName: '',
        materialName: 'Vải A',
        hsCode: 12312312,
        basePrice: 123123123,
        unit: 'mét'
    });

    const [categoryData, setCategoryData] = useState<string[]>([])


    // ---------------Usable Variable---------------//

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();

    // ---------------UseEffect---------------//
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);


    /**
     * Get all category name to dropdown
     */
    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.getAllCategory}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    // Extract only the categoryName values from the objects
                    const categoryNames = responseData.data.map(category => category.categoryName);
                    setCategoryData(categoryNames);
                    console.log("Data received:", categoryNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Tracking the changing in each fields
     */
    const _handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    /**
     * Submit the add manual with validate fields
     * When success show success popup
     * When fail then show fail popup
     */
    const _handleSubmit = async () => {
        try {
            console.log('Form Data:', JSON.stringify(formData));

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.addNewMaterial}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response laf:', response.data.data);

            if (response.data) {
                addNewMaterial(response.data.data);
                Swal.fire(
                    'Add Success!',
                    'User has been updated!',
                    'success'
                );

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

    return (
        <Box style={{
            height: '500px',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::WebkitScrollbar': {
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
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Category Name</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={_handleFormChange}
                                label="Category Name"
                            >
                                {categoryData.map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Material Name"
                            variant="outlined"
                            size="small"
                            name="materialName"
                            value={formData.materialName}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Unit"
                            variant="outlined"
                            size="small"
                            name="unit"
                            value={formData.unit}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="HS Code"
                            variant="outlined"
                            size="small"
                            name="hsCode"
                            value={formData.hsCode}
                            onChange={_handleFormChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Base Price"
                            variant="outlined"
                            size="small"
                            name="basePrice"
                            value={formData.basePrice}
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

export default AddEachMaterialWithHand;

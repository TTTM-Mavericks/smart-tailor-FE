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
    SelectChangeEvent,
    Container
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { AddMaterial, Material } from '../../../../models/AdminMaterialExcelModel';
import axios from 'axios';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { CancelOutlined } from '@mui/icons-material';
import { width } from '@mui/system';

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewMaterial: (addedNewMaterial: AddMaterial) => void
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
                    const categoryNames = responseData.data.map((category: any) => category.categoryName);
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
            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.addNewMaterial}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data) {
                addNewMaterial(formData);
                Swal.fire(
                    'Add Material Success!',
                    'Material has been Added!',
                    'success'
                );

            } else {
                Swal.fire(
                    'Add Material fail!',
                    'Please check information!',
                    'error'
                );
            }
        } catch (err: any) {
            console.error('Error:', err);
            Swal.fire(
                'Add Material fail!',
                'Please check information!',
                'error'
            );
        }
    };

    return (
        <Box>
            <Container maxWidth="md">
                <Typography variant="h4" align="center">
                    Add Material
                </Typography>

                <IconButton
                    aria-label="close"
                    onClick={closeCard}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: '#EC6208',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <CancelOutlined />
                </IconButton>

                <Box my={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
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

                        {['Material Name', 'Unit', 'HS Code'].map((label, index) => (
                            <Grid item xs={12} sm={6} key={label}>
                                <TextField
                                    fullWidth
                                    label={label}
                                    variant="outlined"
                                    name={label.toLowerCase().replace(' ', '')}
                                    value={formData[label.toLowerCase().replace(' ', '')]}
                                    onChange={_handleFormChange}
                                    InputProps={{
                                        sx: {
                                            '&:hover fieldset': {
                                                borderColor: '#EC6208',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#EC6208',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        ))}
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
                </Box>

                <Box mt={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={_handleSubmit}
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "#EC6208",
                            color: "white",
                            fontWeight: 'bold',
                            padding: '12px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(236, 98, 8, 0.2)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                backgroundColor: "#d55500",
                                boxShadow: '0 6px 8px rgba(236, 98, 8, 0.3)',
                            },
                            width: "20%"
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default AddEachMaterialWithHand;

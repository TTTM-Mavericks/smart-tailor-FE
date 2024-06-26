import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { AddMaterial } from '../../../../models/BrandMaterialExcelModel';
import Swal from 'sweetalert2';
const brandName = "LA LA LISA BRAND";

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewMaterial: (addNewMaterial: AddMaterial) => void;
}


const AddEachMaterialWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewMaterial }) => {
    const [data, setData] = useState<any[]>([])

    const [formData, setFormData] = useState({
        categoryName: 'Category',
        materialName: 'mATERIAL',
        price: 110000000,
        unit: 'm',
        hsCode: 110000000,
        brandPrice: 110000000,
        basePrice: 110000000
    });

    const [categoryData, setCategoryData] = useState<string[]>([])
    const [materialData, setMaterialData] = useState<string[]>([])
    const [hsCodeData, setHsCodeData] = useState<number[]>([]);
    const [unitData, setUnitData] = useState<string[]>([])
    const [basePriceData, setBasePriceData] = useState<number[]>([])


    const _handleCategoryChange = (event: SelectChangeEvent<string>) => {
        const category = event.target.value;
        setFormData((prev: any) => ({ ...prev, categoryName: category, materialName: '', hsCode: '', unit: '', basePrice: 0 }));
        const filteredMaterials = [...new Set(data.filter((item: any) => item.categoryName === category).map((item: any) => item.materialName))];
        setMaterialData(filteredMaterials);
    };

    const _handleMaterialChange = (event: SelectChangeEvent<string>) => {
        const material = event.target.value;
        setFormData((prev: any) => ({ ...prev, materialName: material, hsCode: '', unit: '', basePrice: 0 }));
        const filteredHsCodes = [...new Set(data.filter(item => item.categoryName === formData.categoryName && item.materialName === material).map(item => item.hsCode))];
        setHsCodeData(filteredHsCodes);
    };

    const _handleHsCodeChange = (event: SelectChangeEvent<string>) => {
        const hsCode = event.target.value;
        setFormData((prev: any) => ({ ...prev, hsCode, unit: '', basePrice: 0 }));
        const filteredUnits = [...new Set(data.filter(item => item.categoryName === formData.categoryName && item.materialName === formData.materialName && item.hsCode === Number(hsCode)).map(item => item.unit))];
        setUnitData(filteredUnits);
    };

    const _handleUnitChange = (event: SelectChangeEvent<string>) => {
        const unit = event.target.value;
        setFormData(prev => ({ ...prev, unit, basePrice: 0 }));
        const filteredBasePrices = data.filter(item =>
            item.categoryName === formData.categoryName &&
            item.materialName === formData.materialName &&
            item.hsCode === Number(formData.hsCode) &&
            item.unit === unit
        ).map(item => item.basePrice);
        setBasePriceData(filteredBasePrices);
    };

    const _handleBasePriceChange = (event: SelectChangeEvent<string>) => {
        const basePrice = Number(event.target.value);
        setFormData(prev => ({ ...prev, basePrice }));
    };

    const _handleBrandPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const brandPrice = Number(event.target.value);
        setFormData(prev => ({ ...prev, brandPrice }));
    };

    /**
     * Get all category name to dropdown
     */
    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.material.getAllMaterialByBrandName + `?brandName=${brandName}`}`;
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
                    setData(responseData.data)
                    const categoryNames = responseData.data.map((category: any) => category.categoryName);
                    const materialNames = responseData.data.map((material: any) => material.materialName);
                    const hsCode = responseData.data.map((hsCode: any) => hsCode.hsCode);
                    const unit = responseData.data.map((unit: any) => unit.unit);
                    const basePrice = responseData.data.map((basePrice: any) => basePrice.basePrice);
                    setCategoryData(categoryNames);
                    setMaterialData(materialNames);
                    setHsCodeData(hsCode);
                    setUnitData(unit);
                    setBasePriceData(basePrice);
                    console.log("Data received:", categoryNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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

    const _handleSubmit = async () => {
        try {

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.addManual}`, { ...formData, brandName }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response is:', response.data.data);
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
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an error updating your profile. Please try again later.',
            });
        }
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
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Category Name</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={_handleCategoryChange}
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
                    {
                        formData.categoryName && (
                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="material-select-label">Material Name</InputLabel>
                                    <Select
                                        labelId="material-select-label"
                                        id="material-select"
                                        name="materialName"
                                        value={formData.materialName}
                                        onChange={_handleMaterialChange}
                                        label="Material Name"
                                    >
                                        {materialData.map((material, index) => (
                                            <MenuItem key={index} value={material}>
                                                {material}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                    {
                        formData.materialName && (

                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="hsCode-select-label">HS CODE</InputLabel>
                                    <Select
                                        labelId="hsCode-select-label"
                                        id="hsCode-select"
                                        name="hsCode"
                                        value={formData.hsCode}
                                        onChange={_handleHsCodeChange}
                                        label="Hs Code"
                                    >
                                        {hsCodeData.map((hsCode, index) => (
                                            <MenuItem key={index} value={hsCode.toString()}>
                                                {hsCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                    {
                        formData.hsCode && (
                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="unit-select-label">Unit</InputLabel>
                                    <Select
                                        labelId="unit-select-label"
                                        id="unit-select"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={_handleUnitChange}
                                        label="Unit"
                                    >
                                        {unitData.map((unit, index) => (
                                            <MenuItem key={index} value={unit}>
                                                {unit}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                    {
                        formData.unit && (
                            <Grid item xs={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="basePrice-select-label">Base Price</InputLabel>
                                    <Select
                                        labelId="basePrice-select-label"
                                        id="basePrice-select"
                                        name="basePrice"
                                        value={formData.basePrice.toString()}
                                        onChange={_handleBasePriceChange}
                                        label="Material Name"
                                    >
                                        {basePriceData.map((basePrice, index) => (
                                            <MenuItem key={index} value={basePrice.toString()}>
                                                {basePrice}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )
                    }
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            label="Brand Price"
                            variant="outlined"
                            size="small"
                            name="basePrice"
                            type='number'
                            value={formData.brandPrice}
                            onChange={_handleBrandPriceChange}
                        />
                    </Grid>
                </Grid>
            </Box>
            <div
                onClick={closeCard}
                style={{ textAlign: 'center', alignItems: 'center', marginTop: '3rem' }}
            >
                <Button onClick={_handleSubmit} style={{ backgroundColor: "#EC6208", color: "white" }}>
                    Submit
                </Button>
            </div>
        </Box>
    );
};

export default AddEachMaterialWithHand;
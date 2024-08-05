import React, { ChangeEvent, useState, useEffect } from 'react';
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
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { AddCategory } from '../../../../models/AdminCategoryExcelModel';
import { borderRadius, display } from '@mui/system';

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewCategory: (addedNewCategory: AddCategory[]) => void;
}

const AddEachCategoryWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewCategory }) => {
    // Initialize formData as an array of AddCategory objects
    const [formData, setFormData] = useState<AddCategory[]>([
        { categoryNames: 'Fabric' },
        { categoryNames: 'Thread' }
    ]);

    const { t, i18n } = useTranslation();
    const selectedLanguage = localStorage.getItem('language');

    useEffect(() => {
        if (selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const _handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData(prevFormData => {
            const newFormDatas = [...prevFormData];
            newFormDatas[index] = { categoryNames: value }; // Update to match AddCategory type
            return newFormDatas;
        });
    };

    const _handleAddCategory = () => {
        setFormData([...formData, { categoryNames: '' }]); // Add a new empty category
    };

    const _handleRemoveCategory = (index: number) => {
        setFormData(prevFormData => prevFormData.filter((_, i) => i !== index));
    };

    const _handleSubmit = async () => {
        if (formData.length === 0) {
            Swal.fire(
                'Validation Error',
                'Please add at least one category.',
                'warning'
            );
            return;
        }

        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.addNewCategory}`;
            const response = await axios.post(apiUrl, { categoryNames: formData.map(cat => cat.categoryNames) }); // Extract categoryNames

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                addNewCategory(formData);
                closeCard()
                Swal.fire(
                    'Add Success!',
                    'Categories have been added!',
                    'success'
                );
            } else {
                closeCard()
                Swal.fire(
                    'Add Category Fail!',
                    'Please check information!',
                    'error'
                );
            }
        } catch (err: any) {
            closeCard()
            console.error('Error:', err);
            Swal.fire(
                'Add Category Fail!',
                `${err.message || 'Unknown error'}`,
                'error'
            );
        }
    };

    return (
        <Box style={{ overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div>
                <Typography variant="h5" align="center">
                    ADD NEW CATEGORY
                </Typography>
                <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeCard}>
                    <CloseIcon />
                </IconButton>
                <Box height={50} />
                <Grid container spacing={3}>
                    {formData.map((category, index) => (
                        <Grid item xs={12} key={index} style={{ display: "flex" }}>
                            <TextField
                                fullWidth
                                label={`Category ${index + 1}`}
                                variant="outlined"
                                size="small"
                                value={category.categoryNames}
                                onChange={(e: any) => _handleFormChange(index, e)}
                            />
                            <Button
                                type="button"
                                onClick={() => _handleRemoveCategory(index)}
                                style={{ backgroundColor: "red", color: "white", borderRadius: "10px", marginLeft: "10px" }}
                            >
                                Remove
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <div style={{ textAlign: 'center', alignItems: 'center', marginTop: '3rem' }}>
                    <Button onClick={_handleAddCategory} style={{ backgroundColor: "#EC6208", color: "white" }}>
                        Add Category
                    </Button>
                    <Button onClick={_handleSubmit} style={{ backgroundColor: "#EC6208", color: "white", marginLeft: '1rem' }}>
                        Submit
                    </Button>
                </div>
            </div>
        </Box>
    );
};

export default AddEachCategoryWithHand;

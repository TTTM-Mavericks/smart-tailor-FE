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
import { Category } from '../../../../models/AdminCategoryExcelModel';
interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewCategory: (addedNewCategory: Category) => void
}

const AddEachCategoryWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewCategory }) => {

    // ---------------UseState Variable---------------//
    const [formData, setFormData] = useState({
        categoryName: 'Vải',
    });


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

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Tracking the changing in each fields
     */
    const _handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.addNewCategory + `?categoryName=${formData.categoryName}`}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                addNewCategory(response.data);
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
                `${err.message || 'Unknown error'} `,
                'error'
            );
        }
    };

    return (
        <Box style={{
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
                    ADD NEW CATEGORY
                </Typography>
                <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeCard}>
                    <CloseIcon />
                </IconButton>
                <Box height={50} />
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            variant="outlined"
                            size="small"
                            name="categoryName"
                            value={formData.categoryName}
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

export default AddEachCategoryWithHand;
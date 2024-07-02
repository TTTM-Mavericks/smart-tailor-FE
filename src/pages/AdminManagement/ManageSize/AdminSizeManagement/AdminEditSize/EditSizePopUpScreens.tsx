import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Category } from "../../../../../models/AdminCategoryExcelModel";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';

interface EditSizePopUpScreenFormProps {
    fid: {
        categoryID: string
        categoryName: string;
    };
    editClose: () => void;
    updateCategory: (updatedCategory: Category) => void;
}

const EditSizePopUpScreens: React.FC<EditSizePopUpScreenFormProps> = ({ fid, editClose, updateCategory }) => {
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
                updateCategory(response.data.data);
                Swal.fire(
                    `${t(codeLanguage + '000069')}`,
                    `${t(codeLanguage + '000070')}`,
                    'success'
                );
            }

            if (response.data.status === 409) {
                Swal.fire(
                    `${t(codeLanguage + '000071')}`,
                    `${t(codeLanguage + '000072')}`,
                    'error'
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
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                {t(codeLanguage + '000068')}
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={editClose}
            >
                <CloseIcon />
            </IconButton>
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={11}>
                    <TextField name="categoryName" id="categoryName" label="Category Name" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.categoryName} onChange={_handleChange} />
                </Grid>
            </Grid>
            <div style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSubmit} style={{ backgroundColor: "#5858FA", width: "60%", borderRadius: "8px", color: "#FFFFFF" }}>{t(codeLanguage + '000060')}</Button>
                <Button onClick={editClose} style={{ borderRadius: "8px", border: "1px solid black", color: "black", marginLeft: "1rem" }}>{t(codeLanguage + '000055')}</Button>
            </div>
        </Box>
    );
}

export default EditSizePopUpScreens;

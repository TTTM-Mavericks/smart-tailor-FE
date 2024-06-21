import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Material } from "../../../../../models/AdminMaterialExcelModel";
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';

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
        hsCode: fid.hsCode.toString(),
        basePrice: fid.basePrice.toString(),
        unit: fid.unit,
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
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.updateMaterial}`;

            const response = await axios.put(apiUrl + `/${fid.materialID}`, {
                ...formData
            });

            if (!response.data) {
                throw new Error('Error updating material');
            }

            updateMaterial(response.data.data);

            sessionStorage.setItem("obj", JSON.stringify(formData));

            Swal.fire(
                `${t(codeLanguage + '000069')}`,
                `${t(codeLanguage + '000070')}`,
                'success'
            );

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
                <Grid item xs={11}>
                    <TextField name="materialName" id="materialName" label="Material Name" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.materialName} onChange={_handleChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="hsCode" id="hsCode" label="HS Code" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.hsCode} onChange={_handleChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="basePrice" id="basePrice" label="Base Price" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.basePrice} onChange={_handleChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="unit" id="unit" label="Unit" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.unit} onChange={_handleChange} />
                </Grid>
            </Grid>
            <div style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSubmit} style={{ backgroundColor: "#5858FA", width: "60%", borderRadius: "8px", color: "#FFFFFF" }}>{t(codeLanguage + '000060')}</Button>
                <Button onClick={editClose} style={{ borderRadius: "8px", border: "1px solid black", color: "black", marginLeft: "1rem" }}>{t(codeLanguage + '000055')}</Button>
            </div>
        </Box>
    );
}

export default EditMaterialPopUpScreens;

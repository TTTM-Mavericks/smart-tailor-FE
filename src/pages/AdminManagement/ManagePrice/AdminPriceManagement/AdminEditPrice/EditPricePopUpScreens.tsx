import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { LaborQuantity } from "../../../../../models/LaborQuantityModel";

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
        setFormData(prevState => ({
            ...prevState,
            [name]: Number(value)
        }));
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
            const response = await axios.put(apiUrl, formData);

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.status === 200) {
                updateLaborQuantity({ ...formData, laborQuantityID });
                Swal.fire(
                    t(codeLanguage + '000069'),
                    t(codeLanguage + '000070'),
                    'success'
                );
            } else {
                Swal.fire(
                    t(codeLanguage + '000071'),
                    t(codeLanguage + '000072'),
                    'error'
                );
            }

            sessionStorage.setItem("obj", JSON.stringify(formData));
            editClose();
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire(
                t(codeLanguage + '000071'),
                t(codeLanguage + '000072'),
                'error'
            );
        }
    };

    return (
        <Box style={{ height: '250px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                {t(codeLanguage + '000068') || 'Edit Labor Quantity'}
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={editClose}
            >
                <CloseIcon />
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
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.laborQuantityMaxPrice}
                        onChange={_handleChange}
                    />
                </Grid>
            </Grid>
            <Box textAlign="center" alignItems="center" marginTop="3rem">
                <Button
                    onClick={_handleSubmit}
                    style={{ backgroundColor: "#5858FA", width: "60%", borderRadius: "8px", color: "#FFFFFF" }}
                >
                    {t(codeLanguage + '000060') || 'Submit'}
                </Button>
                <Button
                    onClick={editClose}
                    style={{ borderRadius: "8px", border: "1px solid black", color: "black", marginLeft: "1rem" }}
                >
                    {t(codeLanguage + '000055') || 'Cancel'}
                </Button>
            </Box>
        </Box>
    );
};

export default EditPricePopUpScreens;

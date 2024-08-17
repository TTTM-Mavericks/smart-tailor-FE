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
import { __getToken } from "../../../../../App";

interface EditPricePopUpScreenFormProps {
    fid: {
        laborQuantityID: string,
        laborQuantityMinQuantity: number,
        laborQuantityMaxQuantity: number,
        laborQuantityMinPrice: number,
        laborQuantityMaxPrice: number,
        laborCostPerQuantity: number
    };
    editClose: () => void;
    updateCostBrand: (updatedCategory: LaborQuantity) => void;
}

const EditPricePopUpScreens: React.FC<EditPricePopUpScreenFormProps> = ({ fid, editClose, updateCostBrand }) => {
    const [formData, setFormData] = React.useState({
        laborQuantityID: fid.laborQuantityID,
        brandLaborCostPerQuantity: fid.laborCostPerQuantity
    });

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const userAuthData = localStorage.getItem('userAuth') as string;

    const userAuth = JSON.parse(userAuthData);

    const { userID, email, fullName, language, phoneNumber, roleName, imageUrl } = userAuth;

    const LABORQUANTITYID = fid.laborQuantityID
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

    console.log("formData" + formData.laborQuantityID);
    const _handleSubmit = async () => {
        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_labor_quantity + functionEndpoints.brandLaborQuantity.updateBrandLaborQuantity + `/${userID}`}`;
            const response = await axios.put(apiUrl, {
                ...formData
            }, {
                headers: {
                    Authorization: `Bearer ${__getToken()}`
                }
            });

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.data.status === 200) {
                updateCostBrand(response.data.data);
                Swal.fire(
                    'Update Success!',
                    'Price Labor quantity has been update!',
                    'success'
                );
                editClose()
            }

            if (response.data.status === 409) {
                Swal.fire(
                    'Update Fail!',
                    'Price Labor quantity has been updated fail!',
                    'error'
                );
                editClose()

            }

            if (response.data.status === 400) {
                Swal.fire(
                    'Update Fail!',
                    'Price Labor quantity has been updated fail!',
                    'error'
                );
                editClose()
            }


            editClose(); // Close the edit modal after successful update
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire(
                'Update Fail!',
                'Price Labor quantity has been updated fail!',
                'error'
            );
            editClose()

        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                Edit Brand Price
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

            <TextField
                name="brandLaborCostPerQuantity"
                id="brandLaborCostPerQuantity"
                label="Brand Labor Cost Per Quantity"
                variant="outlined"
                size="small"
                fullWidth
                value={formData.brandLaborCostPerQuantity}
                onChange={_handleChange}
                sx={{ mb: 4 }}
            />

            <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                <Grid item>
                    <Button
                        onClick={editClose}
                        variant="outlined"
                        sx={{
                            bgcolor: redColor,
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            borderColor: 'white',
                            '&:hover': {
                                bgcolor: redColor,
                                borderColor: primaryColor,  // Primary color on hover
                            },
                        }}
                    >
                        {t(codeLanguage + '000055')}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={_handleSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: primaryColor,
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: primaryColor,
                            },
                        }}
                    >
                        {t(codeLanguage + '000060')}
                    </Button>
                </Grid>
            </Grid>
        </Box>

    );
}

export default EditPricePopUpScreens;

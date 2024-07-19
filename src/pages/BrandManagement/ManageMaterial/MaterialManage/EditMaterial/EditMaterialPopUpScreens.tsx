import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { UpdateMaterial } from "../../../../../models/BrandMaterialExcelModel";
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import Cookies from "js-cookie";
import { UserInterface } from "../../../../../models/UserModel";

interface EditMaterialPopUpScreenFormProps {
    fid: {
        brandName: string,
        categoryName: string,
        materialName: string,
        hsCode: number,
        unit: string,
        basePrice: number,
        brandPrice: number
    };
    editClose: () => void;
    updateMaterial: (updatedMaterial: UpdateMaterial) => void;
}

const EditMaterialPopUpScreens: React.FC<EditMaterialPopUpScreenFormProps> = ({ fid, editClose, updateMaterial }) => {

    const [formData, setFormData] = React.useState({
        categoryName: fid.categoryName,
        materialName: fid.materialName,
        hsCode: fid.hsCode,
        basePrice: fid.basePrice,
        unit: fid.unit,
        brandPrice: fid.brandPrice
    });
    const BRANDNAME = fid.brandName;

    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
            // Your code that uses the parsed data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, perhaps by setting default values or showing an error message
        }
    } else {
        console.error('userAuth cookie is not set');
        // Handle the case when the cookie does not exist
    }


    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        brandFromSignUp = { brandID, brandEmail }
        console.log(brandFromSignUp);

        console.log('Brand ID:', brandID);
        console.log('Brand Email:', brandEmail);
    } else {
        console.error('No user data found in session storage');
    }
    // Get ID When something null
    const getID = () => {
        if (!brandAuth || brandAuth.userID === null || brandAuth.userID === undefined || brandAuth.userID === '') {
            return brandFromSignUp.brandID;
        } else {
            return brandAuth.userID;
        }
    };
    /**
     * Tracking Change of Each Fields
     * @param e 
     */
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

    const _handleSubmit = () => {

        axios.put(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_material + functionEndpoints.brand.updateBrandMaterial}`, {
            ...formData, brandID: getID()
        })

            .then((response) => {
                console.log('Response:', response);
                // updateMaterial({ ...formData, brandID: getID() });
                Swal.fire(
                    `Edit Success!`,
                    `The Brand Price Updated Success`,
                    'success'
                );
            })
            .catch((error: any) => {
                console.error('Update Error:', error);
                Swal.fire(
                    `Edit Fail!`,
                    `The Brand Price Updated Fail`,
                    'error'
                );
            });
    };

    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Brand Price
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
                    <TextField
                        name="categoryName"
                        id="categoryName"
                        label="Category Name"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.categoryName}
                        onChange={_handleChange}
                        disabled={true}
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        name="materialName"
                        id="materialName"
                        label="Material Name"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.materialName}
                        disabled={true}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        name="basePrice"
                        id="basePrice"
                        label="Base Price"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.basePrice}
                        disabled={true}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        name="unit"
                        id="unit"
                        label="Unit"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        disabled={true}
                        value={formData.unit}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        name="hsCode"
                        id="hsCode"
                        label="HS Code"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        disabled={true}
                        value={formData.hsCode}
                        onChange={_handleChange}
                    />
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        name="brandPrice"
                        id="brandPrice"
                        label="Brand Price"
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: "100%" }}
                        value={formData.brandPrice}
                        onChange={_handleChange}
                    />
                </Grid>
            </Grid>
            <div onClick={editClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button
                    onClick={_handleSubmit}
                    style={{ backgroundColor: "#E96208", width: "80%", borderRadius: "8px", marginLeft: "-10%", marginRight: "2%", color: "#FFFFFF" }}
                >
                    {t(codeLanguage + '000060')}
                </Button>
                <Button
                    style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}
                >
                    {t(codeLanguage + '000055')}
                </Button>
            </div>
        </Box>
    );
}

export default EditMaterialPopUpScreens;

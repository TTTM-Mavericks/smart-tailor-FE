import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { Sizes } from "../../../../../models/AdminManageSizeModel";
import { CancelOutlined } from "@mui/icons-material";
import { primaryColor, redColor } from "../../../../../root/ColorSystem";

interface EditSizePopUpScreenFormProps {
    fid: {
        sizeID: string,
        sizeName: string;
    };
    editClose: () => void;
    updateSize: (updatedSizes: Sizes) => void;
}

const EditSizePopUpScreens: React.FC<EditSizePopUpScreenFormProps> = ({ fid, editClose, updateSize }) => {
    const [formData, setFormData] = React.useState({
        sizeName: fid.sizeName
    });

    const sizeID = fid.sizeID

    console.log(sizeID + ": size id");

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
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.size + functionEndpoints.size.updateSize + `/${sizeID}`}`;
            const response = await axios.put(apiUrl, {
                ...formData
            });

            console.log("formData" + formData);

            if (!response.data) {
                throw new Error('Error updating material');
            }

            if (response.data.status === 200) {
                updateSize({ ...formData, sizeID });
                Swal.fire(
                    'Edit Size Success!',
                    'Size has been Edited!',
                    'success'
                );
                editClose()
            }

            if (response.data.status === 409) {
                Swal.fire(
                    'Edit Size Failed!',
                    'Please check the information!',
                    'error'
                );
                editClose()
            }

            if (response.data.status === 400) {
                Swal.fire(
                    'Edit Size Failed!',
                    'Please check the information!',
                    'error'
                );
                editClose()
            }
            sessionStorage.setItem("obj", JSON.stringify(formData));


            editClose(); // Close the edit modal after successful update
        } catch (error) {
            console.error('Update Error:', error);
            Swal.fire(
                'Edit Size Failed!',
                'Please check the information!',
                'error'
            );
            editClose()
        }
    };

    return (
        <Box style={{ height: '222px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Size
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
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField name="sizeName" id="sizeName" label="Size Name" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={formData.sizeName} onChange={_handleChange} />
                </Grid>
            </Grid>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "3rem" }}>
                <Button
                    onClick={editClose}
                    style={{
                        borderRadius: "8px",
                        color: "white",
                        backgroundColor: `${redColor}`,
                        width: "15%"
                    }}
                >
                    {t(codeLanguage + '000055')}
                </Button>
                <Button
                    onClick={_handleSubmit}
                    style={{
                        backgroundColor: `${primaryColor}`,
                        width: "15%",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        marginLeft: "1rem"
                    }}
                >
                    {t(codeLanguage + '000060')}
                </Button>
            </div>

        </Box>
    );
}

export default EditSizePopUpScreens;

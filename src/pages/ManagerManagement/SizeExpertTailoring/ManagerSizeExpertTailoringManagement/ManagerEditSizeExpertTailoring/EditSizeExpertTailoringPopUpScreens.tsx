import * as React from "react";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";
import { ToastContainer, toast } from "react-toastify";
import { CancelOutlined } from "@mui/icons-material";
import { greenColor, primaryColor, redColor } from "../../../../../root/ColorSystem";
import { __getToken } from "../../../../../App";

interface EditExpertTailoringPopUpScreenFormProps {
    fid: {
        expertTailoringID: string,
        expertTailoringName: string,
        sizeName: string,
        ratio: number
    };
    editClose: () => void;
    updateExpertTailoring: (updatedExpertTailoring: ExpertTailoringEdit) => void;
}

const EditExpertTailoringPopUpScreens: React.FC<EditExpertTailoringPopUpScreenFormProps> = ({ fid, editClose, updateExpertTailoring }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [files, setFiles] = React.useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        expertTailoringName: fid.expertTailoringName,
        sizeName: fid.sizeName,
        ratio: fid.ratio
    });

    const [categoryData, setCategoryData] = React.useState<string[]>([])
    const [sizeName, setSizeNameData] = React.useState<string[]>([])

    /**
        * Get all Size name to dropdown
        */
    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.size + functionEndpoints.size.getAllSize}`;
        axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${__getToken()}`
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    // Extract only the categoryName values from the objects
                    const sizeNames = responseData.data.map((size: any) => size.sizeName);
                    setSizeNameData(sizeNames);
                    console.log("Data received:", sizeNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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

    /**
    * Get the image to user for review
    */
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    /**
     * Get all category name to dropdown
     */
    React.useEffect(() => {
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
     * Make a change in the code
     */
    const _handleImagesChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Only images file types are allowed.');
                return;
            }
            const url = URL.createObjectURL(file);
            setFiles(selectedFiles);
            setPreviewUrl(url);
        }
    };

    /**
     * 
     * @param files 
     * @returns 
     * Upload the image into the cloudinary
     */
    const _handleUploadToCloudinary = async (files: FileList): Promise<string[]> => {
        const cloudName = 'dby2saqmn';
        const presetKey = 'whear-app';
        const folderName = 'test';

        const formData = new FormData();
        formData.append('upload_preset', presetKey);
        formData.append('folder', folderName);

        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            formData.append('file', file);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const responseData = await response.json();

                if (responseData.secure_url) {
                    const imageUrl = responseData.secure_url;
                    uploadedUrls.push(imageUrl);
                } else {
                    console.error('Error uploading image to Cloudinary. Response:', responseData);
                }
            } catch (error) {
                console.error('Error uploading images to Cloudinary:', error);
            }
        }

        return uploadedUrls;
    };


    /**
     * 
     * @param e 
     * Tracking the changing in each fields
     */
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    /**
  * 
  * @param e 
  * Update the Data in to DB
  */
    const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedExpertTailoring = {
            expertTailoringName: "shirtModel",
            sizeName: "L",
            ratio: 1.4,
        };

        try {
            const response = await axios.put(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.sizeExpertTailoring + functionEndpoints.sizeExpertTailoring.updateSizeExpertTailoring}`,
                updatedExpertTailoring
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Expert Tailoring Success!',
                    text: 'Expert tailoring has been Updated!',
                });
                editClose()
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Updated Expert Tailoring Failed!',
                text: 'Expert tailoring update failed!',
            });
            editClose()
        }
    };

    return (
        <Box style={{ height: '400px', overflowY: 'auto' }}>
            <div>
                <div className="relative w-full p-8 bg-white rounded-xl z-10">
                    <div className="text-center relative">
                        <Typography variant="h6" align="center" gutterBottom>
                            Edit Size Expert Tailoring
                        </Typography>
                        <p className="mt-1 text-xs text-gray-400">Add a new expert tailoring below</p>
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
                    </div>
                    <form className="mt-6 space-y-2" action="#" method="POST">
                        <div className="grid grid-cols-1 space-y-1">
                            <FormControl fullWidth>
                                <InputLabel id="expertTailoring-select-label">Expert Tailoring Name</InputLabel>
                                <Select
                                    labelId="expertTailoring-select-label"
                                    id="expertTailoring-select"
                                    name="expertTailoringName"
                                    value={formData.expertTailoringName}
                                    onChange={_handleChange}
                                    label="Expert Tailoring Name"
                                >
                                    {categoryData.map((expertTailoring, index) => (
                                        <MenuItem key={index} value={expertTailoring}>
                                            {expertTailoring}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl fullWidth>
                                <InputLabel id="size-select-label">Size Name</InputLabel>
                                <Select
                                    labelId="size-select-label"
                                    id="size-select"
                                    name="sizeName"
                                    value={formData.sizeName}
                                    onChange={_handleChange}
                                    label="Size Name"
                                >
                                    {sizeName.map((size, index) => (
                                        <MenuItem key={index} value={size}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                fullWidth
                                label="Ratio"
                                variant="outlined"
                                size="small"
                                name="ratio"
                                type="number"
                                value={formData.ratio}
                                onChange={_handleChange}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0, padding: '1rem' }}>
                <Button
                    onClick={editClose}
                    style={{
                        borderRadius: '8px',
                        color: 'white',
                        backgroundColor: `${redColor}`,
                        width: '15%',
                        marginRight: '1rem',
                    }}
                >
                    {t(codeLanguage + '000055')}
                </Button>
                <Button
                    onClick={_handleSubmit}
                    style={{
                        backgroundColor: `${primaryColor}`,
                        width: '15%',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                    }}
                >
                    {t(codeLanguage + '000060')}
                </Button>
            </div>
        </Box>
    );
}

export default EditExpertTailoringPopUpScreens;

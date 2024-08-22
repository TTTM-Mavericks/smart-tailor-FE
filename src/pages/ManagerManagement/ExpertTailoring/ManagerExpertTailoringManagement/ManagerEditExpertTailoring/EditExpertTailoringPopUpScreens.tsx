import * as React from "react";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";
import { ToastContainer, toast } from "react-toastify";
import { primaryColor, redColor } from "../../../../../root/ColorSystem";
import { CancelOutlined } from "@mui/icons-material";
import { __getToken } from "../../../../../App";

interface EditExpertTailoringPopUpScreenFormProps {
    fid: {
        expertTailoringID: string,
        expertTailoringName: string,
        sizeImageUrl: string,
    };
    editClose: () => void;
    updateExpertTailoring: (updatedExpertTailoring: ExpertTailoringEdit) => void;
}

const EditExpertTailoringPopUpScreens: React.FC<EditExpertTailoringPopUpScreenFormProps> = ({ fid, editClose, updateExpertTailoring }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [files, setFiles] = React.useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [modelFiles, setModelFiles] = React.useState<FileList | null>(null);
    const [modelPreviewUrl, setModelPreviewUrl] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState({
        expertTailoringName: fid.expertTailoringName,
        sizeImageUrl: fid.sizeImageUrl,
        modelImageUrl: "", // Added this for the new model image
    });

    const [categoryData, setCategoryData] = React.useState<string[]>([]);

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

    // Get the image to user for review
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            if (modelPreviewUrl) {
                URL.revokeObjectURL(modelPreviewUrl);
            }
        };
    }, [previewUrl, modelPreviewUrl]);

    // Get all category names for dropdown
    React.useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.getAllCategory}`;
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
                    const categoryNames = responseData.data.map((category: any) => category.categoryName);
                    setCategoryData(categoryNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Handle image changes for sizeImageUrl
    const _handleImagesChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Only image file types are allowed.');
                return;
            }
            const url = URL.createObjectURL(file);
            setFiles(selectedFiles);
            setPreviewUrl(url);
        }
    };

    // Handle image changes for modelImageUrl
    const _handleModelImagesChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Only image file types are allowed.');
                return;
            }
            const url = URL.createObjectURL(file);
            setModelFiles(selectedFiles);
            setModelPreviewUrl(url);
        }
    };

    // Upload images to Cloudinary
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

    // Track changes in each field
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Update data in the database
    const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let sizeImageUrls: string[] = [];
        let modelImageUrls: string[] = [];

        if (files && files.length > 0) {
            sizeImageUrls = await _handleUploadToCloudinary(files);
        }

        if (modelFiles && modelFiles.length > 0) {
            modelImageUrls = await _handleUploadToCloudinary(modelFiles);
        }

        const updatedExpertTailoring = {
            ...formData,
            sizeImageUrl: sizeImageUrls.length > 0 ? sizeImageUrls[0] : formData.sizeImageUrl,
            modelImageUrl: modelImageUrls.length > 0 ? modelImageUrls[0] : formData.modelImageUrl, // Include model image URL
        };

        try {
            const response = await axios.put(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.updateExpertTailoring + `/${fid.expertTailoringID}`}`,
                updatedExpertTailoring,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`
                    }
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Expert Tailoring Success!',
                    text: 'Expert tailoring has been updated!',
                });
                updateExpertTailoring({ ...updatedExpertTailoring, expertTailoringID: fid.expertTailoringID });
                editClose();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Expert Tailoring Failed!',
                text: 'Failed to update expert tailoring!',
            });
            editClose();
        }
    };

    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <div>
                <div className="relative w-full p-8 bg-white rounded-xl z-10">
                    <div className="text-center relative">
                        <Typography variant="h6" align="center" gutterBottom>
                            Edit Expert Tailoring
                        </Typography>
                        <p className="mt-1 text-xs text-gray-400">Edit the expert tailoring details below</p>
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
                    <form className="mt-6 space-y-2" action="#" method="POST" onSubmit={_handleSubmit}>
                        <div className="grid grid-cols-1 gap-3">
                            {/* <div>
                                <InputLabel htmlFor="expertTailoringName">{t("Expert Tailoring Name")}</InputLabel>
                                <input
                                    type="text"
                                    id="expertTailoringName"
                                    name="expertTailoringName"
                                    value={formData.expertTailoringName}
                                    onChange={_handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300"
                                />
                            </div> */}
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
                                <InputLabel htmlFor="sizeImageUrl">{t("Size Image")}</InputLabel>
                                <input
                                    type="file"
                                    id="sizeImageUrl"
                                    name="sizeImageUrl"
                                    onChange={_handleImagesChanges}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {previewUrl && (
                                    <img src={previewUrl} alt="Size Image Preview" className="mt-2 w-full h-auto object-contain" />
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="modelImageUrl">{t("Model Image")}</InputLabel>
                                <input
                                    type="file"
                                    id="modelImageUrl"
                                    name="modelImageUrl"
                                    onChange={_handleModelImagesChanges}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {modelPreviewUrl && (
                                    <img src={modelPreviewUrl} alt="Model Image Preview" className="mt-2 w-full h-auto object-contain" />
                                )}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                marginTop: '1rem',
                                backgroundColor: primaryColor,
                                textTransform: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            {t("Update")}
                        </Button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Box>
    );
};

export default EditExpertTailoringPopUpScreens;

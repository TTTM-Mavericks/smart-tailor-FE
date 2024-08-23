import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Button, IconButton, Typography, SelectChangeEvent, Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { AddExpertTailoring } from '../../../../models/ManagerExpertTailoringModel';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { toast, ToastContainer } from 'react-toastify';
import { CancelOutlined } from '@mui/icons-material';
import { primaryColor } from '../../../../root/ColorSystem';
import { __getToken } from '../../../../App';

interface AddExpertTailoringWithHandsFormProps {
    closeCard: () => void;
    addNewExpertTailoring: (addedNewExpertTailoring: AddExpertTailoring) => void
}

const AddEachExpertTailoringWithHand: React.FC<AddExpertTailoringWithHandsFormProps> = ({ closeCard, addNewExpertTailoring }) => {

    // ---------------UseState Variable---------------//

    const sizeImageInputRef = useRef<HTMLInputElement>(null);
    const modelImageInputRef = useRef<HTMLInputElement>(null);
    const [sizeImageFile, setSizeImageFile] = useState<File | null>(null);
    const [modelImageFile, setModelImageFile] = useState<File | null>(null);
    const [sizeImagePreview, setSizeImagePreview] = useState<string | null>(null);
    const [modelImagePreview, setModelImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        expertTailoringName: '',
        sizeImageUrl: '',
        modelImageUrl: ''
    });

    const [categoryData, setCategoryData] = useState<string[]>([])


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

    /**
     * Get the image to user for review
     */
    // useEffect(() => {
    //     return () => {
    //         if (previewUrl) {
    //             URL.revokeObjectURL(previewUrl);
    //         }
    //     };
    // }, [previewUrl]);


    /**
     * Get all category name to dropdown
     */
    useEffect(() => {
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
    const _handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'size' | 'model') => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Only image file types are allowed.');
                return;
            }
            const url = URL.createObjectURL(file);
            if (type === 'size') {
                setSizeImageFile(file);
                setSizeImagePreview(url);
            } else {
                setModelImageFile(file);
                setModelImagePreview(url);
            }
        }
    };

    /**
     * 
     * @param files 
     * @returns 
     * Upload the image into the cloudinary
     */
    const _handleUploadToCloudinary = async (file: File): Promise<string> => {
        const cloudName = 'dby2saqmn';
        const presetKey = 'whear-app';
        const folderName = 'test';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', presetKey);
        formData.append('folder', folderName);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const responseData = await response.json();

            if (responseData.secure_url) {
                return responseData.secure_url;
            } else {
                console.error('Error uploading image to Cloudinary. Response:', responseData);
                return '';
            }
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return '';
        }
    };

    /**
     * 
     * @param e 
     * Tracking the changing in each fields
     */
    const _handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
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
    const _handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let sizeImageUrl = formData.sizeImageUrl;
        let modelImageUrl = formData.modelImageUrl;

        if (sizeImageFile) {
            sizeImageUrl = await _handleUploadToCloudinary(sizeImageFile);
        }
        if (modelImageFile) {
            modelImageUrl = await _handleUploadToCloudinary(modelImageFile);
        }

        const addNewExpertTailorings = {
            ...formData,
            sizeImageUrl,
            modelImageUrl,
        };

        // Make API call to update the profile using POST method
        try {
            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.addNewExpertTailoring}`,
                addNewExpertTailorings,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`
                    }
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add New Expert Tailoring',
                    text: 'Your expert tailoring has been added!',
                });
                addNewExpertTailoring(addNewExpertTailorings);
                closeCard();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: 'There was an error adding new expert tailoring. Please try again later.',
            });
            closeCard();
        }
    };

    return (
        <div className="h-50">
            <div className="relative w-full p-8 bg-white rounded-xl z-10">
                <div className="text-center relative">
                    <Typography variant="h6" align="center" gutterBottom>
                        Add New Expert Tailoring
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={closeCard}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: -26,
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
                <form className="mt-6 space-y-2" onSubmit={_handleAdd}>
                    <div className="grid grid-cols-1 space-y-1">
                        <FormControl fullWidth>
                            <InputLabel id="expertTailoring-select-label">Expert Tailoring Name</InputLabel>
                            <Select
                                labelId="expertTailoring-select-label"
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
                    <div className="grid grid-cols-1 space-y-1">
                        <label className="text-xs font-bold text-gray-500 tracking-wide">Size Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-40 p-10 group text-center">
                                <div className="relative h-full w-full text-center flex flex-col items-center justify-center">
                                    {sizeImagePreview ? (
                                        <img className="absolute inset-0 h-full w-full object-cover" src={sizeImagePreview} alt="Size Image Preview" />
                                    ) : formData.sizeImageUrl ? (
                                        <img className="absolute inset-0 h-full w-full object-cover" src={formData.sizeImageUrl} alt="Size Image" />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center justify-center">
                                            <p className="pointer-none text-gray-500">
                                                <span className="text-xs">Drag and drop</span> size image here <br /> or{' '}
                                                <a href="#" onClick={() => sizeImageInputRef.current?.click()} className="text-blue-600 hover:underline">
                                                    select a file
                                                </a>{' '}
                                                from your computer
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={sizeImageInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => _handleImageChange(e, 'size')}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 space-y-1">
                        <label className="text-xs font-bold text-gray-500 tracking-wide">Model Image</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-40 p-10 group text-center">
                                <div className="relative h-full w-full text-center flex flex-col items-center justify-center">
                                    {modelImagePreview ? (
                                        <img className="absolute inset-0 h-full w-full object-cover" src={modelImagePreview} alt="Model Image Preview" />
                                    ) : formData.modelImageUrl ? (
                                        <img className="absolute inset-0 h-full w-full object-cover" src={formData.modelImageUrl} alt="Model Image" />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center justify-center">
                                            <p className="pointer-none text-gray-500">
                                                <span className="text-xs">Drag and drop</span> model image here <br /> or{' '}
                                                <a href="#" onClick={() => modelImageInputRef.current?.click()} className="text-blue-600 hover:underline">
                                                    select a file
                                                </a>{' '}
                                                from your computer
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={modelImageInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => _handleImageChange(e, 'model')}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-gray-300">
                        <span style={{ color: 'red', fontWeight: "bolder" }}>File type: Images</span>
                    </p>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: primaryColor,
                                color: 'white',
                                width: '15%',
                                '&:hover': {
                                    backgroundColor: primaryColor,
                                },
                            }}
                        >
                            Upload
                        </Button>
                    </Box>

                </form>
                <ToastContainer />
            </div>
        </div>

    );
}

export default AddEachExpertTailoringWithHand;

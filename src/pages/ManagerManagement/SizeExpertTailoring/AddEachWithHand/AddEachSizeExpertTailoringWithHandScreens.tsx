import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import {
    Button,
    IconButton,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { AddSizeExpertTailoring } from '../../../../models/ManagerSizeExpertTailoringModel';
import { CancelOutlined } from '@mui/icons-material';
import { primaryColor } from '../../../../root/ColorSystem';
import { __getToken } from '../../../../App';

interface AddSizeExpertTailoringWithHandsFormProps {
    closeCard: () => void;
    addNewExpertTailoring: (addedNewExpertTailoring: AddSizeExpertTailoring) => void
}

const AddEachSizeExpertTailoringWithHand: React.FC<AddSizeExpertTailoringWithHandsFormProps> = ({ closeCard, addNewExpertTailoring }) => {

    // ---------------UseState Variable---------------//

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        expertTailoringName: '',
        sizeName: '',
        ratio: 0,
    });

    const [categoryData, setCategoryData] = useState<string[]>([])

    const [expertTailoringName, setExpertTailoringNameData] = useState<string[]>([])

    const [sizeName, setSizeNameData] = useState<string[]>([])


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
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


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

    /**
     * Get all Expert Tailoring name to dropdown
     */
    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.getAllExpertTailoring}`;
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
                    const expertTailoringNameData = responseData.data.map((expertTailoring: any) => expertTailoring.expertTailoringName);
                    setExpertTailoringNameData(expertTailoringNameData);
                    console.log("Data received:", expertTailoringNameData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    /**
     * Get all Size name to dropdown
     */
    useEffect(() => {
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
        let sizeImageUrls: string[] = [];

        if (files && files.length > 0) {
            sizeImageUrls = await _handleUploadToCloudinary(files);
        }

        // Make API call to update the profile using PUT method
        try {
            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.sizeExpertTailoring + functionEndpoints.sizeExpertTailoring.addNewSizeExpertTailoring}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`
                    }
                }

            );
            console.log("res:" + response);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add New Expertailoring',
                    text: 'Your expert tailoring have been add!',
                });
                addNewExpertTailoring(formData)
                console.log("addnew " + response.data);
                closeCard()
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: 'There was an error adding new expert tailoring. Please try again later.',
            });
            closeCard()
        }
    };

    return (
        <div>
            <div className="relative w-full p-8 bg-white rounded-xl z-10">
                <div className="text-center relative">
                    <Typography variant="h6" align="center" gutterBottom>
                        Add New Size Expert Tailoring
                    </Typography>
                    <p className="mt-1 text-xs text-gray-400">Add a new expert tailoring below</p>
                    <IconButton
                        aria-label="close"
                        onClick={closeCard}
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
                <form className="mt-6 space-y-4" action="#" method="POST">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
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
                                    {expertTailoringName.map((expertTailoring, index) => (
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
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button
                            type="submit"
                            className="my-4 flex justify-center bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                            onClick={_handleAdd}
                            style={{ backgroundColor: `${primaryColor}`, color: 'white', width: '15%' }}  // Adjust width as needed
                        >
                            Upload
                        </Button>
                    </div>
                </form>
            </div>
        </div>


    );
}

export default AddEachSizeExpertTailoringWithHand;

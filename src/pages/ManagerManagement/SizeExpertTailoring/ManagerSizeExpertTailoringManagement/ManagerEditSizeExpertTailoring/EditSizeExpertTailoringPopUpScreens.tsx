import * as React from "react";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";
import { ToastContainer, toast } from "react-toastify";

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

    const [formData, setFormData] = React.useState({
        expertTailoringName: fid.expertTailoringName,
        sizeImageUrl: fid.sizeImageUrl,
    });

    const [categoryData, setCategoryData] = React.useState<string[]>([])


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
        let sizeImageUrls: string[] = [];

        if (files && files.length > 0) {
            sizeImageUrls = await _handleUploadToCloudinary(files);
        }

        const addNewExpertTailorings = {
            ...formData,
            sizeImageUrl: sizeImageUrls.length > 0 ? sizeImageUrls[0] : formData.sizeImageUrl,
        };


        // Make API call to update the profile using PUT method
        try {
            // const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YW1tdHNlMTYxMDg3QGZwdC5lZHUudm4iLCJpYXQiOjE3MTgyODUyMTMsImV4cCI6MTcxODM3MTYxM30.UUpy2s9SwYGF_TyIru6VASQ-ZzGTOqx7mkWkcSR2__0'; // Replace with the actual bearer token
            const response = await axios.put(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.manager + functionEndpoints.manager.updateExpertTailoring + `/${fid.expertTailoringID}`}`,
                addNewExpertTailorings,
                // {
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     }
                // }

            );
            console.log("res:" + response);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated Expert Tailoring Success!',
                    text: 'Expert tailoring have been Updated!',
                });
                updateExpertTailoring({ ...addNewExpertTailorings, expertTailoringID: fid.expertTailoringID })
                editClose()
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Updated Expert Tailoring Failed!',
                text: 'Expert tailoring have been Updated!',
            });
            editClose()
        }
    };

    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <div>
                <div className="relative w-full p-8 bg-white rounded-xl z-10">
                    <div className="text-center relative">
                        <Typography variant="h6" align="center" gutterBottom>
                            Add New Expert Tailoring
                        </Typography>
                        <p className="mt-1 text-xs text-gray-400">Add a new expert tailoring below</p>
                        <IconButton style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={editClose}>
                            <CloseIcon />
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
                        <div className="grid grid-cols-1 space-y-1">
                            <label className="text-xs font-bold text-gray-500 tracking-wide">Attach Document</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                                    <div className="relative h-full w-full text-center flex flex-col items-center justify-center">
                                        {previewUrl ? (
                                            <img className="absolute inset-0 h-full w-full object-cover" src={previewUrl} alt="Profile Preview" />
                                        ) : formData.sizeImageUrl ? (
                                            <img className="absolute inset-0 h-full w-full object-cover" src={formData.sizeImageUrl} alt="Profile" />
                                        ) : (
                                            <div className="relative z-10 flex flex-col items-center justify-center">
                                                <p className="pointer-none text-gray-500">
                                                    <span className="text-xs">Drag and drop</span> files here <br /> or{' '}
                                                    <a href="#" onClick={() => fileInputRef.current?.click()} className="text-blue-600 hover:underline">
                                                        select a file
                                                    </a>{' '}
                                                    from your computer
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={_handleImagesChanges}
                                        accept="image/*"
                                    />
                                    <ToastContainer />
                                </label>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300">
                            <span style={{ color: 'red', fontWeight: "bolder" }}>File type: Images</span>
                        </p>
                    </form>
                </div>
            </div>
            <div style={{ textAlign: "center", alignItems: "center", marginTop: 0, bottom: 0 }}>
                <Button onClick={_handleSubmit} style={{ backgroundColor: "#E96208", width: "78%", borderRadius: "8px", color: "#FFFFFF" }}>{t(codeLanguage + '000060')}</Button>
                <Button onClick={editClose} style={{ borderRadius: "8px", border: "1px solid black", color: "black", marginLeft: "1rem" }}>{t(codeLanguage + '000055')}</Button>
            </div>
        </Box>
    );
}

export default EditExpertTailoringPopUpScreens;

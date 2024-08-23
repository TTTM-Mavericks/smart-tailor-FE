import * as React from "react";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { ExpertTailoringEdit } from "../../../../../models/ManagerExpertTailoringModel";
import { ToastContainer, toast } from "react-toastify";
import { primaryColor } from "../../../../../root/ColorSystem";
import { CancelOutlined } from "@mui/icons-material";
import { __getToken } from "../../../../../App";

interface EditExpertTailoringPopUpScreenFormProps {
    fid: {
        expertTailoringID: string,
        expertTailoringName: string,
        sizeImageUrl: string,
        modelImageUrl: string
    };
    editClose: () => void;
    updateExpertTailoring: (updatedExpertTailoring: ExpertTailoringEdit) => void;
}

const EditExpertTailoringPopUpScreens: React.FC<EditExpertTailoringPopUpScreenFormProps> = ({ fid, editClose, updateExpertTailoring }) => {
    const [formData, setFormData] = React.useState({
        expertTailoringName: fid.expertTailoringName,
        sizeImageUrl: fid.sizeImageUrl,
        modelImageUrl: fid.modelImageUrl,
    });

    const [categoryData, setCategoryData] = React.useState<string[]>([]);
    const [sizeImageBase64, setSizeImageBase64] = React.useState<string | null>(null);
    const [modelImageBase64, setModelImageBase64] = React.useState<string | null>(null);

    const selectedLanguage = localStorage.getItem('language');
    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

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

    const _handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setBase64: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Only image file types are allowed.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedExpertTailoring = {
            ...formData,
            sizeImageUrl: sizeImageBase64 || formData.sizeImageUrl,
            modelImageUrl: modelImageBase64 || formData.modelImageUrl,
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
                                    onChange={(e) => _handleImageChange(e, setSizeImageBase64)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {sizeImageBase64 && (
                                    <img src={sizeImageBase64} alt="Size Image Preview" className="mt-2 w-full h-auto object-contain" />
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="modelImageUrl">{t("Model Image")}</InputLabel>
                                <input
                                    type="file"
                                    id="modelImageUrl"
                                    name="modelImageUrl"
                                    onChange={(e) => _handleImageChange(e, setModelImageBase64)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {modelImageBase64 && (
                                    <img src={modelImageBase64} alt="Model Image Preview" className="mt-2 w-full h-auto object-contain" />
                                )}
                            </div>
                        </div>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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
                        </Box>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Box>
    );
};

export default EditExpertTailoringPopUpScreens;
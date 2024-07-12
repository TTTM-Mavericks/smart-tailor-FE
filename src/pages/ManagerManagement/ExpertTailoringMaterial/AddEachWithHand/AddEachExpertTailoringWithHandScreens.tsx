import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    IconButton,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { AddExpertTailoring, ExpertTailoring } from '../../../../models/ManagerExpertTailoringModel';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { toast, ToastContainer } from 'react-toastify';
import { AddExpertTailoringMaterial } from '../../../../models/ManagerExpertTaloringMaterialModel';

interface AddExpertTailoringWithHandsFormProps {
    closeCard: () => void;
    addNewExpertTailoringMaterial: (addedNewExpertTailoring: AddExpertTailoringMaterial) => void
}

const AddEachExpertTailoringWithHand: React.FC<AddExpertTailoringWithHandsFormProps> = ({ closeCard, addNewExpertTailoringMaterial }) => {

    const [formData, setFormData] = useState({
        categoryName: '',
        materialName: '',
        expertTailoringNames: [] as string[] // Initialize as an array
    });

    const [categoryData, setCategoryData] = useState<string[]>([])
    const [materialData, setMaterialData] = useState<string[]>([])
    const [expertTailoringData, setExpertTailoringData] = useState<string[]>([])

    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    useEffect(() => {
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
                    const categoryNames = responseData.data.map((category: any) => category.categoryName);
                    setCategoryData(categoryNames);
                    console.log("Data received:", categoryNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.material + functionEndpoints.material.getAllMaterial}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const materialNames = responseData.data.map((material: any) => material.materialName);
                    setMaterialData(materialNames);
                    console.log("Data received:", materialNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.expertTailoring + functionEndpoints.expertTailoring.getAllExpertTailoring}`;
        axios.get(apiUrl)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return response.data;
            })
            .then((responseData) => {
                if (responseData && Array.isArray(responseData.data)) {
                    const expertTailoringNames = responseData.data.map((expertTailoring: any) => expertTailoring.expertTailoringName);
                    setExpertTailoringData(expertTailoringNames);
                    console.log("Data received:", expertTailoringNames);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const _handleChange = (event: SelectChangeEvent<unknown>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name as string]: value as string[],
        });
    };

    const _handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Data to be sent:", formData);
        try {
            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.expertTailoringMaterial + functionEndpoints.expertTailoringMaterial.addNewExpertTailoringMaterial}`,
                formData,
            );
            console.log("API response:", response);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Add New Expert Tailoring Material',
                    text: 'Your expert tailoring material has been added!',
                });
                addNewExpertTailoringMaterial(formData)
                closeCard()
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: 'There was an error adding new expert tailoring material. Please try again later.',
            });
            closeCard()
        }
    };

    return (
        <div>
            <div className="relative w-full p-8 bg-white rounded-xl z-10">
                <div className="text-center relative">
                    <Typography variant="h6" align="center" gutterBottom>
                        {t(codeLanguage + '000051')}
                    </Typography>
                    <p className="mt-1 text-xs text-gray-400">Add a new expert tailoring below</p>
                    <IconButton style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={closeCard}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <form className="mt-6 space-y-2" onSubmit={_handleAdd}>
                    <div className="grid grid-cols-1 space-y-1">
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Category Name</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={_handleChange}
                                label="Category Name"
                            >
                                {categoryData.map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="material-select-label">Material Name</InputLabel>
                            <Select
                                labelId="material-select-label"
                                id="material-select"
                                name="materialName"
                                value={formData.materialName}
                                onChange={_handleChange}
                                label="Material Name"
                            >
                                {materialData.map((material, index) => (
                                    <MenuItem key={index} value={material}>
                                        {material}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="expertTailoring-select-label">Expert Tailoring Name</InputLabel>
                            <Select
                                labelId="expertTailoring-select-label"
                                id="expertTailoring-select"
                                name="expertTailoringNames"
                                multiple
                                value={formData.expertTailoringNames}
                                onChange={_handleChange}
                                label="Expert Tailoring Name"
                            >
                                {expertTailoringData.map((expertTailoringName, index) => (
                                    <MenuItem key={index} value={expertTailoringName}>
                                        {expertTailoringName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        type="submit"
                        className="my-4 w-full flex justify-center bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                        style={{ backgroundColor: '#EC6208', color: 'white' }}
                    >
                        Upload
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default AddEachExpertTailoringWithHand;

import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { AddCategory } from '../../../../models/AdminCategoryExcelModel';
import { borderRadius, display, height } from '@mui/system';
import { AddCircleOutline, CancelOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { primaryColor } from '../../../../root/ColorSystem';
import { __getToken } from '../../../../App';

interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewCategory: (addedNewCategory: AddCategory[]) => void;
}

const AddEachCategoryWithHand: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewCategory }) => {
    // Initialize formData as an array of AddCategory objects
    const [formData, setFormData] = useState<AddCategory[]>([
        { categoryNames: 'Fabric' },
        { categoryNames: 'Thread' }
    ]);

    const { t, i18n } = useTranslation();
    const selectedLanguage = localStorage.getItem('language');

    useEffect(() => {
        if (selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const _handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // Only allow alphabetic characters and spaces
        if (/^[A-Za-z\s]*$/.test(value)) {
            setFormData(prevFormData => {
                const newFormDatas = [...prevFormData];
                newFormDatas[index] = { categoryNames: value.trim() }; // Trim to remove leading/trailing spaces
                return newFormDatas;
            });
        }
    };

    const _handleAddCategory = () => {
        setFormData([...formData, { categoryNames: '' }]); // Add a new empty category
    };

    const _handleRemoveCategory = (index: number) => {
        setFormData(prevFormData => prevFormData.filter((_, i) => i !== index));
    };

    const _handleSubmit = async () => {
        if (formData.length === 0) {
            Swal.fire(
                'Validation Error',
                'Please add at least one category.',
                'warning'
            );
            closeCard()
            return;
        }

        // Check if all categories are valid
        const invalidCategories = formData.filter(category => !/^[A-Za-z\s]+$/.test(category.categoryNames));
        if (invalidCategories.length > 0) {
            Swal.fire(
                'Invalid Input',
                'Category names must contain only alphabetic characters and spaces',
                'error'
            );
            closeCard()
            return;
        }

        // Check for duplicate categories
        const uniqueCategories = new Set(formData.map(category => category.categoryNames.toLowerCase()));
        if (uniqueCategories.size !== formData.length) {
            Swal.fire(
                'Duplicate Categories',
                'Please ensure all category names are unique',
                'error'
            );
            closeCard()
            return;
        }

        try {
            const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.addNewCategory}`;
            const response = await axios.post(apiUrl, { categoryNames: formData.map(cat => cat.categoryNames) }, {
                headers: {
                    Authorization: `Bearer ${__getToken()}`
                }
            }); // Extract categoryNames

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                addNewCategory(formData);
                closeCard()
                Swal.fire(
                    'Add Success!',
                    'Categories have been added!',
                    'success'
                );
            } else {
                closeCard()
                Swal.fire(
                    'Add Category Fail!',
                    'Please check information!',
                    'error'
                );
            }
        } catch (err: any) {
            closeCard()
            console.error('Error:', err);
            Swal.fire(
                'Add Category Fail!',
                `${err.message || 'Unknown error'}`,
                'error'
            );
        }
    };

    return (
        <div>
            <IconButton
                aria-label="close"
                onClick={closeCard}
                sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
                <CancelOutlined sx={{ color: "red" }} />
            </IconButton>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Categories</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {formData.map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder={`Category ${index + 1}`}
                            value={category.categoryNames}
                            onChange={(e) => _handleFormChange(index, e)}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            pattern="[A-Za-z\s]*"
                            title="Only alphabetic characters and spaces are allowed"
                        />
                        <button
                            onClick={() => _handleRemoveCategory(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                            <RemoveCircleOutline />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
                <button
                    type="button"
                    onClick={_handleAddCategory}
                    className="flex items-center space-x-1 text-orange-600 hover:text-orange-600 transition-colors duration-200"
                >
                    <AddCircleOutline />
                    <span>Add Category</span>
                </button>
                <button
                    type="button"
                    onClick={_handleSubmit}
                    style={{ backgroundColor: `${primaryColor}` }}
                    className="text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddEachCategoryWithHand;

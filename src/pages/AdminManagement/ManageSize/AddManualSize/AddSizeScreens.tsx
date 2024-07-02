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
import { Category } from '../../../../models/AdminCategoryExcelModel';
interface AddMaterialWithHandsFormProps {
    closeCard: () => void;
    addNewCategory: (addedNewCategory: Category) => void
}

const AddSizeManual: React.FC<AddMaterialWithHandsFormProps> = ({ closeCard, addNewCategory }) => {

    // ---------------UseState Variable---------------//
    const [formData, setFormData] = useState({
        categoryName: 'Vải',
    });


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

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Tracking the changing in each fields
     */
    const _handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    /**
     * Submit the add manual with validate fields
     * When success show success popup
     * When fail then show fail popup
     */
    const _handleSubmit = async () => {
        try {
            console.log('Form Data:', JSON.stringify(formData));

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.category + functionEndpoints.category.addNewCategory + `?categoryName=${formData.categoryName}`}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                addNewCategory(response.data);
                Swal.fire(
                    'Add Success!',
                    'User has been updated!',
                    'success'
                );

            } else {
                Swal.fire(
                    'Add User fail!',
                    'Please check information!',
                    'error'
                );
            }
        } catch (err: any) {
            console.error('Error:', err);
            Swal.fire(
                'Add fail!',
                `${err.message || 'Unknown error'} `,
                'error'
            );
        }
    };

    const [sizes, setSizes] = useState(['']);

    const handleAddSize = () => {
        setSizes([...sizes, '']);
    };

    const handleSizeChange = (index: any, event: any) => {
        const newSizes = sizes.slice();
        newSizes[index] = event.target.value;
        setSizes(newSizes);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevent page reload
        console.log('Sizes:', sizes);
        // try {
        //   const response = await axios.post('/your-api-endpoint', { sizes });
        //   console.log('Response:', response.data);
        //   // Handle success response
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Handle error response
        // }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="h-52 overflow-y-auto overflow-x-hidden scrollbar-none relative p-4 bg-white shadow-md rounded-md"
        >
            <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeCard}
            >
                <CloseIcon />
            </button>
            {sizes.map((size, index) => (
                <div key={index} className="mb-4">
                    <label htmlFor={`size-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Size {index + 1}:
                    </label>
                    <input
                        id={`size-${index}`}
                        type="text"
                        value={size}
                        onChange={(event) => handleSizeChange(index, event)}
                        placeholder="Enter size (e.g., S, M, L)"
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            ))}
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Size
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Submit
                </button>
            </div>
        </form>

    );
}

export default AddSizeManual;
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
interface AddPriceWithHandsFormProps {
    closeCard: () => void;
    addNewCategory: (addedNewCategory: Category) => void
}

const AddPriceManual: React.FC<AddPriceWithHandsFormProps> = ({ closeCard, addNewCategory }) => {

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

    const [prices, setPrices] = useState([
        { quantity: '1 - 10', basePrice: '150000 - 170000', brandPrice: '' },
        { quantity: '11 - 20', basePrice: '150000 - 170000', brandPrice: '' },
        { quantity: '11 - 20', basePrice: '150000 - 170000', brandPrice: '' },
        { quantity: '11 - 20', basePrice: '150000 - 170000', brandPrice: '' },
        { quantity: '11 - 20', basePrice: '150000 - 170000', brandPrice: '' },
        // Add more rows as needed
    ]);

    const handlePriceChange = (index: any, event: any) => {
        const newPrices = prices.slice();
        newPrices[index].brandPrice = event.target.value;
        setPrices(newPrices);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log('Prices:', prices);

        // Uncomment and use the following lines to make a POST request
        // try {
        //   const response = await axios.post('/your-api-endpoint', { sizes, prices });
        //   console.log('Response:', response.data);
        //   // Handle success response
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Handle error response
        // }
    };
    return (
        <div>
            <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={closeCard}
            >
                <CloseIcon />
            </IconButton>
            <form onSubmit={handleSubmit}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 font-semibold">Quantity</th>
                            <th className="border-b py-2 font-semibold">Base Price</th>
                            <th className="border-b py-2 font-semibold">Brand Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((price, index) => (
                            <tr key={index} className="odd:bg-gray-50">
                                <td className="border-b py-2 px-4">{price.quantity}</td>
                                <td className="border-b py-2 px-4">{price.basePrice}</td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        value={price.brandPrice}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter brand price"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    type="submit"
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AddPriceManual;
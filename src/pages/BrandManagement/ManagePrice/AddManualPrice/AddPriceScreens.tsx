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
import { LaborQuantity } from '../../../../models/LaborQuantityModel';
import { BrandLaborQuantity } from '../../../../models/BrandLaborQuantityModel';
import { CancelOutlined } from '@mui/icons-material';
import { __getToken } from '../../../../App';

interface AddPriceWithHandsFormProps {
    closeCard: () => void;
    addNewLaborQuantity: (addedNewCategory: LaborQuantity) => void
}


const AddPriceManual: React.FC<AddPriceWithHandsFormProps> = ({ closeCard, addNewLaborQuantity }) => {

    // ---------------UseState Variable---------------//
    const [formData, setFormData] = useState({
        categoryName: 'Vải',
    });

    const userAuthData = localStorage.getItem('userAuth') as string;

    const userAuth = JSON.parse(userAuthData);

    const { userID, email, fullName, language, phoneNumber, roleName, imageUrl } = userAuth;


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
                    Authorization: `Bearer ${__getToken()}`
                }
            });

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                addNewLaborQuantity(response.data);
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


    const [prices, setPrices] = useState<LaborQuantity[]>([]);

    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_labor_quantity + functionEndpoints.laborQantity.getAllLaborQuantityByBrandID + `/${userID}`}`;

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
                    setPrices(responseData.data);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handlePriceChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newPrices = prices.slice();
        newPrices[index].brandLaborCostPerQuantity = parseFloat(event.target.value);
        setPrices(newPrices);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Prices:', prices);

        const formData = {
            brandLaborQuantity: prices.map(price => ({
                laborQuantityID: price.laborQuantityID,
                brandLaborCostPerQuantity: price.brandLaborCostPerQuantity
            }))
        };

        try {
            console.log('Form Data:', JSON.stringify(formData));

            const response = await axios.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand_labor_quantity + functionEndpoints.brandLaborQuantity.addNewBrandLaborQuantity + `/${userID}`}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response.data.data);

            if (response.data.status === 200) {
                // addNewLaborQuantity(formData);
                closeCard()
                Swal.fire(
                    'Add Success!',
                    'Labor quantity has been added!',
                    'success'
                );
            } else {
                closeCard()
                Swal.fire(
                    'Add Failed!',
                    'Please check the information!',
                    'error'
                );
            }
        } catch (err: any) {
            closeCard()
            Swal.fire(
                'Add Failed!',
                'Please check the information!',
                'error'
            );
        }
    };

    return (
        <div>
            <button
                type="button"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={closeCard}
            >
                <IconButton
                    aria-label="close"
                    onClick={closeCard}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
                >
                    <CancelOutlined sx={{ color: "red" }} />
                </IconButton>
            </button>
            <div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "30px" }}>Quantity</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "20px" }}>Base Price</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "90px" }}>Brand Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((price, index) => (
                            <tr key={price.laborQuantityID} className="odd:bg-gray-50">
                                <td className="border-b py-2 px-4">{price.laborQuantityMinQuantity} - {price.laborQuantityMaxQuantity}</td>
                                <td className="border-b py-2 px-4">{price.laborQuantityMinPrice} - {price.laborQuantityMaxPrice}</td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        value={price.brandLaborCostPerQuantity || ''}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter brand price"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div onClick={closeCard}>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPriceManual;
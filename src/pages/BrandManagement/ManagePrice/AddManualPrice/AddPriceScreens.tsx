import React, { ChangeEvent, useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { LaborQuantity } from '../../../../models/LaborQuantityModel';
import { CancelOutlined } from '@mui/icons-material';
import { __getToken } from '../../../../App';

interface AddPriceWithHandsFormProps {
    closeCard: () => void;
    addNewLaborQuantity: (addedNewCategory: LaborQuantity) => void
}


const AddPriceManual: React.FC<AddPriceWithHandsFormProps> = ({ closeCard, addNewLaborQuantity }) => {

    // ---------------UseState Variable---------------//
    const userAuthData = localStorage.getItem('userAuth') as string;
    const userAuth = JSON.parse(userAuthData);
    const { userID, email, fullName, language, phoneNumber, roleName, imageUrl } = userAuth;

    // ---------------Usable Variable---------------//
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

    const [prices, setPrices] = useState<LaborQuantity[]>([]);

    useEffect(() => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.labor_quantity + functionEndpoints.laborQantity.getAllLaborQuantity}`;

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
                    // Sort the prices array based on the minimum quantity
                    const sortedPrices = responseData.data.sort((a: any, b: any) =>
                        a.laborQuantityMinQuantity - b.laborQuantityMinQuantity
                    );
                    setPrices(sortedPrices);
                    console.log("Data received:", responseData);
                } else {
                    console.error('Invalid data format:', responseData);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Function to format number with commas
    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePriceChange = (laborQuantityID: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numericValue = parseFloat(inputValue);
        if (isNaN(numericValue) || numericValue <= 0) {
            return;
        }
        const newPrices = prices.map(price =>
            price.laborQuantityID === laborQuantityID
                ? { ...price, brandLaborCostPerQuantity: parseFloat(event.target.value) }
                : price
        );
        setPrices(newPrices);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Prices:', prices);

        const formData = {
            brandID: userID,
            brandLaborQuantity: prices
                .filter((price: any) => price.brandLaborCostPerQuantity !== undefined && price.brandLaborCostPerQuantity !== null)
                .map((price: any) => ({
                    laborQuantityID: price.laborQuantityID,
                    brandLaborCostPerQuantity: price.brandLaborCostPerQuantity
                }))
        };

        try {
            console.log('Form Data:', JSON.stringify(formData));

            const response = await axios.post(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.brand_labor_quantity}${functionEndpoints.brandLaborQuantity.addNewBrandLaborQuantity}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${__getToken()}`
                    },
                }
            );

            console.log('Response:', response.data);

            if (response.data.status === 200) {
                closeCard();
                Swal.fire(
                    'Add Success!',
                    'Labor quantity has been added!',
                    'success'
                );
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (err: any) {
            console.error('Error:', err);
            closeCard();

            let errorMessage = 'An error occurred. Please try again.';

            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                if (errors.length > 0) {
                    errorMessage = errors.map((error: any) => {
                        let msg = '';
                        if (error.errorMessage) {
                            msg = error.errorMessage.map((m: string) => {
                                if (m.includes("Brand Labor Cost must be between Min Price and Max Price")) {
                                    return "Brand Labor Cost must be between Min Price and Max Price";
                                } else if (m.includes("Brand Labor Quantity is existed")) {
                                    return "Brand Labor Quantity is existed";
                                }
                                return m;
                            }).join('<br>');
                        }
                        if (error.errorData) {
                            msg += `<br>Error Data:<br>`;
                            msg += `Labor Quantity ID: ${error.errorData.laborQuantityID}<br>`;
                            msg += `Brand Labor Cost Per Quantity: ${error.errorData.brandLaborCostPerQuantity}`;
                        }
                        return msg;
                    }).join('<br><br>');
                }
            }

            Swal.fire({
                title: 'Add Failed!',
                html: errorMessage,
                icon: 'error'
            });
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
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "20px" }}>Base Price (VND)</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "90px" }}>Brand Price (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((price, index) => (
                            <tr key={price.laborQuantityID} className="odd:bg-gray-50">
                                <td className="border-b py-2 px-4">
                                    {price.laborQuantityMinQuantity} - {price.laborQuantityMaxQuantity}
                                </td>
                                <td className="border-b py-2 px-4">
                                    {formatNumber(price.laborQuantityMinPrice)} - {formatNumber(price.laborQuantityMaxPrice)}
                                </td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        value={price.brandLaborCostPerQuantity || ''}
                                        onChange={(event) => handlePriceChange(price.laborQuantityID, event)}
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
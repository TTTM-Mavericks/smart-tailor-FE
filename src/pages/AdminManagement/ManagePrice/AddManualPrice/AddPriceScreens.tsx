import React, { ChangeEvent, useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { EditLaborQuantity } from '../../../../models/LaborQuantityModel';

interface AddLaborQuantityWithHandsFormProps {
    closeCard: () => void;
    addNewLaborQuantity: (addedNewCategory: EditLaborQuantity[]) => void;
}

const AddPriceManual: React.FC<AddLaborQuantityWithHandsFormProps> = ({ closeCard, addNewLaborQuantity }) => {
    const [prices, setPrices] = useState<EditLaborQuantity[]>([
        { laborQuantityMinQuantity: 1, laborQuantityMaxQuantity: 10, laborQuantityMinPrice: 140, laborQuantityMaxPrice: 160 },
        { laborQuantityMinQuantity: 11, laborQuantityMaxQuantity: 20, laborQuantityMinPrice: 160, laborQuantityMaxPrice: 180 }
    ]);

    const handlePriceChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPrices(prevPrices => {
            const newPrices = [...prevPrices];
            (newPrices[index] as any)[name] = value;
            return newPrices;
        });
    };

    const addNewPriceRow = () => {
        setPrices([...prices, { laborQuantityMinQuantity: 0, laborQuantityMaxQuantity: 0, laborQuantityMinPrice: 0, laborQuantityMaxPrice: 0 }]);
    };

    const removePriceRow = (index: number) => {
        setPrices(prevPrices => prevPrices.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.labor_quantity + functionEndpoints.laborQantity.addNewLaborQuantity}`;
        try {
            const response = await axios.post(apiUrl, { laborQuantityRequests: prices });

            if (response.data.status === 200) {
                Swal.fire(
                    'Add Success!',
                    'Labor quantity has been added!',
                    'success'
                );
                addNewLaborQuantity(prices);
            } else {
                Swal.fire(
                    'Add Labor Quantity Failed!',
                    'Please check the information!',
                    'error'
                ).then(() => {
                    closeCard();
                });
            }
        } catch (err: any) {
            console.error('Error:', err);
            Swal.fire(
                'Add Labor Quantity Failed!',
                'Please check the information!',
                'error'
            ).then(() => {
                closeCard();
            });
        }
    };

    return (
        <div>
            <IconButton
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={closeCard}
            >
                <CloseIcon />
            </IconButton>
            <div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 font-semibold">Min Quantity</th>
                            <th className="border-b py-2 font-semibold">Max Quantity</th>
                            <th className="border-b py-2 font-semibold">Min Price</th>
                            <th className="border-b py-2 font-semibold">Max Price</th>
                            <th className="border-b py-2 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((price, index) => (
                            <tr key={index} className="odd:bg-gray-50">
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        name="laborQuantityMinQuantity"
                                        value={price.laborQuantityMinQuantity}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter Min Quantity"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        name="laborQuantityMaxQuantity"
                                        value={price.laborQuantityMaxQuantity}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter Max Quantity"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        name="laborQuantityMinPrice"
                                        value={price.laborQuantityMinPrice}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter Min Price"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b py-2 px-4">
                                    <input
                                        type="number"
                                        name="laborQuantityMaxPrice"
                                        value={price.laborQuantityMaxPrice}
                                        onChange={(event) => handlePriceChange(index, event)}
                                        placeholder="Enter Max Price"
                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b py-2 px-4">
                                    <button
                                        type="button"
                                        onClick={() => removePriceRow(index)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: "flex" }}>
                    <button
                        type="button"
                        onClick={addNewPriceRow}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Add More
                    </button>
                    <div onClick={closeCard}>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="mt-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPriceManual;

import React, { ChangeEvent, useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { EditLaborQuantity } from '../../../../models/LaborQuantityModel';
import { AddCircleOutline, CancelOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { primaryColor } from '../../../../root/ColorSystem';

interface AddLaborQuantityWithHandsFormProps {
    closeCard: () => void;
    addNewLaborQuantity: (addedNewCategory: EditLaborQuantity[]) => void;
}

const AddPriceManual: React.FC<AddLaborQuantityWithHandsFormProps> = ({ closeCard, addNewLaborQuantity }) => {
    const [prices, setPrices] = useState<EditLaborQuantity[]>([
        { laborQuantityMinQuantity: 1, laborQuantityMaxQuantity: 10, laborQuantityMinPrice: 140, laborQuantityMaxPrice: 160, laborCostPerQuantity: 0 },
        { laborQuantityMinQuantity: 11, laborQuantityMaxQuantity: 20, laborQuantityMinPrice: 160, laborQuantityMaxPrice: 180, laborCostPerQuantity: 0 }
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
        setPrices([...prices, { laborQuantityMinQuantity: 0, laborQuantityMaxQuantity: 0, laborQuantityMinPrice: 0, laborQuantityMaxPrice: 0, laborCostPerQuantity: 0 }]);
    };

    const removePriceRow = (index: number) => {
        setPrices(prevPrices => prevPrices.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.labor_quantity + functionEndpoints.laborQantity.addNewLaborQuantity}`;
        try {
            const response = await axios.post(apiUrl, { laborQuantityRequests: prices });
            if (response.data.status === 200) {
                closeCard();
                Swal.fire(
                    'Add Success!',
                    'Labor quantity has been added!',
                    'success'
                );
                addNewLaborQuantity(prices);
            } else {
                closeCard();
                Swal.fire(
                    'Add Labor Quantity Failed!',
                    'Please check the information!',
                    'error'
                )
            }
        } catch (err: any) {
            closeCard();
            Swal.fire(
                'Add Labor Quantity Failed!',
                'Please check the information!',
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Price</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "30px" }}>Min Quantity</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "30px" }}>Max Quantity</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "30px" }}>Min Price</th>
                            <th className="border-b py-2 font-semibold" style={{ paddingLeft: "30px" }}>Max Price</th>
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
                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                    >
                                        <RemoveCircleOutline />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <button
                    type="button"
                    onClick={addNewPriceRow}
                    className="flex items-center space-x-1 text-orange-600 hover:text-orange-600 transition-colors duration-200"
                >
                    <AddCircleOutline />
                    <span>Add Labor Quantity</span>
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    style={{ backgroundColor: `${primaryColor}` }}
                    className="text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddPriceManual;

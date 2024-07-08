import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { AddSize } from '../../../../models/AdminManageSizeModel';

interface AddSizeManualProps {
    closeCard: () => void;
    addNewSizes: (addedNewSizes: AddSize[]) => void;
}

const AddSizeManual: React.FC<AddSizeManualProps> = ({ closeCard, addNewSizes }) => {
    // ---------------UseState Variable---------------//
    const [sizes, setSizes] = useState<AddSize[]>([
        { sizeName: "M" },
        { sizeName: "S" }
    ]);

    // ---------------FunctionHandler---------------//
    /**
     * 
     * @param index 
     * @param event 
     */
    const _handleSizeChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSizes(prevSizes => {
            const newSizes = [...prevSizes];
            newSizes[index] = { ...newSizes[index], sizeName: value };
            return newSizes;
        });
    };

    /**
     * Add More Size
     */
    const _handleAddSize = () => {
        setSizes([...sizes, { sizeName: '' }]);
    };

    /**
     * Remove Size
     * @param index 
     */
    const _handleRemoveSize = (index: number) => {
        setSizes(prevSizes => prevSizes.filter((_, i) => i !== index));
    };

    /**
     * Submit
     * @returns 
     */
    const _handleSubmit = async () => {
        if (sizes.length === 0) {
            Swal.fire(
                'Validation Error',
                'Please add at least one size.',
                'warning'
            );
            return;
        }

        const apiUrl = `${baseURL + versionEndpoints.v1 + featuresEndpoints.size + functionEndpoints.size.addNewSize}`;

        try {
            const response = await axios.post(apiUrl, { sizeRequestList: sizes });

            if (response.data.status === 200) {
                Swal.fire(
                    'Add Success!',
                    'Size has been added!',
                    'success'
                );
                addNewSizes(sizes); // Pass new sizes here
            } else {
                Swal.fire(
                    'Add Size Failed!',
                    'Please check the information!',
                    'error'
                ).then(() => {
                    closeCard();
                });
            }
        } catch (err: any) {
            console.error('Error:', err);
            Swal.fire(
                'Add Failed!',
                `${err.message || 'Unknown error'}`,
                'error'
            ).then(() => {
                closeCard();
            });
        }
    };

    return (
        <div className="h-52 overflow-y-auto overflow-x-hidden scrollbar-none relative p-4 bg-white shadow-md rounded-md">
            <button
                type="button"
                className="absolute top-0 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeCard}
            >
                <CloseIcon />
            </button>
            {sizes.map((size, index) => (
                <div key={index} className="mb-4 flex items-center">
                    <div className="flex-1">
                        <label htmlFor={`size-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Size {index + 1}:
                        </label>
                        <input
                            type="text"
                            name='sizeName'
                            value={size.sizeName}
                            onChange={(event) => _handleSizeChange(index, event)}
                            placeholder="Enter size (e.g., S, M, L)"
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => _handleRemoveSize(index)}
                        className="ml-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={_handleAddSize}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Size
                </button>
                <div onClick={closeCard}>
                    <button
                        type="button"
                        onClick={_handleSubmit}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSizeManual;

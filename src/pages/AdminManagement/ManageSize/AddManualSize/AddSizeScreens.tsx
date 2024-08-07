import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { AddSize } from '../../../../models/AdminManageSizeModel';
import { AddCircleOutline, CancelOutlined, RemoveCircleOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { primaryColor } from '../../../../root/ColorSystem';

interface AddSizeManualProps {
    closeCard: () => void;
    addNewSizes: (addedNewSizes: AddSize[]) => void;
}

const AddSizeManual: React.FC<AddSizeManualProps> = ({ closeCard, addNewSizes }) => {
    // ---------------UseState Variable---------------//
    const [sizes, setSizes] = useState<AddSize[]>([
        { sizeName: "S" },
        { sizeName: "M" },
        { sizeName: "L" },
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
                closeCard();
                Swal.fire(
                    'Add Size Success!',
                    'Size has been added!',
                    'success'
                );
                addNewSizes(sizes); // Pass new sizes here
            } else {
                closeCard();
                Swal.fire(
                    'Add Size Failed!',
                    'Please check the information!',
                    'error'
                )
            }
        } catch (err: any) {
            closeCard();
            Swal.fire(
                'Add Size Failed!',
                'Please check the information!',
                'error'
            )
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Sizes</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={size.sizeName}
                                onChange={(event) => _handleSizeChange(index, event)}
                                placeholder="Enter size (e.g., S, M, L)"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => _handleRemoveSize(index)}
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
                    onClick={_handleAddSize}
                    className="flex items-center space-x-1 text-orange-600 hover:text-orange-600 transition-colors duration-200"
                >
                    <AddCircleOutline />
                    <span>Add Size</span>
                </button>
                <button
                    type="button"
                    onClick={_handleSubmit}
                    style={{ backgroundColor: `${primaryColor}` }}
                    className="text-white py-2 px-4 rounded-md hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddSizeManual;

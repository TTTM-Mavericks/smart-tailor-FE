import React, { useEffect, useState } from 'react';
import { FaSave, FaCog, FaInfoCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import axios from 'axios';
import { baseURL, versionEndpoints, featuresEndpoints, functionEndpoints } from '../../../../api/ApiConfig';
import { UserInterface } from '../../../../models/UserModel';
import Cookies from 'js-cookie';
import { __getToken } from '../../../../App';

const BrandManagePropertyComponent = () => {
    const [brandProperty, setBrandProperty] = useState({
        brandPropertyID: '',
        brand: {
            brandID: '',
        },
        systemProperty: {
            propertyID: '',
            propertyName: '',
            propertyUnit: '',
            propertyDetail: '',
            propertyType: '',
            propertyValue: '',
            propertyStatus: true,
        },
        brandPropertyValue: '',
        brandPropertyStatus: true,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchBrandProductivity();
    }, []);

    const userStorage = Cookies.get('userAuth');
    if (!userStorage) {
        return null;
    }

    const userParse: UserInterface = JSON.parse(userStorage);

    const fetchBrandProductivity = async () => {
        try {
            const brandID = userParse.userID;
            const response = await axios.get(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.brandPropertise}${functionEndpoints.brandProperties.getBrandByProductiveByBrandID}/${brandID}`,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`,
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data.data;
                console.log("data " + JSON.stringify(data));

                setBrandProperty({
                    brandPropertyID: data.brandPropertyID || '',
                    brand: {
                        brandID: data.brand.brandID || '',
                    },
                    systemProperty: {
                        propertyID: data.systemProperty.propertyID || '',
                        propertyName: data.systemProperty.propertyName || '',
                        propertyUnit: data.systemProperty.propertyUnit || '',
                        propertyDetail: data.systemProperty.propertyDetail || '',
                        propertyType: data.systemProperty.propertyType || '',
                        propertyValue: data.systemProperty.propertyValue || '',
                        propertyStatus: data.systemProperty.propertyStatus ?? true,
                    },
                    brandPropertyValue: data.brandPropertyValue || '',
                    brandPropertyStatus: data.brandPropertyStatus ?? true,
                });
            }
        } catch (error: any) {
            console.error('Error fetching brand productivity:', error.message);
            console.error('Error details:', error.response?.data || error);
            toast.error('Failed to fetch brand productivity');
        }
    };

    const handleInputChange = (value: string) => {
        // Convert the input to a number
        const numValue = parseFloat(value);

        // Check if the input is a valid number and non-negative
        if (!isNaN(numValue) && numValue >= 1) {
            setBrandProperty(prevState => ({
                ...prevState,
                brandPropertyValue: value
            }));
        } else if (value === '') {
            // Allow empty input
            setBrandProperty(prevState => ({
                ...prevState,
                brandPropertyValue: ''
            }));
        }
        // If the input is invalid (negative or not a number), we don't update the state
    };

    const handleSave = async () => {
        try {
            const payload = {
                brandID: brandProperty.brand.brandID,
                systemPropertyID: brandProperty.systemProperty.propertyID,
                brandPropertyValue: brandProperty.brandPropertyValue,
                brandPropertyStatus: brandProperty.brandPropertyStatus
            };
            console.log(JSON.stringify(payload) + "bebe payload");

            const response = await axios.put(
                `${baseURL}${versionEndpoints.v1}${featuresEndpoints.brandPropertise}${functionEndpoints.brandProperties.updateBrandProperty}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${__getToken()}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Brand productivity updated successfully!', { autoClose: 2000 });
            }
        } catch (error) {
            console.error('Error updating brand productivity', error);
            toast.error('Failed to update brand productivity');
        }
    };

    const handleDescriptionClick = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div >
            <ToastContainer />
            <div className="flex items-center mb-8 px-4 py-5 sm:p-6">
                <FaCog className="text-3xl text-orange-500 mr-4" />
                <h4 className="font-bold text-gray-800">Brand Productivity Configuration</h4>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 transition duration-300 ease-in-out transform -mt-12">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-700" style={{ fontSize: "small" }}>
                            {brandProperty.systemProperty.propertyName}
                        </p>
                        <Tooltip title="View Description" arrow>
                            <span
                                onClick={handleDescriptionClick}
                                className="text-orange-500 cursor-pointer hover:text-orange-600 transition-colors duration-200"
                            >
                                <FaInfoCircle size={20} />
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="0"
                            step="any"
                            className="flex-grow p-3 border-2 border-gray-300 rounded-l-md focus:outline-none focus:border-orange-500 transition-colors duration-200"
                            value={brandProperty.brandPropertyValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder={`Enter value in ${brandProperty.systemProperty.propertyUnit}`}
                        />
                        <span className="bg-gray-100 text-gray-700 px-4 py-3 rounded-r-md border-2 border-l-0 border-gray-300">
                            {brandProperty.systemProperty.propertyUnit}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center"
                    >
                        <FaSave className="mr-2" />
                        Save Configuration
                    </button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <span className="text-xl font-semibold text-gray-800">Property Detail</span>
                </DialogTitle>
                <DialogContent>
                    <p className="text-gray-600 mt-2">{brandProperty.systemProperty.propertyDetail}</p>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BrandManagePropertyComponent;
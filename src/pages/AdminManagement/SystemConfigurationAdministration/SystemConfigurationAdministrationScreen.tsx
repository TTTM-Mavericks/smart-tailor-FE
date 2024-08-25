import React, { useEffect, useState } from 'react';
import { FaSave, FaCog, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SystemPropertyInterface } from '../../../models/UltilModel';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { redColor } from '../../../root/ColorSystem';
import { IoMdCloseCircleOutline } from 'react-icons/io';

const AdminConfiguration = () => {
    const [properties, setProperties] = useState<SystemPropertyInterface[]>([]);
    const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [newProperty, setNewProperty] = useState<SystemPropertyInterface>({
        propertyID: '',
        propertyName: '',
        propertyUnit: '',
        propertyDetail: '',
        propertyType: '',
        propertyValue: '',
        propertyStatus: true,
    });

    useEffect(() => {
        fetchPropertiesDetails();
    }, []);


    const fetchPropertiesDetails = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.systemPropertise + functionEndpoints.systemPropertise.getAllSystemPropertise}`);
            if (response.status === 200) {
                setProperties(response.data);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    const validateValue = (value: string, unit: string) => {
        // Regex to check for special characters (excluding spaces and common punctuation)
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/;

        // Check for special characters
        if (specialCharRegex.test(value)) {
            return false;
        }

        // Check for negative numbers
        if (value.startsWith('-')) {
            return false;
        }

        // Existing unit-specific validations
        if (unit === "number" || unit === "integer") {
            return /^\d+$/.test(value) || value === "";
        }
        if (unit === "float") {
            return /^\d*\.?\d+$/.test(value) || value === "";
        }

        // If no specific validation, return true
        return true;
    };

    const handleInputChange = (index: number, value: string) => {
        const property = properties[index];
        const isValid = validateValue(value, property.propertyUnit);

        if (isValid) {
            setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
            setProperties(prevState =>
                prevState.map((property, i) =>
                    i === index ? { ...property, propertyValue: value } : property
                )
            );
        } else {
            setErrors(prevErrors => {
                const newErrors = [...prevErrors];
                newErrors[index] = `Invalid value for ${property.propertyName}. No special characters or negative numbers allowed.`;
                return newErrors;
            });
        }
    };

    const validateDialogInput = (value: string) => {
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/;
        return !specialCharRegex.test(value) && !value.startsWith('-');
    };

    const handleSave = async () => {
        const updatedProperties = properties.filter(property => property.propertyValue !== "");
        try {
            const response = await api.put(`${versionEndpoints.v1 + featuresEndpoints.systemPropertise + functionEndpoints.systemPropertise.updateSystemPropertise}`, updatedProperties);
            if (response.status === 200) {
                toast.success('Configuration has been saved successfully!', { autoClose: 2000 });
                // Update the state only for the properties that have changed
                const updatedState = properties.map(property => {
                    const updatedProperty = updatedProperties.find(up => up.propertyID === property.propertyID);
                    return updatedProperty ? { ...property, propertyValue: updatedProperty.propertyValue } : property;
                });
                setProperties(updatedState);
            }
        } catch (error: any) {
            console.error('Error updating data', error);
            toast.error(`Error: ${error.message}`, { autoClose: 2000 });
        }
    };

    const handleAddProperty = async () => {
        try {
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.systemPropertise + functionEndpoints.systemPropertise.addSystemPropertise}`, newProperty);
            if (response.status === 200) {
                toast.success('New property added successfully!', { autoClose: 2000 });
                setProperties(prevState => [...prevState, response.data]); // Add the new property to the state
                setNewProperty({
                    propertyID: '',
                    propertyName: '',
                    propertyUnit: '',
                    propertyDetail: '',
                    propertyType: '',
                    propertyValue: '',
                    propertyStatus: true,
                }); // Reset the new property state
                setIsDialogAddOpen(false); // Close the dialog
            }
        } catch (error: any) {
            console.error('Error adding property', error);
            toast.error(`Error: ${error.message}`, { autoClose: 2000 });
        }
    };

    const handleDescriptionClick = (propertyDetail: string) => {
        setSelectedPropertyDetail(propertyDetail);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsDialogAddOpen(false)
        setSelectedPropertyDetail(null);
    };

    const handleDialogChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (validateDialogInput(value)) {
            setNewProperty(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            // You might want to show an error message here
            toast.error('Invalid input. No special characters or negative numbers allowed.', { autoClose: 2000 });
        }
    };

    return (
        <div className='-mt-8'>
            <ToastContainer />
            <div className="flex items-center mb-8">
                <FaCog className="text-3xl text-blue-600 mr-4" style={{ color: "#E96208" }} />
                <h2 className="text-3xl font-bold text-gray-800">System Configuration</h2>
            </div>
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-2 gap-4">
                        {properties.map((property, index) => (
                            <div key={property.propertyID} className="flex flex-col mb-5">
                                <div className="flex justify-between" style={{ width: '500px' }}>
                                    <label className="text-sm font-medium text-gray-700" style={{ fontSize: 12 }}>
                                        {property.propertyName} ({property.propertyUnit})
                                    </label>
                                    <span
                                        onClick={() => handleDescriptionClick(property.propertyDetail)}
                                        className="text-sm text-blue-600 cursor-pointer"
                                        style={{ fontSize: 12 }}
                                    >
                                        Description
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className={`mt-1 p-2 border rounded-md focus:border-orange-600 ${errors[index] ? 'border-red-600' : 'border-gray-300'}`}
                                    value={property.propertyValue}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    style={{ width: '500px' }}
                                />
                                {errors[index] && (
                                    <p className="text-red-600 text-xs mt-1">Invalid value</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                        >
                            Save Configuration
                        </button>
                        <button
                            onClick={() => setIsDialogAddOpen(true)}
                            className="mt-6 ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        >
                            <FaPlus className="mr-2" /> Add Property
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle><span style={{ fontSize: 16 }}>Property Detail</span></DialogTitle>
                <DialogContent>
                    <p style={{ fontSize: 13 }}>{selectedPropertyDetail}</p>
                </DialogContent>
            </Dialog>

            <Dialog open={isDialogAddOpen} onClose={handleCloseDialog}>
                <DialogTitle>Add New Property</DialogTitle>
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={handleCloseDialog}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
                <DialogContent>
                    <div className="flex justify-center items-center p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyName"
                                value={newProperty.propertyName}
                                onChange={handleDialogChange}
                                placeholder='Property Name'
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyUnit"
                                value={newProperty.propertyUnit}
                                onChange={handleDialogChange}
                                placeholder='Property Unit'
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyDetail"
                                value={newProperty.propertyDetail}
                                onChange={handleDialogChange}
                                placeholder='Property Detail'
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyType"
                                value={newProperty.propertyType}
                                onChange={handleDialogChange}
                                placeholder='Property Type'
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyValue"
                                value={newProperty.propertyValue}
                                onChange={handleDialogChange}
                                placeholder='Property Value'
                            />
                            <input
                                type="text"
                                className="p-2 border rounded-md focus:border-orange-600"
                                name="propertyStatus"
                                value={newProperty.propertyStatus.toString()}
                                onChange={handleDialogChange}
                                placeholder='Property Status'
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">

                        <Button onClick={handleAddProperty} variant="contained" color="primary">
                            Add
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminConfiguration;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import axios from 'axios';
import style from './BrandProductivityInputDialogStyle.module.scss';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { primaryColor } from '../../../../../root/ColorSystem';
import { toast } from 'react-toastify';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    brandID?: string;
};

const BrandProductivityInputDialog: React.FC<Props> = ({ isOpen, onClose, brandID }) => {
    const [productivity, setProductivity] = useState<number | string>('');
    const [propertyID, setPropertyID] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.systemPropertise + functionEndpoints.systemPropertise.getAllSystemPropertise}`);
                if (response.status === 200) {
                    const properties = response.data;
                    const productivityProperty = properties.find((property: any) => property.propertyName === 'BRAND_PRODUCTIVITY');
                    if (productivityProperty) {
                        setPropertyID(productivityProperty.propertyID);
                    } else {
                        setError('No BRAND_PRODUCTIVITY property found.');
                    }
                }
            } catch (error) {
                setError('Failed to fetch system properties.');
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!propertyID) {
            setError('No BRAND_PRODUCTIVITY property ID set.');
            return;
        }

        try {
            const bodyRequest = {
                brandID: brandID,
                systemPropertyID: propertyID,
                brandPropertyValue: productivity,
                brandPropertyStatus: true,
            }

            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.brandPropertise + functionEndpoints.brandPropertise.addNewBrandPropertise}`, bodyRequest);
            if (response.status === 200) {
                toast.success(`${response.message}`, { autoClose: 4000 });
            } else {
                toast.error(`${response.message}`, {autoClose: 4000});

            }
            console.log(bodyRequest);
            setError('');
            if (onClose) onClose();
        } catch (error) {
            setError('Failed to add new brand property.');
            toast.error(`${error}`, {autoClose: 4000});

        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="dialog-title">
                Productivity
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color="red"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
            <DialogContent dividers className={`${style.dialogContent} bg-gray-100`}>
                <div className="p-4 bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Brand #{brandID}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div className={` mb-5 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 ml-2`}>
                                <span>
                                    Please enter the correct productivity of your manufacturing facility so that we can estimate the dates and avoid unwanted delays.
                                </span>
                            </div>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={productivity}
                                onChange={(e) => setProductivity(e.target.value)}
                                placeholder="Enter number of products per day..."
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}

                        <DialogActions>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white"
                                style={{
                                    borderRadius: 4,
                                    color: 'white',
                                    backgroundColor: primaryColor,
                                }}
                            >
                                Submit
                            </button>
                        </DialogActions>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BrandProductivityInputDialog;

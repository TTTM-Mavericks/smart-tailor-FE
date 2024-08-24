import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { UserInterface } from '../../../models/UserModel';
import Cookies from 'js-cookie';
import { __handlegetRatingStyle } from '../../../utils/ElementUtils';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { borderBottom, borderTop } from '@mui/system';

const BrandProfileSetup = () => {
    const [brandInfo, setBrandInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        const fetchBrandInfo = async () => {
            const userStorage = Cookies.get('userAuth');
            if (!userStorage) {
                setError('User authentication not found');
                setLoading(false);
                return;
            }

            const userParse: UserInterface = JSON.parse(userStorage);

            try {
                const response = await axios.get(`${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.getBrandInformationByBrandID + `/${userParse.userID}`}`);
                console.log('API Response:', response.data);
                setBrandInfo(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brand information:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Response data:', error.response?.data);
                    console.error('Response status:', error.response?.status);
                    setError(`Error: ${error.response?.status} - ${error.response?.data?.message || 'Unknown error'}`);
                } else {
                    setError('An unexpected error occurred');
                }
                setLoading(false);
            }
        };

        fetchBrandInfo();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!brandInfo || !brandInfo.user) {
        return <div className="flex justify-center items-center h-screen">No brand information available.</div>;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500">
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleDialogOpen}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                        View Policy
                    </button>
                </div>


                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img
                            className="h-48 w-full object-cover md:w-48 rounded-t-xl md:rounded-none md:rounded-l-xl"
                            src={brandInfo.user.imageUrl}
                            alt={brandInfo.brandName}
                        />
                    </div>
                    <div className="p-8">
                        <div className="flex items-center space-x-2">
                            <p
                                className={`${__handlegetRatingStyle(brandInfo.rating)} text-xl font-bold text-gray-900`}
                            >
                                {brandInfo.brandName}
                            </p>
                        </div>
                        <p className="mt-2 text-gray-700 text-lg">{brandInfo.user.fullName}</p>
                        <p className="mt-2 text-gray-500">{brandInfo.user.email}</p>
                        <p className="mt-2 text-gray-500">{brandInfo.user.phoneNumber}</p>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Brand Details</h3>
                            <p className="mt-2 text-gray-600">
                                Status: <span className="font-medium">{brandInfo.brandStatus}</span>
                            </p>
                            <p className="mt-2 text-gray-600">
                                Rating:{" "}
                                <span className="font-medium">
                                    {brandInfo.rating.toFixed(1)} ({brandInfo.numberOfRatings} ratings)
                                </span>
                            </p>
                            <p className="mt-2 text-gray-600">
                                Created:{" "}
                                <span className="font-medium">
                                    {new Date(brandInfo.createDate).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Bank Information</h3>
                            <p className="mt-2 text-gray-600">
                                Bank: <span className="font-medium">{brandInfo.bankName}</span>
                            </p>
                            <p className="mt-2 text-gray-600">
                                Account: <span className="font-medium">{brandInfo.accountNumber}</span>
                            </p>
                            <p className="mt-2 text-gray-600">
                                Name: <span className="font-medium">{brandInfo.accountName}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="mt-2 text-gray-600">{brandInfo.address}</p>
                    <p className="mt-1 text-gray-600">
                        {brandInfo.ward}, {brandInfo.district}, {brandInfo.province}
                    </p>
                </div>

                {brandInfo.qr_Payment && (
                    <div className="px-8 py-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">QR Payment</h3>
                        <img
                            src={brandInfo.qr_Payment}
                            alt="QR Payment"
                            className="mt-4 max-w-xs mx-auto rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>

            {isDialogOpen && (
                <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>
                        Order Cancellation Policy for Brands
                        <IoMdCloseCircleOutline
                            cursor={'pointer'}
                            size={20}
                            color="red"
                            onClick={handleDialogClose}
                            style={{ position: 'absolute', right: 20, top: 20 }}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                            <strong>Right to Cancel Orders:</strong><br />
                            <li>Brands have the right to cancel orders during the customer matching period without incurring a penalty. The matching period is defined as 2 hours from the time a suitable brand is found based on the customer’s request.
                            </li>
                            <li>If a brand cancels an order after the matching period but before production has begun, no penalty fee will be applied. However, the brand’s rating will still be reduced.
                            </li>
                        </Typography>
                        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                            <strong> Cancellation After Production Has Started:
                            </strong><br />
                            <li>If production has started and the brand decides to cancel the order, the brand will be penalized with a fee equivalent to the total value of the order.
                            </li>
                        </Typography>
                        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                            <strong>Rating Reduction:
                            </strong><br />
                            <li>Each time a brand cancels an order, its rating will be reduced. A lower rating decreases the likelihood of the brand receiving future orders from customers.
                            </li>
                            <li>The rating reduction will be applied immediately upon order cancellation and cannot be reversed.
                            </li>
                        </Typography>
                        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                            <strong>Upload Process</strong><br />
                            <li>Step 1: Select the file containing the brand information from your device.</li>
                            <li>Step 2: Ensure the file meets the format and data requirements specified above.</li>
                            <li>Step 3: Click the 'Upload' button to submit the brand information.</li>
                            <li>Step 4: The system will validate the data. If errors are detected, you will be prompted to correct them before finalizing the upload.</li>
                        </Typography>
                        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                            <strong>Important Notes:
                            </strong><br />
                            <li>Brands should carefully consider before canceling an order to avoid penalties and rating reductions. Maintaining a high reputation and reliability is crucial for brands to continue receiving orders from customers.</li>
                            <li>The system will automatically record and apply these policies whenever an order is canceled. Brands should monitor their ratings and cancellation history on their management dashboard.
                            </li>
                        </Typography>
                        <Typography variant="body1" style={{ marginBottom: '1rem', borderTop: "1px solid black", marginTop: "2rem" }}>
                        </Typography>
                        <Typography variant="body1" >
                            <strong style={{ textAlign: "center" }}>We hope this policy helps brands understand their rights and responsibilities when participating in the system. If you have any questions, please contact our support team for assistance.</strong><br />
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default BrandProfileSetup;
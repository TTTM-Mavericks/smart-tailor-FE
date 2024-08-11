import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { UserInterface } from '../../../models/UserModel';
import Cookies from 'js-cookie';

const BrandProfileSetup = () => {
    const [brandInfo, setBrandInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={brandInfo.user.imageUrl} alt={brandInfo.brandName} />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{brandInfo.brandName}</div>
                        <p className="mt-2 text-gray-500">{brandInfo.user.fullName}</p>
                        <p className="mt-2 text-gray-500">{brandInfo.user.email}</p>
                        <p className="mt-2 text-gray-500">{brandInfo.user.phoneNumber}</p>
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Brand Details</h3>
                            <p className="mt-2 text-gray-600">Status: <span className="font-medium">{brandInfo.brandStatus}</span></p>
                            <p className="mt-2 text-gray-600">Rating: <span className="font-medium">{brandInfo.rating.toFixed(1)} ({brandInfo.numberOfRatings} ratings)</span></p>
                            <p className="mt-2 text-gray-600">Created: <span className="font-medium">{new Date(brandInfo.createDate).toLocaleDateString()}</span></p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Bank Information</h3>
                            <p className="mt-2 text-gray-600">Bank: <span className="font-medium">{brandInfo.bankName}</span></p>
                            <p className="mt-2 text-gray-600">Account: <span className="font-medium">{brandInfo.accountNumber}</span></p>
                            <p className="mt-2 text-gray-600">Name: <span className="font-medium">{brandInfo.accountName}</span></p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="mt-2 text-gray-600">{brandInfo.address}</p>
                    <p className="mt-1 text-gray-600">{brandInfo.ward}, {brandInfo.district}, {brandInfo.province}</p>
                </div>

                {brandInfo.qr_Payment && (
                    <div className="px-8 py-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">QR Payment</h3>
                        <img src={brandInfo.qr_Payment} alt="QR Payment" className="mt-4 max-w-xs mx-auto" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandProfileSetup;
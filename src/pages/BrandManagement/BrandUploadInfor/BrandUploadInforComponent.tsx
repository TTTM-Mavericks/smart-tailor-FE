import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VNLocationData from '../../../locationData.json';
import { Location, District, Ward } from '../../../models/BrandUploadInforModel';
import { Bank, FormData } from '../../../models/BrandUploadInforModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import Cookies from 'js-cookie';

const UploadBrandInforForm: React.FC = () => {
    const { brandID } = useParams<{ brandID: string }>();

    // ---------------UseState Variables---------------//
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

    const userAuthData = localStorage.getItem('userAuth') as string;

    const userAuth = JSON.parse(userAuthData);
    const { userID, email, fullName, language, phoneNumber, roleName, imageUrl } = userAuth;
    const [formData, setFormData] = useState<FormData>({
        brandName: '',
        bankName: '',
        accountNumber: 34561662002,
        accountName: '',
        address: '',
    });

    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    // ---------------Fetch Location Data---------------//
    useEffect(() => {
        if (VNLocationData) {
            setLocations(VNLocationData);
        } else {
            console.error("Không tìm thấy dữ liệu địa chỉ");
        }
    }, []);

    // ---------------Fetch Banks Data---------------//
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await axios.get('https://api.vietqr.io/v2/banks');
                setBanks(response.data.data);
            } catch (error) {
                console.error('Error fetching banks', error);
                setBanks([]); // Reset to an empty array on error
            }
        };

        fetchBanks();
    }, []);

    // ---------------Fetch Account Name---------------//
    const fetchAccountName = async () => {
        try {
            const response = await axios.post(
                'https://api.vietqr.io/v2/lookup',
                {
                    bin: selectedBank?.bin,
                    accountNumber: formData.accountNumber,
                },
                {
                    headers: {
                        'x-client-id': '51e5b5d8-f54c-4575-a462-37f8d26c8d17',
                        'x-api-key': 'b72be516-8258-4585-af44-a9878acc0237',
                    },
                }
            );

            // Log the entire response object to inspect its structure
            console.log("Full response data:", response.data);

            // Access the nested accountName
            const accountName = response.data.data.accountName;
            console.log("Response accountName:", accountName);

            setFormData({
                ...formData,
                accountName: accountName,
            });

        } catch (error) {
            console.error('Error fetching account name', error);

            // Log the error response to understand the issue
            if (error) {
                console.error('Error response data:', error);
            }
        }
    };

    // ---------------Event Handlers---------------//
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bank = banks.find(b => b.bin === e.target.value);
        setSelectedBank(bank || null);
        setFormData({
            ...formData,
            bankName: bank?.shortName || '',
        });
    };

    const _handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find(location => location.Name === provinceName);
        setSelectedProvince(selectedProvince || null);
        setSelectedDistrict(null);
        setSelectedWard(null);

        setFormData(prevFormData => ({
            ...prevFormData,
            address: `${provinceName}`,
        }));
    };

    const _handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince?.Districts.find(district => district.Name === districtName);
        setSelectedDistrict(selectedDistrict || null);
        setSelectedWard(null);

        setFormData(prevFormData => ({
            ...prevFormData,
            address: `${selectedProvince?.Name || ''}, ${districtName}`,
        }));
    };

    const _handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = event.target.value;
        if (selectedDistrict) {
            const selectedWard = selectedDistrict.Wards.find(ward => ward.Name === wardName);
            setSelectedWard(selectedWard || null);

            setFormData(prevFormData => ({
                ...prevFormData,
                address: `${selectedProvince?.Name || ''}, ${selectedDistrict?.Name || ''}, ${wardName}`,
            }));
        }
    };

    const _handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Log the formData object directly
            console.log("formData:", formData);

            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.uploadBrandInfor + '/' + brandID}`,
                formData
            );

            console.log('Profile uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading profile', error);
        }
    };

    // ---------------Fetch Account Name on Account Number Change---------------//
    useEffect(() => {
        if (formData.accountNumber && selectedBank) {
            const timer = setTimeout(() => {
                fetchAccountName();
            }, 1000); // Delay of 1 second

            return () => clearTimeout(timer); // Cleanup the timer on component unmount or when accountNumber changes
        }
    }, [formData.accountNumber, selectedBank]);

    return (
        <div className="max-w-lg mx-auto bg-white p-8 border border-gray-300 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Upload Brand Information</h2>
            <form onSubmit={_handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brandName">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        name="brandName"
                        id="brandName"
                        value={formData.brandName}
                        onChange={_handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
                        Bank Name
                    </label>
                    {Array.isArray(banks) && banks.length > 0 ? (
                        <select
                            name="bankName"
                            id="bankName"
                            value={selectedBank?.bin || ''}
                            onChange={handleBankChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                                <option key={bank.bin} value={bank.bin}>
                                    {bank.shortName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Loading banks...</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountNumber">
                        Account Number
                    </label>
                    <input
                        type="text"
                        name="accountNumber"
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={_handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountName">
                        Account Name
                    </label>
                    <input
                        type="text"
                        name="accountName"
                        id="accountName"
                        value={formData.accountName}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                        Province
                    </label>
                    <select
                        name="province"
                        id="province"
                        value={selectedProvince?.Name || ''}
                        onChange={_handleProvinceChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Province</option>
                        {locations.map(location => (
                            <option key={location.Id} value={location.Name}>
                                {location.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                        District
                    </label>
                    <select
                        name="district"
                        id="district"
                        value={selectedDistrict?.Name || ''}
                        onChange={_handleDistrictChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={!selectedProvince}
                    >
                        <option value="">Select District</option>
                        {selectedProvince?.Districts.map(district => (
                            <option key={district.Id} value={district.Name}>
                                {district.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ward">
                        Ward
                    </label>
                    <select
                        name="ward"
                        id="ward"
                        value={selectedWard?.Name || ''}
                        onChange={_handleWardChange}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={!selectedDistrict}
                    >
                        <option value="">Select Ward</option>
                        {selectedDistrict?.Wards.map(ward => (
                            <option key={ward.Id} value={ward.Name}>
                                {ward.Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadBrandInforForm;

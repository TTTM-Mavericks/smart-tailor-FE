import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VNLocationData from '../../../locationData.json';
import { Location, District, Ward } from '../../../models/BrandUploadInforModel';
import { Bank, FormData } from '../../../models/BrandUploadInforModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import VerticalStepProgressComponent from '../GlobalComponent/VerticalStepProgress/VerticalStepProgressComponent';

const UploadBrandInforForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    // ---------------UseState Variables---------------//
    const [activeStep, setActiveStep] = useState(1);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

    // const userAuthData = localStorage.getItem('userAuth') as string;
    const BRANDROLECHECK = Cookies.get('userAuth') as string;
    const brandAuth = JSON.parse(BRANDROLECHECK);

    const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;

    const [formData, setFormData] = useState<FormData>({
        brandName: '',
        bankName: '',
        accountNumber: 34561662002,
        accountName: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        QR_Payment: 'https://img.vietqr.io/image/970423-34561662002-compact.jpg'
    });

    const [banks, setBanks] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    // ---------------Fetch Location Data---------------//
    /**
    * Get the location of the api and set it to dropdown
    */
    useEffect(() => {
        if (VNLocationData) {
            setLocations(VNLocationData);
            const initialProvince = VNLocationData.find(location => location.Name === formData.province) as Location;
            setSelectedProvince(initialProvince || null);

            if (initialProvince) {
                const initialDistrict = initialProvince.Districts.find(district => district.Name === formData.district) as District;
                setSelectedDistrict(initialDistrict || null);

                if (initialDistrict) {
                    const initialWard = initialDistrict.Wards.find(ward => ward.Name === formData.ward) as Ward;
                    setSelectedWard(initialWard || null);
                }
            }
        } else {
            console.error("Không tìm thấy dữ liệu địa chỉ");
        }
    }, [formData]);

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
                        'x-client-id': 'fc799e75-60fd-45ae-892c-4639bab6342a',
                        'x-api-key': '2ca3be9f-c017-488b-abda-4a4b39a733fa',
                    },
                }
            );

            // Log the entire response object to inspect its structure
            console.log("Full response data:", response.data);

            // Access the nested accountName
            const accountName = response.data.data.accountName;
            console.log("Response accountName:", accountName);

            // Generate the QR code URL
            const QR_Payment = `https://img.vietqr.io/image/${selectedBank?.bin}-${formData.accountNumber}-compact.jpg`;

            setFormData({
                ...formData,
                accountName: accountName,
                QR_Payment: QR_Payment,
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

    /**
     * 
     * @param event 
     * Update The province change
     */
    const _handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find((location) => location.Name === provinceName);
        setSelectedProvince(selectedProvince || null);
        setSelectedDistrict(null);
        setSelectedWard(null);

        setFormData((prevFormData) => ({
            ...prevFormData,
            province: provinceName,
        }));
    };

    /**
     * 
     * @param event 
     * Update the District change
     * The district display when the province sellected
     */
    const _handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince?.Districts.find((district) => district.Name === districtName);
        setSelectedDistrict(selectedDistrict || null);
        setSelectedWard(null);

        setFormData((prevFormData) => ({
            ...prevFormData,
            district: districtName,
        }));
    };

    /**
     * 
     * @param event 
     * Update the ward change
     * The ward display when the province and district sellected
     */
    const _handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = event.target.value;
        if (selectedDistrict) {
            const selectedWard = selectedDistrict.Wards.find((ward) => ward.Name === wardName);
            setSelectedWard(selectedWard || null);

            setFormData((prevFormData) => ({
                ...prevFormData,
                ward: wardName,
            }));
        }
    };

    const _handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Log the formData object directly
            console.log("formData:", formData);

            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.uploadBrandInfor + '/' + userID}`,
                formData
            );

            console.log('Profile uploaded successfully:', response.data);

            // Show success alert using swalAlert
            Swal.fire({
                icon: 'success',
                title: 'Upload Brand Information Success!',
                text: 'Brand profile uploaded successfully',
            });
            setActiveStep(2)

        } catch (error) {
            console.error('Error uploading profile', error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Brand Information Fail!',
                text: 'Brand profile uploaded Fail',
            });
            setActiveStep(1)
        }
    }

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
        <div className='flex-container flex'>
            {/* Vertical Step */}
            <div className="w-1/5 pr-4 flex justify-center items-center">
                <VerticalStepProgressComponent activeStep={activeStep} />
            </div>
            {/* Content */}
            <div className="w-4/5 max-w-6xl mx-auto p-10 border border-gray-300 shadow-lg rounded-xl bg-gradient-to-r from-orange-50 via-white to-orange-50">
                {/* <h2 className="text-4xl font-bold mb-8 text-center text-orange-700">Upload Brand Information</h2> */}
                <form onSubmit={_handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Input Fields */}
                        <div className="space-y-6">
                            {/* Email and Brand Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={email}
                                        readOnly
                                        className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="brandName">Brand Name</label>
                                    <input
                                        type="text"
                                        name="brandName"
                                        id="brandName"
                                        value={formData.brandName}
                                        onChange={_handleChange}
                                        className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
                                        placeholder="Enter brand name"
                                    />
                                </div>
                            </div>

                            {/* Bank Name and Account Number Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="bankName">Bank Name</label>
                                    <select
                                        name="bankName"
                                        id="bankName"
                                        value={selectedBank?.bin || ''}
                                        onChange={handleBankChange}
                                        className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
                                    >
                                        <option value="">Select Bank</option>
                                        {banks.map(bank => (
                                            <option key={bank.bin} value={bank.bin}>{bank.shortName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="accountNumber">Account Number</label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        id="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={_handleChange}
                                        className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-600 bg-white"
                                        placeholder="Enter account number"
                                    />
                                </div>
                            </div>

                            {/* Account Name Field */}
                            <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="accountName">Account Name</label>
                                <input
                                    type="text"
                                    name="accountName"
                                    id="accountName"
                                    value={formData.accountName}
                                    readOnly
                                    className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 bg-gray-100"
                                />
                            </div>

                            {/* Address Field */}
                            <div>
                                <label htmlFor="address" className="block text-lg font-semibold text-gray-700">Your Address</label>
                                <input
                                    id="address"
                                    className="mt-1 block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
                                    placeholder="Enter your address here..."
                                    name="address"
                                    value={formData.address}
                                    onChange={_handleChange}
                                />
                            </div>
                        </div>

                        {/* Right Side: QR Code */}
                        <div className="flex justify-center items-start mt-10">
                            <img
                                src={formData.QR_Payment || 'path-to-default-qr-code-image'}
                                alt="QR Payment"
                                className="block w-full max-w-xs border-2 border-orange-600 rounded-lg shadow-lg p-2"
                            />
                        </div>
                    </div>

                    {/* Province, District, and Ward Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                        <div className="col-span-1">
                            <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="province">Province</label>
                            <select
                                onChange={_handleProvinceChange}
                                value={selectedProvince?.Name || ''}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
                            >
                                <option value="">Select Province</option>
                                {locations.map((location) => (
                                    <option key={location.Name} value={location.Name}>
                                        {location.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedProvince && (
                            <div className="col-span-1">
                                <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="district">District</label>
                                <select
                                    onChange={_handleDistrictChange}
                                    value={selectedDistrict?.Name || ''}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
                                >
                                    <option value="">Select District</option>
                                    {selectedProvince.Districts.map((district) => (
                                        <option key={district.Name} value={district.Name}>
                                            {district.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {selectedDistrict && (
                            <div className="col-span-1">
                                <label className="block text-gray-800 text-lg font-semibold mb-1" htmlFor="ward">Ward</label>
                                <select
                                    onChange={_handleWardChange}
                                    value={selectedWard?.Name || ''}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
                                >
                                    <option value="">Select Ward</option>
                                    {selectedDistrict.Wards.map((ward) => (
                                        <option key={ward.Name} value={ward.Name}>
                                            {ward.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex mt-8 justify-end">
                        <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-10 rounded-lg focus:outline-none transition duration-300 ease-in-out shadow-xl"
                        >
                            Upload Information
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default UploadBrandInforForm;

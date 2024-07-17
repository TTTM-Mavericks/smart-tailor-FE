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
import { UserInterface } from '../../../models/UserModel';

const UploadBrandInforForm = () => {
    const { id } = useParams<{ id: string }>();

    // ---------------UseState Variables---------------//
    const [activeStep, setActiveStep] = useState(1);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [country, setCountrySelect] = useState([])
    const [activeOption, setActiveOption] = useState('monthly');
    // const userAuthData = localStorage.getItem('userAuth') as string;
    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
            // Your code that uses the parsed data
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, perhaps by setting default values or showing an error message
        }
    } else {
        console.error('userAuth cookie is not set');
        // Handle the case when the cookie does not exist
    }


    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        brandFromSignUp = { brandID, brandEmail }
        console.log(brandFromSignUp);

        console.log('Brand ID:', brandID);
        console.log('Brand Email:', brandEmail);
    } else {
        console.error('No user data found in session storage');
    }
    // Get ID When something null
    const getID = () => {
        if (!brandAuth || brandAuth.userID === null || brandAuth.userID === undefined || brandAuth.userID === '') {
            return brandFromSignUp.brandID;
        } else {
            return brandAuth.userID;
        }
    };

    // Get Email When Email Null
    const getEmail = () => {
        if (!brandAuth || brandAuth.email === null || brandAuth.email === undefined || brandAuth.email === '') {
            return brandFromSignUp.brandEmail;
        } else {
            return brandAuth.email;
        }
    };

    const [formData, setFormData] = useState<FormData>({
        brandName: '',
        bankName: '',
        accountNumber: 34561662002,
        accountName: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        qrPayment: 'https://img.vietqr.io/image/970423-34561662002-compact.jpg'
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

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countryNames = response.data.map((country: any) => country.name.common).sort();
                setCountrySelect(countryNames);
                console.log("country" + country);

            } catch (error) {
                console.error('Error fetching banks', error);
                setCountrySelect([]); // Reset to an empty array on error
            }
        };

        fetchCountry();
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
                qrPayment: QR_Payment,
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
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.uploadBrandInfor + '/' + getID()}`,
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
            window.location.href = `/brand/waiting_process_information`;

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
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="lg:w-2/6 w-full bg-gradient-to-r from-cyan-500 to-blue-400 p-10 text-white flex flex-col justify-between">
                <div>
                    <button className="text-white mb-4 flex items-center space-x-2">
                        {/* <span className="text-lg">&#x2190;</span> */}
                        <span>Become Brand</span>
                    </button>
                    <h1 className="text-4xl font-bold mb-2">222,222 VND</h1>
                    <p>We will bill you 222,222 VND monthly, unless you cancel.</p>
                </div>
                {/* QR PAYMENT */}
                <div className="flex justify-center items-start mt-10">
                    <img
                        src={formData.qrPayment || 'path-to-default-qr-code-image'}
                        alt="QR Payment"
                        className="block w-full max-w-xs border-2 border-orange-600 rounded-lg shadow-lg p-2"
                    />
                </div>
                {/* END QR PAYMENT */}
                <div className="mt-10">
                    <div className="flex items-center mb-6">
                        <div className="w-7 h-5 bg-black rounded-full flex items-center justify-center mr-4">
                            <img src="/src/assets/system/smart-tailor_logo.png" alt="Standard pro" className="rounded-full" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Smart Tailor pro</h2>
                            <p className="text-sm">Up to more functionality and more create design.</p>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Add promo code</label>
                        <input type="text" className="w-full p-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="mt-6 space-y-2">
                        <p className="flex justify-between"><span>Subtotal</span> <span>222,222 VND</span></p>
                        <p className="flex justify-between"><span>Total due today</span> <span>222,000 VND</span></p>
                    </div>
                </div>
            </div>
            <div className="lg:w-5/5 w-full p-10 bg-gray-50">
                <h2 className="text-2xl font-bold mb-6">Billing frequency</h2>
                <div className="flex flex-col lg:flex-row mb-6 space-y-2 lg:space-y-0 lg:space-x-2">
                    <button
                        onClick={() => setActiveOption('monthly')}
                        className={`flex-1 p-4 border rounded-l-lg transition-colors duration-300 relative ${activeOption === 'monthly' ? 'bg-white text-black border-2 border-blue-600' : 'bg-gray-50 text-gray-700 border border-gray-300'
                            } hover:bg-gray-100`}
                    >
                        <div className="text-lg font-semibold">Pay monthly</div>
                        <div className="text-xl mt-5">239 VND/month</div>
                        {activeOption === 'monthly' && (
                            <span className="absolute top-2 right-2 text-blue-600 text-2xl">&#10003;</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveOption('yearly')}
                        className={`flex-1 p-4 border rounded-r-lg transition-colors duration-300 relative ${activeOption === 'yearly' ? 'bg-white text-black border-2 border-blue-600' : 'bg-gray-50 text-gray-700 border border-gray-300'
                            } hover:bg-gray-100`}
                    >
                        <div className="text-lg font-semibold">Pay yearly</div>
                        <div className="flex justify-center items-center space-x-2 text-xl mt-5">
                            <p className='flex items-center'>169 VND/month</p>
                            <span className="text-white bg-green-600 rounded px-2 py-1 text-sm flex items-center">Save 20%</span>
                        </div>
                        {activeOption === 'yearly' && (
                            <span className="absolute top-2 right-2 text-blue-600 text-2xl">&#10003;</span>
                        )}
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-6">Payment information</h2>
                {/* Form Input POST */}
                <form className="space-y-4" onSubmit={_handleSubmit}>
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="email"
                            id="email"
                            value={getEmail()}
                            readOnly
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text"
                            name="brandName"
                            id="brandName"
                            value={formData.brandName}
                            onChange={_handleChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter brand name" />
                    </div>
                    <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4'>
                        <select
                            name="bankName"
                            id="bankName"
                            value={selectedBank?.bin || ''}
                            onChange={handleBankChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                                <option key={bank.bin} value={bank.bin}>{bank.shortName}</option>
                            ))}
                        </select>
                        <input type="text"
                            name="accountNumber"
                            id="accountNumber"
                            value={formData.accountNumber}
                            onChange={_handleChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter account number" />
                    </div>
                    {/* <input type="text" className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Card number" /> */}
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="accountName"
                            id="accountName"
                            value={formData.accountName}
                            readOnly
                            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
                        <input
                            type='text'
                            placeholder="Enter your address"
                            name="address"
                            value={formData.address}
                            onChange={_handleChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                        <div className="col-span-1">
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
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="CSV"
                            id="CSV"
                            // value={formData.accountName}
                            placeholder='csv'
                            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
                        <input
                            type='text'
                            placeholder="Enter your note"
                            name="note"
                            // value={formData.address}
                            // onChange={_handleChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="Comment"
                            id="Comment"
                            // value={formData.accountName}
                            placeholder='Input Comment'
                            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
                    </div>

                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <select
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600"
                        >
                            <option value="">Select Country</option>
                            {country.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full p-4 text-white rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors duration-300">Upload Information</button>
                </form>
            </div>
        </div>
    );
};

export default UploadBrandInforForm;

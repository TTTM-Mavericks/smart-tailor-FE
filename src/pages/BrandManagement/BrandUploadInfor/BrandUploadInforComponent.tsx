import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VNLocationData from '../../../locationData.json';
import { Location, District, Ward, FormDataBrandInformation } from '../../../models/BrandUploadInforModel';
import { Bank } from '../../../models/BrandUploadInforModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
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

    const [formErrors, setFormErrors] = useState({
        brandName: '',
        accountNumber: '',
        address: ''
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            brandName: '',
            accountNumber: '',
            address: ''
        };

        if (!formData.brandName || formData.brandName.length > 100) {
            errors.brandName = 'Brand name is required and must be 100 characters or less';
            isValid = false;
        }

        if (!formData.accountNumber || formData.accountNumber.toString().length > 50) {
            errors.accountNumber = 'Account number is required and must be 50 characters or less';
            isValid = false;
        }

        if (!formData.address || formData.address.length > 255) {
            errors.address = 'Address is required and must be 255 characters or less';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

    /**
    * Get the image to user for review
    */
    useEffect(() => {
        return () => {
            previewUrls.forEach(URL.revokeObjectURL);
        };
    }, [previewUrls]);

    const [formData, setFormData] = useState<FormDataBrandInformation>({
        brandName: '',
        bankName: '',
        accountNumber: 34561662002,
        accountName: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        qrPayment: 'https://img.vietqr.io/image/970423-34561662002-compact.jpg',
        // imageURL: []
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

    /**
   * 
   * @param e 
   * Make a change in the code
   */
    const _handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);

    };

    /**
     * 
     * @param files 
     * @returns 
     * Upload the image into the cloudinary
     */
    const _handleUploadToCloudinary = async (files: File[]): Promise<string[]> => {
        const cloudName = 'dby2saqmn';
        const presetKey = 'whear-app';
        const folderName = 'test';

        const formData = new FormData();
        formData.append('upload_preset', presetKey);
        formData.append('folder', folderName);

        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            formData.append('file', file);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const responseData = await response.json();

                if (responseData.secure_url) {
                    const imageUrl = responseData.secure_url;
                    uploadedUrls.push(imageUrl);
                } else {
                    console.error('Error uploading image to Cloudinary. Response:', responseData);
                }
            } catch (error) {
                console.error('Error uploading images to Cloudinary:', error);
            }
        }

        return uploadedUrls;
    };

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
                        'x-client-id': 'df864cd3-00fc-4879-a682-9cfc72bf9ddc',
                        'x-api-key': 'ffe26089-0906-487e-afc1-db31b7d72e56',
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

        setFormErrors({
            ...formErrors,
            [name]: ''
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
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form',
            });
            return;
        }
        let uploadedImageURLs: string[] = [];

        if (files && files.length > 0) {
            try {
                uploadedImageURLs = await _handleUploadToCloudinary(files);
                console.log("Uploaded image URLs:", uploadedImageURLs);
            } catch (error) {
                console.error('Error uploading images:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Image Upload Failed',
                    text: 'There was an error uploading your images. Please try again.',
                });
                return; // Stop the submission if image upload fails
            }
        }

        const updatedFormData = {
            ...formData,
            imageURL: uploadedImageURLs,
            selectedOption: selectedOption
        };

        console.log(updatedFormData, "formdata");

        try {
            console.log("Submitting form data:", updatedFormData);

            const response = await axios.post(
                `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.uploadBrandInfor + '/' + getID()}`,
                formData
            );

            console.log('Profile uploaded successfully:', response.data);

            Swal.fire({
                icon: 'success',
                title: 'Upload Brand Information Success!',
                text: 'Brand profile uploaded successfully',
            });
            setActiveStep(2);
            // window.location.href = `/brand/waiting_process_information`;

        } catch (error) {
            console.error('Error uploading profile', error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Brand Information Failed!',
                text: 'There was an error uploading your brand profile. Please try again.',
            });
            setActiveStep(1);
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

    const [selectedOption, setSelectedOption] = useState('weekly');

    const renderCheckmark = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 absolute top-2 right-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const commonClasses = "relative flex-1 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md transition transform hover:scale-105 active:scale-95";
    const selectedClasses = "border-2 border-blue-500";
    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="lg:w-2/6 w-full bg-gradient-to-r from-emerald-500 to-emerald-900 p-10 text-white flex flex-col justify-between">
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
                    <div
                        onClick={() => setSelectedOption('weekly')}
                        className={`${commonClasses} ${selectedOption === 'weekly' ? selectedClasses : ''}`}
                    >
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
                                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right mr-7">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Today's Money</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">53 VND</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className="text-green-500">+55%</strong>&nbsp;than last week
                            </p>
                        </div>
                        {selectedOption === 'weekly' && renderCheckmark()}
                    </div>

                    <div
                        onClick={() => setSelectedOption('monthly')}
                        className={`${commonClasses} ${selectedOption === 'monthly' ? selectedClasses : ''}`}
                    >
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right mr-7">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">New Clients</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">346 VND</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className="text-red-500">-2%</strong>&nbsp;than yesterday
                            </p>
                        </div>
                        {selectedOption === 'monthly' && renderCheckmark()}
                    </div>

                    <div
                        onClick={() => setSelectedOption('yearly')}
                        className={`${commonClasses} ${selectedOption === 'yearly' ? selectedClasses : ''}`}
                    >
                        <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
                                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                            </svg>
                        </div>
                        <div className="p-4 text-right mr-7">
                            <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Today's Money</p>
                            <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">53 VND</h4>
                        </div>
                        <div className="border-t border-blue-gray-50 p-4">
                            <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                                <strong className="text-green-500">+55%</strong>&nbsp;than last week
                            </p>
                        </div>
                        {selectedOption === 'yearly' && renderCheckmark()}
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-6">Payment information</h2>

                {/* Image Array */}
                <div className="flex flex-wrap gap-4 mb-4">
                    {previewUrls.map((url, index) => (
                        <div key={url} className="relative w-40 h-40 rounded-lg overflow-hidden">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => {
                                    const newFiles = files.filter((_, i) => i !== index);
                                    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
                                    setFiles(newFiles);
                                    setPreviewUrls(newPreviewUrls);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={_handleChanges}
                            accept="image/*"
                        />
                        <span className="text-4xl text-gray-400">+</span>
                    </div>
                </div>
                {/* Form Input POST */}
                <form className="space-y-4" onSubmit={_handleSubmit}>
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="email"
                            id="email"
                            value={getEmail()}
                            readOnly
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <div className="flex-1 flex flex-col">
                            <input type="text"
                                name="brandName"
                                id="brandName"
                                value={formData.brandName}
                                onChange={_handleChange}
                                className={`p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.brandName ? 'border-red-500' : ''}`}
                                placeholder="Enter brand name" />
                            {formErrors.brandName && <p className="text-red-500 text-sm mt-1">{formErrors.brandName}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4'>
                        <select
                            name="bankName"
                            id="bankName"
                            value={selectedBank?.bin || ''}
                            onChange={handleBankChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                                <option key={bank.bin} value={bank.bin}>{bank.shortName}</option>
                            ))}
                        </select>
                        <div className="flex-1 flex flex-col">
                            <input type="text"
                                name="accountNumber"
                                id="accountNumber"
                                value={formData.accountNumber}
                                onChange={_handleChange}
                                className={`p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.accountNumber ? 'border-red-500' : ''}`}
                                placeholder="Enter account number" />
                            {formErrors.accountNumber && <p className="text-red-500 text-sm mt-1">{formErrors.accountNumber}</p>}
                        </div>
                    </div>
                    {/* <input type="text" className="w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Card number" /> */}
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <input type="text"
                            name="accountName"
                            id="accountName"
                            value={formData.accountName}
                            placeholder='Account Name Not Found'
                            readOnly
                            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
                        <div className="flex-1 flex flex-col">
                            <input
                                type='text'
                                placeholder="Enter your address"
                                name="address"
                                value={formData.address}
                                onChange={_handleChange}
                                className={`p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : ''}`} />
                            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                        <div className="col-span-1">
                            <select
                                onChange={_handleProvinceChange}
                                value={selectedProvince?.Name || ''}
                                className="appearance-none mt-1 block w-full px-4 py-3 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="appearance-none mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="appearance-none mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="appearance-none mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

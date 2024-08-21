import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VNLocationData from '../../../locationData.json';
import { Location, District, Ward, FormDataBrandInformation, BrandImages } from '../../../models/BrandUploadInforModel';
import { Bank } from '../../../models/BrandUploadInforModel';
import { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { UserInterface } from '../../../models/UserModel';
import { toast } from 'react-toastify';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import ViewSampleBrandUpdateDialog from './Test';
import { AnyObject } from 'three/examples/jsm/nodes/core/constants';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from '@mui/material';
import { primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './BrandUploadInforStyle.module.scss'
import { Toast } from 'react-toastify/dist/components';
import { __getToken } from '../../../App';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [taxCode, setTaxCode] = useState('');
    const [taxCodeError, setTaxCodeError] = useState('');
    const [taxCodeValidated, setTaxCodeValidated] = useState(false);

    const [businessType, setBusinessType] = useState('individual');
    const [taxCodeData, setTaxCodeData] = useState<any>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [policyAgreed, setPolicyAgreed] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handlePolicyAgreeChange = (e: any) => {
        setPolicyAgreed(e.target.checked);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatarToCloudinary = async (file: File): Promise<string> => {
        const cloudName = 'dby2saqmn';
        const presetKey = 'whear-app';
        const folderName = 'avatars';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', presetKey);
        formData.append('folder', folderName);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const responseData = await response.json();

            if (responseData.secure_url) {
                return responseData.secure_url;
            } else {
                throw new Error('Error uploading avatar to Cloudinary');
            }
        } catch (error) {
            console.error('Error uploading avatar to Cloudinary:', error);
            throw error;
        }
    };
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
            errors.brandName = 'Brand name is required and must be more than 0 and less than 100';
            isValid = false;
        }

        if (!formData.accountNumber || formData.accountNumber.toString().length > 50) {
            errors.accountNumber = 'Account number is required and must be more than 0 and less than 50';
            isValid = false;
        }

        if (!formData.address || formData.address.length > 255) {
            errors.address = 'Address is required and must be more than 0 and less than 255';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    let brandAuth: any = null;

    const BRANDROLECHECK = Cookies.get('userAuth');

    if (BRANDROLECHECK) {
        try {
            brandAuth = JSON.parse(BRANDROLECHECK);
            const { userID, email, fullName, language, phoneNumber, roleName, imageUrl, userStatus } = brandAuth;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    } else {
        console.error('userAuth cookie is not set');
    }

    let brandFromSignUp: any = null
    // Get BrandID from session
    const getBrandFromSingUp = sessionStorage.getItem('userRegister') as string | null;

    if (getBrandFromSingUp) {
        const BRANDFROMSIGNUPPARSE: UserInterface = JSON.parse(getBrandFromSingUp);
        const brandID = BRANDFROMSIGNUPPARSE.userID;
        const brandEmail = BRANDFROMSIGNUPPARSE.email;
        const brandPhoneNumber = BRANDFROMSIGNUPPARSE.phoneNumber;
        const brandFullName = BRANDFROMSIGNUPPARSE.fullName;
        brandFromSignUp = { brandID, brandEmail, brandPhoneNumber, brandFullName }
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

    // Get Phone When Phone Null
    const getPhone = () => {
        if (!brandAuth || brandAuth.phoneNumber === null || brandAuth.phoneNumber === undefined || brandAuth.phoneNumber === '') {
            return brandFromSignUp.brandPhoneNumber;
        } else {
            return brandAuth.phoneNumber;
        }
    };

    // Get Phone When Phone Null
    const getFullName = () => {
        if (!brandAuth || brandAuth.fullName === null || brandAuth.fullName === undefined || brandAuth.fullName === '') {
            return brandFromSignUp.brandFullName;
        } else {
            return brandAuth.fullName;
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
        brandImages: [],
        taxCode: 0
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
    const MAX_IMAGES = 5;

    const _handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // Check if adding the new files would exceed the maximum
        if (files.length + selectedFiles.length > MAX_IMAGES) {
            // Display an error message or handle the situation in another way
            console.error('Maximum number of images reached.');
            toast.error("The upload image maximum is 5 image")
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    };

    /**
     * 
     * @param files 
     * @returns 
     * Upload the image into the cloudinary
     */
    const _handleUploadToCloudinary = async (files: File[]): Promise<BrandImages[]> => {
        const cloudName = 'dby2saqmn';
        const presetKey = 'whear-app';
        const folderName = 'test';

        const formData = new FormData();
        formData.append('upload_preset', presetKey);
        formData.append('folder', folderName);

        const uploadedImages: BrandImages[] = [];

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
                    uploadedImages.push({
                        imageUrl: imageUrl,
                        imageDescription: `Image ${uploadedImages.length + 1}`
                    });
                } else {
                    console.error('Error uploading image to Cloudinary. Response:', responseData);
                }
            } catch (error) {
                console.error('Error uploading images to Cloudinary:', error);
            }
        }

        return uploadedImages;
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
                        'x-client-id': 'a7b3e81a-99f5-4954-9093-78cf98e6aa90',
                        'x-api-key': 'd746181c-b2be-42ff-a3ee-76cb750c177e',
                    },
                }
            );

            console.log("Full response data:", response.data);

            const accountName = response.data.data.accountName;
            console.log("Response accountName:", accountName);

            if (!accountName) {
                toast.error("Account name not found. Please check your bank and account number.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const QR_Payment = `https://img.vietqr.io/image/${selectedBank?.bin}-${formData.accountNumber}-compact.jpg`;

            setFormData({
                ...formData,
                accountName: accountName,
                qrPayment: QR_Payment,
            });

        } catch (error) {
            console.error('Error fetching account name', error);
            toast.error("The Bank and the Account Number not match!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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

    const validateTaxCode = async () => {
        if (businessType === 'individual') {
            setFormData((prevData: any) => ({
                ...prevData,
                taxCode: null
            }));
            return;
        }

        try {
            const response = await axios.get(`https://api.vietqr.io/v2/business/${formData.taxCode}`);
            console.log("fmmmm" + formData.taxCode);

            if (response.data.code === "00" && response.data.desc === "Success - Thành công") {
                setTaxCodeError('');
                setTaxCodeValidated(true);
                setTaxCodeData(response.data.data);
                console.log("bebe " + taxCodeData);

                setFormData(prevData => ({
                    ...prevData,
                    taxCode: formData.taxCode,
                    brandName: response.data.data.name,
                    address: response.data.data.address
                }));
                toast.success('Tax code validated successfully!');
            } else {
                toast.error('Invalid tax code. Please try again!');
                setTaxCodeValidated(false);
                setTaxCodeData(null);
            }
        } catch (error) {
            toast.error('Error validating tax code. Please try again!');
            setTaxCodeValidated(false);
            setTaxCodeData(null);
        }
    };

    console.log("bebe1 " + JSON.stringify(taxCodeData));

    const handleBusinessTypeChange = (e: any) => {
        setBusinessType(e.target.value);
        if (e.target.value === 'individual') {
            setFormData((prevData: any) => ({
                ...prevData,
                taxCode: null
            }));
            setTaxCodeValidated(true);
            setTaxCodeData(null);
        } else {
            setTaxCodeValidated(false);
        }
    };

    const _handleSubmit = async (e: any) => {
        e.preventDefault();
        handleDialogOpen();
    }

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (policyAgreed) {
            if (!validateForm() || !taxCodeValidated) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please correct the errors in the form and validate the tax code',
                });
                handleDialogClose();
                setIsLoading(false);
                return;
            }

            let avatarUrl = '';
            if (avatarFile) {
                try {
                    avatarUrl = await uploadAvatarToCloudinary(avatarFile);
                } catch (error) {
                    console.error('Error uploading avatar:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Avatar Upload Failed',
                        text: 'There was an error uploading your avatar. Please try again.',
                    });
                    setIsLoading(false);
                    return;
                }
            }

            const updatedFormData = {
                email: getEmail(),
                fullName: getFullName(),
                phoneNumber: getPhone(),
                gender: true,
                dateOfBirth: "22-08-2019",
                address: formData.address,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                imageUrl: avatarUrl
            };

            console.log("Submitting form data:", updatedFormData);

            try {
                // First, update the profile
                const profileUpdateResponse = await axios.put(
                    `${baseURL + versionEndpoints.v1 + featuresEndpoints.customer + functionEndpoints.customer.updateProfile + '/' + getID()}`,
                    updatedFormData, {
                    headers: {
                        'Authorization': `Bearer ${__getToken()}`
                    }
                }
                );

                console.log('Profile updated successfully:', profileUpdateResponse.data);

                // If profile update is successful, then upload the brand information
                if (profileUpdateResponse.status === 200) {
                    const brandUploadResponse = await axios.post(
                        `${baseURL + versionEndpoints.v1 + featuresEndpoints.brand + functionEndpoints.brand.uploadBrandInfor + '/' + getID()}`,
                        formData
                    );

                    console.log('Brand profile uploaded successfully:', brandUploadResponse.data);

                    if (brandUploadResponse.status === 200) {
                        setIsLoading(false);
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Upload Brand Information Success!',
                        text: 'Brand profile uploaded successfully',
                    });
                    handleDialogClose();
                    setActiveStep(2);
                    window.location.href = `/brand/waiting_process_information`;
                }
            } catch (error) {
                setIsLoading(false);
                handleDialogClose();
                console.error('Error uploading profile', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Brand Information Failed!',
                    text: 'There was an error uploading your brand profile. Please try again.',
                });
                setActiveStep(1);
            }
            handleDialogClose();
        } else {
            alert('You must agree to the policy before submitting.');
        }
    };
    // ---------------Fetch Account Name on Account Number Change---------------//
    useEffect(() => {
        if (formData.accountNumber && selectedBank) {
            const timer = setTimeout(() => {
                fetchAccountName();
            }, 1000); // Delay of 1 second

            return () => clearTimeout(timer);
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
            <LoadingComponent isLoading={isLoading} time={5000}></LoadingComponent>
            <div className="lg:w-2/6 w-full bg-gradient-to-r from-emerald-500 to-emerald-900 p-10 text-white flex flex-col justify-between">
                <div>
                    <button className="text-white mb-4 flex items-center space-x-2">
                        <span>Become a Brand Partner</span>
                    </button>
                    <h1 className="text-2xl font-bold mb-2">Exclusive Benefits</h1>
                    <p>Join us as a brand partner and unlock a suite of premium features tailored</p>
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
                {/* Form Input POST */}
                <form className="space-y-4" onSubmit={_handleSubmit}>
                    {/* Avatar Upload Section */}


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
                    {/* <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <select
                            className="appearance-none mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Country</option>
                            {country.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div> */}
                    <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                        <select
                            name="businessType"
                            value={businessType}
                            onChange={handleBusinessTypeChange}
                            className="flex-1 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                        </select>
                    </div>

                    {businessType === 'company' && (
                        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                            <div className="flex-1 flex flex-col">
                                <input
                                    type="text"
                                    name="taxCode"
                                    id="taxCode"
                                    value={formData.taxCode || ''}
                                    onChange={_handleChange}
                                    className={`p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${taxCodeError ? 'border-red-500' : ''}`}
                                    placeholder="Enter tax code"
                                />
                                {taxCodeError && <p className="text-red-500 text-sm mt-1">{taxCodeError}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={validateTaxCode}
                                className="p-4 text-white rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors duration-300"
                            >
                                Validate Tax Code
                            </button>
                        </div>
                    )}

                    {taxCodeData && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <h3 className="font-bold mb-2">Tax Code Information:</h3>
                            <p><strong>Name:</strong> {taxCodeData.name}</p>
                            <p><strong>International Name:</strong> {taxCodeData.internationalName}</p>
                            <p><strong>Address:</strong> {taxCodeData.address}</p>
                        </div>
                    )}

                    <div className="flex items-center space-x-4">
                        {/* Upload Avartar */}
                        <div className="flex items-center justify-center h-full">
                            <div className="p-4 rounded-lg shadow-lg w-56">
                                <div className="flex justify-center mb-4">
                                    {avatarPreview ? (
                                        <div className="w-20 h-20 rounded-full overflow-hidden">
                                            <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    <label
                                        htmlFor="avatar-upload"
                                        className="block bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            onChange={handleAvatarChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        Upload Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Upload Multiple Image */}
                        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 h-full">
                            {previewUrls.map((url, index) => (
                                <div
                                    key={url}
                                    className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => {
                                            const newFiles = files.filter((_, i) => i !== index);
                                            const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
                                            setFiles(newFiles);
                                            setPreviewUrls(newPreviewUrls);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                                        aria-label="Remove image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={_handleChanges}
                                    accept="image/*"
                                    multiple
                                    max="5"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-gray-400 mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span className="text-sm text-gray-500">Add Image</span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full p-4 text-white rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors duration-300">Upload Information</button>
                </form>
            </div >
            {isDialogOpen && (
                <Dialog open={isDialogOpen}>
                    <DialogTitle>
                        Upload Information Policy
                        <IoMdCloseCircleOutline
                            cursor={'pointer'}
                            size={20}
                            color={redColor}
                            onClick={handleDialogClose}
                            style={{ position: 'absolute', right: 20, top: 20 }}
                        />
                    </DialogTitle>
                    <DialogContent className={styles.orderPolicyDialog__content}>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>General Regulations</strong><br />
                            <li>This brand information upload policy applies to all brand data submitted through our platform.</li>
                            <li>By uploading brand information, users agree to the terms and conditions outlined in this policy.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Accepted Formats</strong><br />
                            <li>Brand information can be uploaded in the following formats: CSV, XLSX, or JSON.</li>
                            <li>Ensure that the file format complies with the specified format guidelines to avoid upload errors.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Data Requirements</strong><br />
                            <li>Brand data must include the following fields: Brand Name, Brand Description, and Brand Logo URL.</li>
                            <li>Ensure that all data is accurate and up-to-date before uploading.</li>
                            <li>Prohibited content includes but is not limited to: offensive language, false information, and unauthorized trademarks.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Upload Process</strong><br />
                            <li>Step 1: Select the file containing the brand information from your device.</li>
                            <li>Step 2: Ensure the file meets the format and data requirements specified above.</li>
                            <li>Step 3: Click the 'Upload' button to submit the brand information.</li>
                            <li>Step 4: The system will validate the data. If errors are detected, you will be prompted to correct them before finalizing the upload.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Errors and Corrections</strong><br />
                            <li>If the uploaded file contains errors, you will receive an error report outlining the issues.</li>
                            <li>Correct the errors as indicated in the report and re-upload the file.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Data Handling and Privacy</strong><br />
                            <li>Uploaded brand information will be stored securely and used only for the intended purpose.</li>
                            <li>Personal data or sensitive information should not be included in the brand information upload.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Support and Contact</strong><br />
                            <li>For questions or support regarding the brand information upload process, please contact our support team via email: smarttailor@gmail.com or phone: 0123-456-789.</li>
                        </Typography>
                        <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                            <strong>Policy Changes</strong><br />
                            <li>We reserve the right to update this brand information upload policy at any time.</li>
                            <li>Any changes will be communicated via our website and may be sent to users through email notifications.</li>
                        </Typography>
                    </DialogContent>
                    <FormControlLabel
                        control={<Checkbox color={'error'} checked={policyAgreed} onChange={handlePolicyAgreeChange} />}
                        label={(<span style={{ fontSize: 14 }}>I agree to the upload information policy</span>)}
                        className='px-5 py-5'
                        style={{ fontSize: '1px', fontWeight: 500 }}
                        sx={{ fontSize: 12 }}
                    />
                    <DialogActions>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-medium text-white"
                            style={
                                {
                                    border: `1px solid ${primaryColor}`,
                                    borderRadius: 4,
                                    color: policyAgreed ? whiteColor : primaryColor,
                                    marginBottom: 10,
                                    marginRight: 10,
                                    backgroundColor: policyAgreed ? primaryColor : whiteColor
                                }
                            }
                            onClick={handleFinalSubmit}
                            disabled={!policyAgreed}
                        >
                            Confirm
                        </button>
                    </DialogActions>
                </Dialog>
            )}
        </div >
    );
};

export default UploadBrandInforForm;

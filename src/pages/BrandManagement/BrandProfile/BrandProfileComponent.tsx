import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, TextField, Button, Avatar, IconButton, useTheme } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { tokens } from '../../../theme';
import VNLocationData from '../../../locationData.json';
import { useTranslation } from 'react-i18next';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface BrandProfileData {
    id: string;
    name: string;
    address: string,
    imgURL: string
}

const BrandProfileSetup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [userInfo, setUserInfo] = useState<BrandProfileData | null>(null)
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        Promise.resolve(VNLocationData)
            .then(data => setLocations(data))
            .catch(err => console.log("err ", err));
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userID = localStorage.getItem('userID');
                if (!userID) {
                    throw new Error('User ID not found in local storage');
                }

                const apiUrl = `https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST/55`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUserInfo(userData);

                const addressParts = userData.address.split(', ');

                // Tìm và khởi tạo selectedProvince
                const selectedProvince = locations.find((location: any) => location.Name === addressParts[0]);
                setSelectedProvince(selectedProvince);

                // Tìm và khởi tạo selectedDistrict
                if (selectedProvince) {
                    const selectedDistrict = selectedProvince.Districts.find((district: any) => district.Name === addressParts[1]);
                    setSelectedDistrict(selectedDistrict);
                }

                // Tìm và khởi tạo selectedWard
                if (selectedDistrict) {
                    const selectedWard = selectedDistrict.Wards.find((ward: any) => ward.Name === addressParts[2]);
                    setSelectedWard(selectedWard);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [locations]);

    const _handleProvinceChange = (event: any) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find((location: any) => location.Name === provinceName);
        setSelectedProvince(selectedProvince);
        setSelectedDistrict(null);
        setSelectedWard(null);

        // Cập nhật địa chỉ khi thay đổi Tỉnh/Thành phố
        setProfileData((prevFormData) => ({
            ...prevFormData,
            address: `${provinceName}, , `,
        }));
    };

    const _handleDistrictChange = (event: any) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince?.Districts.find((district: any) => district.Name === districtName);
        setSelectedDistrict(selectedDistrict);
        setSelectedWard(null);

        // Cập nhật địa chỉ khi thay đổi Quận/Huyện
        setProfileData((prevFormData) => ({
            ...prevFormData,
            address: `${selectedProvince?.Name}, ${districtName}, `,
        }));
    };

    const _handleWardChange = (event: any) => {
        const wardName = event.target.value;
        if (selectedDistrict) {
            const selectedWard = selectedDistrict.Wards.find((ward: any) => ward.Name === wardName);
            setSelectedWard(selectedWard);

            // Cập nhật địa chỉ khi thay đổi Phường/Xã
            setProfileData((prevFormData) => ({
                ...prevFormData,
                address: `${selectedProvince?.Name}, ${selectedDistrict?.Name}, ${wardName}`,
            }));
        }
    };

    useEffect(() => {
        if (VNLocationData) {
            setLocations(VNLocationData);
        } else {
            console.error("Không tìm thấy dữ liệu địa chỉ");
        }
    }, []);

    const [profileData, setProfileData] = useState({
        name: 'Tam',
        surname: 'Mai',
        specialty: 'Developer',
        skills: 'English',
        gender: 'Male',
        birthDate: '2017-06-04',
        phone: '+123456789',
        email: 'demo@gmail.com',
        profilePicture: '',
        address: ''
    });

    const _handleChange = (e: any) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const _handleUpdate = () => {
        console.log('Profile data:', profileData);
    };

    // Upload Image into Cloudinary
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<string[]>([]);

    const _handleChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            const imageUrls = await _handleUploadToCloudinary(selectedFiles);

            setFiles((prevFiles) => [...prevFiles, ...imageUrls]);
            setProfileData((prevFormData) => ({
                ...prevFormData,
                profilePicture: imageUrls[0],
            }));
        } else {
            setFiles([]);
        }
    };

    const _handleUploadToCloudinary = async (files: FileList): Promise<string[]> => {
        try {
            const cloud_name = "dby2saqmn";
            const preset_key = "whear-app";
            const folder_name = "test";
            const formData = new FormData();
            formData.append("upload_preset", preset_key);
            formData.append("folder", folder_name);

            const uploadedUrls: string[] = [];

            for (const file of Array.from(files)) {
                formData.append("file", file);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();

                if (responseData.secure_url) {
                    const imageUrl = responseData.secure_url;
                    console.log(imageUrl);
                    uploadedUrls.push(imageUrl);
                } else {
                    console.error("Error uploading image to Cloudinary. Response:", responseData);
                }
            }

            return uploadedUrls;
        } catch (error) {
            console.error("Error uploading images to Cloudinary:", error);
            return [];
        }
    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 p-8">
                        <div className="relative">
                            <img
                                className="h-48 w-48 rounded-full object-cover"
                                src={profileData.profilePicture || 'https://via.placeholder.com/150'}
                                alt="Profile"
                            />
                            <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer">
                                <PhotoIcon className="h-6 w-6 text-white" />
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={_handleChanges} ref={fileInputRef} />
                            </label>
                        </div>
                    </div>
                    <div className="p-8 flex-1">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" name="name" id="name" value={profileData.name} onChange={_handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
                                    <input type="text" name="surname" id="surname" value={profileData.surname} onChange={_handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                                {/* Add similar styled inputs for other fields */}
                            </div>

                            <div className="space-y-4">
                                <select onChange={_handleProvinceChange} value={selectedProvince?.Name || ''} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                    <option value="">Select Province</option>
                                    {locations.map((location: any) => (
                                        <option key={location.Name} value={location.Name}>{location.Name}</option>
                                    ))}
                                </select>

                                {selectedProvince && (
                                    <select onChange={_handleDistrictChange} value={selectedDistrict?.Name || ''} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="">Select District</option>
                                        {selectedProvince.Districts.map((district: any) => (
                                            <option key={district.Name} value={district.Name}>{district.Name}</option>
                                        ))}
                                    </select>
                                )}

                                {selectedDistrict && (
                                    <select onChange={_handleWardChange} value={selectedWard?.Name || ''} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                        <option value="">Select Ward</option>
                                        {selectedDistrict.Wards.map((ward: any) => (
                                            <option key={ward.Name} value={ward.Name}>{ward.Name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <button type="button" onClick={_handleUpdate} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    {t(codeLanguage + '000060')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandProfileSetup;

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import VNLocationData from '../../../locationData.json';

type Location = {
    Name: string;
    Districts: District[];
};

type District = {
    Name: string;
    Wards: Ward[];
};

type Ward = {
    Name: string;
};

type ProfileData = {
    name: string;
    surname: string;
    gender: string;
    birthDate: string;
    phone: string;
    email: string;
    profilePicture: string;
    address: string;
    province: string;
    district: string;
    ward: string;
};

const ProfileSettings: React.FC = () => {
    // ---------------UseState Variable---------------//
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: 'Tam',
        surname: 'Mai',
        gender: 'Male',
        birthDate: '2017-06-04',
        phone: '+123456789',
        email: 'demo@gmail.com',
        profilePicture: '',
        address: '10/6C',
        province: 'Thành phố Hải Phòng',
        district: 'Huyện Vĩnh Bảo',
        ward: 'Xã Liên Am'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ---------------Usable Variable---------------//
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();
    const { t, i18n } = useTranslation();

    // ---------------UseEffect---------------//
    /**
     * Get the location to dropdown
     */
    useEffect(() => {
        if (VNLocationData) {
            setLocations(VNLocationData);
        } else {
            console.error("Không tìm thấy dữ liệu địa chỉ");
        }
    }, []);

    /**
     * Get the image to user for review
     */
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /**
     * Update the Language
     */
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    // ---------------FunctionHandler---------------//

    /**
     * 
     * @param e 
     * Make a change in the code
     */
    const _handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    /**
     * 
     * @param files 
     * @returns 
     * Upload the image into the cloudinary
     */
    const _handleUploadToCloudinary = async (files: FileList): Promise<string[]> => {
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

    /**
     * 
     * @param e 
     * Tracking the fields to update
     */
    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    /**
     * 
     * @param e 
     * Update the Data in to DB
     */
    const _handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let imageUrls: string[] = [];

        if (files && files.length > 0) {
            imageUrls = await _handleUploadToCloudinary(files);
        }

        const updatedProfileData = {
            ...profileData,
            profilePicture: imageUrls.length > 0 ? imageUrls[0] : profileData.profilePicture,
        };

        console.log('Updated profile data:', updatedProfileData);
    };

    /**
     * Delete The image to get another image
     */
    const _handleDeletePicture = () => {
        setProfileData((prevFormData) => ({
            ...prevFormData,
            profilePicture: '',
        }));
        setFiles(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

        setProfileData((prevFormData) => ({
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

        setProfileData((prevFormData) => ({
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

            setProfileData((prevFormData) => ({
                ...prevFormData,
                ward: wardName,
            }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderComponent />
            <div className="flex flex-1 flex-col md:flex-row gap-8 px-6 py-8 md:px-16 lg:px-28 text-gray-800 mt-40">
                <aside className="hidden md:block md:w-1/3 lg:w-1/4">
                    <div className="sticky top-20 p-4 text-sm border-r border-gray-200 h-full">
                        <h2 className="pl-3 mb-6 text-2xl font-semibold text-orange-900">Settings</h2>
                        <nav className="flex flex-col gap-3">
                            <a href="/auth/profilesetting" className="px-4 py-3 font-semibold text-orange-900 bg-white border border-orange-100 rounded-lg hover:bg-orange-50">
                                Account Settings
                            </a>
                            <a href="#" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Notifications
                            </a>
                            <a href="/order_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Order History
                            </a>
                        </nav>
                    </div>
                </aside>
                <main className="w-full md:w-2/3 lg:w-3/4">
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h1 className="mb-6 text-3xl font-semibold text-orange-900">Account Settings</h1>
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
                            <div className="relative w-32 h-32 rounded-full border border-gray-300 overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : profileData.profilePicture ? (
                                    <img
                                        src={profileData.profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No image
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={_handleChanges}
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    className="py-3 px-6 text-base font-medium text-white bg-orange-700 rounded-lg hover:bg-orange-800"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change picture
                                </button>
                                <button
                                    type="button"
                                    className="py-3 px-6 text-base font-medium text-orange-700 bg-white rounded-lg border border-orange-200 hover:bg-orange-100 hover:text-white-900"
                                    onClick={_handleDeletePicture}
                                >
                                    Delete picture
                                </button>
                            </div>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={_handleUpdate}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        Your first name
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Your first name"
                                        name="name"
                                        value={profileData.name}
                                        onChange={_handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Your last name
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Your last name"
                                        name="surname"
                                        value={profileData.surname}
                                        onChange={_handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                                    placeholder="your.email@mail.com"
                                    name="email"
                                    value={profileData.email}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Your address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    className="mt-1 block w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Your address"
                                    name="address"
                                    value={profileData.address}
                                    onChange={_handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    onChange={_handleProvinceChange}
                                    value={selectedProvince?.Name || ''}
                                    style={{
                                        padding: '10px',
                                        marginTop: '10px',
                                        width: '100%',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    <option value="">Select Province</option>
                                    {locations.map((location) => (
                                        <option key={location.Name} value={location.Name}>
                                            {location.Name}
                                        </option>
                                    ))}
                                </select>

                                {selectedProvince && (
                                    <select
                                        onChange={_handleDistrictChange}
                                        value={selectedDistrict?.Name || ''}
                                        style={{
                                            padding: '10px',
                                            marginTop: '10px',
                                            width: '100%',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <option value="">Select District</option>
                                        {selectedProvince.Districts.map((district) => (
                                            <option key={district.Name} value={district.Name}>
                                                {district.Name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {selectedDistrict && (
                                    <select
                                        onChange={_handleWardChange}
                                        value={selectedWard?.Name || ''}
                                        style={{
                                            padding: '10px',
                                            marginTop: '10px',
                                            width: '100%',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <option value="">Select Ward</option>
                                        {selectedDistrict.Wards.map((ward) => (
                                            <option key={ward.Name} value={ward.Name}>
                                                {ward.Name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
            <FooterComponent />
        </div>
    );
};

export default ProfileSettings;

import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, TextField, Button, Avatar, IconButton, Select, MenuItem, useTheme, InputLabel, FormControl, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { tokens } from '../../../theme';
import VNLocationData from '../../../locationData.json';
import { useTranslation } from 'react-i18next';

interface UserProfileData {
    id: string;
    name: string;
    address: string,
    imgURL: string
}

const ProfileSetup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [userInfo, setUserInfo] = useState<UserProfileData | null>(null)
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    const handleProvinceChange = (event: any) => {
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

    const handleDistrictChange = (event: any) => {
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

    const handleWardChange = (event: any) => {
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

    const handleChange = (e: any) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        console.log('Profile data:', profileData);
    };

    // Upload Image into Cloudinary
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<string[]>([]);

    const handleChanges = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            const imageUrls = await uploadToCloudinary(selectedFiles);

            setFiles((prevFiles) => [...prevFiles, ...imageUrls]);
            setProfileData((prevFormData) => ({
                ...prevFormData,
                profilePicture: imageUrls[0],
            }));
        } else {
            setFiles([]);
        }
    };

    const uploadToCloudinary = async (files: FileList): Promise<string[]> => {
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <Box m="100px">
                        <Box display="flex" alignItems="center" >
                            <Avatar
                                alt="Profile Picture"
                                src={profileData.profilePicture}
                                sx={{ width: 150, height: 150 }}
                            />
                            <IconButton color="primary" aria-label="upload picture" component="label" style={{ marginLeft: "-35%", marginTop: "90%" }}>
                                <input hidden accept="image/*" type="file" onChange={handleChanges} ref={fileInputRef} />
                                <PhotoCamera />
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        label="Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Surname"
                        name="surname"
                        value={profileData.surname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Specialty"
                        name="specialty"
                        value={profileData.specialty}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Skills"
                        name="skills"
                        value={profileData.skills}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Birth Date"
                        name="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email address"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <div>
                        <select
                            onChange={handleProvinceChange}
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
                            {locations.map((location: any) => (
                                <option key={location.Name} value={location.Name}>
                                    {location.Name}
                                </option>
                            ))}
                        </select>

                        {selectedProvince && (
                            <select
                                onChange={handleDistrictChange}
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
                                {selectedProvince.Districts.map((district: any) => (
                                    <option key={district.Name} value={district.Name}>
                                        {district.Name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {selectedDistrict && (
                            <select
                                onChange={handleWardChange}
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
                                {selectedDistrict.Wards.map((ward: any) => (
                                    <option key={ward.Name} value={ward.Name}>
                                        {ward.Name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2 }}>
                        {t(codeLanguage + '000060')}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfileSetup;

import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, TextField, Button, Avatar, IconButton, Select, MenuItem, useTheme, InputLabel, FormControl, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { tokens } from '../../../theme';
import VNLocationData from '../../../locationData.json';

const ProfileSetup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [locations, setLocations] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);

    console.log(selectedProvince + selectedDistrict + selectedWard);

    useEffect(() => {
        Promise.resolve(VNLocationData)
            .then(data => setLocations(data))
            .catch(err => console.log("err ", err));
    }, []);

    const handleProvinceChange = (event: any) => {
        const provinceName = event.target.value;
        const selectedProvince = locations.find((location: any) => location.Name === provinceName);
        setSelectedProvince(selectedProvince);
        setSelectedDistrict(null);
        setSelectedWard(null);
    };

    const handleDistrictChange = (event: any) => {
        const districtName = event.target.value;
        const selectedDistrict = selectedProvince.Districts.find((district: any) => district.Name === districtName);
        setSelectedDistrict(selectedDistrict);
        setSelectedWard(null);
    };

    const handleWardChange = (event: any) => {
        const wardName = event.target.value;
        const selectedWard = selectedDistrict.Wards.find((ward: any) => ward.Name === wardName);
        setSelectedWard(selectedWard);
    };


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
                        <select onChange={handleProvinceChange} style={{ padding: '10px', marginTop: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}>
                            <option>Select Province</option>
                            {locations.map((location: any) => (
                                <option key={location.Name}>{location.Name}</option>
                            ))}
                        </select>
                        {selectedProvince && (
                            <select onChange={handleDistrictChange} style={{ padding: '10px', marginTop: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}>
                                <option>Select District</option>
                                {selectedProvince.Districts.map((district: any) => (
                                    <option key={district.Name}>{district.Name}</option>
                                ))}
                            </select>
                        )}
                        {selectedDistrict && (
                            <select onChange={handleWardChange} style={{ padding: '10px', marginTop: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}>
                                <option>Select Ward</option>
                                {selectedDistrict.Wards.map((ward: any) => (
                                    <option key={ward.Name}>{ward.Name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2 }}>
                        UPDATE
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfileSetup;

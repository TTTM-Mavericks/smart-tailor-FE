import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Avatar, IconButton, Select, MenuItem, useTheme, InputLabel, FormControl } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { tokens } from '../../../theme';

const host = "https://provinces.open-api.vn/api/";

const ProfileSetup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [profileData, setProfileData] = useState({
        name: 'John',
        surname: '',
        specialty: 'Developer',
        skills: '',
        gender: 'Male',
        birthDate: '2017-06-04',
        phone: '+123456789',
        email: 'demo@gmail.com',
        country: 'Russia',
        city: 'Krasnodar',
        profilePicture: null,
    });

    useEffect(() => {
        fetchAPI(host + "?depth=1", setProvinces);
    }, []);

    const fetchAPI = (api: any, setter: any) => {
        fetch(api)
            .then(response => response.json())
            .then(data => setter(data))
            .catch(error => console.error("Error fetching data:", error));
    };

    const handleChange = (e: any) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e: any) => {
        setProfileData({ ...profileData, profilePicture: e.target.files[0] });
    };

    const handleUpdate = () => {
        console.log('Profile data:', profileData);
    };

    const handleProvinceChange = (e: any) => {
        setSelectedProvince(e.target.value);
        fetchAPI(host + "p/" + e.target.value + "?depth=2", setDistricts);
        setSelectedDistrict("");
        setSelectedWard("");
    };

    const handleDistrictChange = (e: any) => {
        setSelectedDistrict(e.target.value);
        fetchAPI(host + "d/" + e.target.value + "?depth=2", setWards);
        setSelectedWard("");
    };

    const handleWardChange = (e: any) => {
        setSelectedWard(e.target.value);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <Box m="100px">
                        <Box display="flex" alignItems="center" >
                            <Avatar
                                alt="Profile Picture"
                                src={profileData.profilePicture ? URL.createObjectURL(profileData.profilePicture) : ''}
                                sx={{ width: 150, height: 150 }}
                            />
                            <IconButton color="primary" aria-label="upload picture" component="label" style={{ marginLeft: "-10%", marginTop: "30%" }}>
                                <input hidden accept="image/*" type="file" onChange={handleProfilePictureChange} />
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
                    <TextField
                        label="Country"
                        name="country"
                        value={profileData.country}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        labelId='1'
                        label="Province"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        fullWidth
                        style={{ marginTop: "2%" }}
                    >
                        <MenuItem value="">Chọn</MenuItem>
                        {provinces.map((province: any) => (
                            <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                        ))}
                    </Select>
                    <Select
                        label="District"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        fullWidth
                        style={{ marginTop: "2%" }}
                    >
                        <MenuItem value="">Chọn</MenuItem>
                        {districts.map((district: any) => (
                            <MenuItem key={district.code} value={district.code}>{district.name}</MenuItem>
                        ))}
                    </Select>
                    <Select
                        label="Ward"
                        value={selectedWard}
                        onChange={handleWardChange}
                        fullWidth
                        style={{ marginTop: "2%" }}
                    >
                        <MenuItem value="">Chọn</MenuItem>
                        {wards.map((ward: any) => (
                            <MenuItem key={ward.code} value={ward.code}>{ward.name}</MenuItem>
                        ))}
                    </Select>
                    <div id="result">{selectedProvince ? selectedProvince : "Not choose"} | {selectedDistrict ? selectedDistrict : "Not choose"} | {selectedWard ? selectedWard : "Not choose"}</div>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mt: 2 }}>
                        UPDATE
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfileSetup;

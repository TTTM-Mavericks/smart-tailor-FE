import * as React from "react";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

interface User {
    id: number;
    registrarId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
}

interface EditReportPopUpScreenFormProps {
    fid: {
        id: number;
        registrarId: string;
        name: string;
        age: number;
        phone: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
    };
    editClose: () => void;
    updateUser: (updatedUser: User) => void;
}

const EditReportPopUpScreens: React.FC<EditReportPopUpScreenFormProps> = ({ fid, editClose, updateUser }) => {
    const [registrarId, setRegistrarId] = React.useState("");
    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState(1);
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [city, setCity] = React.useState("")
    const [zipCode, setZipCode] = React.useState("")

    React.useEffect(() => {
        setRegistrarId(fid.registrarId);
        setName(fid.name);
        setAge(fid.age);
        setPhone(fid.phone)
        setEmail(fid.email);
        setAddress(fid.address);
        setCity(fid.city)
        setZipCode(fid.zipCode)
    }, [fid]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleRegistrarIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistrarId(e.target.value);
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAge = parseInt(e.target.value)
        setAge((newAge))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    }

    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZipCode(e.target.value);
    }

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);

    const handleSubmit = () => {
        const obj = {
            registrarId: registrarId,
            name: name,
            age: age,
            phone: phone,
            email: email,
            address: address,
            city: city,
            zipCode: zipCode
        };
        const id = fid.id;
        console.log('Update Request:', id, obj);
        console.log(JSON.stringify(obj));
        console.log("id" + id);
        fetch('https://66080c21a2a5dd477b13eae5.mockapi.io/CPSE_DATA_TEST/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                ...obj, id
            }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                console.log('Response:', res);
                if (!res) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                console.log('Update Response Data:', data);
                updateUser(data);
                sessionStorage.setItem("obj", JSON.stringify(obj));
                Swal.fire(
                    `${t(codeLanguage + '000069')}`,
                    `${t(codeLanguage + '000070')}`,
                    'success'
                );
            })
            .catch((err) => {
                console.error('Update Error:', err);
                Swal.fire(
                    `${t(codeLanguage + '000071')}`,
                    `${t(codeLanguage + '000072')}`,
                    'error'
                );
            });
    }

    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                {t(codeLanguage + '000068')}
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={editClose}
            >
                <CloseIcon />
            </IconButton>
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Email" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={registrarId} onChange={handleRegistrarIdChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Phone Number" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={name} onChange={handleNameChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Username" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={age} onChange={handleAgeChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Dob" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={phone} onChange={handlePhoneChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Language" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={email} onChange={handleEmailChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Role" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={address} onChange={handleAddressChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Role" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={city} onChange={handleCityChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Role" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={zipCode} onChange={handleZipCodeChange} />
                </Grid>
            </Grid>
            <div onClick={editClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={handleSubmit} style={{ backgroundColor: "#5858FA", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>{t(codeLanguage + '000060')}</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>{t(codeLanguage + '000055')}</Button>
            </div>
        </Box>
    );
}

export default EditReportPopUpScreens;

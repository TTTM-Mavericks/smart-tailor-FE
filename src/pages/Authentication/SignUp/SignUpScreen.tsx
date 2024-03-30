import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormLabel, IconButton, InputAdornment, Radio, RadioGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import ApiService from '../ApiAuthService';
import { apiBaseUrl, basePonitUrl } from '../../../api/ApiConfig';
import dayjs from 'dayjs';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';

/** Import Css */
import './SignUpStyle.css';
import { Navigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUpScreen() {

    //** Variable */
    const baseUrl = basePonitUrl.auth;
    // const apiService = new ApiService();

    //** UseState variable */ 
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);
    const [formData, setFormData] = React.useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: true,
        dateOfBirth: dayjs(),
        address: "1",
        role: "CUSTOMER"

    });

    const [formErrors, setFormErrors] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        phone: "",
        dateOfBirth: ""
    });

    /**
     * validateFirstName
     * @param value 
     * @returns 
     */
    const validateFirstName = (value: string) => {
        if (!value) {
            return "First Name is required.";
        }
        if (value.length >= 20) {
            return "Frist Name must be lower than 20 character."
        }
        setIsValid(true)
        return "";

    };

    /**
     * validateLastName
     * @param value 
     * @returns 
     */
    const validateLastName = (value: string) => {
        if (!value) {
            return "Last Name is required.";
        }
        if (value.length >= 20) {
            return "Last Name must be lower than 20 character."
        }
        return "";
        setIsValid(true)
    };

    /**
     * validateEmail
     * @param value 
     * @returns 
     */
    const validateEmail = (value: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!value) {
            return "Email is required.";
        } else if (!emailRegex.test(value)) {
            return "Invalid email format.";
        }

        setIsValid(true)
        return "";
    };

    /**
     * validatePassword
     * @param password 
     * @returns 
     */
    const validatePassword = (password: string) => {
        if (!password) {
            return "Password is required.";
        } else if (password.length < 8 || password.length > 20) {
            return "Password must be between 8 and 20 characters.";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        setIsValid(true)
        return "";
    };

    /**
     * validateConfirmPassword
     * @param password 
     * @returns 
     */
    const validateConfirmPassword = (password: string) => {
        if (!password) {
            return "Password is required.";
        } else if (password.length < 8 || password.length > 20) {
            return "Password must be between 8 and 20 characters.";
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }

        if (password !== formData.password) {
            return "Confirm password does not match."
        }

        setIsValid(true)
        return "";
    };

    /**
     * validatePhone
     * @param phone 
     * @returns 
     */
    const validatePhone = (phone: string) => {
        const phoneRegex = /^\d{10}$/;

        if (!phone) {
            return "Phone number is required.";
        } else if (!phoneRegex.test(phone)) {
            return "Please enter a valid 10-digit phone number.";
        }

        setIsValid(true)
        return "";
    };

    /**
     * validateDateOfBirth
     * @param dateOfBirth 
     * @returns 
     */
    const validateDateOfBirth = (dateOfBirth: any) => {
        const currentDate = dayjs();
        const selectedDate = dayjs(dateOfBirth);
        const minDate = dayjs('1903-01-01');

        if (!dateOfBirth) {
            return "Date of birth is required.";
        } else if (selectedDate.isAfter(currentDate)) {
            return "Date of birth cannot be in the future.";
        } else if (selectedDate.isBefore(minDate)) {
            return "Date of birth cannot be earlier than 1903.";
        }

        setIsValid(true)
        return "";
    };

    //** Handle show pasword */ 
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setConfirmShowPassword((show) => !show);

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    /**
     * handleInputChange
     * @param event 
     */
    const handleInputChange = (event: any) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        const errorMessage =
            name === "firstName"
                ? validateFirstName(value)
                : name === "lastName"
                    ? validateLastName(value)
                    : name === "email"
                        ? validateEmail(value)
                        : name === "password"
                            ? validatePassword(value)
                            : name === "phone"
                                ? validatePhone(value)
                                : name === "dateOfBirth"
                                    ? validateDateOfBirth(value)
                                    : name === "confirmPassword"
                                        ? validateConfirmPassword(value)
                                        : ""

        if (errorMessage)
            setIsValid(true);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage,
        }));
    };

    /**
     * handleDateChange
     * @param date 
     */
    const handleDateChange = (date: any) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedDate: date,
        }));
    };

    /**
     * handleRegister
     * @param event 
     */
    const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
        // event.preventDefault();
        // console.log(formData);
        // console.log(apiBaseUrl);
        
        // const requestData = {
        //     firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     email: formData.email,
        //     phone: formData.phone,
        //     password: formData.password,
        //     gender: formData.gender,
        //     dateOfBirth: formData.dateOfBirth.format('YYYY-MM-DD'),
        //     address: "1",
        //     role: "CUSTOMER"
        // }
        // localStorage.setItem("userRegister", JSON.stringify(requestData))

        // const obj = apiService.postData(baseUrl + '/register', requestData);
        // obj.then((res) => {
        //     setIsLoading(true);
        //     setTimeout(() => {
        //         if (res) {
        //             setIsLoading(false);
        //             window.location.href = '/auth/verify'

        //         }
        //     }, 2000)


        // });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {/* {isLoading && (<CircularIndeterminate></CircularIndeterminate>)} */}
            
        </ThemeProvider>
    );
}
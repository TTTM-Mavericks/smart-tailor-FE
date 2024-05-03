import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, makeStyles, Theme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';



// import ApiService from '../ApiAuthService';
import { apiBaseUrl, basePonitUrl } from '../../../api/ApiConfig';
import './SignInStyle.css'
import { ButtonGroup, IconButton, InputAdornment } from '@mui/material';
import { Email, Height, Visibility, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import SignUpScreen from '../SignUp/SignUpScreen';



const defaultTheme = createTheme();


export default function SignInScreen() {

  //** Variable */
//   const apiService = new ApiService();
  const baseUrl = apiBaseUrl;

  // UseSate variable
  const [showLogin, setShowLogin] = React.useState(true);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",

  });

  const [formErrors, setFormErrors] = React.useState({
    email: "",
    password: "",
  });

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
      name === "email"
        ? validateEmail(value)
        : name === "password"
          ? validatePassword(value)

          : ""

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };



  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
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
    return "";
  };

  /**
     * validatePassword
     * @param password 
     * @returns 
     */
  const validatePassword = (password: string) => {
    // if (!password) {
    //   return "Password is required.";
    // } else if (password.length < 8 || password.length > 20) {
    //   return "Password must be between 8 and 20 characters.";
    // }

    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    // if (!passwordRegex.test(password)) {
    //   return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    // }

    // return "";
  };


  const toggleFormRegister = () => {
    setShowRegister(!showRegister);
  };

  const toggleFormLogin = () => {
    setShowLogin(!showLogin);
  };

  /**
   * handleLogin
   * @param event 
   */
//   const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const body = formData
//     console.log(body);
//     console.log(baseUrl + 'auth' + '/login');

//     const obj = apiService.postData('auth' + '/login', body)
//     obj
//     .then((res) => {
//       localStorage.setItem("userID", res.userID)
//       localStorage.setItem("email", res.userID)
//       localStorage.setItem("role", res.role)
//       localStorage.setItem("isLogined", "isLogined")
//       console.log(res);
//       localStorage.setItem("accessToken", res.access_token)
//       const decoded = jwtDecode(res.access_token);

//       console.log(decoded);
//       const currentPage = localStorage.getItem("currentPage")
//       if (currentPage) {
//         window.location.href = currentPage
//       } else {
//         window.location.href = '/'

//       }
//     }).catch((err) => {
//       Swal.fire(
//         'Authentication!',
//         'Your email or password is wrong !!!',
//         'error'
//       );
//     })
//   };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>Hello Login</div>
    </ThemeProvider>
  );
}
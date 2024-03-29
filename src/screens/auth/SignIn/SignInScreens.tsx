import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
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
import Image from '../../../assets/img/backgound-3.jpg';
import GoogleIcon from '../../../assets/img/google-icon.png';
import FacebookIcon from '../../../assets/img/facebook-icon.png';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';



// import ApiService from '../ApiAuthService';
import { apiBaseUrl, basePonitUrl } from '../../../api/ApiConfig';
import './SignInStyle.css'
import { ButtonGroup, IconButton, InputAdornment } from '@mui/material';
import { Email, Height, Visibility, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
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
      <Grid container sx={{ height: 'fit-content', }}>
        {/* Image with fixed height */}
        <Grid item xs={12} sm={6}>
          <img src={Image}
            style={{
              width: '50%',
              height: '100vh',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
            }} />
        </Grid>
        {/* Login Form */}
        <Grid item xs={12} sm={6} justifyContent="center" alignItems="center" sx={{ height: 'fit-content' }}>
          <Container className='login-form' component="main" maxWidth="xs" >
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: -5,
                mt: 3,
              }}
            >
              <Typography className='name-login' component="h1" variant="h5">
                {showRegister ? "Register " : "Login "}
              </Typography>
              <ButtonGroup
                disableElevation
                variant="contained"
                aria-label="Disabled elevation buttons"
                className='btn-group'
              >
                <Button startIcon={<LoginIcon></LoginIcon>} onClick={() => { toggleFormLogin(); toggleFormRegister() }} variant={showRegister ? "outlined" : "contained"} sx={{ height: '35px' }} >Log In</Button>
                <Button startIcon={<PersonIcon></PersonIcon>} onClick={() => { toggleFormLogin(); toggleFormRegister() }} variant={showLogin ? "outlined" : "contained"} sx={{ height: '35px' }}>Register</Button>
              </ButtonGroup>
            </Box>
            <Box
              sx={{
                marginTop: 8,
                display: showRegister ? 'none' : 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                //sdsd
              }}
            >

              <div style={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  size='small'
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2, height: '40px' }}
                >
                  Log In
                </Button>
                <Button
                  type="submit"
                  className='btn-gg'
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 0, mb: 0, mr: '4%', width: '48%', height: '40px' }}
                  startIcon={<img className='login-icon' src={GoogleIcon} alt="Image" />}
                >
                  Google
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 0, mb: 0, width: '48%', height: '40px' }}
                  startIcon={<img className='login-icon' src={FacebookIcon} alt="Image" />}
                >
                  Facebook
                </Button>
                <Grid item xs sx={{ mt: 5 }}>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </div>
            </Box>
          </Container>

          {showRegister ? <SignUpScreen /> : null}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
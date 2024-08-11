import React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './SignInStyle.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import './SignInStyle.css'
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie'
import axios from 'axios';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

const SignInDialog = () =>{

    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>('Email');
    const [errorEmailValidate, setEmailErrorValidate] = React.useState<string>('');
    const [isEmailValidate, setIsEmailValidate] = React.useState<boolean>(true);
    const [password, setPassword] = React.useState<string>('');
    const [errorPasswordValidate, setPasswordErrorValidate] = React.useState<string>('');
    const [isPasswordValidate, setIsPasswordValidate] = React.useState<boolean>(true);
    const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
    const [isLoading, setIsloading] = React.useState<boolean>(false);
  
    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();
    const googleLoginButtonRef = React.useRef<HTMLDivElement>(null);
  
    // ---------------UseEffect---------------//
  
    React.useEffect(() => {
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('language', selectedLanguage);
  
    }, [selectedLanguage, i18n]);
  
    React.useEffect(() => {
      console.log(Math.floor(Date.now() / 1000));
      if (selectedLanguage) {
        const uppercase = selectedLanguage.toUpperCase();
        setCodeLanguage(uppercase);
      }
  
    }, [selectedLanguage]);
  
  
  
    // ---------------FunctionHandler---------------//
    /**
     * Hanlde change language
     * @param language 
     */
    const __handleLanguageChange = (language: string) => {
      setSelectedLanguage(language);
    };
  
  
    const __handleClickShowPassword = () => setShowPassword((show) => !show);
  
  
    /**
     * Handle signin
     * @param event 
     */
    const __handleSignIn = async () => {
      setIsloading(true);
      if (isEmailValidate && isPasswordValidate) {
        try {
          const requestData = {
            email: email,
            password: password,
          };
  
          const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signin}`, requestData);
          if (response.status === 200) {
            localStorage.setItem('userAuth', JSON.stringify(response.data.user));
            const authToken = response.data.access_token;
            const refreshToken = response.data.refresh_token;
  
            Cookies.set('token', authToken);
            Cookies.set('refreshToken', refreshToken);
  
            // if (response.data.user.role === 'CUSTOMER') {
            //   localStorage.setItem('subrole', JSON.stringify(response.subrole));
            // }
            console.log(response.data.user);
            setTimeout(() => {
                window.location.reload;
            }, 2000)
  
          } else {
            setIsloading(false);
            toast.error(`${response.message}`, { autoClose: 3000 });
  
          }
          console.log(response);
  
        } catch (error: any) {
          console.error('Error posting data:', error);
          setIsloading(false);
          toast.error(`${error}`, { autoClose: 3000 });
  
  
          // Toast.show({
          //   type: 'error',
          //   text1: JSON.stringify(error.message),
          //   position: 'top'
          // });
        }
      } else {
        setEmailErrorValidate(errorEmailValidate);
        setPasswordErrorValidate(errorPasswordValidate);
      }
    };
  
    const __handleSignInGoogle = async () => {
      // return (
      //   <GoogleOAuthProvider clientId="1051460649548-ijlrpmgdcmd5td1apidcpauh3dhv7u26.apps.googleusercontent.com">
      //     <button
      //       type="submit"
      //       className={`${styles.signinGoogle__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
  
      //     >
      //       <GoogleLogin
      //         onSuccess={__handleLoginSuccess}
      //         onError={() => {
      //           console.log('Login Failed');
      //         }}
  
      //       />
      //     </button>
      //   </GoogleOAuthProvider>
      // )
      if (googleLoginButtonRef.current) {
        const button = document.getElementById('hehe');
        if (button) {
          button.click();
        }
      }
    };
  
    const __handleLoginSuccess = (response: any) => {
      try {
        const { credential } = response;
        console.log('credential: ', credential);
        fetch(`${baseURL}/api/v1/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authRequest: credential }),
        })
          .then((res) => res.json())
          .then((resp) => {
            if (resp.data.access_token) {
              const authToken = response.data.access_token;
              const refreshToken = response.data.refresh_token;
              Cookies.set('token', authToken);
              Cookies.set('refreshToken', refreshToken);
              console.log('data.jwtToken: ', resp.data);
              axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
              localStorage.setItem('userAuth', JSON.stringify(resp.data.user));
            }
            setIsloading(true);
            setTimeout(() => {
              window.location.reload;
            }, 2000)
          });
      } catch (error) {
        toast.error(`${error}`, { autoClose: 3000 });
      }
  
    };
  
  
    const signInBox = () => {
      return (
        <div className={styles.signinDialog__box}>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-20 w-auto"
                style={{ borderRadius: 90 }}
                src={systemLogo}
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {t(codeLanguage + '000014')}
              </h2>
            </div>
  
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="space-y-6" >
  
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Email'
                    autoComplete="email"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signIn_input}`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
  
              </div>
  
              <div>
  
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t(codeLanguage + '000010')}
                    autoComplete="current-password"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signIn_input}`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
  
                  {/* Show/hide password toggle button */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    onClick={__handleClickShowPassword}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
  
                <div className="flex items-center justify-between">
                  <div className="text-sm mt-2 mb-2">
                    <a onClick={() => window.location.href = `/auth/getpassword/${email ? email : 'Email'}`} style={{ cursor: 'pointer' }} className="font-semibold text-indigo-600 hover:text-indigo-500">
                      {t(codeLanguage + '000007')} ?
                    </a>
                  </div>
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className={`${styles.signin__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
                  onClick={() => __handleSignIn()}
                >
                  {t(codeLanguage + '000002')}
                </button>
  
  
                {/* <button
                type="submit"
                className={`${styles.signinGoogle__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
                onClick={() => login()}
              >
                {t(codeLanguage + '000005')}
              </button> */}
  
  
                <GoogleLogin
                  width={380}
                  size='large'
                  text="signin_with"
                  theme={'filled_blue'}
                  type='standard'
                  onSuccess={__handleLoginSuccess}
                  onError={() => {
                    toast.error(`Sign in faild`, { autoClose: 3000 });
                  }}
                  containerProps={{
                    style: {
                      width: "100% !important",
                      backgroundColor: '#1A73E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4
                    },
                  }}
                  cancel_on_tap_outside
                />
  
              </div>
  
  
  
  
              <p className="mt-10 text-center text-sm text-gray-500">
                {t(codeLanguage + '000008')}?{' '}
                <a href="/auth/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  {t(codeLanguage + '000015')}
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }
  
  
  
    return (
      <GoogleOAuthProvider clientId="1051460649548-ijlrpmgdcmd5td1apidcpauh3dhv7u26.apps.googleusercontent.com">
  
        <ThemeProvider theme={defaultTheme}>
          <ToastContainer />
          <LoadingComponent isLoading={isLoading} time={5000}></LoadingComponent>
          <div className={styles.signInDialog__container}>
            {signInBox()}
          </div>
        </ThemeProvider>
      </GoogleOAuthProvider>
  
  
    );
  }



export default SignInDialog;
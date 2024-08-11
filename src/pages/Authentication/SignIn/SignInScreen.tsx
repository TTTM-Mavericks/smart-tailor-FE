import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './SignInStyle.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import './SignInStyle.css'
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api, { baseURL, featuresEndpoints, functionEndpoints, isAuthenticated, versionEndpoints } from '../../../api/ApiConfig';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie'
import axios from 'axios';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageMasonry from '../../../components/ImageMasonry/ImageMasonryCoponent';
import { __validateEmail } from '../Utils';
import { useNavigate } from 'react-router-dom';
import BrandProductivityInputDialog from '../../BrandManagement/GlobalComponent/Dialog/BrandProductivity/BrandProductivityInputDialog';

const defaultTheme = createTheme();



function SignInScreen() {

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
  const [showDialog, setShowDialog] = React.useState(false);

  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  const googleLoginButtonRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ---------------UseEffect---------------//

  /**
 * Fetch validate token
 */
  React.useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const isValid = isAuthenticated(token);
      if (isValid) {
        navigate('/')
      }
    }
  }, []);

  React.useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);

  }, [selectedLanguage, i18n]);

  React.useEffect(() => {
    if (selectedLanguage) {
      const uppercase = selectedLanguage.toUpperCase();
      setCodeLanguage(uppercase);
    }

  }, [selectedLanguage]);

  /**
  * Validate Email
  */
  React.useEffect(() => {
    const error = __validateEmail(email);
    if (!error.isValid && error.error) {
      setEmailErrorValidate(error.error);
      setIsEmailValidate(false);
    } else {
      setEmail(email);
      setIsEmailValidate(true);
    }
  }, [email]);



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
   * 
   * @param roleName 
   * @returns 
   */
  const roleBasedRedirect = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return '/admin';
      case 'EMPLOYEE':
        return '/employee';
      case 'MANAGER':
        return '/manager';
      case 'ACCOUNTANT':
        return '/accountant';
      default:
        return '/';
    }
  };

  /**
   * Handle signin
   * @param event 
   */
  const __handleSignIn = async () => {
    if (isEmailValidate && isPasswordValidate) {
      setIsloading(true);
      try {
        const requestData = {
          email: email,
          password: password,
        };

        const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signin}`, requestData);
        if (response.status === 200) {
          const { user, access_token, refresh_token } = response.data;

          localStorage.setItem('userAuth', JSON.stringify(user));
          Cookies.set('token', access_token);
          Cookies.set('refreshToken', refresh_token);
          Cookies.set('userAuth', JSON.stringify(user));

          const redirectUrl = roleBasedRedirect(user.roleName);
          console.log('User role:', user.roleName); // Debugging line
          console.log('Redirect URL:', redirectUrl); // Debugging line

          if (!localStorage.getItem('brandFirstLogin')) {
            localStorage.setItem('brandFirstLogin', 'true');
          }

          if (localStorage.getItem('brandFirstLogin') === 'false') {
            window.location.href = '/brand';
            return;
          }

          // Check if user role is 'BRAND'
          if (user.roleName === 'BRAND') {
            try {
              // Fetch brand data by ID
              const fetchApiBrand = await api.get(
                `${versionEndpoints.v1}${featuresEndpoints.brand}${functionEndpoints.brand.getBrandByID}/${user.userID}`
              );
              const { brandName, brandStatus } = fetchApiBrand.data;

              // Navigate based on brand data
              if (!brandName) {
                window.location.href = `/brand/updateProfile/${user.userID}`;
              } else if (brandStatus === 'PENDING') {
                window.location.href = '/brand/waiting_process_information';
              } else if (localStorage.getItem('brandFirstLogin') === 'false') {
                window.location.href = '/brand';
              } else {
                localStorage.setItem('brandFirstLogin', 'true');
                setTimeout(() => {
                  window.location.href = '/brand';
                }, 100);
              }
            } catch (error) {
              console.error('Error fetching brand data:', error);
            }
          } else {
            // Navigate to the appropriate page based on role
            navigate(redirectUrl);
          }
        }
      } catch (error: any) {
        console.error('Error posting data:', error);
        if (error.response) {
          toast.error(`${error.response.data.message || 'An error occurred'}`, { autoClose: 3000 });
        } else {
          toast.error('Network error. Please try again.', { autoClose: 3000 });
        }
      } finally {
        setIsloading(false);
      }
    } else {
      setEmailErrorValidate(errorEmailValidate);
      setPasswordErrorValidate(errorPasswordValidate);
      toast.error(`Invalid Email or Password`, { autoClose: 3000 });
    }
  };

  const __handleLoginSuccess = (response: any) => {
    try {
      const { credential } = response;
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
            const authToken = resp.data.access_token;
            const refreshToken = resp.data.refresh_token;
            Cookies.set('token', authToken);
            Cookies.set('refreshToken', refreshToken);
            axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
            localStorage.setItem('userAuth', JSON.stringify(resp.data.user));
            Cookies.set('userAuth', JSON.stringify(resp.data.user));

          }
          setIsloading(true);
          setTimeout(() => {
            window.location.href = '/';
          }, 2000)
        });
    } catch (error) {
      toast.error(`${error}`, { autoClose: 3000 });
    }

  };

  const login = useGoogleLogin({

    onSuccess: (tokenResponse: any) => {
      __handleLoginSuccess(tokenResponse);
    },
    onError: () => {
      console.log('Login Failed');
    },
  });

  const signInBox = () => {
    return (
      <div className={styles.signin__box}>
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
        <ImageMasonry></ImageMasonry>
        <ToastContainer />
        <LoadingComponent isLoading={isLoading} time={5000}></LoadingComponent>
        <div className={styles.signin__container}>
          <Menu as="div" className={`${styles.icon_language}`}>
            <div >
              <Menu.Button className="relative flex rounded-full text-sm focus:outline-none ">
                <img
                  className="h-10 w-18"
                  src={selectedLanguage === 'en' ? usaFlag : vietnamFlag}
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"

            >
              <Menu.Items className="absolute justify-center items-center right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  <button className={`flex  space-x-2 ${styles.language__button}`} onClick={() => __handleLanguageChange('vi')}>
                    <div className={`${styles.language__button}`}>
                      <img src={vietnamFlag} style={{ width: '35px', height: '35px', marginLeft: 30 }}></img>
                      <span className='text-black'>{t(codeLanguage + '000016')}</span>
                    </div>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className={`flex  space-x-2 ${styles.language__button}`} onClick={() => __handleLanguageChange('en')}>
                    <div className={`${styles.language__button}`}>
                      <img src={usaFlag} style={{ width: '35px', height: '35px', marginLeft: 30 }}></img>
                      <span className='text-black'>{t(codeLanguage + '000025')}</span>
                    </div>
                  </button>
                </Menu.Item>
              </Menu.Items>

            </Transition>
          </Menu>
          {signInBox()}
        </div>
        {showDialog && <BrandProductivityInputDialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            window.location.href = '/brand';
          }}
        />}
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export const SignInBox = SignInScreen.prototype.signInBox;
export default SignInScreen
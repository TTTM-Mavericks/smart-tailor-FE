import * as React from 'react';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import styles from './SignInStyle.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaFlagUsa, FaFlag } from 'react-icons/fa';
// import ApiService from '../ApiAuthService';
import { apiBaseUrl } from '../../../api/ApiConfig';
import './SignInStyle.css'
import { jwtDecode } from "jwt-decode";
import { primaryColor } from '../../../root/ColorSystem';
import { languageIcon, systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react';

const defaultTheme = createTheme();



export default function SignInScreen() {

  // ---------------UseState Variable---------------//
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
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
  const [codeLanguage, setCodeLanguage] = React.useState('EN');
  // ---------------Usable Variable---------------//
  const baseUrl = apiBaseUrl;
  const { t, i18n } = useTranslation();

  // ---------------UseEffect---------------//
  React.useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);

  }, [selectedLanguage, i18n]);

  React.useEffect(() => {
    if (selectedLanguage) {
      const uppercase = selectedLanguage.toUpperCase();
      setCodeLanguage(uppercase)
    }

  }, [selectedLanguage]);

  // ---------------FunctionHandler---------------//

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };
  // UseSate variable


  /**
     * handleInputChange
     * @param event 
     */
  // const handleInputChange = (event: any) => {
  //   const { name, value, type, checked } = event.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: type === 'checkbox' ? checked : value,
  //   }));

  //   const errorMessage =
  //     name === "email"
  //       ? validateEmail(value)
  //       : name === "password"
  //         ? validatePassword(value)

  //         : ""

  //   setFormErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: errorMessage,
  //   }));
  // };



  const __handleClickShowPassword = () => setShowPassword((show) => !show);

  /**
       * validateEmail
       * @param value 
       * @returns 
       */
  // const validateEmail = (value: string | any) => {
  //   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //   if (!value) {
  //     return "Email is required.";
  //   } else if (!emailRegex.test(value)) {
  //     return "Invalid email format.";
  //   }
  //   return "";
  // };

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
      <div className={styles.signin__container}>
        <Menu as="div" className={`${styles.icon_language}`}>
          <div >
            <Menu.Button className="relative flex rounded-full text-sm focus:outline-none ">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
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
                <button className={`flex  space-x-2 ${styles.language__button}`} onClick={() => handleLanguageChange('vi')}>
                  <div className={`${styles.language__button}`}>
                    <img src={vietnamFlag} style={{ width: '35px', height: '35px', marginLeft: 30 }}></img>
                    <span className='text-black'>{t(codeLanguage + '000016')}</span>
                  </div>
                </button>
              </Menu.Item>
              <Menu.Item>
                <button className={`flex  space-x-2 ${styles.language__button}`} onClick={() => handleLanguageChange('en')}>
                  <div className={`${styles.language__button}`}>
                    <img src={usaFlag} style={{ width: '35px', height: '35px', marginLeft: 30 }}></img>
                    <span className='text-black'>USA</span>
                  </div>

                </button>
              </Menu.Item>
            </Menu.Items>

          </Transition>
        </Menu>

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
                  />
                </div>
              </div>

              <div>

                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} // Toggle input type based on visibility state
                    placeholder={t(codeLanguage + '000010')}
                    autoComplete="current-password"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signIn_input}`}
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
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      {t(codeLanguage + '000007')} ?
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex mb-2 h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t(codeLanguage +'000002')}
                </button>


                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => window.location.href = 'https://st.mavericks-tttm.studio/oauth2/authorization/google'}
                >
                  {t(codeLanguage +'000005')}
                </button>

              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                {t(codeLanguage +'000008')}?{' '}
                <a href="/auth/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  {t(codeLanguage + '000015')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
import * as React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './SignUpStyle.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi';

// import ApiService from '../ApiAuthService';
import './SignUpStyle.css'
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';

// import Logo from '../../../assets/system/smart-tailor_logo.png'
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api, { baseURL, featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { __validateEmail, __validatePassword } from '../Utils';


const defaultTheme = createTheme();


export default function SignUpScreen() {

  // ---------------UseState Variable---------------//
  const [showLogin, setShowLogin] = React.useState(true);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
  const [codeLanguage, setCodeLanguage] = React.useState('EN');
  const [email, setEmail] = React.useState('');
  const [errorEmailValidate, setEmailErrorValidate] = React.useState('');
  const [isEmailValidate, setIsEmailValidate] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [errorPasswordValidate, setPasswordErrorValidate] = React.useState('');
  const [isPasswordValidate, setIsPasswordValidate] = React.useState(true);


  // ---------------Usable Variable---------------//
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

  /**
   * Validate Password
   */
  React.useEffect(() => {
    const error = __validatePassword(password);
    if (!error.isValid && error.error) {
      setPasswordErrorValidate(error.error);
      setIsPasswordValidate(false);
    } else {
      setPassword(password);
      setIsPasswordValidate(true);
    }
  }, [password]);


  // ---------------FunctionHandler---------------//
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const __handleClickShowPassword = () => setShowPassword((show) => !show);


  /**
     * SignUp handler
     * @param event 
     */
  const __handleSignUp = async () => {

    try {
      const requestData = {
        email: email,
        password: password,
      }

      const response = await api.post(`${baseURL + versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signup}`, requestData);
      if (response.success === 200) {
        // sessionStorage.setItem('userData', JSON.stringify(response.data.user));
        // sessionStorage.setItem('access_token', JSON.stringify(response.data.access_token));
        // sessionStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
        console.log(response.data);
        setTimeout(() => {

        }, 1000)
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: JSON.stringify(response.message),
        //   position: 'top'
        // });
        

      }
      console.log(response);
    } catch (error: any) {
      console.error('Error posting data:', error);
      // Toast.show({
      //   type: 'error',
      //   text1: JSON.stringify(error.message),
      //   position: 'top'
      // });
      // setIsLoading(false);
    }


  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={styles.signup__container}>

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

        <div className={styles.signup__box}>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-20 w-auto"
                style={{ borderRadius: 90 }}
                src={systemLogo}
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {t(codeLanguage + '000003')}
              </h2>
            </div>

            <div className="sm:mx-auto text-center sm:w-full sm:max-w-sm">
              <h4>{t(codeLanguage + '000017')}</h4>
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
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signup__input}`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {!isEmailValidate && (
                  <span className={`${styles.error__txt}`}>{errorEmailValidate}</span>
                )}
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
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signup__input}`}
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
                {!isPasswordValidate && (
                  <span className={`${styles.error__txt}`}>{errorPasswordValidate}</span>
                )}
              </div>

              <div>
                <div className="relative mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type={showPassword ? "text" : "password"} // Toggle input type based on visibility state
                    placeholder={t(codeLanguage + '000011')}
                    autoComplete="current-password"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signup__input}`}
                  />
                  {/* Show/hide password toggle button */}
                  {/* <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                    onClick={__handleClickShowPassword}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button> */}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm mt-2 mb-2">

                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`${styles.signup__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
                  onClick={() => __handleSignUp()}
                >
                  {t(codeLanguage + '000003')}
                </button>


                <button
                  type="submit"
                  className={`${styles.signupGoogle__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
                  onClick={() => window.location.href = 'https://st.mavericks-tttm.studio/oauth2/authorization/google'}
                >
                  {t(codeLanguage + '000006')}
                </button>

              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                {t(codeLanguage + '000013')}?{' '}
                <a href="/auth/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  {t(codeLanguage + '000018')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
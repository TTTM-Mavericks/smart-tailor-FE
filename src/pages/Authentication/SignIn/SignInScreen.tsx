import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './SignInStyle.module.scss';
import { HiEye, HiEyeOff } from 'react-icons/hi';
// import ApiService from '../ApiAuthService';
import './SignInStyle.css'
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const defaultTheme = createTheme();



export default function SignInScreen() {

  // ---------------UseState Variable---------------//
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
  const [showLogin, setShowLogin] = React.useState(true);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [errorEmailValidate, setEmailErrorValidate] = React.useState('');
  const [isEmailValidate, setIsEmailValidate] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [errorPasswordValidate, setPasswordErrorValidate] = React.useState('');
  const [isPasswordValidate, setIsPasswordValidate] = React.useState(true);
  const [codeLanguage, setCodeLanguage] = React.useState('EN');

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
  /**
 * SignIn
 */
  const __handleSignIn = async () => {
    if (isEmailValidate && isPasswordValidate) {
      try {
        const requestData = {
          email: email,
          password: password
        };

        const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signin}`, requestData);
        if (response.success === 200) {
          // sessionStorage.setItem('userData', JSON.stringify(response.data.user));
          // sessionStorage.setItem('access_token', JSON.stringify(response.data.access_token));
          // sessionStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
          // if (response.data.user.role === 'CUSTOMER') {
          //   sessionStorage.setItem('subrole', JSON.stringify(response.subrole));
          // }
          console.log(response.data.user);


        } else {

        }
        console.log(response);

      } catch (error: any) {
        console.error('Error posting data:', error);
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
    if (isEmailValidate && isPasswordValidate) {
      try {
        const requestData = {
          email: email,
          password: password
        };

        const response = await api.get(`/oauth2/authorization/google`, requestData);
        if (response.success === 200) {
          // sessionStorage.setItem('userData', JSON.stringify(response.data.user));
          // sessionStorage.setItem('access_token', JSON.stringify(response.data.access_token));
          // sessionStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
          // if (response.data.user.role === 'CUSTOMER') {
          //   sessionStorage.setItem('subrole', JSON.stringify(response.subrole));
          // }
          console.log(response.data);


        } else {

        }
        console.log(response);

      } catch (error: any) {
        console.error('Error posting data:', error);
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

  const handleLoginSuccess = (response: any) => {
    const { credential } = response;
    // Gửi token đến backend để xác thực và nhận JWT token
    fetch('https://be.mavericks-tttm.studio/api/v1/auth/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Lưu JWT token vào localStorage
        localStorage.setItem('jwtToken', data.jwtToken);
        // Chuyển hướng tới trang chủ
        window.location.href = '/';
      });
  };


  return (
    <ThemeProvider theme={defaultTheme}>
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
                    <a href="/auth/getpassword" className="font-semibold text-indigo-600 hover:text-indigo-500">
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


                <button
                  type="submit"
                  className={`${styles.signinGoogle__btn} flex mb-2 h-11 w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white`}
                  onClick={() => window.location.href = 'https://be.mavericks-tttm.studio/oauth2/authorization/google'}
                // onClick={() => __handleSignInGoogle()}
                >
                  {t(codeLanguage + '000005')}
                </button>

              </div>

              <GoogleOAuthProvider clientId="1051460649548-ijlrpmgdcmd5td1apidcpauh3dhv7u26.apps.googleusercontent.com">
                <div className="App">
                  <h1>Login with Google</h1>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
              </GoogleOAuthProvider>

              <p className="mt-10 text-center text-sm text-gray-500">
                {t(codeLanguage + '000008')}?{' '}
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
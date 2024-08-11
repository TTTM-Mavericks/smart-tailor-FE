import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './ForgotPassWordStyle.module.scss';
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { __validateEmail, __validatePassword } from '../Utils';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { greenColor, redColor, secondaryColor } from '../../../root/ColorSystem';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { toast, ToastContainer } from 'react-toastify';

const defaultTheme = createTheme();


export default function ForgotPassWordScreen() {

  const { emailParam } = useParams();

  // ---------------UseState Variable---------------//
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
  const [email, setEmail] = React.useState<string>(emailParam ? emailParam : '');
  const [errorEmailValidate, setEmailErrorValidate] = React.useState<string>('');
  const [isEmailValidate, setIsEmailValidate] = React.useState<boolean>(true);
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
  const [isVerify, setIsVerify] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [errorPasswordValidate, setPasswordErrorValidate] = React.useState<string>('');
  const [isPasswordValidate, setIsPasswordValidate] = React.useState<boolean>(true);
  const [hideResent, setHideResent] = React.useState<boolean>(false);

  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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

  /**
    * Check verify status
    *
    */
  React.useEffect(() => {
    if (isEmailSent) {
      let intervalId: any;
      const checkVerificationStatus = async () => {
        console.log('reset init');
        try {
          console.log(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.checkVerifyPassword}/${email}`);
          const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.checkVerifyPassword}/${email}`);
          if (response.status === 200) {
            console.log('verify');
            setIsVerify(true);
            clearInterval(intervalId);
          } else {
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
          setIsLoading(false);
        }
      };
      intervalId = setInterval(checkVerificationStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isEmailSent]);

  // ---------------FunctionHandler---------------//

  /**
   * Handle change language
   */
  const __handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  /**
   * Handle retrieve password
   * @param event 
   */
  const __handleRetrievePassword = async () => {

    if (!isEmailValidate) {
      setEmailErrorValidate(errorEmailValidate);
      toast.error(`Email invalidate`, { autoClose: 4000 });
      return;

    }

    setIsLoading(true);
    try {
      const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.forgot}/${email}`);
      if (response.status === 200) {
        console.log('retrieve');
        setIsEmailSent(true);
        localStorage.setItem('email', email);
        setIsLoading(false);

      } else {
        console.log(response);
        setIsLoading(false);
        toast.error(`${response.message}`, { autoClose: 4000 });
      }

    } catch (error: any) {
      console.error('Error posting data:', error);
      setIsEmailSent(false);
      setIsLoading(false);
      toast.error(`${error}`, { autoClose: 4000 });

    }

  };

  /**
 * Handle retrieve password
 * @param event 
 */
  const __handleChangePassword = async () => {

    if (!isPasswordValidate) {

      setPasswordErrorValidate(errorPasswordValidate);
      toast.error(`Password invalidate`, { autoClose: 4000 });
      return;

    }

    try {
      const request = {
        email: email,
        password: password,
      }

      console.log(request);
      const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.updatePassword}`, request);
      if (response.status === 200) {
        console.log(response);
        toast.success(`${response.message}`, { autoClose: 4000 });
        setTimeout(() => {
          setIsLoading(true);
          navigate('/auth/signin');
        }, 3000)
      } else {
        console.log(response);
        toast.error(`${response.message}`, { autoClose: 4000 });

      }

    } catch (error: any) {
      toast.error(`${error}`, { autoClose: 3000 });
      console.error('Error posting data:', error);
    }

  };

  /**
   * Handle hide or show password
   */
  const __handleClickShowPassword = () => setShowPassword((show) => !show);

  const __handleVerifyAllert = () => {
    toast.error(`Please verify email to change password`, { autoClose: 4000 });

  }

  /**
     * Handle resend to email
     */
  const __handleResendEmail = async () => {
    setIsEmailSent(false);
    console.log(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.resendVerificationToken}/${email}`);
    try {
      setIsLoading(true);
      const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.resendVerificationToken}/${email}`);
      if (response.status === 200) {
        console.log('resend');
        toast.success(`${response.message}`, { autoClose: 4000 });
        setIsEmailSent(true);
        setIsLoading(false);
        setHideResent(true);
        setTimeout(() => {
        }, 2000)
      } else {
        setIsLoading(false);
        toast.error(`${response.message}`, { autoClose: 4000 });
        setIsEmailSent(false);
      }
    } catch (error: any) {
      console.error('Error posting data:', error);
      toast.error(`${error}`, { autoClose: 4000 });
      setIsLoading(false);
      setIsEmailSent(false);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <LoadingComponent isLoading={isLoading} time={5000}></LoadingComponent>
      <ToastContainer />
      <div className={styles.forgot__container}>
        <Menu as="div" className={`${styles.icon_language}`}>
          <div >
            <Menu.Button className="relative flex rounded-full text-sm focus:outline-none ">
              <span className="absolute -inset-1.5" />
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

        <div className={styles.forgot__box}>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-20 w-auto"
                style={{ borderRadius: 90 }}
                src={systemLogo}
              />
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {t(codeLanguage + '000119')}
              </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="space-y-0" >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm mt-2 mb-2">
                      <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                        {t(codeLanguage + '000120')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    value={email}
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Email'
                    autoComplete="email"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.forgot__input}`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {!isEmailValidate && (
                  <span className={`${styles.error__txt}`}>{errorEmailValidate}</span>
                )}
                {isVerify && (
                  <div className='mt-0'>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm mt-2 mb-0">
                          <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Enter new password
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"} // Toggle input type based on visibility state
                        placeholder={t(codeLanguage + '000010')}
                        autoComplete="current-password"
                        required
                        className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.forgot__input}`}
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
                )}
              </div>



              <div className="mt-2">
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{ backgroundColor: !isEmailSent ? secondaryColor : isVerify ? greenColor : redColor }}
                  onClick={() => !isEmailSent ? __handleRetrievePassword() : isVerify ? __handleChangePassword() : __handleVerifyAllert()}
                >
                  {!isEmailSent ? 'Retrieve new password' : !isVerify ? 'Please verify in your email' : 'Change password'}
                </button>

                {isEmailSent && (
                  <p className="mt-5 pr-1 text-center text-sm text-gray-500">
                    Have not recieved yet? {' '}
                    <a style={{ cursor: 'pointer', color: redColor }} onClick={() => __handleResendEmail()} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                      Resend email
                    </a>
                  </p>
                )}
              </div>

              <p className="mt-2 text-center text-sm text-gray-500">
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
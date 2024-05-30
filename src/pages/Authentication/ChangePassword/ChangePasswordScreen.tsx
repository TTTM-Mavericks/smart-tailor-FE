import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './ChangePasswordStyle.module.scss';
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { grayColor, redColor, secondaryColor } from '../../../root/ColorSystem';
import { __validatePassword } from '../Utils';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { useParams } from 'react-router-dom';

const defaultTheme = createTheme();
const SECONDS_LEFT = 5


export default function ChangePasswordScreen() {

  // ---------------UseState Variable---------------//
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
  const [showLogin, setShowLogin] = React.useState<boolean>(true);
  const [showRegister, setShowRegister] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');
  const [errorPasswordValidate, setPasswordErrorValidate] = React.useState<string>('');
  const [isPasswordValidate, setIsPasswordValidate] = React.useState<boolean>(true);
  const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
  const [secondsLeft, setSecondsLeft] = React.useState<number>(SECONDS_LEFT);
  const [isPasswordChanged, setIspasswordChanged] = React.useState<boolean>(false);
  // ---------------Usable Variable---------------//
  const { t, i18n } = useTranslation();
  const { email } = useParams();

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

  React.useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);

      // Cleanup interval on component unmount or when secondsLeft changes
      return () => clearInterval(timerId);
    }
  }, [secondsLeft]);

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
 * Starts a countdown timer from the specified number of seconds.
 * @param seconds - The number of seconds to count down from.
 * @param onTick - Callback function to execute on each tick (every second).
 * @param onComplete - Callback function to execute when the countdown completes.
 */
  const __handlecountdown = (seconds: number, onTick: (secondsLeft: number) => void, onComplete: () => void): void => {
    let currentSeconds = seconds;

    const intervalId = setInterval(() => {
      onTick(currentSeconds);

      if (currentSeconds <= 0) {
        clearInterval(intervalId);
        onComplete();
      }

      currentSeconds--;
    }, 1000);
  };

  /**
   * Handle retrieve password
   * @param event 
   */
  const __handleChangePassword = async () => {
    if (isPasswordValidate) {
      try {
        const request = {
          email: email,
          password: password,
        }

        console.log(request);
        const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.updatePassword}`, request);
        if (response.status === 200) {
          console.log(response.data.user);
          setIspasswordChanged(true)

        } else {
          console.log(response);
        }

      } catch (error: any) {
        console.error('Error posting data:', error);
        setIspasswordChanged(false)
      }
    } else {
      setPasswordErrorValidate(errorPasswordValidate);
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={styles.changepassword__container}>
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
                    <span className='text-black'>{t(codeLanguage + '000025')}</span>
                  </div>

                </button>
              </Menu.Item>
            </Menu.Items>

          </Transition>
        </Menu>

        <div className={styles.changepassword__box}>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-20 w-auto"
                style={{ borderRadius: 90 }}
                src={systemLogo}
              />
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {t(codeLanguage + '000123')}
              </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="space-y-0" >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm mt-2 mb-2">
                      <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                        {t(codeLanguage + '000124')}
                      </span>
                    </div>
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
                      className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.changepassword__input}`}
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
              </div>



              <div className="mt-2">

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => __handleChangePassword()}
                >
                  {`${t(codeLanguage + '000125')}`}

                </button>
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
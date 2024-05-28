import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './VerifyEmailStyle.module.scss';
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { grayColor, redColor, secondaryColor } from '../../../root/ColorSystem';

const defaultTheme = createTheme();
const SECONDS_LEFT = 5


export default function VerifyEmailScreen() {

  // ---------------UseState Variable---------------//
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
  const [showLogin, setShowLogin] = React.useState(true);
  const [showRegister, setShowRegister] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
  const [secondsLeft, setSecondsLeft] = React.useState<number>(SECONDS_LEFT);
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

  React.useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setInterval(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);

      // Cleanup interval on component unmount or when secondsLeft changes
      return () => clearInterval(timerId);
    }
  }, [secondsLeft]);

  // ---------------FunctionHandler---------------//

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

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


  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={styles.signin__container}>
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

        <div className={styles.signin__box}>
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
                <div className="mt-2">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    placeholder='XXXXXX'
                    autoComplete="email"
                    required
                    className={`block h-11 w-full pl-3 pr-10 rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6  ${styles.signIn_input}`}
                  />
                </div>
              </div>



              <div className="mt-2">

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  style={{ backgroundColor: secondsLeft !== 0 ? secondaryColor : redColor }}
                >
                  {secondsLeft !== 0 ? `${t(codeLanguage + '000125')} ( ${secondsLeft}s )` : `${t(codeLanguage + '000127')}`}

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
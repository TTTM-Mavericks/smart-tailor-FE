import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './VerifyEmailStyle.module.scss';
import { systemLogo, usaFlag, vietnamFlag } from '../../../assets';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { greenColor, redColor } from '../../../root/ColorSystem';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';

const defaultTheme = createTheme();
const SECONDS_LEFT = 5


export default function VerifyEmailScreen() {

    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');
    const [secondsLeft, setSecondsLeft] = React.useState<number>(SECONDS_LEFT);
    const [isVerify, setIsVerify] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isResend, setIsResend] = React.useState<boolean>(false);
    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();
    const { email } = useParams();
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
    * Check verify status
    *
    */
    React.useEffect(() => {
        if (email || isResend) {


            let intervalId: any;
            const checkVerificationStatus = async () => {
                setIsLoading(true);
                console.log('reset init');
                try {
                    const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.checkVerify}/${email}`);

                    if (response.status === 200) {
                        console.log('verify');
                        setSecondsLeft(5);
                        setIsVerify(true);
                        setIsLoading(false);
                        clearInterval(intervalId);
                        setTimeout(() => {
                            navigate('/auth/signin');
                        }, 5000)
                    }
                } catch (error) {
                    console.error('Error checking verification status:', error);
                    setIsLoading(false);
                }
            };

            intervalId = setInterval(checkVerificationStatus, 5000);

            return () => clearInterval(intervalId);
        }
    }, [email]);

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

    const __handleResendEmail = async () => {
        const userRegister = localStorage.getItem('userRegister');
        if (userRegister) {
            const userParse = JSON.parse(userRegister);
            try {
                const requestData = userParse

                const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.auth + functionEndpoints.auth.signup}`, requestData);
                if (response.status === 200) {
                    console.log('resend');
                    console.log(response);
                    setIsResend(true);
                } else {

                }
                console.log(response);
            } catch (error: any) {
                console.error('Error posting data:', error);

            }
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            {/* <LoadingComponent isLoading={true} time={5000}></LoadingComponent> */}
            <div className={styles.verify__container}>
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

                <div className={styles.verify__box}>
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <img
                                className="mx-auto h-20 w-auto"
                                style={{ borderRadius: 90 }}
                                src={systemLogo}
                            />
                            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Verify your email
                            </h2>
                        </div>

                        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className="space-y-0" >
                                <div className="flex items-center justify-between">
                                    <div style={{ margin: ' 0 auto' }} className="text-sm mt-3 mb-3 text-center items-center justify-between">
                                        <p className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            A verify link was sent to email '{email}'
                                        </p>
                                        <p className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            Please click to verify!
                                        </p>
                                    </div>
                                </div>
                            </div>



                            <div className="mt-3">

                                <button
                                    type="submit"
                                    className="flex h-11 w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    style={{ backgroundColor: !isVerify ? redColor : greenColor }}
                                >
                                    {!isVerify && (<CircularProgress className='mr-2' color={'primary'} style={{ width: 30, height: 30 }} />)}

                                    {/* {secondsLeft !== 0 ? `${t(codeLanguage + '000125')} ( ${secondsLeft}s )` : `${t(codeLanguage + '000127')}`} */}
                                    {isVerify ? `Verified! Change to login (${secondsLeft}s )` : 'Verifing...'}
                                </button>
                            </div>

                            <p className="mt-2 pr-1 text-center text-sm text-gray-500">
                                Have not recieved yet? {' '}
                                <a style={{cursor:'pointer'}} onClick={() => __handleResendEmail()} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Resend email
                                </a>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
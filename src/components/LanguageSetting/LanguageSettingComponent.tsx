import * as React from "react";
import { Box } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { usaFlag, vietnamFlag } from '../../assets';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'
import styles from './LanguageSettingStyles.module.scss'

const HeaderLanguageSetting = () => {

    // Setting VI EN Mode
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = React.useState('EN');
    const { t, i18n } = useTranslation();

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

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };

    return (
        <Box display="flex">
            {/* EN VI Mode */}
            <Menu as="div">
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
                    <Menu.Items className="absolute justify-center items-center right-40 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
        </Box>
    );
};

export default HeaderLanguageSetting;

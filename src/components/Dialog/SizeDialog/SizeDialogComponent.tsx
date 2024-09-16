import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './SizeDialogComponentStyle.module.scss'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { redColor } from '../../../root/ColorSystem';
import { useTranslation } from 'react-i18next';

const defaultImgUrl = 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719994661/size_information/ozeigjug9t8v3pwejmlv.jpg';

interface ImgUrls {
    [key: string]: {
        [key: string]: string;
    };
}

const imgUrls: ImgUrls = {
    VI: {
        shirtModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1724058179/size_information/gjp82yqlly5jgky9omdf.png',
        hoodieModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998297/size_information/prybb94laz4koe6s67y1.png',
        skirtFullModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998297/size_information/xr0pmswji1xpibssvonv.png',
        womenSkirtTopModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/dibuxkyu7su4ezv02o3e.png',
        womenSkirtBottomModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/ia3krurp9evzddpnhwib.png',
    },
    EN: {
        shirtModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1724058179/size_information/uzvqp41gfzxygeep7vug.png',
        hoodieModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/zouh4qojex6ogtn7qcfb.png',
        skirtFullModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/psgdap7shuubxjqvquzi.png',
        womenSkirtTopModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/ctw8vo8hlcg0w6vbpxob.png',
        womenSkirtBottomModel: 'https://res.cloudinary.com/dby2saqmn/image/upload/v1719998296/size_information/prrnwydrzjjhcupdrtlg.png',
    }
};

const getImageUrl = (language: string, model: string): string => {
    if (language === "VI") {
        return imgUrls.VI[model] || defaultImgUrl;
    } else {
        return imgUrls.EN[model] || defaultImgUrl;
    }
};

type SizeDialogProps = {
    data?: string;
    isOpen: boolean;
    onClose?: () => void;
}

const SizeDialogComponent: React.FC<SizeDialogProps> = ({ data, isOpen, onClose }) => {
    // TODO MUTIL LANGUAGE
    // ---------------UseState Variable---------------//
    const [sizeImgUrl, setSizeImgUrl] = useState<string>('');
    // const [selectedLanguage, setSelectedLanguage] = React.useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = React.useState<string>('EN');

    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();
    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');

    // Using i18n
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
            setCodeLanguage(selectedLanguage.toUpperCase());
        }
    }, [selectedLanguage, i18n]);

    // ---------------UseEffect---------------//
    // React.useEffect(() => {
    //     i18n.changeLanguage(selectedLanguage);
    //     localStorage.setItem('language', selectedLanguage);

    // }, [selectedLanguage, i18n, isOpen]);

    // React.useEffect(() => {
    //     if (selectedLanguage) {
    //         const uppercase = selectedLanguage.toUpperCase();
    //         setCodeLanguage(uppercase);
    //         console.log(uppercase);
    //     }
    // }, [selectedLanguage]);

    useEffect(() => {
        if (!data || !codeLanguage) return;
        setSizeImgUrl(getImageUrl(codeLanguage, data));
    }, [codeLanguage, data]);


    // ---------------FunctionHandler---------------//

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <IoMdCloseCircleOutline
                        cursor={'pointer'}
                        size={20}
                        color={redColor}
                        onClick={onClose}
                        style={{ position: 'absolute', right: 20 }}
                    />
                </DialogTitle>
                <DialogContent style={{ marginTop: '10px' }}>
                    <img className={`${style.dialog__content__img}`} src={sizeImgUrl}>
                    </img>
                </DialogContent>
            </Dialog>
        </div>
    );
};


export default SizeDialogComponent;
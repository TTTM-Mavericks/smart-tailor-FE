import React, { useState, useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './ProductDialogStyle.module.scss';
import { blackColor, grayColor, redColor } from '../../../root/ColorSystem';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const ProductDialogComponent: React.FC<Props> = ({ isOpen, onClose }) => {

    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = useState('EN');
    const [isOpenProductDialog, setIsOpenProductDialog] = useState(false);

    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();

    // ---------------UseEffect---------------//
    useEffect(() => {
        setIsOpenProductDialog(isOpen);
    }, [isOpen]);

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);

    }, [selectedLanguage, i18n]);

    useEffect(() => {
        if (selectedLanguage) {
            const uppercase = selectedLanguage.toUpperCase();
            setCodeLanguage(uppercase)
        }

    }, [selectedLanguage]);

    // ---------------FunctionHandler---------------//
    const __handleClose = () => {
        setIsOpenProductDialog(false);
        onClose();
    };




    return (
        <div className={`${styles.dialog__container}`} hidden={!isOpenProductDialog}>
            <div className={`${styles.dialog__area}`}>
                <div className={`${styles.dialog__area__header}`}>
                    <div className={`${styles.dialog__area__header__brandArea}`}>
                        <span>{t(codeLanguage + '000115')}</span>

                    </div>
                    <IoMdCloseCircleOutline cursor={'pointer'} size={20} color={redColor} onClick={() => __handleClose()} style={{ position: 'absolute', right: 20 }} />
                </div>
            </div>
        </div>
    );
};

export default ProductDialogComponent;

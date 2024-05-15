import React, { useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './ProductDialogStyle.module.scss';
import { blackColor, grayColor, redColor } from '../../../root/ColorSystem';
import { useTranslation } from 'react-i18next';
import { hoodieModel, longSkirtModel, shirtModel, skirtFullModel, womenSkirtBottomModel, womenSkirtTopModel } from '../../../assets';
import { Fragment, useState } from 'react'
import ProductCard from '../../../components/Card/ProductCard/ProductCard';


const productData = [
    {
        id: 1,
        imgUrl: shirtModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: hoodieModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: skirtFullModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: womenSkirtTopModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: womenSkirtBottomModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: longSkirtModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: shirtModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 1,
        imgUrl: shirtModel,
        title: 'Product 1',
        brand: 'Sample',
        rating: 5

    },
]

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const ProductDialogComponent: React.FC<Props> = ({ isOpen, onClose }) => {

    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = useState('EN');
    const [isOpenProductDialog, setIsOpenProductDialog] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

                <div className={`${styles.dialog__area__navbar}`}>
                    <div className={`${styles.dialog__area__navbar__option}`}>
                        <button
                            className={` py-2 px-4 rounded inline-flex items-center`}
                        >
                            {t(codeLanguage + '000116')}
                        </button>

                        <button
                            className={` py-2 px-4 rounded inline-flex items-center`}
                        >
                            {t(codeLanguage + '000117')}
                        </button>

                        <button
                            className={` py-2 px-4 rounded inline-flex items-center`}
                        >
                            {t(codeLanguage + '000118')}
                        </button>
                    </div>


                </div>

                <div style={{ width: '100%', display: 'flex', height: '85%' }}>
                    <div className={`${styles.dialog__area__filter__container}`}>
                        <button>hehe</button>
                    </div>

                    <div className={`${styles.dialog__area__result__list}`}>
                            {productData.map((item: any) => (
                                <ProductCard object={item}></ProductCard>
                            ))}
                    </div>
                </div>


            </div>


        </div>
    );
};

export default ProductDialogComponent;

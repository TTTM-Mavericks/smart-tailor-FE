import React, { useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './ProductDialogStyle.module.scss';
import { blackColor, grayColor, primaryColor, redColor } from '../../../../root/ColorSystem';
import { useTranslation } from 'react-i18next';
import { hoodieModel, longSkirtModel, shirtModel, skirtFullModel, womenSkirtBottomModel, womenSkirtTopModel } from '../../../../assets';
import { Fragment, useState } from 'react'
import ProductCard from '../../../../components/Card/ProductCard/ProductCard';
import OptionFilterCompnent from '../../../../components/OptionFilter/OptionFilterCompnent';
import { toast } from 'react-toastify';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../api/ApiConfig';
import { DesignInterface, ExpertTailoringInterface } from '../../../../models/DesignModel';
import OptionFilterCompnentDialog from '../OptionFilter/OptionFilterCompnentDialog';


// const productData = [
//     {
//         id: 1,
//         imgUrl: shirtModel,
//         title: 'shirtModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: hoodieModel,
//         title: 'hoodieModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: skirtFullModel,
//         title: 'skirtFullModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: womenSkirtTopModel,
//         title: 'womenSkirtTopModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: womenSkirtBottomModel,
//         title: 'womenSkirtBottomModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: longSkirtModel,
//         title: 'longSkirtModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: shirtModel,
//         title: 'shirtModel',
//         brand: 'Sample',
//         rating: 5

//     },
//     {
//         id: 1,
//         imgUrl: shirtModel,
//         title: 'shirtModel',
//         brand: 'Sample',
//         rating: 5

//     },
// ]

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onItemSelect: (item: string , id: any) => void;
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const ProductDialogComponent: React.FC<Props> = ({ isOpen, onClose, onItemSelect }) => {

    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = useState('EN');
    const [isOpenProductDialog, setIsOpenProductDialog] = useState<boolean>(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
    const [itemSelected, setItemSelected] = useState<string>('');
    const [expertTailoringList, setExpertTailoringList] = useState<ExpertTailoringInterface[]>();
    const [activeButton, setActiveButton] = useState<string | null>('blankSample');
    const [productList, setProductList] = useState<DesignInterface[]>();
    const [modelTypeFilter, setModelTypeFilter] = useState<string>('all');
    const [filteredList, setFilteredList] = useState<ExpertTailoringInterface[]>();




    // ---------------Usable Variable---------------//
    const { t, i18n } = useTranslation();

    // ---------------UseEffect---------------//
    useEffect(() => {
        setIsOpenProductDialog(isOpen);
        if (isOpen) {
            setItemSelected('');
        }
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

    useEffect(() => {
        if (activeButton === 'blankSample') {
            __handleGetExpertTailoringList();
        }
        if (activeButton === 'products') {
            __handleGetProductList();
        }

    }, [activeButton]);

    useEffect(() => {
        if (modelTypeFilter !== 'all') {
            const filteredList = expertTailoringList?.filter(
                (item) => item.expertTailoringName === modelTypeFilter
            );
            if (filteredList)
                setFilteredList(filteredList);
        } else {
            setFilteredList(expertTailoringList);
        }

    }, [modelTypeFilter])



    // ---------------FunctionHandler---------------//

    // +++++ API +++++ //
    /**
     * Handle get expertTailoring list
     * @returns 
     */
    const __handleGetExpertTailoringList = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.expertTailoring + functionEndpoints.expertTailoring.getAllExpertTailoring}`);
            if (response.status === 200) {
                setExpertTailoringList(response.data)
                setFilteredList(response.data);

            }
            else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                return;
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log('error: ', error);
        }
    }

    /**
     * Handle get product list
     * @returns 
     */
    const __handleGetProductList = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + `/` + featuresEndpoints.design + functionEndpoints.design.getAllDesign}`);
            if (response.status === 200) {
                setProductList(response.data)
            }
            else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                return;
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log('error: ', error);
        }
    }

    // +++++ Function +++++ //

    const handleButtonClick = (button: string) => {
        setActiveButton(button);
    };

    const __handleClose = () => {
        setIsOpenProductDialog(false);
        onClose();
    };

    const __handleSelectItem = (item: ExpertTailoringInterface) => {
        setItemSelected(item.expertTailoringName);
        onItemSelect(item.expertTailoringName, item.expertTailoringID);
        __handleClose();
    };

    const __handleGetOptionFilter = (modelType: string) => {
        setModelTypeFilter(modelType)
    }




    return (
        <div className={`${styles.dialog__container}`} hidden={!isOpenProductDialog}>
            <div className={`${styles.dialog__area}`}>
                <div className={`${styles.dialog__area__header}`}>
                    <div className={`${styles.dialog__area__header__brandArea}`}>
                        <span>{t(codeLanguage + '000115')}</span>

                    </div>

                    <form className={`${styles.searchBar}`}>
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full h-4 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                        </div>
                    </form>


                    <IoMdCloseCircleOutline cursor={'pointer'} size={20} color={redColor} onClick={() => __handleClose()} style={{ position: 'absolute', right: 20 }} />
                </div>

                <div className={`${styles.dialog__area__navbar}`}>
                    <div className={styles.dialog__area__navbar__option}>
                        <button
                            className={`py-2 px-2  inline-flex items-center ${activeButton === 'blankSample' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('blankSample')}
                        >
                            {t(`${codeLanguage}000116`)}
                        </button>

                        <button
                            className={`py-2 px-2  inline-flex items-center ${activeButton === 'products' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('products')}
                        >
                            Products
                        </button>

                        <button
                            className={`py-2 px-2  inline-flex items-center ${activeButton === 'favorite' ? styles.active : ''}`}
                            onClick={() => handleButtonClick('favorite')}
                        >
                            {t(`${codeLanguage}000117`)}
                        </button>
                    </div>


                </div>

                <div style={{ width: '100%', display: 'flex', height: '80%' }}>
                    <div className={`${styles.dialog__area__filter__container}`}>
                        <OptionFilterCompnentDialog onClickSelect={(option) => __handleGetOptionFilter(option)}></OptionFilterCompnentDialog>
                    </div>

                    <div className={`${styles.dialog__area__result__list}`}>
                        {activeButton === 'blankSample' && filteredList?.map((item: any, key: any) => (
                            <ProductCard
                                onClick={() => __handleSelectItem(item)}
                                key={key}
                                object={item}
                                style={itemSelected === item.title ? { border: `2px solid ${primaryColor}`, borderRadius: 4 } : {}}
                            ></ProductCard>
                        ))}

                        {activeButton === 'products' && productList?.map((item: any, key: any) => (
                            <ProductCard
                                // onClick={() => __handleSelectItem(item)}
                                key={key}
                                object={item}
                                style={itemSelected === item.title ? { border: `2px solid ${primaryColor}`, borderRadius: 4 } : {}}
                            ></ProductCard>
                        ))}
                    </div>
                </div>


            </div>


        </div>
    );
};

export default ProductDialogComponent;

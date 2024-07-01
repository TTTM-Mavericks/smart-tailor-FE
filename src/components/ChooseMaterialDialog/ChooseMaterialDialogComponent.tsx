import React, { ReactElement, useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Autocomplete,
    TextField,
    Popper,
    DialogContentText,
} from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './ChooseMaterialDialogStyle.module.scss';
import { useTranslation } from 'react-i18next';
import { grayColor1, greenColor, primaryColor, redColor, whiteColor, yellowColor } from '../../root/ColorSystem';
import { DesignInterface } from '../../models/DesignModel';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/system';
import {
    hoodieModel,
    longSkirtModel,
    shirtModel,
    skirtFullModel,
    womenSkirtBottomModel,
    womenSkirtTopModel
} from '../../../src/assets';
import { IoIosWarning } from "react-icons/io";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingComponent from '../Loading/LoadingComponent';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    designData?: DesignInterface;
    child?: ReactElement;
    model?: ReactElement;
    typeOfModel?: any;
    key?: any;
}

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const CustomPaper = styled('div')(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
        backgroundColor: whiteColor,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: '100%',
        border: `1px solid ${grayColor1}`,
        fontSize: '12px',
        '&::-webkit-scrollbar': {
            width: '0.3em',
            borderRadius: '4px',
            backgroundColor: grayColor1
        },
        '&::-webkit-scrollbar-track': {
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            backGroundColor: grayColor1
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#7b7b7b',
            borderRadius: '4px'
        },
    },
}));

const CustomPopper = (props: any) => {
    return <Popper {...props} placement="bottom-start" />;
};

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '35px',
        width: '150px',
        borderRadius: '4px',
      },
      '& .MuiOutlinedInput-input': {
        fontSize: '12px',
      },
      '& .MuiInputLabel-root': {
        fontSize: '12px', // Adjust font size of the label
      },
      '& .MuiInputLabel-root.Mui-focused': {
          color: primaryColor, // Label color when focused
        },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
        },
        '&:hover fieldset': {
          border: `1.5px solid ${primaryColor}`, // Border color on hover,
          color: primaryColor
        },
        '&.Mui-focused fieldset': {
          border: `1.5px solid ${primaryColor}`, // Border color when focused
        },
      },
    }));

const stylesInputField = {
    input1: {
        height: 50
    },
    input2: {
        height: 200,
        fontSize: "3em"
    }
};

const names = [
    'chỉ đỏ',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const productData = [
    {
        id: 1,
        imgUrl: shirtModel,
        title: 'shirtModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 2,
        imgUrl: hoodieModel,
        title: 'hoodieModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 3,
        imgUrl: skirtFullModel,
        title: 'skirtFullModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 4,
        imgUrl: womenSkirtTopModel,
        title: 'womenSkirtTopModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 5,
        imgUrl: womenSkirtBottomModel,
        title: 'womenSkirtBottomModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 6,
        imgUrl: longSkirtModel,
        title: 'longSkirtModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 7,
        imgUrl: shirtModel,
        title: 'shirtModel',
        brand: 'Sample',
        rating: 5

    },
    {
        id: 8,
        imgUrl: shirtModel,
        title: 'shirtModel',
        brand: 'Sample',
        rating: 5

    },
]

const ChooseMaterialDialogComponent: React.FC<Props> = ({ isOpen, onClose, child, model, typeOfModel, key }) => {
    // TODO MUTIL LANGUAGE
    // ---------------UseState Variable---------------//
    const [selectedLanguage, setSelectedLanguage] = useState<string>(localStorage.getItem('language') || 'en');
    const [codeLanguage, setCodeLanguage] = useState('EN');
    const [materialType, setMaterialType] = useState<string>('');
    const [material, setMaterial] = useState<string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const { t, i18n } = useTranslation();
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<any>([]);
    const [fabric, setFabric] = React.useState<string>('');
    const [thread, setThread] = React.useState<string>('');
    const [inputValueFabric, setInputValueFabric] = React.useState<string>('');
    const [inputValueThread, setInputValueThread] = React.useState<string>('');
    const [modelImg, setModelImg] = useState<string>('');
    const [isOpenSaveMaterialDialog, setIsOpenSaveMaterialDialog] = useState<boolean>(false);

    // ---------------Usable Variable---------------//


    // ---------------UseEffect---------------//

    useEffect(() => {
        setSelectedLanguage(localStorage.getItem('language') || 'en');
    }, []);

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    }, [selectedLanguage, i18n]);

    useEffect(() => {
        if (selectedLanguage) {
            const uppercase = selectedLanguage.toUpperCase();
            setCodeLanguage(uppercase);
        }
    }, [selectedLanguage]);

    useEffect(() => {
        if (!typeOfModel) return;

        const typeResult = productData.find((item: any) => item.title === typeOfModel);
        if (typeResult) {
            setModelImg(typeResult.imgUrl)
        }

    }, [typeOfModel])

    // ---------------FunctionHandler---------------//

    const __handleClose = () => {
        onClose();
    };

    const __handleOpenMaterialSavingDialog = () => {
        setIsOpenSaveMaterialDialog(true);
    }

    const __handleCloseMaterialSavingDialog = () => {
        setIsOpenSaveMaterialDialog(false);

    }

    const __handleSaveMaterialInformation = () => {
        setIsOpenSaveMaterialDialog(false);
        __handleClose();
    }


    return (
        <Dialog className={`${styles.dialog__container}`} maxWidth={'md'} open={isOpen}>
            <DialogTitle >
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={__handleClose}
                    style={{ position: 'absolute', right: 20 }}
                />
                {t('Choose Material')}
            </DialogTitle>
            <DialogContent className={`${styles.dialog__content}`}>
                <div className="mt-0" style={{ height: '100%' }}>
                    {/* <div className={styles.dialog__content__lableGroup}>
                        <div >
                            <span className={styles.dialog__content__span__text}>For model</span>
                        </div>
                        <div className={styles.dialog__content__span}>
                            <span style={{ color: redColor }}>1.999.999</span>
                            <span> - </span>
                            <span style={{ color: greenColor }}>2.000.000</span>
                            <span> VNĐ</span>
                        </div>
                    </div> */}
                    {/* <div className={`${styles.dialog__content__modelMaterialArea}`}>
                        <main className={`${styles.dialog__content__modelMaterialArea__model}`}>
                            <img src={modelImg}></img>
                        </main>
                        <div className={`${styles.dialog__content__modelMaterialArea__material}`}>
                            <div>
                                <FormControl className={`${styles.dialog__content__modelMaterialArea__material__formControl}`}>
                                    <Autocomplete
                                        id="tags-outlined"
                                        options={names}
                                        getOptionLabel={(option) => option}
                                        filterSelectedOptions
                                        value={fabric}
                                        onChange={(event, newValue) => {
                                            newValue && setFabric(newValue);
                                        }}
                                        inputValue={inputValueFabric}
                                        onInputChange={(event, newValue) => {
                                            setInputValueFabric(newValue);
                                        }}
                                        style={{ height: '10px !important' }}
                                        size='small'
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                variant="outlined"
                                                label="Fabric"
                                                size='small'
                                                className={`${styles.dialog__content__modelMaterialArea__material__formControl__textField}`}
                                            />
                                        )}
                                        PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
                                        PopperComponent={CustomPopper}

                                    />
                                </FormControl>
                            </div>
                            <div>
                                <FormControl className={`${styles.dialog__content__modelMaterialArea__material__formControl}`}>
                                    <Autocomplete
                                        id="tags-outlined"
                                        options={names}
                                        getOptionLabel={(option) => option}
                                        filterSelectedOptions
                                        value={thread}
                                        onChange={(event, newValue) => {
                                            newValue && setThread(newValue);
                                        }}
                                        inputValue={inputValueThread}
                                        onInputChange={(event, newValue) => {
                                            setInputValueThread(newValue);
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                variant="outlined"
                                                label="Thread"
                                                placeholder="Select thread"
                                                size='small'
                                                InputLabelProps={{ size: 'small' }}
                                                className={`${styles.dialog__content__modelMaterialArea__material__formControl__textField}`}
                                            />
                                        )}
                                        PaperComponent={({ children }) => <CustomPaper>{children}</CustomPaper>}
                                        PopperComponent={CustomPopper}

                                    />
                                </FormControl>
                            </div>

                        </div>
                    </div> */}

                    <div className={styles.dialog__content__lableGroup} style={{ width: '50%' }} >
                        <div>
                            <span className={styles.dialog__content__span__text}>For item mask</span>
                        </div>
                        {/* <div className={styles.dialog__content__span}>
                            <span style={{ color: redColor }}>1.999.999</span>
                            <span> - </span>
                            <span style={{ color: greenColor }}>2.000.000</span>
                            <span> VNĐ</span>
                        </div> */}
                    </div>
                    {child && (
                        <div style={{ width: '100%' }} >
                            {child}
                        </div>
                    )}
                </div>


            </DialogContent>
            <DialogContent className={`${styles.dialog__content__totalPrice}`}>
                <div className={`${styles.dialog__content__totalPrice__note} inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10`}>
                    <IoIosWarning size={50} color={yellowColor} mode={'contain'} />
                    <span>
                        Material prices might change, but they won't be higher than the highest price.
                    </span>
                </div>
                <table className={`${styles.dialog__content__totalPrice__table}`}>
                    <thead>

                        <tr>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: '600' }}>Model material</td>
                            <td>
                                <span style={{ color: redColor }}>1.999.999</span>
                                <span> - </span>
                                <span style={{ color: greenColor }}>2.000.000</span>
                                <span> VNĐ</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: '600' }}>Item mask material</td>
                            <td>
                                <span style={{ color: redColor }}>1.999.999</span>
                                <span> - </span>
                                <span style={{ color: greenColor }}>2.000.000</span>
                                <span> VNĐ</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: '600' }}>Total</td>
                            <td><span style={{ color: redColor }}>1.999.999</span>
                                <span> - </span>
                                <span style={{ color: greenColor }}>2.000.000</span>
                                <span> VNĐ</span></td>
                        </tr>
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => __handleOpenMaterialSavingDialog()} style={{ color: primaryColor, padding: '5px 20px 5px 20px' }}  >
                    Cancel
                </Button>
                <Button style={{ backgroundColor: redColor, color: whiteColor, padding: '5px 20px 5px 20px' }}>
                    Order
                </Button>
            </DialogActions>

            <div>
                <div style={{ width: '100%', marginTop: 0, overflow: 'hidden' }}>
                    <LoadingComponent isLoading={false} time={5000}></LoadingComponent>
                </div>
                <Dialog open={isOpenSaveMaterialDialog} style={{ position: 'absolute', top: 0 }}>
                    <DialogTitle>Save information</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your information will be lost. Do you want to save it?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => __handleCloseMaterialSavingDialog()} style={{ color: primaryColor }}  >
                            No
                        </Button>
                        <Button onClick={() => __handleSaveMaterialInformation()} style={{ backgroundColor: redColor, color: whiteColor }}>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Dialog >
    );
};

export default ChooseMaterialDialogComponent;

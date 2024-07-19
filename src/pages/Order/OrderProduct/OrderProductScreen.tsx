import { useEffect, useState } from 'react';
import style from './OrderProductStyle.module.scss'
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import ChangeAddressDialogComponent from './ChangeAddressDialogComponent';
import { TextField, Grid, Autocomplete, ToggleButtonGroup, ToggleButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import MaterialDetailTableComponent from '../Components/Table/MaterialDetailTableComponent';
import { RiBodyScanLine } from "react-icons/ri";
import SizeDialogComponent from '../../../components/Dialog/SizeDialog/SizeDialogComponent';
import { useTranslation } from 'react-i18next';
import OrderPolicyDialogComponent from '../../../components/Dialog/PolicyDialog/OrderPolicyDialogComponent';
import { useNavigate, useParams } from 'react-router-dom';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { DesignInterface, ExpertTailoringSizeInterface } from '../../../models/DesignModel';
import { toast, ToastContainer } from 'react-toastify';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import { __handleAddCommasToNumber, __handleRoundToThreeDecimalPlaces } from '../../../utils/NumbericUtils';


interface SizeQuantity {
    sizeID?: any;
    size?: string;
    quantity: number;
    width?: number;
    height?: number;
    ring1?: number;
    ring2?: number;
    ring3?: number;
    expertTailoringID?: string;
    expertTailoringName?: string;
    sizeName?: string;
    minFabric?: number;
    maxFabric?: number;
    unit?: string;
    createDate?: string;
    lastModifiedDate?: null;
}


const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '30px',
        width: '140px',
        borderRadius: '4px',
        outline: 'none',
    },
    '& .MuiOutlinedInput-input': {
        fontSize: '12px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px', // Adjust font size of the label
        marginTop: '-10px'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: primaryColor, // Label color when focused
        marginTop: '0px'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: `1.5px solid ${primaryColor}`, // Initial border color
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

const CustomTextFieldSizeCustom = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '30px',
        width: '100%',
        borderRadius: '4px',
        outline: 'none',
        float: 'left'
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
            border: `1.5px solid ${primaryColor}`, // Initial border color
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

const CustomTextFieldQuantity = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '30px',
        width: '140px',
        borderRadius: '4px',
        outline: 'none',

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
            border: `1.5px solid ${primaryColor}`, // Initial border color
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

const OrderProductScreen = () => {
    // TODO MULTI LANGUAGE\
    // ---------------UseState Variable---------------//
    const [isChangeAddressDialogOpen, setIsChangeAddressDialogOpen] = useState<boolean>(false);
    const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([{ size: '', quantity: 1, sizeID: '' }]);
    const [sizeQuantitiesCustom, setSizeQuantitiesCustom] = useState<SizeQuantity[]>([{ quantity: 1, height: 0, ring1: 0, ring2: 0, ring3: 0, width: 0 }]);
    const [inputMode, setInputMode] = useState<'predefined' | 'custom'>('predefined');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedCustomIndex, setSelectedCustomIndex] = useState<number | null>();
    const [open, setOpen] = useState(false);
    const [isOpenSizeDialog, setIsOpenSizeDialog] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<any>();
    const [isOpenOrderPolicyDialog, setIsOpenOrderPolicyDialog] = useState<boolean>(false);
    const [designData, setDesignData] = useState<DesignInterface>();
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
    const [sizes, setSizes] = useState<ExpertTailoringSizeInterface[]>();
    const [materialPrice, setMaterialPrice] = useState<{ min: any, max: any }>();



    // ---------------Usable Variable---------------//
    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();
    const { id } = useParams();
    const navigate = useNavigate()

    // Using i18n
    const { t, i18n } = useTranslation();
    useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);
    // ---------------UseEffect---------------//

    useEffect(() => {
        __handleFetchDesignDetailData();
    }, [id])

    useEffect(() => {

    }, [sizeQuantities])

    useEffect(() => {
        console.log(sizeQuantitiesCustom);
    }, [sizeQuantitiesCustom])
    // ---------------FunctionHandler---------------//

    //+++++ API +++++//

    /**
     * Handle fetch data to get design information
     */
    const __handleFetchDesignDetailData = async () => {
        setIsLoadingPage(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + `/` + featuresEndpoints.design + functionEndpoints.design.getDesignByID}/${id}`);
            if (response.status === 200) {
                setDesignData(response.data);
                __handleGetExpertTailoringSize(response.data.expertTailoring.expertTailoringID)
            }
            else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                setIsLoadingPage(false);
                return;
            }
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log('error: ', error);
            setIsLoadingPage(false);
        }
    }

    /**
     * Handle fetch expert tailoring size
     */
    const __handleGetExpertTailoringSize = async (expertId: any) => {
        setIsLoadingPage(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.sizeExpertTailoring + functionEndpoints.sizeExpertTailoring.getAllSizeExpertTailoringByExperId}/${expertId}`);
            if (response.status === 200) {
                console.log('size: ', response);
                setSizes(response.data)
            }
            else {
                return;
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    /**
     * Handle fetch data to get design information
     */
    const __handlePostSizeAndQuatity = async () => {
        const checkValidSize = sizeQuantities.map((item) => {
            if (!item.sizeID || !item.sizeName || !item.size) return false;
            return true;
        })
        if (!checkValidSize) {
            toast.error(`Please enter your size`, { autoClose: 4000 });
            return;
        }
        setIsLoadingPage(true);
        try {
            const sizeList = sizeQuantities
                .map(({ quantity, sizeID }) => {
                    if (sizeID) {
                        return { quantity, sizeID };
                    }
                    return null; // Return null for invalid sizeID
                })
                .filter(item => item !== null); // Filter out null items


            const bodyRequest = {
                designId: designData?.designID,
                sizeList: sizeList,
                address: selectedAddress.address,
                province: selectedAddress.province,
                district: selectedAddress.district,
                ward: selectedAddress.ward,
                phone: selectedAddress.phoneNumber,
                buyerName: selectedAddress.fullName,
            }
            console.log('bodyRequest: ', bodyRequest);
            const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.addNewDesignDetail}`, bodyRequest);
            if (response.status === 200) {
                // await __handleCreateOrder();
                toast.success(`${response.message}`, { autoClose: 4000 });
                setTimeout(() => {
                    navigate(`/order_detail/${response.data.orderID}`);
                }, 1000);
            }
            else {
                setIsLoadingPage(false);
                console.log(`${response.message}`);
                return;
            }
        } catch (error) {
            console.log('error: ', error);
            setIsLoadingPage(false);
        }
    }

    /**
     * Handle fetch data to get design information
     */
    // const __handleCreateOrder = async () => {
    //     try {
    //         const totalQuantity = sizeQuantities.reduce((sum, item) => sum + item.quantity, 0);

    //         const bodyRequest = {
    //             designID: designData?.designID,
    //             quantity: totalQuantity,
    //             orderType: 'ORDER',
    //             address: selectedAddress.address,
    //             province: selectedAddress.province,
    //             district: selectedAddress.district,
    //             ward: selectedAddress.ward,
    //             phone: selectedAddress.phoneNumber,
    //             buyerName: selectedAddress.fullName,
    //         }
    //         console.log(bodyRequest);
    //         const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.createOrder}`, bodyRequest);
    //         if (response.status === 200) {
    //             navigate(`/order_detail/${response.data.orderID}`);
    //         }
    //         else {
    //             console.log(`${response.message}`);
    //             setIsLoadingPage(false);
    //             return;
    //         }
    //     } catch (error) {
    //         console.log('error: ', error);
    //         setIsLoadingPage(false);
    //     }
    // }

    //+++++ Function +++++//

    /**
     * Open dialog address
     * @param isOpen 
     */
    const __handleOpenChangeAddressDialog = (isOpen: boolean) => {
        setIsChangeAddressDialogOpen(isOpen);
        console.log(isOpen);
    }

    /**
     * Add more size and quantity
     */
    const __handleAddSizeQuantity = () => {
        setSizeQuantities([...sizeQuantities, { size: '', quantity: 1 }]);
        setSizeQuantitiesCustom([...sizeQuantitiesCustom, { quantity: 1, height: 0, ring1: 0, ring2: 0, ring3: 0, width: 0 }])
    };

    /**
     * Remove out size or quantity 
     * @param index 
     */
    const __handleRemoveSizeQuantity = (index: number) => {
        setSizeQuantities(sizeQuantities.filter((_, i) => i !== index));
        setSizeQuantitiesCustom(sizeQuantitiesCustom.filter((_, i) => i !== index));
    };

    /**
     * Update state change of size 
     * @param index 
     * @param newSize 
     */
    const __handleSizeChange = (index: number, newSizeID: string, nameSize: string) => {
        if (!newSizeID || !nameSize) return;
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index] = { ...updatedSizeQuantities[index], sizeID: newSizeID, size: nameSize };
        setSizeQuantities(updatedSizeQuantities);
        setSizeQuantitiesCustom(updatedSizeQuantities);
    };

    /**
     * Update state change of quantity
     * @param index 
     * @param newQuantity 
     */
    const __handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].quantity = newQuantity;
        setSizeQuantities(updatedSizeQuantities);
        setSizeQuantitiesCustom(updatedSizeQuantities);

    };

    /**
     * Change between predefined or custom mode
     * @param _event 
     * @param newMode 
     */
    const __handleInputModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: 'predefined' | 'custom') => {
        if (newMode !== null) {
            setInputMode(newMode);
        }
    };

    /**
     * Custom customer size
     * @param index 
     * @param field 
     * @param value 
     */
    const __handleCustomSizeChange = (index: number, field: keyof SizeQuantity, value: number) => {
        const newSizeQuantities = [...sizeQuantitiesCustom];
        (newSizeQuantities[index][field] as number) = value;
        setSizeQuantitiesCustom(newSizeQuantities);
    };

    /**
     * Open size detail dialog
     * @param index 
     */
    const __handleToggleExpand = (index: number) => {
        // __handleClickOpen();
        setOpen(true);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    /**
     * Close size dialog
     */
    const __handleCloseSizeDilog = () => {
        setIsOpenSizeDialog(false);
    };

    /**
     * Close order policy dialog
     */
    const __handleCloseOrderPolicyDilog = () => {
        setIsOpenOrderPolicyDialog(false);
    };

    /**
     * Close custom size dialog
     */
    const __handleClose = () => {
        setOpen(false);
    };

    /**
     * Add selected address
     * @param address 
     */
    const __handleGetSelectedAdress = (address: any) => {
        setSelectedAddress(address);
    }

    const __handleGetMaterialPrice = (item: any) => {
        if (item) {

            setMaterialPrice({
                min: item.min,
                max: item.max
            })
        }
    }

    const __handleCalculateDiscount = (min: number, max: number, percent: number): number => {
        if (min !== undefined && max !== undefined && percent !== undefined) {
            return ((min + max) / 2) * (percent / 100);
        }
        return 0;
    };

    const __handleCalculateTotalMin = (min: number, max: number, percent: number): number => {
        if (min !== undefined && max !== undefined && percent !== undefined) {
            const discount = __handleCalculateDiscount(min, max, percent);
            return min - discount;
        }
        return 0;
    };

    const __handleCalculateTotalMax = (min: number, max: number, percent: number): number => {
        if (min !== undefined && max !== undefined && percent !== undefined) {
            const discount = __handleCalculateDiscount(min, max, percent);
            return min - discount;
        }
        return 0;
    };



    return (
        <div className={`${style.orderProduct__container}`}>
            <HeaderComponent></HeaderComponent>

            <div>
                <div className="py-0 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                    <div className="mt-2 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                        <div className="flex flex-col justify-start items-start bg-gray-50 w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <div style={{ display: 'flex', position: 'relative', width: '100%' }}>
                                <p className=" pt-10 pl-10 text-md md:text-xl light:text-white font-semibold leading-6 xl:leading-5 text-gray-800" style={{ float: 'left' }}>Order details</p>
                                <p className=" pt-10 pl-10" onClick={() => setIsOpenSizeDialog(true)} style={{ position: 'absolute', right: 10, color: secondaryColor, fontSize: 13, textDecorationLine: 'underline', cursor: 'pointer' }}>Size reference</p>
                                <SizeDialogComponent data='shirtModel' isOpen={isOpenSizeDialog} onClose={__handleCloseSizeDilog}></SizeDialogComponent>
                            </div>
                            <div className="flex justify-start items-start bg-gray-50 light:bg-gray-800 px-4 md:py-6 md:p-6 xl:pl-8 xl:pt-0 w-full">
                                <div className="mr-10 w-full md:w-40" style={{ width: 280, height: 260, marginTop: 0, borderRadius: '5px' }}>
                                    <img className="w-full h-full object-cover rounded-md shadow-md mb-4 md:mb-0" src={designData?.imageUrl} style={{ borderRadius: '5px' }} alt="dress" />
                                </div>
                                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start  items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                    <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0" >
                                        <div className="w-full justify-start items-start space-y-8">
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <div style={{ width: '100%' }}>
                                                    <div style={{ width: '100%' }} className="flex pb-5 justify-between space-x-8 items-start w-full">
                                                        <h3 className="text-md light:text-white xl:text-1xl font-semibold leading-6 text-gray-800">{designData?.titleDesign}</h3>
                                                    </div>
                                                    <div className={`${style.orderProduct__container__content}`}>
                                                        <div className={`${style.orderProduct__container__information}`}>
                                                            <p className="text-sm light:text-white leading-none text-gray-800"><span className="light:text-gray-400 text-gray-300">Exper tailoring: </span> {designData?.expertTailoring?.expertTailoringName}</p>
                                                            <p className="text-sm light:text-white leading-none text-gray-800"><span className="light:text-gray-400 text-gray-300">Color: </span> {designData?.color}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`${style.orderProduct__container__detail__sizeDetail}`}>
                                                    <ToggleButtonGroup
                                                        value={inputMode}
                                                        exclusive
                                                        onChange={__handleInputModeChange}
                                                        aria-label="text alignment"
                                                        sx={{ display: 'block', justifyContent: 'center', marginBottom: 2 }}
                                                        style={{ marginLeft: 10 }}
                                                    >
                                                        <ToggleButton
                                                            value="predefined"
                                                            aria-label="centered"
                                                            sx={{ width: 150, height: 30, fontSize: 12, '&.Mui-selected': { backgroundColor: primaryColor, color: 'white' } }}
                                                        >
                                                            Predefined Sizes
                                                        </ToggleButton>
                                                        <ToggleButton
                                                            value="custom"
                                                            aria-label="centered"
                                                            sx={{ width: 150, height: 30, fontSize: 12, '&.Mui-selected': { backgroundColor: primaryColor, color: 'white' } }}
                                                        >
                                                            Custom Sizes
                                                        </ToggleButton>
                                                    </ToggleButtonGroup>

                                                    {inputMode === 'predefined' ? (
                                                        <div>
                                                            {sizeQuantities.map((sq, index) => {
                                                                const selectedSize = sizes?.find(size => size.sizeID === sq.sizeID) || null;

                                                                // Filter out selected sizes
                                                                const filteredSizes = sizes ? sizes.filter(size => !sizeQuantities.some(sq => sq.sizeID === size.sizeID)) : [];

                                                                return (
                                                                    <div key={index} style={{ display: 'flex', margin: 10 }}>
                                                                        <Grid item>
                                                                            <Autocomplete
                                                                                options={filteredSizes}
                                                                                getOptionLabel={(option) => option.sizeName}
                                                                                value={selectedSize}
                                                                                onChange={(event, newValue) => {
                                                                                    if (newValue) {
                                                                                        __handleSizeChange(index, newValue.sizeID, newValue.sizeName);
                                                                                    }
                                                                                }}
                                                                                renderInput={(params) => <CustomTextField {...params} label="Size" variant="outlined" />}
                                                                            />
                                                                        </Grid>
                                                                        <Grid className={`${style.orderProduct__container__detail__sizeDetail__quantity}`} item>
                                                                            <CustomTextFieldQuantity
                                                                                fullWidth
                                                                                type="number"
                                                                                label="Quantity"
                                                                                value={sq.quantity}
                                                                                onChange={(e) => __handleQuantityChange(index, Number(e.target.value))}
                                                                                inputProps={{ min: 1 }}
                                                                                style={{ marginLeft: 20, marginRight: 10 }}
                                                                            />
                                                                            <FaMinusCircle size={25} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer' }}>
                                                                            </FaMinusCircle>
                                                                        </Grid>
                                                                    </div>
                                                                );
                                                            })}

                                                        </div>
                                                    ) : (
                                                        <div style={{ marginTop: 10, marginLeft: 10 }}>
                                                            {sizeQuantitiesCustom.map((sq, index) => (
                                                                <div key={index} style={{ marginBottom: 10 }}>
                                                                    <button className={`${style.orderProduct__container__detail__sizeDetail__quantity__button} py-1 px-4 rounded inline-flex items-cente1`} onClick={() => __handleToggleExpand(index)}>
                                                                        {`Size ${index + 1}`}
                                                                        <RiBodyScanLine style={{ marginLeft: 10 }} size={20} />
                                                                    </button>
                                                                    {expandedIndex === index && (
                                                                        <Dialog
                                                                            open={open}
                                                                            onClose={__handleClose}
                                                                            aria-labelledby="alert-dialog-title"
                                                                            aria-describedby="alert-dialog-description"
                                                                        >
                                                                            <DialogTitle id="alert-dialog-title">
                                                                                {'Enter your body information'}
                                                                            </DialogTitle>
                                                                            <div style={{ margin: '0 auto' }}>
                                                                                <Grid item>
                                                                                    <CustomTextFieldSizeCustom
                                                                                        label="Width (cm)"
                                                                                        variant="outlined"
                                                                                        type="number"
                                                                                        value={sq.width || 1}
                                                                                        onChange={(e) => __handleCustomSizeChange(index, 'width', Number(e.target.value))}
                                                                                        style={{ marginBottom: 15 }}

                                                                                    />
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <CustomTextFieldSizeCustom
                                                                                        label="Height (cm)"
                                                                                        variant="outlined"
                                                                                        type="number"
                                                                                        value={sq.height || 1}
                                                                                        onChange={(e) => __handleCustomSizeChange(index, 'height', Number(e.target.value))}
                                                                                        style={{ marginBottom: 15 }}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <CustomTextFieldSizeCustom
                                                                                        label="Ring 1 (cm)"
                                                                                        variant="outlined"
                                                                                        type="number"
                                                                                        value={sq.ring1 || 1}
                                                                                        onChange={(e) => __handleCustomSizeChange(index, 'ring1', Number(e.target.value))}
                                                                                        style={{ marginBottom: 15 }}

                                                                                    />
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <CustomTextFieldSizeCustom
                                                                                        label="Ring 2 (cm)"
                                                                                        variant="outlined"
                                                                                        type="number"
                                                                                        value={sq.ring2 || 1}
                                                                                        onChange={(e) => __handleCustomSizeChange(index, 'ring2', Number(e.target.value))}
                                                                                        style={{ marginBottom: 15 }}

                                                                                    />
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <CustomTextFieldSizeCustom
                                                                                        label="Ring 3 (cm)"
                                                                                        variant="outlined"
                                                                                        type="number"
                                                                                        value={sq.ring3 || 1}
                                                                                        onChange={(e) => __handleCustomSizeChange(index, 'ring3', Number(e.target.value))}
                                                                                        style={{ marginBottom: 15 }}

                                                                                    />
                                                                                </Grid>
                                                                            </div>

                                                                            <DialogActions>
                                                                                <Button onClick={__handleClose}>Disagree</Button>
                                                                                <button autoFocus onClick={__handleClose} style={{ width: '150px', backgroundColor: primaryColor }} >
                                                                                    Accept
                                                                                </button>
                                                                            </DialogActions>
                                                                        </Dialog>
                                                                    )}
                                                                    <Grid className={`${style.orderProduct__container__detail__sizeDetail__quantity}`} item>
                                                                        <CustomTextFieldQuantity
                                                                            fullWidth
                                                                            type="number"
                                                                            label="Quantity"
                                                                            value={sq.quantity}
                                                                            onChange={(e) => __handleQuantityChange(index, Number(e.target.value))}
                                                                            inputProps={{ min: 1 }}
                                                                            style={{ marginLeft: 10 }}

                                                                        />
                                                                        <FaMinusCircle size={22} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer' }}>
                                                                        </FaMinusCircle>
                                                                    </Grid>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <FaPlusCircle size={20} style={{ cursor: 'pointer', marginLeft: 10 }} color={primaryColor} onClick={__handleAddSizeQuantity}>
                                                        </FaPlusCircle>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-between space-x-8 items-start w-full ml-11 mb-20">
                                <h3 className="text-sm light:text-white xl:text-1xl font-semibold leading-6 text-gray-800">Material price</h3>
                            </div>
                            <MaterialDetailTableComponent onGetMaterialPrice={__handleGetMaterialPrice} materialDetailData={designData?.materialDetail}></MaterialDetailTableComponent>
                            {/* <div className="flex justify-center  md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 light:bg-gray-800 space-y-6">
                                    <h3 className="text-xl light:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex justify-center items-center space-x-4">
                                            <div className="w-8 h-8">
                                                <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
                                            </div>
                                            <div className="flex flex-col justify-start items-center">
                                                <p className="text-lg leading-6 light:text-white font-semibold text-gray-800">DPD Delivery<br /><span className="font-normal">Delivery with 24 Hours</span></p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-semibold leading-6 light:text-white text-gray-800">$8.00</p>
                                    </div>

                                </div>
                            </div> */}
                        </div>

                        {/* Order summary */}
                        <div className="bg-gray-50 light:bg-gray-800 w-full xl:w-2/5 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                            <div className="flex flex-col w-full bg-gray-50 light:bg-gray-800 space-y-6 mb-10">
                                <h3 className="text-xl light:text-white font-semibold leading-5 text-gray-800">Summary</h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                    <div className="flex justify-between w-full">
                                        <p className="text-sm light:text-white leading-4 text-gray-800">Min price</p>
                                        <p className="text-sm light:text-gray-300 leading-4 text-gray-600">{__handleAddCommasToNumber(materialPrice?.min)} VND</p>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <p className="text-sm light:text-white leading-4 text-gray-800">Max price</p>
                                        <p className="text-sm light:text-gray-300 leading-4 text-gray-600">{__handleAddCommasToNumber(materialPrice?.max)} VND</p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-sm light:text-white leading-4 text-gray-800">Discount <span className="bg-gray-200 p-1 text-xs font-medium light:bg-white light:text-gray-800 leading-3 text-gray-800">Quantity</span></p>
                                        <p className="text-sm light:text-gray-300 leading-4 text-gray-600">-{__handleAddCommasToNumber((materialPrice?.min + materialPrice?.max) / 2 * 2 / 100)}(2%) VND</p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-sm light:text-white leading-4 text-gray-800">Shipping</p>
                                        <p className="text-sm light:text-gray-300 leading-4 text-gray-600">Self-payment</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base light:text-white font-semibold leading-4 text-gray-800">Total</p>
                                    <div>
                                        <span style={{ color: greenColor, fontWeight: 400 }} className="text-gray-600">{__handleAddCommasToNumber(__handleRoundToThreeDecimalPlaces(__handleCalculateTotalMin(materialPrice?.min, materialPrice?.max, 2)))}</span>
                                        <span> - </span>
                                        <span style={{ color: redColor, fontWeight: 400 }} className="text-gray-600">{__handleAddCommasToNumber(__handleRoundToThreeDecimalPlaces(__handleCalculateTotalMax(materialPrice?.min, materialPrice?.max, 2)))} VND</span>
                                    </div>

                                </div>
                            </div>

                            <h3 className="text-md light:text-white font-semibold leading-5 text-gray-800">Customer</h3>
                            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex flex-col justify-start items-start flex-shrink-0" >
                                    {/* <div className=" justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                        <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />

                                    </div> */}
                                    <div style={{ display: 'flex' }} className='border-b border-gray-200 w-full'>
                                        <div className="flex justify-center text-gray-800 light:text-white md:justify-start items-center space-x-4 py-4  w-full" style={{ width: '100%' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4 20c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="cursor-pointer leading-5 " style={{ fontSize: 13 }}>{selectedAddress?.fullName}</p>
                                        </div>
                                        <div className="flex justify-center text-gray-800 light:text-white md:justify-start items-center space-x-4 py-4  w-full" style={{ width: '50%' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 16.92V20a2 2 0 01-2.18 2A19.81 19.81 0 013 4.18 2 2 0 015 2h3.09a2 2 0 012 1.72 12.66 12.66 0 00.64 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006.41 6.41l1.27-1.27a2 2 0 012.11-.45 12.66 12.66 0 002.81.64 2 2 0 011.72 2.01z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                            <p className="cursor-pointer text-xs leading-5 " style={{ fontSize: 13 }}>{selectedAddress?.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center text-gray-800 light:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="cursor-pointer text-xs leading-5 " style={{ fontSize: 13 }}>{selectedAddress?.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-0 sm:mt-0" style={{ marginTop: -15 }}>
                                    <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                        <div className="flex justify-center md:justify-start items-center md:items-start  flex-col space-y-4 xl:mt-8 w-full">
                                            <p className="text-base light:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                            <p className="w-full light:text-gray-300 text-center md:text-left  text-sm leading-5 text-gray-600" style={{ fontSize: 13 }}>{selectedAddress?.address}, {selectedAddress?.ward}, {selectedAddress?.district}, {selectedAddress?.province} </p>
                                        </div>

                                        <div className=" w-full justify-center items-center md:justify-start md:items-start" style={{ marginTop: 15 }}>
                                            {/* <button  className="mt-6 md:mt-0 light:border-white light:hover:bg-gray-900 light:bg-transparent light:text-white py-5 hover:bg-gray-200 focus:outline-none  focus:ring-gray-800 border border-gray-800  w-96 2xl:w-full text-base font-medium leading-4 text-gray-800"> */}
                                            <button
                                                type="submit"
                                                className="px-5 py-2.5 text-sm font-medium text-white"
                                                style={{ border: `1px solid ${primaryColor}`, borderRadius: 4, margin: '0 auto', color: primaryColor, width: '100%', marginBottom: 10 }}
                                                onClick={() => __handleOpenChangeAddressDialog(true)}
                                            >
                                                <span>Change address</span>
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-5 py-2.5 text-sm font-medium text-white"
                                                style={{ backgroundColor: primaryColor, borderRadius: 4, margin: '0 auto', color: whiteColor, width: '100%' }}
                                                onClick={() => setIsOpenOrderPolicyDialog(true)}
                                            >
                                                <span>Order</span>
                                            </button>
                                        </div>
                                        {/* <button  className="mt-6 md:mt-0 light:border-white light:hover:bg-gray-900 light:bg-transparent light:text-white py-5 hover:bg-gray-200 focus:outline-none  focus:ring-gray-800 border border-gray-800  w-96 2xl:w-full text-base font-medium leading-4 text-gray-800"> */}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent></FooterComponent>

            {/* DIALOG */}
            <OrderPolicyDialogComponent onClose={__handleCloseOrderPolicyDilog} isOpen={isOpenOrderPolicyDialog} onOrderProduct={__handlePostSizeAndQuatity}></OrderPolicyDialogComponent>
            <ChangeAddressDialogComponent onSelectedAddressData={(address) => __handleGetSelectedAdress(address)} isOpen={isChangeAddressDialogOpen} onClose={() => __handleOpenChangeAddressDialog(false)}></ChangeAddressDialogComponent>
            <ToastContainer></ToastContainer>

        </div >
    );
};



export default OrderProductScreen;
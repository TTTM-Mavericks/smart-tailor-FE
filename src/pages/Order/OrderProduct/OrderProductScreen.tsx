import { useEffect, useState } from 'react';
import style from './OrderProductStyle.module.scss'
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import ChangeAddressDialogComponent from './ChangeAddressDialogComponent';
import { TextField, Grid, Autocomplete, ToggleButtonGroup, ToggleButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import { primaryColor } from '../../../root/ColorSystem';
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import MaterialDetailTableComponent from '../Components/Table/MaterialDetailTableComponent';


interface SizeQuantity {
    size?: string;
    quantity: number;
    width?: number;
    height?: number;
    ring1?: number;
    ring2?: number;
    ring3?: number;
}


const sizes = ['Small', 'Medium', 'Large', 'X-Large'];

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '35px',
        width: '150px',
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

const CustomTextFieldSizeCustom = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        height: '35px',
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
        height: '35px',
        width: '100px',
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
    const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([{ size: 'L', quantity: 1 }]);
    const [sizeQuantitiesCustom, setSizeQuantitiesCustom] = useState<SizeQuantity[]>([{ quantity: 1, height: 0, ring1: 0, ring2: 0, ring3: 0, width: 0 }]);
    const [inputMode, setInputMode] = useState<'predefined' | 'custom'>('predefined');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedCustomIndex, setSelectedCustomIndex] = useState<number | null>();
    const [open, setOpen] = useState(false);



    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//

    useEffect(() => {
        console.log(sizeQuantities);
    }, [sizeQuantities])

    useEffect(() => {
        console.log(sizeQuantitiesCustom);
    }, [sizeQuantitiesCustom])
    // ---------------FunctionHandler---------------//
    const __handleOpenChangeAddressDialog = (isOpen: boolean) => {
        setIsChangeAddressDialogOpen(isOpen);
        console.log(isOpen);
    }

    const __handleAddSizeQuantity = () => {
        setSizeQuantities([...sizeQuantities, { size: 'L', quantity: 1 }]);
        setSizeQuantitiesCustom([...sizeQuantitiesCustom, { quantity: 1, height: 0, ring1: 0, ring2: 0, ring3: 0, width: 0 }])
    };

    const __handleRemoveSizeQuantity = (index: number) => {
        setSizeQuantities(sizeQuantities.filter((_, i) => i !== index));
        setSizeQuantitiesCustom(sizeQuantitiesCustom.filter((_, i) => i !== index));
    };

    const __handleSizeChange = (index: number, newSize: string) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].size = newSize;
        setSizeQuantities(updatedSizeQuantities);
        setSizeQuantitiesCustom(updatedSizeQuantities)
    };

    const __handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].quantity = newQuantity;
        setSizeQuantities(updatedSizeQuantities);
        setSizeQuantitiesCustom(updatedSizeQuantities);

    };

    const __handleSubmit = () => {
        // Process the sizeQuantities data
        console.log(sizeQuantities);
    };

    const __handleInputModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: 'predefined' | 'custom') => {
        if (newMode !== null) {
            setInputMode(newMode);
        }
    };

    const __handleCustomSizeChange = (index: number, field: keyof SizeQuantity, value: number) => {
        const newSizeQuantities = [...sizeQuantitiesCustom];
        (newSizeQuantities[index][field] as number) = value;
        setSizeQuantitiesCustom(newSizeQuantities);
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className={`${style.orderProduct__container}`}>
            <HeaderComponent></HeaderComponent>
            <div>
                <div className="py-0 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                    <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <p className="text-md md:text-xl light:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Order details</p>
                            <div className="flex justify-start items-start light:bg-gray-800 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                <div className="pb-4 mr-10 md:pb-8 w-full md:w-40">
                                    <img className="w-full hidden md:block" src="https://i.ibb.co/84qQR4p/Rectangle-10.png" alt="dress" />
                                    <img className="w-full md:hidden" src="https://i.ibb.co/L039qbN/Rectangle-10.png" alt="dress" />
                                </div>
                                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                    <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0" >
                                        <div className="w-full justify-start items-start space-y-8" >
                                            <div className="flex justify-between space-x-8 items-start w-full">
                                                <h3 className="text-md light:text-white xl:text-1xl font-semibold leading-6 text-gray-800">Premium Quaility Dress</h3>
                                                <p className="text-base light:text-white xl:text-lg leading-6">$36.00 <span className="text-red-300 line-through"> $45.00</span></p>
                                                <p className="text-base light:text-white xl:text-lg leading-6 text-gray-800">01</p>
                                                <p className="text-base light:text-white xl:text-lg font-semibold leading-6 text-gray-800">$36.00</p>
                                            </div>

                                            <div className={`${style.orderProduct__container__content}`}>
                                                <div className={`${style.orderProduct__container__information}`}>
                                                    <p className="text-sm light:text-white leading-none text-gray-800"><span className="light:text-gray-400 text-gray-300">Style: </span> Italic Minimal Design</p>
                                                    <p className="text-sm light:text-white leading-none text-gray-800"><span className="light:text-gray-400 text-gray-300">Size: </span> Small</p>
                                                    <p className="text-sm light:text-white leading-none text-gray-800"><span className="light:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                                                </div>
                                                <div className={`${style.orderProduct__container__detail}`}>
                                                    <div className={`${style.orderProduct__container__detail__sizeDetail}`}>
                                                        <ToggleButtonGroup
                                                            value={inputMode}
                                                            exclusive
                                                            onChange={__handleInputModeChange}
                                                            aria-label="text alignment"
                                                            sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}
                                                        >
                                                            <ToggleButton
                                                                value="predefined"
                                                                aria-label="left aligned"
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
                                                                {sizeQuantities.map((sq, index) => (
                                                                    <div style={{ display: 'flex', margin: 10 }}>
                                                                        <Grid item>
                                                                            <Autocomplete
                                                                                options={sizes}
                                                                                value={sq.size}
                                                                                onChange={(event, newValue) => newValue && __handleSizeChange(index, newValue)}
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
                                                                                style={{ marginLeft: 10, marginRight: 10 }}

                                                                            />
                                                                            <FaMinusCircle size={25} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer' }}>
                                                                            </FaMinusCircle>
                                                                        </Grid>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        ) : (
                                                            <div style={{ marginTop: 10, marginLeft: 10 }}>
                                                                {sizeQuantitiesCustom.map((sq, index) => (
                                                                    <div style={{ marginBottom: 10 }}>
                                                                        <button className={`${style.orderProduct__container__detail__sizeDetail__quantity__button} py-1 px-4 rounded inline-flex items-cente1`} onClick={() => toggleExpand(index)}>
                                                                            {`Size ${index + 1}`}
                                                                        </button>
                                                                        {expandedIndex === index && (
                                                                            <Dialog
                                                                                open={open}
                                                                                onClose={handleClose}
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
                                                                                    <Button onClick={handleClose}>Disagree</Button>
                                                                                    <Button onClick={handleClose} autoFocus>
                                                                                        Agree
                                                                                    </Button>
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
                                                                                style={{ marginLeft: 10, marginRight: 20 }}

                                                                            />
                                                                            <FaMinusCircle size={25} color={primaryColor} onClick={() => __handleRemoveSizeQuantity(index)} style={{ display: sizeQuantities.length === 1 ? 'none' : 'flex', cursor: 'pointer' }}>
                                                                            </FaMinusCircle>
                                                                        </Grid>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <FaPlusCircle size={20} style={{ cursor: 'pointer' }} color={primaryColor} onClick={__handleAddSizeQuantity}>
                                                            </FaPlusCircle>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between space-x-8 items-start w-full">
                                                <h3 className="text-sm light:text-white xl:text-1xl font-semibold leading-6 text-gray-800">Material price</h3>
                                            </div>
                                            <MaterialDetailTableComponent></MaterialDetailTableComponent>

                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-center  md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">

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

                                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 light:bg-gray-800 space-y-6">
                                    <h3 className="text-xl light:text-white font-semibold leading-5 text-gray-800">Summary</h3>
                                    <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                        <div className="flex justify-between w-full">
                                            <p className="text-base light:text-white leading-4 text-gray-800">Subtotal</p>
                                            <p className="text-base light:text-gray-300 leading-4 text-gray-600">$56.00</p>
                                        </div>
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-base light:text-white leading-4 text-gray-800">Discount <span className="bg-gray-200 p-1 text-xs font-medium light:bg-white light:text-gray-800 leading-3 text-gray-800">STUDENT</span></p>
                                            <p className="text-base light:text-gray-300 leading-4 text-gray-600">-$28.00 (50%)</p>
                                        </div>
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-base light:text-white leading-4 text-gray-800">Shipping</p>
                                            <p className="text-base light:text-gray-300 leading-4 text-gray-600">$8.00</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base light:text-white font-semibold leading-4 text-gray-800">Total</p>
                                        <p className="text-base light:text-gray-300 font-semibold leading-4 text-gray-600">$36.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 light:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                            <h3 className="text-xl light:text-white font-semibold leading-5 text-gray-800">Customer</h3>
                            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                                <div className="flex flex-col justify-start items-start flex-shrink-0">
                                    <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                                        <img src="https://i.ibb.co/5TSg7f6/Rectangle-18.png" alt="avatar" />
                                        <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-base light:text-white font-semibold leading-4 text-left text-gray-800">David Kent</p>
                                            <p className="text-sm light:text-gray-300 leading-5 text-gray-600">10 Previous Orders</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center text-gray-800 light:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="cursor-pointer text-sm leading-5 ">david89@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                                    <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                            <p className="text-base light:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                            <p className="w-48 lg:w-full light:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">180 North King Street, Northhampton MA 1060</p>
                                        </div>

                                        <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                                            <button onClick={() => __handleOpenChangeAddressDialog(true)} className="mt-6 md:mt-0 light:border-white light:hover:bg-gray-900 light:bg-transparent light:text-white py-5 hover:bg-gray-200 focus:outline-none  focus:ring-gray-800 border border-gray-800  w-96 2xl:w-full text-base font-medium leading-4 text-gray-800">
                                                <span>Change address</span>
                                            </button>
                                        </div>
                                    </div>
                                    <ChangeAddressDialogComponent isOpen={isChangeAddressDialogOpen} onClose={() => __handleOpenChangeAddressDialog(false)}></ChangeAddressDialogComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div >
    );
};



export default OrderProductScreen;
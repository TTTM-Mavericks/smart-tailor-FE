import React, { useState } from 'react';
import style from './OrderProductStyle.module.scss'
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import ChangeAddressDialogComponent from './ChangeAddressDialogComponent';
import { TextField, IconButton, Button, Box, Grid, Container, Autocomplete } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { styled } from '@mui/system';
import { primaryColor } from '../../../root/ColorSystem';


interface SizeQuantity {
    size: string;
    quantity: number;
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

    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//
    // ---------------FunctionHandler---------------//
    const __handleOpenChangeAddressDialog = (isOpen: boolean) => {
        setIsChangeAddressDialogOpen(isOpen);
        console.log(isOpen);
    }

    const __handleAddSizeQuantity = () => {
        setSizeQuantities([...sizeQuantities, { size: 'L', quantity: 1 }]);
    };

    const __handleRemoveSizeQuantity = (index: number) => {
        setSizeQuantities(sizeQuantities.filter((_, i) => i !== index));
    };

    const __handleSizeChange = (index: number, newSize: string) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].size = newSize;
        setSizeQuantities(updatedSizeQuantities);
    };

    const __handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedSizeQuantities = [...sizeQuantities];
        updatedSizeQuantities[index].quantity = newQuantity;
        setSizeQuantities(updatedSizeQuantities);
    };

    const __handleSubmit = () => {
        // Process the sizeQuantities data
        console.log(sizeQuantities);
    };

    return (
        <div className={`${style.orderProduct_container}`}>
            <HeaderComponent></HeaderComponent>
            <div>
                <div className="py-0 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                    <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                            <p className="text-md md:text-xl light:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Order details</p>
                            <div className="flex justify-start items-start light:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                                <div className="pb-4 mr-10 md:pb-8 w-full md:w-40">
                                    <img className="w-full hidden md:block" src="https://i.ibb.co/84qQR4p/Rectangle-10.png" alt="dress" />
                                    <img className="w-full md:hidden" src="https://i.ibb.co/L039qbN/Rectangle-10.png" alt="dress" />
                                </div>
                                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                    <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                        <div className="w-full flex flex-col justify-start items-start space-y-8" >
                                            <h3 className="text-md light:text-white xl:text-1xl font-semibold leading-6 text-gray-800">Premium Quaility Dress</h3>
                                            <div className="flex justify-start items-start flex-col space-y-2">
                                                <div>
                                                    {sizeQuantities.map((sq, index) => (
                                                        <Grid container spacing={5} alignItems="center" key={index}>
                                                            <Grid item>
                                                                <Autocomplete
                                                                    options={sizes}
                                                                    value={sq.size}
                                                                    onChange={(event, newValue) => newValue && __handleSizeChange(index, newValue)}
                                                                    renderInput={(params) => <CustomTextField {...params} label="Size" variant="outlined" />}
                                                                />
                                                            </Grid>
                                                            <Grid item>
                                                                <CustomTextFieldQuantity
                                                                    fullWidth
                                                                    type="number"
                                                                    label="Quantity"
                                                                    value={sq.quantity}
                                                                    onChange={(e) => __handleQuantityChange(index, Number(e.target.value))}
                                                                    inputProps={{ min: 1 }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <IconButton onClick={() => __handleRemoveSizeQuantity(index)} disabled={sizeQuantities.length === 1}>
                                                                    <RemoveIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                    <div>
                                                        <IconButton onClick={__handleAddSizeQuantity}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between space-x-8 items-start w-full">
                                            <p className="text-base light:text-white xl:text-lg leading-6">$36.00 <span className="text-red-300 line-through"> $45.00</span></p>
                                            <p className="text-base light:text-white xl:text-lg leading-6 text-gray-800">01</p>
                                            <p className="text-base light:text-white xl:text-lg font-semibold leading-6 text-gray-800">$36.00</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex justify-center  md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
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
                                    <div className="w-full flex justify-center items-center">
                                        <button className="hover:bg-black light:bg-white light:text-gray-800 light:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">View Carrier Details</button>
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
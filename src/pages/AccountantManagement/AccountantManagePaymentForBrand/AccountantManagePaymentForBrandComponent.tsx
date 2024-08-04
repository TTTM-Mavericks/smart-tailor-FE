import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, CircularProgress, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './AccountantManagePaymentForBrandComponentStyle.module.scss'
import { OrderDetailInterface, PaymentInterface } from '../../../models/OrderModel';
import { Stack } from '@mui/system';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../models/UserModel';
import { __handleAddCommasToNumber } from '../../../utils/NumbericUtils';
import { Listbox, Transition } from '@headlessui/react';
import PaymentInformationDialogComponent from '../../Order/Components/Dialog/PaymentInformationDialog/PaymentInformationDialogComponent';
import PaymentFromAccountantToBranđialog from '../../../components/Dialog/PaymentDialog/PaymentFromAccountantToBranđialog';
import { __handlegetRatingStyle, __handlegetStatusBackgroundBoolean } from '../../../utils/ElementUtils';
import '../../../index.css'
const AccountantManagePaymentForBrandComponent: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<PaymentInterface | PaymentOrderInterface>();
    // const [isExtendTransaction, setIsExtendTransaction] = useState<{ orderID: string, isExtend: boolean } | null>(null);
    const [isExtendTransaction, setIsExtendTransaction] = useState<{ [orderId: string]: boolean }>({});
    const [orderDetailList, setOrderDetailList] = useState<OrderDetailInterface[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState<{ [key: string]: boolean }>({});

    const [selectedOwner, setSelectedOwner] = React.useState('Owner');
    const [selectedCategory, setSelectedCategory] = React.useState('Category');
    const [selectedDate, setSelectedDate] = React.useState('Modify date');
    const [selectedRelevance, setSelectedRelevance] = React.useState('Liên quan nhất');
    const [activeTab, setActiveTab] = useState('All');
    const [orderChild, setOrderChild] = useState<{ [orderId: string]: OrderDetailInterface[] }>({});
    const [selectedOrder, setSelectedOrder] = useState<any>();
    const [isOpenPaymentForBrandDialog, setIsOpenPaymentForBrandDialog] = useState<boolean>(false);


    const options = ['Option 1', 'Option 2', 'Option 3'];



    // ---------------UseEffect---------------//

    useEffect(() => {

        console.log('orderChild: ', orderChild);
    }, [orderChild]);

    useEffect(() => {

        Object.keys(isExtendTransaction).forEach(orderId => {
            __handleFetchOrderDetails(orderId);
            // if (isExtendTransaction[orderId] === true && !orderChild[orderId]) {
            // }
        });
    }, [isExtendTransaction]);

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse)
            __handleFetchOrderData(userParse.userID);
        }
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // ---------------FunctionHandler---------------//

    const __handleFetchOrderDetails = async (orderId: string) => {
        console.log('hehehehe');
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getAllSubOrder}/${orderId}`);
            if (response.status === 200) {
                setOrderChild(prevState => ({
                    ...prevState,
                    [orderId]: response.data // Assuming response.data is an array of OrderDetailInterface
                }));
                console.log(response.data);
            }
        } catch (error) {
            console.error(`Error fetching details for order ${orderId}:`, error);
        }
    };

    const __handleFetchOrderData = async (userID: any) => {
        setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getAllOrder}`);
            if (response.status === 200) {
                console.log(response.data);
                setOrderDetailList(response.data);
                setIsLoading(false)
            } else {
                toast.error(`${response.message}`, { autoClose: 4000 });
                console.log(response.message);
            }
            console.log(response);
        } catch (error) {
            toast.error(`${error}`, { autoClose: 4000 });
            console.log(error);

        }
    }

    /**
     * Close order policy dialog
     */

    const __handleExtendTranscation = (orderID: any) => {
        setIsExtendTransaction((prev) => ({
            ...prev,
            [orderID]: !prev[orderID]
        }));
    };

    /**
     * Close order policy dialog
     */
    const __handleClosePaymentInformationDialog = () => {
        setIsOpenPaymentInformationDialog(false);
    };

    /**
     * Open invoice information dialog
     * @param payment 
     */
    const __handleViewInvoiceClick = (payment: PaymentInterface | PaymentOrderInterface) => {
        setCurrentPaymentData(payment);
        setIsOpenPaymentInformationDialog(true);
    };

    /**
     * 
     * @param item 
     * @returns 
     */
    const renderStatusIcon = (item: PaymentInterface | PaymentOrderInterface) => {
        if (item.paymentStatus === true) {
            return (
                <div className="flex items-center text-green-600" style={{ backgroundColor: `rgba($color: ${greenColor}, $alpha: 0.7)` }}>
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{'Successfully'}</span>
                </div>
            );
        }
        else if (item.paymentStatus === false) {
            return (
                <div className="flex items-center" style={{ color: secondaryColor }}>
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Pending</span>
                </div>
            );
        }
        //  else {
        //     return (
        //         <div className="flex items-center text-gray-500">
        //             <svg className="w-6 h-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        //                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        //             </svg>
        //             <span className="font-medium">Order status unknown</span>
        //         </div>
        //     );
        // }
    };

    /**
    * Scrolls the window to the top smoothly.
    */
    const _handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get language in local storage
    const selectedLanguage = localStorage.getItem('language');
    const codeLanguage = selectedLanguage?.toUpperCase();

    // Using i18n
    const { t, i18n } = useTranslation();
    React.useEffect(() => {
        if (selectedLanguage !== null) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, i18n]);


    const __handleOpenPaymentDialog = (paymentId: any) => {
        setIsOpenPaymentDialog({ [paymentId]: true })
    }

    const __handleClosePaymentDialog = (paymentId: any) => {
        setIsOpenPaymentDialog({ [paymentId]: false })
    }


    const renderDropdown = (selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>) => (
        <Listbox value={selected} onChange={setSelected} >
            <div className="relative" style={{ zIndex: 30 }}>
                <Listbox.Button className={`${style.button} flex items-center`}>
                    {selected}
                    <FaAngleDown className="ml-2 w-4 h-4" aria-hidden="true" />
                </Listbox.Button>
                <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {options.map((option, idx) => (
                            <Listbox.Option
                                key={idx}
                                className={({ active }) =>
                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}`
                                }
                                style={{ zIndex: 30 }}
                                value={option}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-amber-600' : 'text-amber-600'}`}>
                                                {/* <CheckIcon className="w-5 h-5" aria-hidden="true" /> */}
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );

    const __handleOpenPaymentForBrandialog = (orderId: any) => {
        setSelectedOrder(orderId);
        setIsOpenPaymentForBrandDialog(true);
    }

    const __handleClosePaymentForBrandialog = () => {
        setSelectedOrder(null);
        setIsOpenPaymentForBrandDialog(true);
    }



    return (
        <div>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`}>

                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">

                    {orderDetailList?.map((orderDetail) => (
                        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6" >

                                <div className="mb-4 md:mb-0 w-max ">
                                    <h2 className="text-1xl md:text-1xl font-bold text-gray-800 pb-2">{t(codeLanguage + '000193')} </h2>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2" >Order ID: <span className="text-sm text-gray-500 pb-2">{orderDetail?.orderID}</span></p>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Create date: <span className="text-sm text-gray-500 pb-2">{orderDetail?.expectedStartDate}</span></p>
                                    <div style={{
                                        display: 'flex',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }} >
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black">Status: </p>
                                        <Stack direction="row" spacing={5} padding={1}>
                                            <Chip
                                                label={`${orderDetail?.orderStatus} 
                                            ${orderDetail?.orderStatus === 'Cancel' || orderDetail?.orderStatus === 'Delivered' ? 'at ' + orderDetail?.expectedProductCompletionDate : ''}
                                            `}
                                                variant="filled"
                                                style={
                                                    {
                                                        backgroundColor:
                                                            orderDetail?.orderStatus === 'PENDING' ? secondaryColor
                                                                : orderDetail?.orderStatus === 'DELIVERED' ? greenColor
                                                                    : orderDetail?.orderStatus === 'DEPOSIT' ? secondaryColor
                                                                        : orderDetail?.orderStatus === 'PROCESSING' ? secondaryColor
                                                                            : redColor,
                                                        opacity: 1,
                                                        color: whiteColor
                                                    }
                                                } />
                                        </Stack>
                                        {/* <p className="text-sm text-gray-500"></p> */}
                                    </div>
                                </div>

                            </div>
                            <button
                                onClick={() => __handleExtendTranscation(orderDetail?.orderID)}
                                className={`${style.orderHistory__transactionLable}`}
                            >
                                <p className="text-1xl md:text-1xl font-bold text-gray-800 pr-5">Transactions</p>
                                {isExtendTransaction[orderDetail?.orderID || '1'] ? (
                                    <FaAngleUp />
                                ) : (
                                    <FaAngleDown />
                                )}

                            </button>

                            <div style={{ width: '100%' }}>
                                {isExtendTransaction[orderDetail?.orderID || '1'] && !orderChild[orderDetail.orderID] && (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <CircularProgress size={20} />
                                    </div>
                                )}
                            </div>


                            {isExtendTransaction[orderDetail?.orderID || '1'] && orderChild[orderDetail.orderID]?.map((order, itemIndex) => (
                                <div key={itemIndex} className="flex flex-col md:flex-row items-start md:items-center mt-10 mb-4 md:mb-6 border-b pb-4 md:pb-6">
                                    <div className="flex-shrink-0">
                                        {/* <img className="w-32 h-28 md:w-35 md:h-40 rounded-lg shadow-md" src={orderDetail?.designResponse.imageUrl} alt={`Image `} /> */}
                                    </div>
                                    <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow" style={{ position: 'relative' }}>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">ID: <span className="text-sm text-gray-500 pb-2"> {order.orderID}</span></p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Type: <span className="text-sm text-blue-700 pb-2"> {order.orderType}</span></p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Brand ID: <span className="text-sm text-gray-500 pb-2">{order.brand?.brandID}</span></p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black flex content-center items-center">Brand:
                                            <p style={{ fontWeight: '500' }} className="text-sm text-black flex content-center items-center pb-2">
                                                <img src={order.brand?.user.imageUrl} style={{ width: 30, height: 30, borderRadius: 90, marginLeft: 5, marginRight: 5 }}></img>
                                                <p className={`${__handlegetRatingStyle(order.brand?.rating)} text-sm text-gray-500`} > {order.brand?.brandName}</p>
                                            </p>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Total price: <span className="text-sm text-gray-500 pb-2"> {__handleAddCommasToNumber(order.totalPrice)} VND</span></p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2 flex content-center items-center">Status:
                                            <button
                                                className='py-1 px-3 rounded-full ml-2'
                                                style={
                                                    __handlegetStatusBackgroundBoolean(order?.paymentList && order?.paymentList[0].paymentStatus ? true : false)
                                                } >
                                                {`${order?.paymentList && order?.paymentList[0].paymentStatus ? 'PAID' : 'PENDING'} `}

                                            </button>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-4">Details:
                                            {order.detailList?.map((detail) => (
                                                <div className='ml-14 grid grid-cols-7 gap-1 pt-0'>
                                                    <p className="text-sm text-gray-500 pb-2">Size: {detail.size?.sizeName}</p>
                                                    <p className="text-sm text-gray-500 pb-2">Quantity: {detail.quantity}</p>
                                                </div>
                                            ))}
                                        </p>

                                        <div
                                            className={`${style.orderHistory__viewInvoice__buttonPayment} flex flex-col items-center justify-center`}
                                            style={{ textAlign: 'center' }}
                                        >
                                            <p className={`${style.orderHistory__viewInvoice__button}px-5 py-2.5 text-sm font-medium`}>View transaction</p>
                                            <button
                                                type="submit"
                                                className="px-5 py-2 text-sm font-medium text-white"
                                                style={{
                                                    borderRadius: 4,
                                                    color: whiteColor,
                                                    marginBottom: 10,
                                                    backgroundColor: primaryColor,
                                                    textDecoration: 'none'
                                                }}
                                                onClick={() => __handleOpenPaymentForBrandialog(order.orderID)}
                                            >
                                                <span className="font-medium text-white">Payment</span>
                                            </button>
                                        </div>



                                        {selectedOrder === order.orderID && (
                                            <PaymentFromAccountantToBranđialog onClose={__handleClosePaymentForBrandialog} isOpen={true} paymentData={order.paymentList}></PaymentFromAccountantToBranđialog>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {showScrollButton && (
                        <IconButton
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 100,
                                backgroundColor: primaryColor,
                                color: "white"
                            }}
                            onClick={_handleScrollToTop}
                        >
                            <ArrowUpward />
                        </IconButton>
                    )}
                </div>
            </div>

            {/* Dialog */}
            {currentPaymentData && (
                <PaymentInformationDialogComponent
                    data={currentPaymentData}
                    onClose={__handleClosePaymentInformationDialog}
                    isOpen={isOpenPaymentInforDialog}
                />
            )}
        </div>

    );
};

export default AccountantManagePaymentForBrandComponent;

import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import { useTranslation } from 'react-i18next';
import { Chip, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './OrderHistoryStyles.module.scss'
import { OrderDetailInterface, OrderInterface, PaymentInterface } from '../../../models/OrderModel';
import PaymentInformationDialogComponent from '../Components/Dialog/PaymentInformationDialog/PaymentInformationDialogComponent';
import { Stack } from '@mui/system';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast, ToastContainer } from 'react-toastify';
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import LoadingComponent from '../../../components/Loading/LoadingComponent';


const examplePayments: PaymentInterface[] = [
    {
        paymentID: '5f8d0d55-99a1-4c1a-9443-7f82f8a5e1e3',
        paymentSenderID: '9b6d8b8b-8c6e-4c4d-9b1c-1a6b3c6a6c1c',
        paymentSenderName: 'John Doe',
        paymentSenderBankCode: 'ABC123',
        paymentSenderBankNumber: '123456789',
        paymentRecipientID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        paymentRecipientName: 'Jane Smith',
        paymentRecipientBankCode: 'XYZ789',
        paymentRecipientBankNumber: '987654321',
        paymentAmount: 250.75,
        paymentMethod: 'Credit Card',
        paymentStatus: true,
        paymentType: 'Order payment',
        createDate: '2023-07-04T10:30:00',
        lastModifiedDate: '2023-07-04T12:00:00'
    },
    {
        paymentID: '6e5d0d55-88a1-4c1b-8443-7d82f8b5e2f4',
        paymentSenderID: '7c6d8b8b-8c6f-4c4d-8b1c-1b6b3c6b6d2d',
        paymentSenderName: 'Alice Johnson',
        paymentSenderBankCode: 'DEF456',
        paymentSenderBankNumber: '234567890',
        paymentRecipientID: '2a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p',
        paymentRecipientName: 'Bob Brown',
        paymentRecipientBankCode: 'UVW123',
        paymentRecipientBankNumber: '876543210',
        paymentAmount: 150.50,
        paymentMethod: 'Bank Transfer',
        paymentStatus: false,
        paymentType: 'Deposit',
        createDate: '2023-06-20T09:00:00',
        lastModifiedDate: '2023-06-20T10:30:00'
    }
];

const exampleOrders: OrderInterface[] = [
    {
        orderID: '8f9d0d55-77a1-4c1a-9443-7f82f8a5e1e3234234',
        parentOrderID: '9g0h1i2j-8k3l-4m5n-6o7p-8q9r1s2t3u4v',
        designID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        design: {
            designID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            imageUrl: 'data:image/jpeg;base64,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'
        },
        brandID: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        quantity: 5,
        discountID: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        orderStatus: 'Delivered',
        orderType: 'Standard',
        address: '123 Main St',
        district: 'Central',
        province: 'State',
        ward: 'Ward 1',
        phone: 1234567890,
        buyerName: 'John Doe',
        totalPrice: 500.00,
        employeeID: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        expectedStartDate: '2023-05-01T08:00:00',
        expectedProductCompletionDate: '2023-05-10T17:00:00',
        estimatedDeliveryDate: '2023-05-12T10:00:00',
        productionStartDate: '2023-05-01T09:00:00',
        productCompletionDate: '2023-05-10T16:00:00',
        createDate: '2023-04-25T10:30:00',
        lastModifiedDate: '2023-04-25T12:00:00',
        payment: examplePayments
    },
    {
        orderID: '7g8h1i2j-77a1-4c1a-9443-7f82f8a5e1e4',
        parentOrderID: '8i9j0k1l-8m3n-4o5p-6q7r-8s9t1u2v3w4x',
        designID: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7r',
        design: {
            designID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4PHI5muWT_qjOt9JhBhYZsxfHd_5dJ0xz7zW58UfOCkg-SN1opuEk1HWEpbCxp2_--LM&usqp=CAU'
        },
        brandID: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8s',
        quantity: 2,
        discountID: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9t',
        orderStatus: 'Pending',
        orderType: 'Custom',
        address: '456 Elm St',
        district: 'West',
        province: 'Province',
        ward: 'Ward 2',
        phone: 9876543210,
        buyerName: 'Alice Johnson',
        totalPrice: 300.00,
        employeeID: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
        expectedStartDate: '2023-06-01T08:00:00',
        expectedProductCompletionDate: '2023-06-10T17:00:00',
        estimatedDeliveryDate: '2023-06-12T10:00:00',
        productionStartDate: '2023-06-01T09:00:00',
        productCompletionDate: '2023-06-10T16:00:00',
        createDate: '2023-05-25T10:30:00',
        lastModifiedDate: '2023-05-25T12:00:00',
        payment: examplePayments
    },
    {
        orderID: '7g8h1i2j-77a1-4c1a-9443-7f82f8a5e1e456966767',
        parentOrderID: '8i9j0k1l-8m3n-4o5p-6q7r-8s9t1u2v3w4x',
        designID: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7r',
        design: {
            designID: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4PHI5muWT_qjOt9JhBhYZsxfHd_5dJ0xz7zW58UfOCkg-SN1opuEk1HWEpbCxp2_--LM&usqp=CAU'
        },
        brandID: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8s',
        quantity: 2,
        discountID: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9t',
        orderStatus: 'Cancel',
        orderType: 'Custom',
        address: '456 Elm St',
        district: 'West',
        province: 'Province',
        ward: 'Ward 2',
        phone: 9876543210,
        buyerName: 'Alice Johnson',
        totalPrice: 300.00,
        employeeID: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
        expectedStartDate: '2023-06-01T08:00:00',
        expectedProductCompletionDate: '2023-06-10T17:00:00',
        estimatedDeliveryDate: '2023-06-12T10:00:00',
        productionStartDate: '2023-06-01T09:00:00',
        productCompletionDate: '2023-06-10T16:00:00',
        createDate: '2023-05-25T10:30:00',
        lastModifiedDate: '2023-05-25T12:00:00',
        payment: examplePayments
    }
];


const OrderHistory: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<PaymentInterface | PaymentOrderInterface>();
    // const [isExtendTransaction, setIsExtendTransaction] = useState<{ orderID: string, isExtend: boolean } | null>(null);
    const [isExtendTransaction, setIsExtendTransaction] = useState<{ [key: string]: boolean }>({});
    const [orderDetail, setOrderDetail] = useState<OrderDetailInterface>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // ---------------UseEffect---------------//

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        __handleFetchOrderData();
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

    const __handleFetchOrderData = async () => {
        setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderById}/${'aa130e98-a1ff-404d-a819-939152a00a74'}`);
            if (response.status === 200) {
                console.log(response.data);
                setOrderDetail(response.data);
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
                    <span className="font-medium">{item.paymentStatus}</span>
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

    return (
        <div>
            <HeaderComponent />
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`}>
                <aside className={`${style.orderHistory__container__menuBar}`}>
                    <div className="sticky top-20 p-4 text-sm border-r border-gray-200 h-full mt-10">
                        <nav className="flex flex-col gap-3">
                            <a href="/auth/profilesetting" className="px-4 py-3 font-semibold text-orange-900 bg-white border border-orange-100 rounded-lg hover:bg-orange-50">
                                Account Settings
                            </a>
                            <a href="#" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Notifications
                            </a>
                            <a href="/order_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Order History
                            </a>
                        </nav>
                    </div>
                </aside>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-8">{t(codeLanguage + '000198')}</h1>
                    <p className="text-base sm:text-lg text-gray-700 mb-4 md:mb-8">{t(codeLanguage + '000199')}</p>
                    {exampleOrders.map((order, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6" >
                                <div className="mb-4 md:mb-0 w-max">
                                    <h2 className="text-1xl md:text-1xl font-bold text-gray-800 pb-2">{t(codeLanguage + '000193')} </h2>
                                    <p className="text-sm text-gray-500 pb-2"> #{order.orderID}</p>
                                    <p className="text-sm text-gray-500 pb-2">{t(codeLanguage + '000200')}: {order.lastModifiedDate}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }} >
                                        <p className="text-sm text-gray-500">Status: </p>
                                        <Stack direction="row" spacing={5} padding={1}>
                                            <Chip
                                                label={`${order.orderStatus} 
                                            ${order.orderStatus === 'Cancel' || order.orderStatus === 'Delivered' ? 'at ' + order.expectedProductCompletionDate : ''}
                                            `}
                                                variant="filled"
                                                style={
                                                    {
                                                        backgroundColor:
                                                            order.orderStatus === 'Pending' ? secondaryColor
                                                                : order.orderStatus === 'Delivered' ? greenColor
                                                                    : redColor,
                                                        opacity: 1,
                                                        color: whiteColor
                                                    }
                                                } />
                                        </Stack>
                                        {/* <p className="text-sm text-gray-500"></p> */}
                                    </div>
                                    <button
                                        onClick={() => __handleExtendTranscation(order.orderID)}
                                        className={`${style.orderHistory__transactionLable}`}
                                    >
                                        <p className="text-1xl md:text-1xl font-bold text-gray-800 pr-5">Giao dịch</p>
                                        {isExtendTransaction[order.orderID] ? (
                                            <FaAngleUp />
                                        ) : (
                                            <FaAngleDown />
                                        )}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">{order.totalPrice}</p>
                                    <div className="mt-2">
                                        <button className={`${style.orderHistory__viewOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}>{t(codeLanguage + '000201')}</button>
                                        {order.orderStatus === 'Delivered' && (
                                            <button className={`${style.orderHistory__reOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`} >Mua lại</button>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {isExtendTransaction[order.orderID] && order?.payment?.map((payment, itemIndex) => (
                                <div key={itemIndex} className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6 border-b pb-4 md:pb-6">
                                    <div className="flex-shrink-0">
                                        <img className="w-32 h-28 md:w-35 md:h-40 rounded-lg shadow-md" src={order?.design?.imageUrl} alt={`Image `} />
                                    </div>
                                    <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow" style={{ position: 'relative' }}>
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{payment.paymentSenderName}</h3>
                                        <p className="text-sm text-gray-500 pb-2">{payment.paymentAmount}</p>
                                        <p className="text-sm text-gray-500 pb-2">{payment.lastModifiedDate}</p>
                                        <p
                                            key={`view-product-${index}-${itemIndex}`}
                                            className={`${style.orderHistory__viewInvoice__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                            onClick={() => __handleViewInvoiceClick(payment)}
                                        >
                                            Xem hóa đơn
                                        </p>
                                        <div className="flex flex-col md:flex-row items-start md:items-center">
                                            {renderStatusIcon(payment)}
                                            <div className="ml-0 md:ml-auto mt-4 md:mt-0">

                                                {!payment.paymentStatus && (
                                                    <button
                                                        key={`buy-again-${index}-${itemIndex}`}
                                                        className={`${style.orderHistory__payment__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                                    >
                                                        Thanh toán
                                                    </button>
                                                )}


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6" >
                            <div className="mb-4 md:mb-0 w-max">
                                <h2 className="text-1xl md:text-1xl font-bold text-gray-800 pb-2">{t(codeLanguage + '000193')} </h2>
                                <p className="text-sm text-gray-500 pb-2"> #{orderDetail?.orderID}</p>
                                <p className="text-sm text-gray-500 pb-2">{t(codeLanguage + '000200')}: {orderDetail?.expectedStartDate}</p>
                                <div style={{
                                    display: 'flex',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                }} >
                                    <p className="text-sm text-gray-500">Status: </p>
                                    <Stack direction="row" spacing={5} padding={1}>
                                        <Chip
                                            label={`${orderDetail?.orderStatus} 
                                            ${orderDetail?.orderStatus === 'Cancel' || orderDetail?.orderStatus === 'Delivered' ? 'at ' + orderDetail?.expectedProductCompletionDate : ''}
                                            `}
                                            variant="filled"
                                            style={
                                                {
                                                    backgroundColor:
                                                        orderDetail?.orderStatus === 'Pending' ? secondaryColor
                                                            : orderDetail?.orderStatus === 'Delivered' ? greenColor
                                                                : redColor,
                                                    opacity: 1,
                                                    color: whiteColor
                                                }
                                            } />
                                    </Stack>
                                    {/* <p className="text-sm text-gray-500"></p> */}
                                </div>
                                <button
                                    onClick={() => __handleExtendTranscation(orderDetail?.orderID)}
                                    className={`${style.orderHistory__transactionLable}`}
                                >
                                    <p className="text-1xl md:text-1xl font-bold text-gray-800 pr-5">Giao dịch</p>
                                    {isExtendTransaction[orderDetail?.orderID || '1'] ? (
                                        <FaAngleUp />
                                    ) : (
                                        <FaAngleDown />
                                    )}
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">{orderDetail?.totalPrice}</p>
                                <div className="mt-2">
                                    <button onClick={() => window.location.href = `/order_detail/${orderDetail?.orderID}`} className={`${style.orderHistory__viewOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}>{t(codeLanguage + '000201')}</button>
                                    {orderDetail?.orderStatus === 'Delivered' && (
                                        <button className={`${style.orderHistory__reOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`} >Mua lại</button>
                                    )}
                                </div>

                            </div>
                        </div>

                        {isExtendTransaction[orderDetail?.orderID || '1'] && orderDetail?.paymentList?.map((payment, itemIndex) => (
                            <div key={itemIndex} className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6 border-b pb-4 md:pb-6">
                                <div className="flex-shrink-0">
                                    <img className="w-32 h-28 md:w-35 md:h-40 rounded-lg shadow-md" src={orderDetail?.designResponse.imageUrl} alt={`Image `} />
                                </div>
                                <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow" style={{ position: 'relative' }}>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">{payment.paymentSenderName}</h3>
                                    <p className="text-sm text-gray-500 pb-2">{payment.paymentAmount}</p>
                                    <p

                                        className={`${style.orderHistory__viewInvoice__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                        onClick={() => __handleViewInvoiceClick(payment)}
                                    >
                                        Xem hóa đơn
                                    </p>
                                    <div className="flex flex-col md:flex-row items-start md:items-center">
                                        {renderStatusIcon(payment)}
                                        <div className="ml-0 md:ml-auto mt-4 md:mt-0">

                                            {!payment.paymentStatus && (
                                                <button
                                                    className={`${style.orderHistory__payment__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                                >
                                                    Thanh toán
                                                </button>
                                            )}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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
            <FooterComponent />
        </div>

    );
};

export default OrderHistory;

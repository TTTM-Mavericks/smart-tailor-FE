import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, CircularProgress, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './BrandManageTransactionComponentStyle.module.scss'
import { OrderDetailInterface, PaymentInterface } from '../../../models/OrderModel';
import { fontWeight, Stack } from '@mui/system';
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
import Select from 'react-select';
import { DesignInterface } from '../../../models/DesignModel';

interface AccountantOrderInterface {
    orderID: string;
    paymentStatus: boolean;
    quantity: number;
    rating: number;
    orderStatus: string;
    orderType: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    phone: string;
    buyerName: string;
    totalPrice: number;
    expectedStartDate: string;
    expectedProductCompletionDate: string;
    estimatedDeliveryDate: string | null;
    productionStartDate: string | null;
    productionCompletionDate: string | null;
    createDate: string;
    detailList: Detail[];
    subOrderList: SubOrder[];
    paymentList: Payment[];
    designResponse?: DesignInterface
}

interface Detail {
    designDetailId: string;
    quantity: number;
    size: Size;
    detailStatus: boolean;
}

interface Size {
    sizeID: string;
    sizeName: string;
    status: boolean;
    createDate: string;
    lastModifiedDate: string | null;
}

interface SubOrder {
    orderID: string;
    brand: Brand;
    parentOrderID: string;
    quantity: number;
    orderStatus: string;
    rating: number | null;
    orderType: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    phone: string;
    buyerName: string;
    totalPrice: number;
    expectedStartDate: string;
    expectedProductCompletionDate: string;
    estimatedDeliveryDate: string | null;
    productionStartDate: string;
    productionCompletionDate: string;
    detailList: Detail[];
    paymentList: Payment[];
}

interface Brand {
    brandID: string;
    user: User;
    brandName: string;
    brandStatus: string;
    rating: number;
    numberOfRatings: number;
    totalRatingScore: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    numberOfViolations: number;
    createDate: string;
    lastModifiedDate: string;
    images: string[];
    qr_Payment: string;
}

interface User {
    userID: string;
    email: string;
    fullName: string;
    language: string;
    phoneNumber: string;
    provider: string;
    userStatus: string;
    roleName: string | null;
    imageUrl: string;
    createDate: string;
    lastModifiedDate: string | null;
}

interface Payment {
    paymentID: string;
    paymentSenderID: string | null;
    paymentSenderName: string;
    paymentSenderBankCode: string;
    paymentSenderBankNumber: string;
    paymentRecipientID: string | null;
    paymentRecipientName: string;
    paymentRecipientBankCode: string;
    paymentRecipientBankNumber: string;
    paymentAmount: number;
    paymentMethod: string | null;
    paymentStatus: boolean;
    paymentType: string;
    orderID: string;
    paymentURl: string | null;
    payOSResponse: PayOSResponse | null;
    createDate: string;
}

interface PayOSResponse {
    code: string;
    desc: string;
    data: PayOSResponseData;
    signature: string;
}

interface PayOSResponseData {
    id: string;
    orderCode: number;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: string;
    transactions: Transaction[];
    createdAt: string;
    canceledAt: string | null;
    cancellationReason: string | null;
    checkoutUrl: string;
    qrCode: string;
}

interface Transaction {
    accountNumber: string;
    amount: number;
    counterAccountBankId: string | null;
    counterAccountBankName: string | null;
    counterAccountName: string | null;
    counterAccountNumber: string | null;
    description: string;
    reference: string;
    transactionDateTime: string;
    virtualAccountName: string | null;
    virtualAccountNumber: string;
}


// TODO MUTIL LANGUAGE

const BrandManageTransactionComponent: React.FC = () => {
    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<PaymentInterface | PaymentOrderInterface>();
    const [isExtendTransaction, setIsExtendTransaction] = useState<{ [orderId: string]: boolean }>({});
    // const [orderDetailList, setOrderDetailList] = useState<OrderDetailInterface[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState<{ [key: string]: boolean }>({});
    const [selectedOwner, setSelectedOwner] = React.useState('Owner');
    const [selectedCategory, setSelectedCategory] = React.useState('Category');
    const [selectedDate, setSelectedDate] = React.useState('Modify date');
    const [selectedRelevance, setSelectedRelevance] = React.useState('Liên quan nhất');
    const [activeTab, setActiveTab] = useState('All');
    const [orderChild, setOrderChild] = useState<{ [orderId: string]: OrderDetailInterface[] | SubOrder[] }>({});
    const [selectedOrder, setSelectedOrder] = useState<any>();
    const [isOpenPaymentForBrandDialog, setIsOpenPaymentForBrandDialog] = useState<boolean>(false);
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        orderID: '',
        createDate: '',
        status: ''
    });
    const filterOptions = [
        { value: 'Date', label: 'Date' },
        { value: 'Order ID', label: 'Order ID' },
        { value: 'Order Status', label: 'Order Status' }
    ];
    // ---------------UseEffect---------------//
    useEffect(() => {

        console.log('orderChild: ', orderChild);
    }, [orderChild]);
    const [fulldataOrderResposne, setFulldataOrderResposne] = useState<OrderDetailInterface[]>([]);



    // ---------------UseEffect---------------//


    useEffect(() => {


    }, []);

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

    // const __handleFetchOrderDetails = async (orderId: string) => {
    //     console.log('hehehehe');
    //     try {
    //         const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getAllSubOrder}/${orderId}`);
    //         if (response.status === 200) {
    //             setOrderChild(prevState => ({
    //                 ...prevState,
    //                 [orderId]: response.data // Assuming response.data is an array of OrderDetailInterface
    //             }));
    //             console.log(response.data);
    //         }
    //     } catch (error) {
    //         console.error(`Error fetching details for order ${orderId}:`, error);
    //     }
    // };

    const __handleFetchOrderData = async (userID: any) => {
        setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getBrandTransactions}/${userID}`);
            if (response.status === 200) {
                console.log(response.data);
                // setOrderDetailList(response.data);
                setFulldataOrderResposne(response.data);
                
                setIsLoading(false);
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

    /**
     * 
     * @param event 
     * Filter With the select 
     */
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };


    /**
     * 
     * @param orderDetail 
     * @returns 
     * Apply the filter to the render with card
     */
    const applyFilters = (orderDetail: OrderDetailInterface) => {
        return (
            (filters.orderID === '' || orderDetail.orderID.includes(filters.orderID)) &&
            (filters.createDate === '' || (orderDetail.expectedStartDate?.includes(filters.createDate) ?? false)) &&
            (filters.status === '' || orderDetail.orderStatus === filters.status)
        );
    };

    return (
        <div>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`}>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
                    <div className="mb-6">
                        <label htmlFor="filterSelect" className="block mb-2 text-lg font-semibold text-gray-700">Select Filters</label>
                        <Select
                            isMulti
                            name="filters"
                            options={filterOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={filterOptions.filter(option => selectedFilters.includes(option.value))}
                            onChange={(selectedOptions: any) => {
                                setSelectedFilters(selectedOptions.map((option: any) => option.value));
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {selectedFilters.includes('Date') && (
                            <div className="filter-item">
                                <label htmlFor="dateFilter" className="block mb-2 text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    id="dateFilter"
                                    name="createDate"
                                    value={filters.createDate}
                                    onChange={handleFilterChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                />
                            </div>
                        )}

                        {selectedFilters.includes('Order ID') && (
                            <div className="filter-item">
                                <label htmlFor="orderIdFilter" className="block mb-2 text-sm font-medium text-gray-700">Order ID</label>
                                <input
                                    type="text"
                                    id="orderIdFilter"
                                    name="orderID"
                                    value={filters.orderID}
                                    onChange={handleFilterChange}
                                    placeholder="Enter Order ID"
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                />
                            </div>
                        )}

                        {selectedFilters.includes('Order Status') && (
                            <div className="filter-item">
                                <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">Order Status</label>
                                <select
                                    id="statusFilter"
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                >
                                    <option value="">All Order Statuses</option>
                                    <option value="NOT_VERIFY">Not Verify</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="DEPOSIT">Deposit</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="CANCEL">Cancel</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="DELIVERED">Delivered</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                        <div className="mb-6">
                            <label htmlFor="filterSelect" className="block mb-2 text-lg font-semibold text-gray-700">Select Filters</label>
                            <select
                                id="filterSelect"
                                multiple
                                value={selectedFilters}
                                onChange={(e) => setSelectedFilters(Array.from(e.target.selectedOptions, option => option.value))}
                                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                            >
                                <option value="Date">Date</option>
                                <option value="Order ID">Order ID</option>
                                <option value="Order Status">Order Status</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {selectedFilters.includes('Date') && (
                                <div className="filter-item">
                                    <label htmlFor="dateFilter" className="block mb-2 text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        id="dateFilter"
                                        name="createDate"
                                        value={filters.createDate}
                                        onChange={handleFilterChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    />
                                </div>
                            )}

                            {selectedFilters.includes('Order ID') && (
                                <div className="filter-item">
                                    <label htmlFor="orderIdFilter" className="block mb-2 text-sm font-medium text-gray-700">Order ID</label>
                                    <input
                                        type="text"
                                        id="orderIdFilter"
                                        name="orderID"
                                        value={filters.orderID}
                                        onChange={handleFilterChange}
                                        placeholder="Enter Order ID"
                                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    />
                                </div>
                            )}

                            {selectedFilters.includes('Order Status') && (
                                <div className="filter-item">
                                    <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">Order Status</label>
                                    <select
                                        id="statusFilter"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    >
                                        <option value="">All Order Statuses</option>
                                        <option value="NOT_VERIFY">Not Verify</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="DEPOSIT">Deposit</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="CANCEL">Cancel</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="DELIVERED">Delivered</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div> */}

                    {fulldataOrderResposne?.filter(applyFilters).map((orderDetail) => (
                        // {fulldataOrderResposne?.map((orderDetail) => (
                        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6" >
                                <div className="mb-4 md:mb-0 w-max ">
                                    <h2 className="text-1xl md:text-1xl font-bold text-gray-800 pb-2">{t(codeLanguage + '000193')} </h2>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2" >Order ID: <span className="text-sm text-gray-500 pb-2">{orderDetail?.orderID}</span></p>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">Desgin ID: <span className="text-sm text-gray-500 pb-2">{orderDetail.designResponse?.designID}</span></p>
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
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                    }} >
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black">Payment status: </p>
                                        {/* <Stack direction="row" spacing={5} padding={1}>
                                            <Chip
                                                label={`${orderDetail?.pay && orderDetail.paymentStatus ? 'PAID' : 'PENDING'} `}
                                                variant="filled"
                                                style={
                                                    __handlegetStatusBackgroundBoolean(orderDetail?.paymentStatus && orderDetail.paymentStatus ? true : false)
                                                } />
                                        </Stack> */}
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
                                        {/* <CircularProgress size={20} /> */}
                                    </div>
                                )}
                            </div>
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
            {
                currentPaymentData && (
                    <PaymentInformationDialogComponent
                        data={currentPaymentData}
                        onClose={__handleClosePaymentInformationDialog}
                        isOpen={isOpenPaymentInforDialog}
                    />
                )
            }
        </div >
    );
};

export default BrandManageTransactionComponent;

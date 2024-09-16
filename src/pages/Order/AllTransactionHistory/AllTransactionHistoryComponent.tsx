import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, CircularProgress, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './AllTransactionHistoryComponentStyle.module.scss'
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
import PaymentInformationDialogComponent from '../Components/Dialog/PaymentInformationDialog/PaymentInformationDialogComponent';
import PaymentFromAccountantToBranđialog from '../../../components/Dialog/PaymentDialog/PaymentFromAccountantToBranđialog';
import { __handlegetRatingStyle, __handlegetStatusBackgroundBoolean } from '../../../utils/ElementUtils';
import '../../../index.css'
import Select from 'react-select';
import { DesignInterface } from '../../../models/DesignModel';
import { __getToken } from '../../../App';
import HeaderComponent from '../../../components/Header/HeaderComponent';

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

const AllTransactionHistoryComponent: React.FC = () => {
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
    const [selectedTransaction, setSelectedTransaction] = useState<any>();
    const [isOpenPaymentForBrandDialog, setIsOpenPaymentForBrandDialog] = useState<boolean>(false);
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        paymentID: '',
        createDate: '',
        orderID: '',
        paymentStatus: false
    });
    const filterOptions = [
        { value: 'Payment ID', label: 'Payment ID' },
        { value: 'Order ID', label: 'Order ID' },
        { value: 'Date', label: 'Date' },
        { value: 'Order Status', label: 'Order Status' }

    ];
    // ---------------UseEffect---------------//
    useEffect(() => {

        console.log('orderChild: ', orderChild);
    }, [orderChild]);
    const [fulldataTransactionResposne, setFulldataTransactionResposne] = useState<PaymentOrderInterface[]>([]);



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
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.payment + functionEndpoints.payment.getPaymentByUserID}/${userID}`);
            if (response.status === 200) {
                console.log(response.data);
                // setOrderDetailList(response.data);
                setFulldataTransactionResposne(response.data);

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


    const __handleOpenPaymentForBrandialog = (orderId: any) => {
        setSelectedTransaction(orderId);
        setIsOpenPaymentForBrandDialog(true);
    }

    const __handleClosePaymentForBrandDialog = () => {
        setSelectedTransaction(null);
        setIsOpenPaymentForBrandDialog(false);
    };

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
    const applyFilters = (transaction: PaymentOrderInterface) => {
        return (
            (filters.paymentID === '' || transaction.paymentID.includes(filters.paymentID)) &&
            (filters.orderID === '' || transaction.orderID.includes(filters.orderID)) &&
            (filters.createDate === '' || (transaction.createDate?.includes(filters.createDate) ?? false)) &&
            (filters.paymentStatus === false || transaction.paymentStatus === filters.paymentStatus)
        );
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [goToPage, setGoToPage] = useState(currentPage.toString());
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = fulldataTransactionResposne.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(fulldataTransactionResposne.length / productsPerPage);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        setGoToPage(currentPage.toString());
    }, [currentPage]);

    return (
        <div>
            <HeaderComponent />
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`}>
                <aside className={`${style.orderHistory__container__menuBar}`}>
                    <div className="sticky top-20 p-4 text-sm border-r border-gray-200 h-full mt-10">
                        <nav className="flex flex-col gap-3">
                            <a href="/auth/profilesetting" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Account Settings
                            </a>
                            <a href="/notification" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Notifications
                            </a>
                            <a href="/order_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Order History
                            </a>
                            <a href="/report_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Report History
                            </a>
                            <a href="/refund_history" className="px-4 py-3 font-semibold text-orange-900 bg-white border border-orange-100 rounded-lg hover:bg-orange-50">
                                Refund Transaction
                            </a>
                            <a href="/transaction_history" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Transactions
                            </a>
                            <a href="/collection" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Collection
                            </a>
                        </nav>
                    </div>
                </aside>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
                    <div className={`${style.gradientBackground}`}>
                        <p className={style.textStyle}>Trasactions history</p>
                    </div>
                    <div className={` inline-flex items-center rounded-md bg-yellow-50 px-2 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mt-10`}>
                        <span>
                            {t(codeLanguage + '000199')}
                        </span>
                    </div>
                    <div className="mb-6 mt-5">
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

                    {selectedFilters.includes('Payment ID') && (
                        <div className="filter-item">
                            <label htmlFor="orderIdFilter" className="block mb-2 text-sm font-medium text-gray-700">Payment ID</label>
                            <input
                                type="text"
                                id="paymentIDFilter"
                                name="paymentID"
                                value={filters.paymentID}
                                onChange={handleFilterChange}
                                placeholder="Enter Order ID"
                                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                            />
                        </div>
                    )}

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


                        {selectedFilters.includes('Order Status') && (
                            <div className="filter-item">
                                <label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-700">Order Status</label>
                                <select
                                    id="statusFilter"
                                    name="status"
                                    value={filters.paymentStatus ? 'Paid' : 'Pending'}
                                    onChange={handleFilterChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                >
                                    <option value="">All Order Statuses</option>
                                    <option value={'true'}>PAID</option>
                                    <option value={'false'}>PENDING</option>
                                </select>
                            </div>
                        )}
                    </div>



                    {currentProducts?.length > 0 && currentProducts?.filter(applyFilters).map((transaction) => (
                        // {fulldataTransactionResposne?.map((orderDetail) => (
                        <div key={transaction.paymentID} className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-wrap md:flex-nowrap mb-4 md:mb-6">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                    <h2 className="text-sm md:text-1xl font-bold text-gray-800 pb-2">OrderID {transaction.orderID} </h2>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                        Payment ID: <span className="text-sm text-gray-500 pb-2">{transaction?.paymentID}</span>
                                    </p>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                        Payment type:{' '}
                                        <span
                                            className="text-sm text-gray-500 pb-2"
                                            style={{ color: transaction.paymentType === 'FINED' ? redColor : greenColor, fontWeight: 'bold' }}
                                        >
                                            {transaction.paymentType}
                                        </span>
                                    </p>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                        Amount: <span className="text-sm text-gray-500">{__handleAddCommasToNumber(transaction.paymentAmount)} VND</span>
                                    </p>

                                    <div className="flex items-center">
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black">
                                            Status:
                                        </p>
                                        <Stack direction="row" spacing={5} padding={1}>
                                            <Chip
                                                label={transaction?.paymentStatus ? 'PAID' : 'PENDING'}
                                                variant="filled"
                                                style={{
                                                    backgroundColor: !transaction?.paymentStatus ? secondaryColor : greenColor,
                                                    opacity: 1,
                                                    color: whiteColor,
                                                }}
                                            />
                                        </Stack>
                                    </div>


                                </div>
                                {transaction.paymentType === 'FINED' ? (
                                    <div className="w-full md:w-1/2">
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Recipient ID: <span className="text-sm text-gray-500 pb-2">{transaction.paymentRecipientID || 'SMART TAILOR'}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Recipient name: <span className="text-sm text-gray-500 pb-2">{transaction.paymentRecipientName}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Recipient bank code:{' '}
                                            <span className="text-sm text-gray-500 pb-2">{transaction.paymentRecipientBankCode}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Create date: <span className="text-sm text-gray-500 pb-2">{transaction?.createDate}</span>
                                        </p>

                                    </div>
                                ) : (
                                    <div className="w-full md:w-1/2">
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Sender ID: <span className="text-sm text-gray-500 pb-2">{transaction.paymentSenderID || 'SMART TAILOR'}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Sender name: <span className="text-sm text-gray-500 pb-2">{transaction.paymentSenderName || 'SMART TAILOR'}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Sender bank code:{' '}
                                            <span className="text-sm text-gray-500 pb-2">{transaction.paymentSenderBankCode || 'OCB'}</span>
                                        </p>
                                        <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                            Create date: <span className="text-sm text-gray-500 pb-2">{transaction?.createDate}</span>
                                        </p>

                                    </div>
                                )}

                            </div>

                            {transaction.paymentType === 'FINED' && transaction.paymentStatus === false && (
                                <>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 text-sm font-medium text-white ml-auto"
                                        style={{
                                            borderRadius: 4,
                                            color: whiteColor,
                                            marginBottom: 10,
                                            backgroundColor: primaryColor,
                                            textDecoration: "none",
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 20
                                        }}
                                        onClick={() => __handleOpenPaymentForBrandialog(transaction.paymentID)}
                                    >
                                        <span className="font-medium text-white">Payment</span>
                                    </button>
                                    {selectedTransaction === transaction.paymentID && (
                                        <PaymentFromAccountantToBranđialog
                                            onClose={__handleClosePaymentForBrandDialog}
                                            isOpen={true}
                                            paymentData={[transaction]} // Wrap transaction in an array
                                        />
                                    )}

                                </>
                            )}
                        </div>

                    ))}
                    <div className="flex flex-wrap items-center justify-center space-x-2 mt-8">
                        <select
                            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            value={productsPerPage}
                            onChange={(e) => {
                                setProductsPerPage(Number(e.target.value));
                                paginate(1);
                            }}
                        >
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>

                        <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    }`}
                                onClick={() => { if (currentPage > 1) paginate(currentPage - 1); }}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-2 rounded-md ${currentPage === number
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                className={`px-3 py-2 rounded-md ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    }`}
                                onClick={() => {
                                    if (currentPage < totalPages) paginate(currentPage + 1);
                                }}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <span className="text-gray-600">Go to</span>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-md w-16 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                value={goToPage}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoToPage(e.target.value)}
                                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === 'Enter') {
                                        const page = Math.max(1, Math.min(parseInt(goToPage), totalPages));
                                        if (!isNaN(page)) {
                                            paginate(page);
                                        }
                                    }
                                }}
                            />
                        </div>
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
            {/* {
                currentPaymentData && (
                    <PaymentInformationDialogComponent
                        data={currentPaymentData}
                        onClose={__handleClosePaymentInformationDialog}
                        isOpen={isOpenPaymentInforDialog}
                    />
                )
            } */}
        </div >
    );
};

export default AllTransactionHistoryComponent;

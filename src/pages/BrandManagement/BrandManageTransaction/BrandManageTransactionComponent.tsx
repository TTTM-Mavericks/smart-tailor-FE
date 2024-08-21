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
import { __getToken } from '../../../App';

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

    const [pendingCount, setPendingCount] = useState<number>(0);
    const [paidCount, setPaidCount] = useState<number>(0);
    const [findedCount, setFinedCount] = useState<number>(0);
    const [brandPaymentCount, setBrandPaymentCount] = useState<number>(0);

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
                const filteredPaid = response.data.filter((payment: PaymentOrderInterface) => payment.paymentStatus === true);
                const filteredPending = response.data.filter((payment: PaymentOrderInterface) => payment.paymentStatus === false);
                const filteredFined = response.data.filter((payment: PaymentOrderInterface) => payment.paymentType === 'FINED');
                const filteredBrandPayment = response.data.filter((payment: PaymentOrderInterface) => payment.paymentType === 'BRAND_INVOICE');

                setPaidCount(filteredPaid.length);
                setPendingCount(filteredPending.length);
                setBrandPaymentCount(filteredBrandPayment.length)
                setFinedCount(filteredFined.length)

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

    return (
        <div>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`} style={{ marginTop: -50 }}>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
                    <div className="mt-12">
                        <div className="mb-10 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                        <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                    </svg>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: primaryColor, fontWeight: 'bold' }}>BRAND INVOICE</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{brandPaymentCount}</h4>
                                </div>

                            </div>

                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                        <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                        <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                        <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                    </svg>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: redColor, fontWeight: 'bold' }}>FINED</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{findedCount}</h4>
                                </div>

                            </div>
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                        <path d="M19.14 12.936c.046-.306.071-.618.071-.936s-.025-.63-.071-.936l2.037-1.582a.646.646 0 00.154-.809l-1.928-3.338a.646.646 0 00-.785-.293l-2.4.964a7.826 7.826 0 00-1.617-.936l-.364-2.558A.645.645 0 0013.629 3h-3.258a.645.645 0 00-.635.538l-.364 2.558a7.82 7.82 0 00-1.617.936l-2.4-.964a.646.646 0 00-.785.293L2.642 9.673a.646.646 0 00.154.809l2.037 1.582a7.43 7.43 0 000 1.872l-2.037 1.582a.646.646 0 00-.154.809l1.928 3.338c.169.293.537.42.785.293l2.4-.964c.506.375 1.05.689 1.617.936l.364 2.558a.645.645 0 00.635.538h3.258a.645.645 0 00.635-.538l.364-2.558a7.82 7.82 0 001.617-.936l2.4.964c.248.127.616 0 .785-.293l1.928-3.338a.646.646 0 00-.154-.809l-2.037-1.582zM12 15.3A3.3 3.3 0 1112 8.7a3.3 3.3 0 010 6.6z" />
                                    </svg>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: secondaryColor, fontWeight: 'bold' }}>PENDING</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{pendingCount}</h4>
                                </div>

                            </div>
                            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-green-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.59 14.59l-4.24-4.24 1.41-1.41L10.41 14l7.42-7.42 1.41 1.41-8.83 8.83z" />
                                    </svg>
                                </div>
                                <div className="p-4 text-right">
                                    <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: greenColor, fontWeight: 'bold' }}>PAID</p>
                                    <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{paidCount}</h4>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="filterSelect" className="block mb-2 text-sm font-semibold text-gray-700">Select filters</label>

                        <div style={{ width: "60%" }}>
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

                        {selectedFilters.includes('Payment Status') && (
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
                                    <option value={'true'}>Paid</option>
                                    <option value={'false'}>Pending</option>
                                </select>
                            </div>
                        )}
                    </div>



                    {fulldataTransactionResposne?.filter(applyFilters).map((transaction) => (
                        // {fulldataTransactionResposne?.map((orderDetail) => (
                        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-wrap md:flex-nowrap mb-4 md:mb-6">
                                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                    <h2 className="text-sm md:text-1xl font-bold text-gray-800 pb-2">Order ID {transaction.orderID} </h2>

                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                        Payment ID: <span className="text-sm text-gray-500 pb-2">{transaction?.paymentID}</span>
                                    </p>
                                    <p style={{ fontWeight: '500' }} className="text-sm text-black pb-2">
                                        Payment type:{' '}
                                        <span
                                            className="text-sm text-gray-500 pb-2"
                                            style={{ color: transaction.paymentType === 'FINED' ? redColor : primaryColor, fontWeight: 'bold' }}
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

export default BrandManageTransactionComponent;

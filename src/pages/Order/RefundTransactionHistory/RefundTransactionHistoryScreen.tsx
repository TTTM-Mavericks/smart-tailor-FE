import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../../components/Header/HeaderComponent';
import FooterComponent from '../../../components/Footer/FooterComponent';
import { useTranslation } from 'react-i18next';
import { Chip, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './RefundTransactionHistoryStyle.module.scss'
import { OrderDetailInterface, OrderInterface, PaymentInterface } from '../../../models/OrderModel';
import PaymentInformationDialogComponent from '../Components/Dialog/PaymentInformationDialog/PaymentInformationDialogComponent';
import { Stack } from '@mui/system';
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast, ToastContainer } from 'react-toastify';
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import LoadingComponent from '../../../components/Loading/LoadingComponent';
import Cookies from 'js-cookie';
import { UserInterface } from '../../../models/UserModel';
import { __handleAddCommasToNumber } from '../../../utils/NumbericUtils';
import { PaymentOrderDialogComponent } from '../../../components';
import { Listbox, Transition } from '@headlessui/react';
import Select from 'react-select';
import { __getToken } from '../../../App';

const RefundTransactionHistoryScreen: React.FC = () => {
    // TODO MUTIL LANGUAGE

    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<PaymentInterface | PaymentOrderInterface>();
    // const [isExtendTransaction, setIsExtendTransaction] = useState<{ orderID: string, isExtend: boolean } | null>(null);
    const [isExtendTransaction, setIsExtendTransaction] = useState<{ [key: string]: boolean }>({});
    const [orderDetailList, setOrderDetailList] = useState<OrderDetailInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState<{ [key: string]: boolean }>({});
    const [selectedOwner, setSelectedOwner] = React.useState('Owner');
    const [selectedCategory, setSelectedCategory] = React.useState('Category');
    const [selectedDate, setSelectedDate] = React.useState('Modify date');
    const [selectedRelevance, setSelectedRelevance] = React.useState('Liên quan nhất');
    const [activeTab, setActiveTab] = useState('All');
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const filterOptions = [
        { value: 'Date', label: 'Date' },
        { value: 'Order ID', label: 'Order ID' },
        { value: 'Order Status', label: 'Order Status' },
    ];

    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        createDate: '',
        orderID: '',
        status: '',
    });
    const [paymentList, setPaymentList] = useState<PaymentOrderInterface[]>([]);


    /**
     * 
     * @param e 
     */
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    /**
     * 
     * @param orderDetail 
     * @returns 
     * Filter
     */
    const applyFilters = (orderDetail: OrderDetailInterface) => {
        return (
            (filters.orderID === '' || orderDetail.orderID.includes(filters.orderID)) &&
            (filters.createDate === '' || (orderDetail.expectedStartDate?.includes(filters.createDate) ?? false)) &&
            (filters.status === '' || orderDetail.orderStatus === filters.status)
        );
    };



    // ---------------UseEffect---------------//

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

    const __handleFetchOrderData = async (userID: any) => {
        setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getOrderByUserId}/${userID}`, null, __getToken());
            if (response.status === 200) {
                console.log(response.data);
                const dataResp = response.data.filter((item: any) =>
                    item.paymentList.length !== 0 &&
                    item.paymentList.some((payment: any) => payment.paymentType === 'ORDER_REFUND')
                );
                setOrderDetailList(dataResp);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [goToPage, setGoToPage] = useState(currentPage.toString());
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = orderDetailList.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(orderDetailList.length / productsPerPage);
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
                                Trandsactions
                            </a>
                            <a href="/collection" className="px-4 py-3 font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                                Collection
                            </a>
                        </nav>
                    </div>
                </aside>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
                    <div className={`${style.gradientBackground}`}>
                        <p className={style.textStyle}>Refund history</p>
                    </div>
                    <div className={` inline-flex items-center rounded-md bg-yellow-50 px-2 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 mt-10`}>
                        <span>
                            {t(codeLanguage + '000199')}
                        </span>
                    </div>

                    <div className="mb-6 mt-6">
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

                    {currentProducts?.length > 0 ? currentProducts?.filter(applyFilters).map((orderDetail) => (
                        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                            <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6" >
                                <div className="mb-4 md:mb-0 w-max">
                                    <img className="w-32 h-28 md:w-35 md:h-40 rounded-lg shadow-md" src={orderDetail?.designResponse.imageUrl} alt={`Image `} />

                                </div>
                                <div className="mb-4 md:mb-0 w-max ml-12">
                                    <h2 className="text-1xl md:text-1xl font-bold text-gray-800 pb-2">{t(codeLanguage + '000193')} </h2>
                                    <p className="text-sm text-gray-500 pb-2"> {orderDetail?.orderID}</p>
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
                                                            orderDetail?.orderStatus === 'PENDING' ? secondaryColor
                                                                : orderDetail?.orderStatus === 'DELIVERED' ? greenColor
                                                                    : orderDetail?.orderStatus === 'COMPLETED' ? greenColor
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
                                <div className="text-right">
                                    <div className="mt-2">
                                        <button onClick={() => window.location.href = `/order_detail/${orderDetail?.orderID}`} className={`${style.orderHistory__viewOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}>{t(codeLanguage + '000201')}</button>
                                        {orderDetail?.orderStatus === 'Delivered' && (
                                            <button className={`${style.orderHistory__reOrder__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`} >ReOrder</button>
                                        )}
                                    </div>
                                    <p className='ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2' style={{ position: 'absolute', top: 50, right: 0, fontWeight: 'bold' }}>{__handleAddCommasToNumber(orderDetail?.totalPrice)} VND</p>

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

                            {isExtendTransaction[orderDetail?.orderID || '1'] && (
                                <div className='mt-10'></div>
                            )}

                            {isExtendTransaction[orderDetail?.orderID || '1'] &&
                                orderDetail?.paymentList?.map((payment, itemIndex) => {
                                    if (payment.paymentType === 'ORDER_REFUND') {
                                        return (
                                            <div
                                                key={itemIndex}
                                                className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6 border-b pb-4 md:pb-6"
                                            >
                                                <div className="flex-shrink-0">
                                                    {/* Uncomment and replace the image source if needed */}
                                                    {/* <img
                                                        className="w-32 h-28 md:w-35 md:h-40 rounded-lg shadow-md"
                                                        src={orderDetail?.designResponse?.imageUrl}
                                                        alt={`Image `}
                                                        /> */}
                                                </div>
                                                <div
                                                    className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow"
                                                    style={{ position: 'relative' }}
                                                >
                                                    <p className="text-sm text-gray-500 pb-2">
                                                        ID: <span>{payment.paymentID}</span>
                                                    </p>
                                                    <p className="text-sm text-gray-500 pb-2">
                                                        Amount: <span>{__handleAddCommasToNumber(payment.payOSResponse?.data?.amount)} VND</span>
                                                    </p>
                                                    <p className="text-sm text-gray-500 pb-2">
                                                        Created at: <span>{payment.payOSResponse?.data?.createdAt}</span>
                                                    </p>

                                                    <p
                                                        className={`${style.orderHistory__viewInvoice__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                                        onClick={() => __handleViewInvoiceClick(payment)}
                                                    >
                                                        View transaction
                                                    </p>
                                                    <div className="flex flex-col md:flex-row items-start md:items-center">
                                                        {renderStatusIcon(payment)}
                                                        {/* <div className="ml-0 md:ml-auto mt-4 md:mt-0 px-3 py-2 md:px-4 md:py-2">
                                                            {!payment.paymentStatus && (
                                                                <button
                                                                    className={`${style.orderHistory__payment__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                                                    onClick={() => __handleOpenPaymentDialog(payment.paymentID)}
                                                                >
                                                                    Payment
                                                                </button>
                                                            )}
                                                            <PaymentOrderDialogComponent
                                                                isOpen={isOpenPaymentDialog[payment.paymentID] === true}
                                                                onClose={() => __handleClosePaymentDialog(payment.paymentID)}
                                                                paymentData={orderDetail.paymentList}
                                                            />
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null; // If paymentType is not 'ORDER_REFUND', return null
                                })
                            }

                        </div>
                    )) : (
                        <div>
                            <span className="text-gray-500 text-sm text-center justify-center content-center">Do not have any refund transaction</span>
                        </div>
                    )}

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
            {/* {currentPaymentData && (
                <PaymentInformationDialogComponent
                    data={currentPaymentData}
                    onClose={__handleClosePaymentInformationDialog}
                    isOpen={isOpenPaymentInforDialog}
                />
            )} */}
            <FooterComponent />
        </div>

    );
};

export default RefundTransactionHistoryScreen;

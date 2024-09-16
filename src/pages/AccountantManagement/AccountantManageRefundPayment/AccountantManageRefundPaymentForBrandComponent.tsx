import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, CircularProgress, IconButton, useTheme } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { greenColor, primaryColor, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './AccountantManageRefundPaymentForBrandComponentStyle.module.scss'
import { OrderDetailInterface, PaymentInterface } from '../../../models/OrderModel';
import { fontWeight, Stack } from '@mui/system';
import { FaAngleDown, FaCalendar, FaCalendarAlt, FaCalendarDay, FaClipboardCheck, FaCreditCard, FaDraftingCompass, FaExclamationCircle, FaFileAlt, FaMoneyBillWave, FaReceipt, FaUser } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../api/ApiConfig';
import { toast } from 'react-toastify';
import { PaymentOrderInterface, PayOSResponseInterface } from '../../../models/PaymentModel';
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
import { __handleGetDateTimeColor } from '../../../utils/DateUtils';
import { color, motion } from 'framer-motion';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import { __getToken } from '../../../App';
import { PaymentOrderDialogComponent } from '../../../components';

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
    payOSData?: PayOSResponseInterface
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
interface TransactionModalProps {
    transaction: AccountantOrderInterface;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'NOT_VERIFY': return 'bg-gray-200 text-gray-600';
            case 'PENDING': return 'bg-yellow-100 text-yellow-600';
            case 'CANCEL': return 'bg-red-100 text-red-600';
            case 'COMPLETED': return 'bg-green-100 text-green-600';
            case 'Completed': return 'bg-green-100 text-green-600';
            case 'Not Completed': return 'bg-red-100 text-red-600';
            default: return 'bg-red-100 text-red-600';
        }
    };

    const brand = transaction.subOrderList.length > 0 ? transaction.subOrderList[0].brand : null;
    const ratings = transaction.subOrderList.length > 0 ? transaction.subOrderList[0].brand : null;

    const statusItems = [
        { label: 'Sub ID', value: transaction.orderID },
        { label: 'Type', value: transaction.orderType },
        { label: 'Brand', value: brand ? brand.brandName : 'N/A' },
        { label: 'Rating', value: ratings ? ratings.rating + '★' : 'N/A' },
        { label: 'Quantity', value: transaction.quantity },
        { label: 'Total Price', value: `${transaction.totalPrice} VND` },
        { label: 'Expected Start', value: transaction.expectedStartDate },
        {
            label: 'Status',
            value: transaction.orderStatus,
            customClass: getStatusColor(transaction.orderStatus),
        },
        {
            label: 'Payment Status',
            value: transaction.paymentStatus ? 'COMPLETED' : 'PENDING',
            customClass: getStatusColor(transaction.paymentStatus ? 'COMPLETED' : 'NOT_VERIFY'),
        }
    ];
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [canceledCount, setCanceledCount] = useState<number>(0);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [checkingSampleDataCount, setCheckingSampleDataCount] = useState<number>(0);

    const [selectedOrder, setSelectedOrder] = useState<any>();
    const [isOpenPaymentForBrandDialog, setIsOpenPaymentForBrandDialog] = useState<boolean>(false);

    const __handleOpenPaymentForBrandialog = (orderId: any) => {
        setSelectedOrder(orderId);
        setIsOpenPaymentForBrandDialog(true);
    };

    const __handleClosePaymentForBrandDialog = () => {
        setSelectedOrder(null);
        setIsOpenPaymentForBrandDialog(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <IoMdCloseCircleOutline
                    size={24}
                    color="red"
                    onClick={onClose}
                    className="absolute top-4 right-4 cursor-pointer"
                />

                <h2 className="text-2xl font-bold text-gray-700 mb-6">Order Report Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {statusItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center"
                            style={{
                                gridTemplateColumns: item.label === 'Status' || item.label === 'Payment Status' ? '30% auto' : '1fr auto'
                            }}
                        >
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-semibold">{item.label}:</span>
                            </p>
                            <p className={`text-sm font-bold ${item.customClass || 'text-gray-800'} ml-2 px-3 rounded-full ${item.label === 'Status' || item.label === 'Payment Status' ? 'py-2' : ''}`}>
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-5 py-2 text-sm font-medium text-white"
                        style={{
                            borderRadius: 4,
                            color: whiteColor,
                            marginBottom: 10,
                            backgroundColor: primaryColor,
                            textDecoration: "none",
                        }}
                        onClick={() => __handleOpenPaymentForBrandialog(transaction.orderID)}
                    >
                        <span className="font-medium text-white">Payment</span>
                    </button>
                </div>

                {selectedOrder === transaction.orderID && (
                    <PaymentFromAccountantToBranđialog
                        onClose={__handleClosePaymentForBrandDialog}
                        isOpen={true}
                        paymentData={transaction.paymentList}
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

interface TablesProps {
    table: AccountantOrderInterface[],
    onViewDetails: (report: AccountantOrderInterface) => void;
}
const Tables: React.FC<TablesProps> = ({ table, onViewDetails }) => {
    const columns: GridColDef[] = [
        { field: 'orderID', headerName: 'Order ID', width: 130 },
        { field: 'orderType', headerName: 'Type', width: 130 },
        { field: 'buyerName', headerName: 'Buyer Name', width: 150 },
        { field: 'totalPrice', headerName: 'Total Price (VND)', width: 130 },
        { field: 'expectedStartDate', headerName: 'Expected Start Date', width: 180 },
        { field: 'orderStatus', headerName: 'Order Status', width: 130 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    onClick={() => onViewDetails(params.row)}
                    sx={{
                        backgroundColor: `${primaryColor}`,
                        color: "white",
                        '&:hover': {
                            backgroundColor: `${primaryColor}`
                        }
                    }}
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <Box
            sx={{
                height: "75vh",
                width: '100%',
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: '#D7E7FF !important',
                },
                '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#FFFFFF !important',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bolder',
                }
            }}
        >
            <DataGrid
                rows={table}
                columns={columns}
                getRowId={(row) => row.orderID}
            />
        </Box>
    );
}

const AccountantManageRefundPaymentForBrandComponent: React.FC = () => {
    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<{ payment: PaymentInterface | PaymentOrderInterface, order: AccountantOrderInterface } | undefined>();
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
    const [isTableView, setIsTableView] = useState(false);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [canceledCount, setCanceledCount] = useState<number>(0);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [checkingSampleDataCount, setCheckingSampleDataCount] = useState<number>(0);
    const [fulldataOrderResposne, setFulldataOrderResposne] = useState<AccountantOrderInterface[]>([]);

    // ---------------UseEffect---------------//
    useEffect(() => {

        console.log('orderChild: ', orderChild);
    }, [orderChild]);



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
            __handleFetchOrderData();

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

    const __handleFetchOrderData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getFullOrderAccountant}`, null, __getToken());

            if (response.status === 200) {
                // Define and use proper types
                const dataResp: AccountantOrderInterface[] = response.data.filter((item: AccountantOrderInterface) =>
                    item.paymentList.length !== 0 &&
                    item.paymentList.some((payment: Payment) => payment.paymentType === 'ORDER_REFUND')
                );

                console.log('dataResp: ', dataResp);

                // Update state for orderChild
                const orderChildUpdate: { [orderId: string]: SubOrder[] } = {};
                dataResp.forEach((order: AccountantOrderInterface) => {
                    orderChildUpdate[order.orderID] = order.subOrderList;
                });
                setOrderChild(prevState => ({
                    ...prevState,
                    ...orderChildUpdate
                }));

                // Update the full data response
                setFulldataOrderResposne(dataResp);

                // Filter and set pending and completed counts
                const filteredPendingOrders = dataResp.filter((order: AccountantOrderInterface) => order.paymentStatus === false);
                const filteredPaidOrders = dataResp.filter((order: AccountantOrderInterface) => order.paymentStatus === true);

                setPendingCount(filteredPendingOrders.length);
                setCompletedCount(filteredPaidOrders.length);
            } else {
                toast.error(response.message || 'An error occurred', { autoClose: 4000 });
                console.log(response.message);
            }
        } catch (error: any) {
            toast.error(`An error occurred`, { autoClose: 4000 });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };


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
    const __handleViewInvoiceClick = (payment: any, order: AccountantOrderInterface) => {
        setCurrentPaymentData({ payment, order });
        setIsOpenPaymentInformationDialog(true);
    };

    /**
     * 
     * @param item 
     * @returns 
     */
    const renderStatusIcon = (item: any) => {
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
    const applyFilters = (orderDetail: AccountantOrderInterface) => {
        return (
            (filters.orderID === '' || orderDetail.orderID.includes(filters.orderID)) &&
            (filters.createDate === '' || (orderDetail.expectedStartDate?.includes(filters.createDate) ?? false)) &&
            (filters.status === '' || orderDetail.orderStatus === filters.status)
        );
    };





    const columns: GridColDef[] = [
        { field: 'orderID', headerName: 'Order ID', width: 130 },
        { field: 'buyerName', headerName: 'Buyer Name', width: 150 },
        { field: 'totalPrice', headerName: 'Total Price', width: 130, valueFormatter: (params: any) => `${__handleAddCommasToNumber(params.value)} VND` },
        { field: 'expectedStartDate', headerName: 'Expected Start Date', width: 180 },
        {
            field: 'orderStatus', headerName: 'Order Status', width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    style={__handlegetStatusBackgroundBoolean(params.value === 'DELIVERED')}
                />
            )
        },
        {
            field: 'paymentStatus', headerName: 'Payment Status', width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'PAID' : 'PENDING'}
                    style={__handlegetStatusBackgroundBoolean(params.value)}
                />
            )
        },
        {
            field: 'actions', headerName: 'Actions', width: 200,
            renderCell: (params) => (
                <div>
                    <Button
                        onClick={() => __handleExtendTranscation(params.row.orderID)}
                        style={{ marginRight: '10px' }}
                    >
                        View Transactions
                    </Button>
                    <Button
                        onClick={() => __handleOpenPaymentForBrandialog(params.row.orderID)}
                    >
                        Payment
                    </Button>
                </div>
            )
        },
    ];

    const [selectedTransaction, setSelectedTransaction] = useState<AccountantOrderInterface | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (report: AccountantOrderInterface) => {
        setSelectedTransaction(report)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container}`}>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto p-4 md:p-6 min-h-screen">
                    <div className="mb-6">
                        <div className="mt-0">
                            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
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
                                            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                            <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                        </svg>
                                    </div>
                                    <div className="p-4 text-right">
                                        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: greenColor, fontWeight: 'bold' }}>PAID</p>
                                        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{completedCount}</h4>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="flex mt-0">
                            <div className="w-7/10" style={{ width: "60%" }}>
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
                            <div className="flex border border-gray-300 rounded-md overflow-hidden" style={{ marginLeft: "auto" }}>
                                <button
                                    className={`px-2 py-1 text-sm ${!isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                                    onClick={() => setIsTableView(false)}
                                >
                                    List mode
                                </button>
                                <button
                                    className={`px-2 py-1 text-sm ${isTableView ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
                                    onClick={() => setIsTableView(true)}
                                >
                                    Table mode
                                </button>
                            </div>
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

                    {isTableView ? (
                        <div>
                            <div style={{ height: 444, width: '100%' }}>
                                <Tables
                                    table={fulldataOrderResposne}
                                    onViewDetails={handleViewDetails}
                                />
                            </div>
                            {isModalOpen && selectedTransaction && (
                                <TransactionModal
                                    transaction={selectedTransaction}
                                    onClose={handleCloseModal}
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            {fulldataOrderResposne?.filter(applyFilters).map((orderDetail) => (
                                // {fulldataOrderResposne?.map((orderDetail) => (
                                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-8 transform transition-all hover:shadow-lg">
                                    <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-6" >
                                        <div className="mb-4 md:mb-0 w-max">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                        <FaFileAlt className="inline-block mr-1" />
                                                        Order ID:{" "}
                                                        <span className="text-sm text-gray-500 pb-2">
                                                            {orderDetail?.orderID}
                                                        </span>
                                                    </p>
                                                    <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                        <FaDraftingCompass className="inline-block mr-1" />
                                                        Design ID:{" "}
                                                        <span className="text-sm text-gray-500 pb-2">
                                                            {orderDetail.designResponse?.designID}
                                                        </span>
                                                    </p>
                                                    <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                        <FaCalendarAlt className="inline-block mr-1" />
                                                        Create date:{" "}
                                                        <span className="text-sm text-gray-500 pb-2">
                                                            {orderDetail?.expectedStartDate}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className='ml-32' style={{ marginTop: -10 }}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black">
                                                            Order Status:{" "}
                                                        </p>
                                                        <Stack direction="row" spacing={1} padding={1}>
                                                            <Chip
                                                                label={`${orderDetail?.orderStatus
                                                                    } ${orderDetail?.orderStatus === "Cancel" ||
                                                                        orderDetail?.orderStatus === "Delivered"
                                                                        ? "at " + orderDetail?.expectedProductCompletionDate
                                                                        : ""
                                                                    }`}
                                                                variant="filled"
                                                                style={{
                                                                    backgroundColor:
                                                                        orderDetail?.orderStatus === "PENDING"
                                                                            ? secondaryColor
                                                                            : orderDetail?.orderStatus === "DELIVERED"
                                                                                ? greenColor
                                                                                : orderDetail?.orderStatus === "DEPOSIT"
                                                                                    ? secondaryColor
                                                                                    : orderDetail?.orderStatus === "PROCESSING"
                                                                                        ? secondaryColor
                                                                                        : redColor,
                                                                    opacity: 1,
                                                                    color: whiteColor,
                                                                }}
                                                            />
                                                        </Stack>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black">
                                                            Payment status:{" "}
                                                        </p>
                                                        <Stack direction="row" spacing={5} padding={1}>
                                                            <Chip
                                                                label={`${orderDetail?.paymentStatus && orderDetail.paymentStatus
                                                                    ? "PAID"
                                                                    : "PENDING"
                                                                    } `}
                                                                variant="filled"
                                                                style={__handlegetStatusBackgroundBoolean(
                                                                    orderDetail?.paymentStatus && orderDetail.paymentStatus
                                                                        ? true
                                                                        : false
                                                                )}
                                                            />
                                                        </Stack>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <button
                                        onClick={() => __handleExtendTranscation(orderDetail?.orderID)}
                                        className={`${style.orderHistory__transactionLable} mb-5`}
                                    >
                                        <p className="text-sm md:text-sm font-bold text-gray-800 pr-5">Transactions</p>
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
                                                            <p className="text-sm text-black-500 pb-2">
                                                                <span style={{ fontWeight: "bolder" }}>ID:</span>  <span>{payment.paymentID}</span>
                                                            </p>
                                                            <p className="text-sm text-black-500 pb-2">
                                                                <span style={{ fontWeight: "bolder" }}>
                                                                    PayOS ID:{" "}
                                                                </span>
                                                                <span>{payment ? payment?.payOSData?.orderCode : 'NaN'}</span>
                                                            </p>
                                                            <p className="text-sm text-black-500 pb-2">
                                                                <span style={{ fontWeight: "bolder" }}>Amount:</span> <span>{__handleAddCommasToNumber(payment.payOSData?.amount)} VND</span>
                                                            </p>
                                                            <p className="text-sm text-black-500 pb-2">
                                                                <span style={{ fontWeight: "bolder" }}>Created at: </span><span>{payment.payOSData?.createDate}</span>
                                                            </p>

                                                            <p
                                                                className={`${style.orderHistory__viewInvoice__button} ml-2 md:ml-4 px-3 py-2 md:px-4 md:py-2`}
                                                                onClick={() => __handleViewInvoiceClick(payment, orderDetail)}
                                                            >
                                                                View transaction
                                                            </p>
                                                            <div className="flex flex-col md:flex-row items-start md:items-center">
                                                                {renderStatusIcon(payment)}
                                                                <div className="ml-0 md:ml-auto mt-4 md:mt-0 px-3 py-2 md:px-4 md:py-2">
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
                                                                        paymentData={[orderDetail.paymentList.find((payment) => payment.paymentType === 'ORDER_REFUND')]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null; // If paymentType is not 'ORDER_REFUND', return null
                                        })
                                    }
                                </div>
                            ))}
                        </div>
                    )}
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

export default AccountantManageRefundPaymentForBrandComponent;

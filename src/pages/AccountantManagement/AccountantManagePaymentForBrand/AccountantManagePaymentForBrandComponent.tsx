import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { cancelColor, cancelColorText, completeColor, completeColorText, deliveredColor, deliveredColorText, deposisColor, deposisColorText, greenColor, pendingColor, pendingColorText, primaryColor, processingColor, processingColorText, redColor, secondaryColor, whiteColor } from '../../../root/ColorSystem';
import style from './AccountantManagePaymentForBrandComponentStyle.module.scss'
import { DesignMaterialDetailResponse, OrderDetailInterface, PaymentInterface } from '../../../models/OrderModel';
import { Stack } from '@mui/system';
import { FaAngleDown, FaBuilding, FaClock, FaCreditCard, FaDollarSign, FaHashtag } from "react-icons/fa";
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
import { DesignDetailInterface, DesignInterface } from '../../../models/DesignModel';
import { __handleGetDateTimeColor } from '../../../utils/DateUtils';
import { motion } from 'framer-motion';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import { __getToken } from '../../../App';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { styled } from '@mui/system';
import { FaFileAlt, FaTag, FaCalendarAlt } from 'react-icons/fa'

const InvoiceHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
}));

const Logo = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '2rem',
}));

const InvoiceDetails = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const ScrollFreeDialogContent = styled(DialogContent)({
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
});


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
    designResponse: DesignDetailInterface
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
    payOSData?: PayOSResponseInterface;
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
interface TransactionModalProps {
    transaction: any;
    onClose: () => void;
    orderDetail?: OrderDetailInterface | AccountantOrderInterface
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose, orderDetail }) => {
    const [isTransactionsExpanded, setIsTransactionsExpanded] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [isOpenPaymentForBrandDialog, setIsOpenPaymentForBrandDialog] = useState<boolean>(false);

    const toggleTransactions = () => setIsTransactionsExpanded(!isTransactionsExpanded);

    const __handleOpenPaymentForBrandDialog = (orderId: string) => {
        setSelectedOrder(orderId);
        setIsOpenPaymentForBrandDialog(true);
    };

    const __handleClosePaymentForBrandDialog = () => {
        setSelectedOrder(null);
        setIsOpenPaymentForBrandDialog(false);
    };

    const safelyGetProperty = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const __handleGetQuantityMaterial = (materialID: any) => {
        const result = transaction?.designResponse?.materialDetail?.find((item: any) => item.materialResponse?.materialID === materialID)
        if (result) return result;
    }


    // Download PDF Function
    const _handleOpenPDF = (pdfData: PDFData) => {
        const { transaction, transactionSubOrder, totalMaterialPrice, referencePrice } = pdfData;

        const __handleGetStageBrandPrice = (subOrderID: any) => {
            const result = referencePrice?.brandDetailPriceResponseList.find((item) => item.subOrderID === subOrderID);
            if (result) return result;
        }

        const __handleGetTotalMaterialPrice = () => {
            if (!transactionSubOrder) {
                console.log("No transactionSubOrder available");
                return 0; // Return 0 if no transactionSubOrder exists
            }

            let sum: number = 0;

            console.log("Transaction:", transactionSubOrder);

            transactionSubOrder?.brandMaterialResponseList?.forEach((material: any) => {
                console.log("Processing material:", material);

                transactionSubOrder.orderCustomResponse?.designResponse?.materialDetail?.forEach((item: any) => {
                    console.log("Checking item:", item);

                    if (material.materialID === item.materialResponse?.materialID && item.quantity) {
                        const materialPrice = material.brandPrice * item.quantity;
                        console.log(`Adding price: ${material.brandPrice} * ${item.quantity} = ${materialPrice}`);
                        sum += materialPrice;
                    }
                });
            });

            console.log("Total Material Price:", sum);
            return sum;
        };

        const stageBrandPrice = __handleGetStageBrandPrice(transactionSubOrder?.orderCustomResponse.orderID);

        // Extract and parse the prices, ensuring they default to 0 if undefined or null
        const brandPriceDeposit = Math.round(parseInt(stageBrandPrice?.brandPriceDeposit || '0', 10) / 1000) * 1000;
        const brandPriceFirstStage = Math.round(parseInt(stageBrandPrice?.brandPriceFirstStage || '0', 10) / 1000) * 1000;
        const brandPriceSecondStage = Math.round(parseInt(stageBrandPrice?.brandPriceSecondStage || '0', 10) / 1000) * 1000;

        // Sum the parsed prices
        const totalPrice = brandPriceDeposit + brandPriceFirstStage + brandPriceSecondStage;

        if (!transaction) return;
        const doc = new jsPDF();

        // set background color
        doc.setFillColor(244, 245, 239); // White color
        // doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'D');

        const imgData = "https://res.cloudinary.com/dby2saqmn/image/upload/v1723989709/ncoktpbtvzzhjqktopjz.png";
        const imgWidth = 40;
        const imgHeight = 40;
        doc.addImage(imgData, 'PNG', 15, 10, imgWidth, imgHeight);

        doc.setFontSize(35);
        doc.setFont('Playfair Display', 'bold');

        doc.text("INVOICE", 140, 30).getFont()

        const textOffset = 10;
        const tableStartY = Math.max(imgHeight + textOffset, 50);

        autoTable(doc, {
            startY: tableStartY,
            body: [
                [
                    {
                        content: `SMART TAILOR, Inc` + `\nLot E2a-7, Street D1, High-Tech Park` + `\nLong Thanh My Ward City` + `\nThu Duc` + `\nHo Chi Minh City.` + `\nViet Nam`,
                        styles: {
                            halign: 'right',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ], theme: 'plain',
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        // Add Material detail
        doc.setFontSize(12);
        autoTable(doc, {
            head: [['HS code', 'Name', 'Category', 'Unit', 'Quantity']],

            body: transactionSubOrder?.brandMaterialResponseList?.map((item: MaterialReportInterface) => {
                return [
                    item.hsCode,
                    item.materialName,
                    item.categoryName,
                    item.unit,
                    __handleGetQuantityMaterial(item.materialID)?.quantity || 'N/A'
                ];
            }) || [],
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        doc.setFontSize(12);
        autoTable(doc, {
            head: [['Part name', 'Min square (m²)', 'Max square (m²)', 'Min material price / m² (VND)', 'Max material price / m² (VND)']],

            body: referencePrice?.designMaterialDetailResponseList?.map((item: any) => {
                return [
                    item.detailName,
                    item.minMeterSquare,
                    item.maxMeterSquare,
                    __handleAddCommasToNumber(item.minPriceMaterial) || 'N/A',
                    __handleAddCommasToNumber(item.maxPriceMaterial) || 'N/A'
                ];
            }) || [],
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        // Original Design detail table
        autoTable(doc, {
            head: [['Design ID', 'Quantity', 'Size', 'Create Date']],
            body: transaction.detailList?.map((item: any) => [
                item.designDetailId,
                item.quantity,
                item.size?.sizeName,
                item.size?.createDate
            ]),
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            // startY: doc.lastAutoTable.finalY + 10,
            body: [
                [
                    {
                        content: 'Payment Information',
                        styles: {
                            halign: 'left',
                            fontSize: 14,
                            fontStyle: 'bold'
                        }
                    }
                ],
                [
                    {
                        content: `Deposit: ${__handleAddCommasToNumber(__handleGetStageBrandPrice(transactionSubOrder?.orderCustomResponse.orderID)?.brandPriceDeposit) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Labor Price: ${__handleAddCommasToNumber(transactionSubOrder?.brandLaborQuantity) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Total: ${__handleAddCommasToNumber(totalPrice) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            head: [[{ content: "                          ", styles: { halign: 'right' } }, { content: "                         ", styles: { halign: 'center' } }, { content: "TOTAL", styles: { halign: 'center' } }, { content: `${__handleAddCommasToNumber(transaction.totalPrice)} VND`, styles: { halign: 'center' } }]],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `                                                                                                               __________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: "Thank You!",
                        styles: {
                            halign: 'center',
                            fontSize: 20
                        }
                    }
                ]
            ],
            theme: "plain"
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: ` Lot E2a - 7, Street D1, High - Tech Park` + ` Long Thanh My Ward City` + ` Thu Duc` + ` Ho Chi Minh City` + ` Viet Nam`,
                        styles: {
                            halign: 'left',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ], theme: 'plain',
        })

        doc.save('Transaction_Invoice.pdf')
    };


    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState(null);

    const handleViewTransaction = (transaction: any) => {
        setSelectedTransactions(transaction);
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setIsTransactionModalOpen(false);
        setSelectedTransactions(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <IoMdCloseCircleOutline
                    size={20}
                    className="absolute top-4 right-4 cursor-pointer text-red-500 hover:text-red-500 transition-colors"
                    onClick={onClose}
                />

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Transaction Details</h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-semibold">{transaction.orderID || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Design ID</p>
                        <p className="font-semibold">{safelyGetProperty(transaction, 'designResponse.designID') || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Create Date</p>
                        <p className="font-semibold">{transaction.createDate || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <Chip label={transaction.orderStatus || 'N/A'} color="error" size="small" className="mt-1" />
                    </div>
                </div>

                <div className="mb-6">
                    <button
                        onClick={toggleTransactions}
                        className="flex items-center justify-between w-full text-left font-bold bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <span className="text-lg text-blue-700">Transactions</span>
                        {isTransactionsExpanded ? <FaAngleUp className="text-blue-700" /> : <FaAngleDown className="text-blue-700" />}
                    </button>

                    {isTransactionsExpanded && (transaction.subOrderList || []).map((subOrder: any, index: number) => (
                        <motion.div
                            key={index}
                            className="mt-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                className="flex flex-col md:flex-row items-start md:items-center mt-10 mb-4 md:mb-6 border-b pb-4 md:pb-6"
                            >
                                <div className="flex-shrink-0"></div>
                                <div
                                    className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow grid grid-cols-1 md:grid-cols-2 gap-4"
                                    style={{ position: "relative" }}
                                >
                                    <div>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Sub ID:{" "}
                                            <span className="text-sm text-gray-500 pb-2">
                                                {subOrder.orderID}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Type:{" "}
                                            <span className="text-sm text-blue-700 pb-2">
                                                {subOrder.orderType}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Brand ID:{" "}
                                            <span className="text-sm text-gray-500 pb-2">
                                                {subOrder.brand?.brandID}
                                            </span>
                                        </p>
                                        <p
                                            style={{ fontWeight: "500" }}
                                            className="text-sm text-black flex content-center items-center"
                                        >
                                            Brand:
                                            <p
                                                style={{ fontWeight: "500" }}
                                                className="text-sm text-black flex content-center items-center"
                                            >
                                                <img
                                                    src={subOrder.brand?.user.imageUrl}
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: 90,
                                                        marginLeft: 5,
                                                        marginRight: 5,
                                                    }}
                                                />
                                                <p
                                                    className={`${__handlegetRatingStyle(
                                                        subOrder.brand?.rating
                                                    )} text-sm text-gray-500`}
                                                >
                                                    {" "}
                                                    {subOrder.brand?.brandName}
                                                </p>
                                            </p>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Rating:{" "}
                                            <span className="text-sm text-gray-500 pb-2">
                                                {subOrder.brand?.rating?.toFixed(1)}
                                            </span>{" "}
                                            <span className="text-yellow-400 text-sm">★</span>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-4">
                                            Details:
                                            {subOrder.detailList?.map((detail: any) => (
                                                <div className="grid grid-cols-4 gap-1 pt-0">
                                                    <p className="text-sm text-gray-500 pb-2">
                                                        Size: {detail.size?.sizeName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 pb-2">
                                                        Quantity: {detail.quantity}
                                                    </p>
                                                </div>
                                            ))}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Total price:{" "}
                                            <span className="text-sm text-gray-500 pb-2">
                                                {__handleAddCommasToNumber(subOrder.totalPrice)} VND
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Expected start at:{" "}
                                            <span className={`${__handleGetDateTimeColor(subOrder.expectedStartDate)} text-sm pb-2`}>
                                                {subOrder.expectedStartDate}
                                            </span>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Status:
                                            <button
                                                className="py-1 px-3 rounded-full ml-2"
                                                style={{
                                                    backgroundColor:
                                                        subOrder.orderDetail?.orderStatus === "PENDING"
                                                            ? secondaryColor
                                                            : subOrder.orderDetail?.orderStatus === "DELIVERED"
                                                                ? greenColor
                                                                : subOrder.orderDetail?.orderStatus === "DEPOSIT"
                                                                    ? secondaryColor
                                                                    : subOrder.orderDetail?.orderStatus === "PROCESSING"
                                                                        ? secondaryColor
                                                                        : orderDetail?.orderStatus === "RECEIVED"
                                                                            ? greenColor
                                                                            : orderDetail?.orderStatus === "COMPLETED"
                                                                                ? greenColor
                                                                                : orderDetail?.orderStatus === "REFUND_REQUEST"
                                                                                    ? redColor
                                                                                    : redColor,
                                                    opacity: 1,
                                                    color: whiteColor,
                                                    fontSize: 11,
                                                }}
                                            >
                                                {subOrder.orderStatus}
                                            </button>
                                        </p>
                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                            Payment status:
                                            <button
                                                className="py-1 px-3 rounded-full ml-2"
                                                style={__handlegetStatusBackgroundBoolean(
                                                    subOrder?.paymentList &&
                                                        subOrder?.paymentList[0].paymentStatus
                                                        ? true
                                                        : false
                                                )}
                                            >
                                                {`${subOrder?.paymentList &&
                                                    subOrder?.paymentList[0].paymentStatus
                                                    ? "PAID"
                                                    : "PENDING"
                                                    } `}
                                            </button>
                                        </p>

                                    </div>
                                    <div
                                        className={`${style.orderHistory__viewInvoice__buttonPayment}items-center justify-center mt-0`}
                                        style={{ textAlign: "center", position: 'absolute', bottom: 0, right: 10 }}
                                    >
                                        <p
                                            className={`px-5 text-sm font-medium`}
                                        >
                                            {/* <p className='mb-40' onClick={() => handleViewTransaction(subOrder)}>View transaction</p> */}
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
                                                onClick={() => __handleOpenPaymentForBrandDialog(subOrder.orderID)}
                                            >
                                                <span className="font-medium text-white">Payment</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {isTransactionModalOpen && selectedTransactions && (
                                <TransactionModals
                                    transaction={selectedTransactions}
                                    onClose={handleCloseTransactionModal}
                                    onDownloadPDF={(pdfData) => _handleOpenPDF(pdfData)}
                                    parentOrderDetai={orderDetail}
                                />
                            )}
                            {selectedOrder === subOrder.orderID && (
                                <PaymentFromAccountantToBranđialog
                                    onClose={__handleClosePaymentForBrandDialog}
                                    isOpen={true}
                                    paymentData={subOrder.paymentList}
                                ></PaymentFromAccountantToBranđialog>
                            )}
                            <p className='pb-5 text-sm underline text-blue-500 mr-auto cursor-pointer' onClick={() => handleViewTransaction(subOrder)}>View transaction</p>

                        </motion.div>
                    ))}
                </div>

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
        { field: 'orderID', headerName: 'Order ID', width: 130, flex: 1 },
        { field: 'orderType', headerName: 'Type', width: 130, flex: 1 },
        { field: 'buyerName', headerName: 'Buyer Name', width: 150 },
        {
            field: 'totalPrice', headerName: 'Total Price (VND)', width: 130,
            renderCell: (params) => (
                <span>
                    {params.value.toLocaleString()}
                </span>
            ),
        },
        { field: 'expectedStartDate', headerName: 'Expected Start Date', width: 180 },
        {
            field: 'orderStatus', headerName: 'Order Status', width: 100,
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor:
                            params.value === "PENDING"
                                ? pendingColor
                                : params.value === "DELIVERED"
                                    ? deliveredColor
                                    : params.value === "DEPOSIT"
                                        ? deposisColor
                                        : params.value === "PROCESSING"
                                            ? processingColor
                                            : params.value === "COMPLETED"
                                                ? completeColor
                                                : cancelColor,
                        color: params.value === "PENDING"
                            ? pendingColorText
                            : params.value === "DELIVERED"
                                ? deliveredColorText
                                : params.value === "DEPOSIT"
                                    ? deposisColorText
                                    : params.value === "PROCESSING"
                                        ? processingColorText
                                        : params.value === "COMPLETED"
                                            ? completeColorText
                                            : cancelColorText,
                        borderRadius: '16px',
                        padding: '1px 5px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        height: "50%",
                        marginTop: "10%"
                    }}
                >
                    <Box
                        sx={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                        }}
                    />
                    {params.value}
                </Box>
            )
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
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


interface TransactionModalsProps {
    transaction: any;
    onClose: () => void;
    onDownloadPDF: (data: PDFData) => void;
    parentOrderDetai?: OrderDetailInterface | AccountantOrderInterface
}

interface PDFData {
    transaction: any;
    transactionSubOrder: TransactionSubOrderInterface | undefined;
    totalMaterialPrice: number;
    referencePrice: OrderPriceDetailInterface | undefined
}

interface MaterialReportInterface {
    basePrice: number;
    brandID: string;
    brandPrice: number;
    categoryName: string;
    createDate: string; // Consider using Date type if you plan to manipulate dates
    hsCode: string;
    lastModifiedDate: string | null; // If this can be null, keep it as a nullable string
    materialID: string;
    materialName: string;
    unit: string;
}

interface TransactionSubOrderInterface {
    brandLaborQuantity: number;
    orderCustomResponse: OrderDetailInterface;
    brandMaterialResponseList: MaterialReportInterface[]
}

interface BrandDetailPriceResponseInterface {
    brandID: string;
    subOrderID: string;
    brandPriceDeposit: string;
    brandPriceFirstStage: string;
    brandPriceSecondStage: string;
}

interface OrderPriceDetailInterface {
    totalPriceOfParentOrder: string;
    customerPriceDeposit: string;
    customerPriceFirstStage: string;
    customerSecondStage: string;
    customerShippingFee: string | number | undefined;
    brandDetailPriceResponseList: BrandDetailPriceResponseInterface[];
    designMaterialDetailResponseList: DesignMaterialDetailResponse[]
}

const TransactionModals: React.FC<TransactionModalsProps> = ({ transaction, onClose, onDownloadPDF, parentOrderDetai }) => {

    const [transactionSubOrder, setTransactionSubOrder] = useState<TransactionSubOrderInterface>();
    const [referencePrice, setReferencePrice] = useState<OrderPriceDetailInterface>();


    useEffect(() => {
        console.log('transaction.designResponse.materialDetail: ', transaction.designResponse);
        __handleFetchInvoiceData();
        __handleReferencePrice(parentOrderDetai?.orderID)
    }, [transaction]);

    const __handleMoveToPayOSPaymentDetail = () => {
        if (transaction) {
            window.open(transaction.paymentList[0]?.payOSResponse.data.checkoutUrl, '_blank');
        }
    }

    const __handleFetchInvoiceData = async () => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getSubOrderInvoiceBySubOrderId}/${transaction.orderID}`);
            if (response.status === 200) {

                console.log(response.data);
                setTransactionSubOrder(response.data)
            }
        } catch (error) {
            console.error(`Error fetching details for order ${transaction.orderID}:`, error);
        }
    }

    const __handleGetQuantityMaterial = (materialID: any) => {
        const result = parentOrderDetai?.designResponse?.materialDetail?.find((item) => item.materialResponse?.materialID === materialID)
        if (result) return result;
    }

    const handleDownloadPDF = () => {
        const pdfData: PDFData = {
            transaction,
            transactionSubOrder,
            referencePrice,
            totalMaterialPrice: __handleGetTotalMaterialPrice()
        };
        onDownloadPDF(pdfData);
    };

    const __handleGetTotalMaterialPrice = () => {
        if (!transactionSubOrder) return 0; // Return 0 if no transactionSubOrder exists
        let sum: number = 0;

        transactionSubOrder?.brandMaterialResponseList?.forEach((material) => {
            transactionSubOrder.orderCustomResponse?.designResponse?.materialDetail?.forEach((item) => {
                if (material.materialID === item.materialResponse?.materialID && item.quantity) {
                    sum += material.brandPrice * item.quantity;
                }
            });
        });

        return sum;
    };

    const __handleReferencePrice = async (parentId: any) => {
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.designDetail + functionEndpoints.designDetail.getTotalPriceByParentOrderId}/${parentId}`, null, __getToken());
            if (response.status === 200) {
                setReferencePrice(response.data);
                console.log('response.data: ', response.data);
            }
            else {
                console.log('detail error: ', response.message);
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    const __handleGetStageBrandPrice = (subOrderID: any) => {
        const result = referencePrice?.brandDetailPriceResponseList.find((item) => item.subOrderID === subOrderID);
        if (result) return result;
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <ScrollFreeDialogContent>
                <DialogContent>
                    <InvoiceHeader>
                        <Logo>SMART TAILOR</Logo>
                        <Typography variant="h4">INVOICE</Typography>
                    </InvoiceHeader>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <InvoiceDetails>
                                <Typography variant="body2" style={{ display: "flex" }}>Brand: <p
                                    style={{ fontWeight: "500", marginTop: "-4px" }}
                                    className="text-sm text-black flex content-center items-center"
                                >
                                    <img
                                        src={transaction.brand?.user.imageUrl}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 90,
                                            marginLeft: 5,
                                            marginRight: 5,
                                        }}
                                    />
                                    <p
                                        className={`${__handlegetRatingStyle(
                                            transaction.brand?.rating
                                        )} text-sm text-gray-500`}
                                    >
                                        {" "}
                                        {transaction.brand?.brandName}
                                    </p>
                                </p></Typography>
                                <Typography variant="body2"><p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                    Brand Rating:{" "}
                                    <span className="text-sm text-gray-500 pb-2">
                                        {transaction.brand?.rating.toFixed(1)}
                                    </span>{" "}
                                    <span className="text-yellow-400 text-sm">★</span>
                                </p></Typography>
                                <Typography variant="body2">{transaction.address}</Typography>
                            </InvoiceDetails>
                        </Grid>
                        <Grid item xs={6}>
                            {/* <Typography variant="body1" align="right">Invoice No. {transaction.paymentList[0].paymentID}</Typography> */}

                            <Typography variant="body1" align="right">{transaction.expectedStartDate}</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" align="left">Material detail</Typography>
                    <Box sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, marginTop: 2, marginBottom: 2 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: primaryColor }}>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>HS code</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                        {/* <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Price (VND)</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactionSubOrder ? transactionSubOrder?.brandMaterialResponseList?.map((item) => (
                                        <TableRow
                                            key={item.materialID}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="left">{item.hsCode}</TableCell>
                                            <TableCell align="left">{item.materialName}</TableCell>
                                            <TableCell align="left">{item.categoryName}</TableCell>
                                            <TableCell align="left">{item.unit}</TableCell>
                                            <TableCell align="left">{__handleGetQuantityMaterial(item.materialID)?.quantity}</TableCell>
                                            {/* <TableCell align="left">{__handleAddCommasToNumber(item.brandPrice)}</TableCell> */}
                                        </TableRow>
                                    )) : (
                                        <div>
                                            <TableRow

                                                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                            >
                                                Data Loading
                                            </TableRow>
                                        </div>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box >
                    <Typography variant="body2" align="left">Part of design detail</Typography>

                    <Box sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, marginTop: 2, marginBottom: 2 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: primaryColor }}>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Part name</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Min square (m²)</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Max square (m²)</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Min material price / m² (VND)</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Max material price / m² (VND)</TableCell>
                                        {/* <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Price (VND)</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {referencePrice?.designMaterialDetailResponseList ? referencePrice?.designMaterialDetailResponseList?.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="left">{item.detailName}</TableCell>
                                            <TableCell align="left">{item.minMeterSquare}</TableCell>
                                            <TableCell align="left">{item.maxMeterSquare}</TableCell>
                                            <TableCell align="left">{__handleAddCommasToNumber(item.minPriceMaterial)}</TableCell>
                                            <TableCell align="left">{__handleAddCommasToNumber(item.maxPriceMaterial)}</TableCell>

                                            {/* <TableCell align="left">{__handleAddCommasToNumber(item.brandPrice)}</TableCell> */}
                                        </TableRow>
                                    )) : (
                                        <div>
                                            <TableRow

                                                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                            >
                                                Data Loading
                                            </TableRow>
                                        </div>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box >
                    <Typography variant="body2" align="left">Design detail</Typography>
                    <Box sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, marginTop: 2, marginBottom: 3 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ height: 10 }}>
                                    <TableRow sx={{ backgroundColor: primaryColor, height: 10 }}>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Design ID</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Size</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Create Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transaction.detailList?.map((item: any) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="left">{item.designDetailId}</TableCell>
                                            <TableCell align="left">{item.quantity}</TableCell>
                                            <TableCell align="left">{item.size?.sizeName}</TableCell>
                                            <TableCell align="left">{item.size?.createDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {transactionSubOrder && (
                        <div className="space-y-4 h-full flex items-center justify-center content-center" >
                            <div className="w-1/3 mr-auto mt-4">
                                {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceDeposit !== '-1' && (
                                    <div className="flex justify-between items-center border-b py-2">
                                        <span style={{ fontSize: 13 }} className="font-semibold">Deposit</span>
                                        <div className="flex items-center justify-end">
                                            {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceDeposit ? (
                                                <span style={{ fontSize: 14 }} className="text-right">{__handleAddCommasToNumber(__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceDeposit)} VND</span>
                                            ) : (
                                                <span style={{ fontSize: 14 }} className="text-right">Loading</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceFirstStage !== '-1' && (
                                    <div className="flex justify-between items-center border-b py-2">

                                        <span style={{ fontSize: 13 }} className="font-semibold">Stage 1</span>
                                        <div className="flex items-center justify-end">
                                            {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceFirstStage ? (
                                                <span style={{ fontSize: 14 }} className="text-right">{__handleAddCommasToNumber(__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceFirstStage)} VND</span>
                                            ) : (
                                                <span style={{ fontSize: 14 }} className="text-right">Loading</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceFirstStage !== '-1' && (
                                    <div className="flex justify-between items-center py-2">
                                        <span style={{ fontSize: 13 }} className="font-semibold">Stage 2</span>
                                        <div className="flex items-center justify-end">
                                            {__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceSecondStage ? (
                                                <span style={{ fontSize: 14 }} className="text-right">{__handleAddCommasToNumber(__handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID)?.brandPriceSecondStage)} VND</span>
                                            ) : (
                                                <span style={{ fontSize: 14 }} className="text-right">Loading</span>
                                            )}
                                        </div>

                                    </div>
                                )}

                            </div>

                            <div className="w-1/2">
                                <div className="flex justify-between items-center border-b py-2">
                                    <span style={{ fontSize: 13 }} className="font-semibold">Labor price:</span>
                                    <div className="flex items-center justify-end">
                                        <span style={{ fontSize: 14 }} className="text-right">{__handleAddCommasToNumber(transactionSubOrder?.brandLaborQuantity)} VND</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span style={{ fontSize: 13 }} className="font-semibold">Total price:</span>
                                    <div className="flex items-center justify-end">
                                        <span style={{ fontSize: 14 }} className="text-right">
                                            {(() => {
                                                const stageBrandPrice = __handleGetStageBrandPrice(transactionSubOrder.orderCustomResponse.orderID);

                                                // Extract and parse the prices, ensuring they default to 0 if undefined or null
                                                const brandPriceDeposit = Math.round(parseInt(stageBrandPrice?.brandPriceDeposit || '0', 10) / 1000) * 1000;
                                                const brandPriceFirstStage = Math.round(parseInt(stageBrandPrice?.brandPriceFirstStage || '0', 10) / 1000) * 1000;
                                                const brandPriceSecondStage = Math.round(parseInt(stageBrandPrice?.brandPriceSecondStage || '0', 10) / 1000) * 1000;

                                                // Sum the parsed prices
                                                const totalPrice = brandPriceDeposit + brandPriceFirstStage + brandPriceSecondStage;

                                                // Format the total price with commas and return it
                                                return `${__handleAddCommasToNumber(totalPrice)} VND`;
                                            })()}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </DialogContent>
            </ScrollFreeDialogContent >
            <DialogActions>
                <Button onClick={handleDownloadPDF} variant="contained" color="primary">Download PDF</Button>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog >
    );
};

const AccountantManagePaymentForBrandComponent: React.FC = () => {
    // ---------------UseState---------------//
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
    const [isOpenPaymentInforDialog, setIsOpenPaymentInformationDialog] = useState<boolean>(false);
    const [currentPaymentData, setCurrentPaymentData] = useState<PaymentOrderInterface>();
    const [isExtendTransaction, setIsExtendTransaction] = useState<{ [orderId: string]: boolean }>({});
    // const [orderDetailList, setOrderDetailList] = useState<OrderDetailInterface[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userAuth, setUserAuth] = useState<UserInterface>();
    const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState<{ [key: string]: boolean }>({});
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
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [canceledCount, setCanceledCount] = useState<number>(0);
    const [completedCount, setCompletedCount] = useState<number>(0);
    const [checkingSampleDataCount, setCheckingSampleDataCount] = useState<number>(0);


    // ---------------UseEffect---------------//
    useEffect(() => {

        console.log('orderChild: ', orderChild);
    }, [orderChild]);
    const [fulldataOrderResposne, setFulldataOrderResposne] = useState<AccountantOrderInterface[]>([]);

    // ---------------UseEffect---------------//
    useEffect(() => {

        __handleFetchOrderData();

    }, []);

    /**
     * Move to Top When scroll down
     */
    useEffect(() => {
        const userStorage = Cookies.get('userAuth');
        if (userStorage) {
            const userParse: UserInterface = JSON.parse(userStorage);
            setUserAuth(userParse)
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
        setIsLoading(true)
        try {
            const response = await api.get(`${versionEndpoints.v1 + featuresEndpoints.order + functionEndpoints.order.getFullOrderAccountant}`, null, __getToken());
            if (response.status === 200) {
                console.log(response.data);
                // setOrderDetailList(response.data);
                setFulldataOrderResposne(response.data);
                const filteredPendingOrders = response.data.filter((order: AccountantOrderInterface) => order.paymentStatus === false);
                const filteredPaidOrders = response.data.filter((order: AccountantOrderInterface) => order.paymentStatus === true);
                const filteredCanceledOrders = response.data.filter((order: AccountantOrderInterface) => order.orderStatus === 'CANCEL');
                const filteredCheckingSampleDataOrders = response.data.filter((order: AccountantOrderInterface) => order.orderStatus === 'DELIVERED');

                setPendingCount(filteredPendingOrders.length);
                setCanceledCount(filteredCanceledOrders.length);
                setCompletedCount(filteredPaidOrders.length)
                setCheckingSampleDataCount(filteredCheckingSampleDataOrders.length)
                response.data.forEach((order: AccountantOrderInterface) => {
                    setOrderChild(prevState => ({
                        ...prevState,
                        [order.orderID]: order.subOrderList // Ensure order.subOrderList is an array of OrderDetailInterface
                    }));
                });
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
    // const __handleViewInvoiceClick = (payment: PaymentInterface | PaymentOrderInterface) => {
    //     setCurrentPaymentData(payment);
    //     setIsOpenPaymentInformationDialog(true);
    // };

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

    const [isTableView, setIsTableView] = useState(false)
    const columns: GridColDef[] = [
        { field: 'orderID', headerName: 'Order ID', width: 130 },
        { field: 'buyerName', headerName: 'Buyer Name', width: 150 },
        { field: 'totalPrice', headerName: 'Total Price (VND)', width: 130, valueFormatter: (params: any) => `${__handleAddCommasToNumber(params.value)} VND` },
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

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState<any>(null);

    const handleViewTransaction = (transaction: any) => {
        setSelectedTransactions(transaction);
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setIsTransactionModalOpen(false);
        setSelectedTransactions(null);
    };

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


    const __handleGetQuantityMaterial = (materialID: string) => {
        const designResponse = fulldataOrderResposne?.find((item: any) => {
            return item?.designResponse?.materialDetail?.some((material: any) => material.materialResponse?.materialID === materialID);
        });
        const materialDetail = designResponse?.designResponse?.materialDetail?.find((material: any) => material.materialResponse?.materialID === materialID);
        return materialDetail;
    };

    // Download PDF Function
    const _handleOpenPDF = (pdfData: PDFData) => {
        const { transaction, transactionSubOrder, totalMaterialPrice, referencePrice } = pdfData;

        const __handleGetStageBrandPrice = (subOrderID: any) => {
            const result = referencePrice?.brandDetailPriceResponseList.find((item) => item.subOrderID === subOrderID);
            if (result) return result;
        }

        const __handleGetTotalMaterialPrice = () => {
            if (!transactionSubOrder) {
                console.log("No transactionSubOrder available");
                return 0; // Return 0 if no transactionSubOrder exists
            }

            let sum: number = 0;

            console.log("Transaction:", transactionSubOrder);

            transactionSubOrder?.brandMaterialResponseList?.forEach((material: any) => {
                console.log("Processing material:", material);

                transactionSubOrder.orderCustomResponse?.designResponse?.materialDetail?.forEach((item: any) => {
                    console.log("Checking item:", item);

                    if (material.materialID === item.materialResponse?.materialID && item.quantity) {
                        const materialPrice = material.brandPrice * item.quantity;
                        console.log(`Adding price: ${material.brandPrice} * ${item.quantity} = ${materialPrice}`);
                        sum += materialPrice;
                    }
                });
            });

            console.log("Total Material Price:", sum);
            return sum;
        };

        const stageBrandPrice = __handleGetStageBrandPrice(transactionSubOrder?.orderCustomResponse.orderID);

        // Extract and parse the prices, ensuring they default to 0 if undefined or null
        const brandPriceDeposit = Math.round(parseInt(stageBrandPrice?.brandPriceDeposit || '0', 10) / 1000) * 1000;
        const brandPriceFirstStage = Math.round(parseInt(stageBrandPrice?.brandPriceFirstStage || '0', 10) / 1000) * 1000;
        const brandPriceSecondStage = Math.round(parseInt(stageBrandPrice?.brandPriceSecondStage || '0', 10) / 1000) * 1000;

        // Sum the parsed prices
        const totalPrice = brandPriceDeposit + brandPriceFirstStage + brandPriceSecondStage;

        if (!transaction) return;
        const doc = new jsPDF();

        // set background color
        doc.setFillColor(244, 245, 239); // White color
        // doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'D');

        const imgData = "https://res.cloudinary.com/dby2saqmn/image/upload/v1723989709/ncoktpbtvzzhjqktopjz.png";
        const imgWidth = 40;
        const imgHeight = 40;
        doc.addImage(imgData, 'PNG', 15, 10, imgWidth, imgHeight);

        doc.setFontSize(35);
        doc.setFont('Playfair Display', 'bold');

        doc.text("INVOICE", 140, 30).getFont()

        const textOffset = 10;
        const tableStartY = Math.max(imgHeight + textOffset, 50);

        autoTable(doc, {
            startY: tableStartY,
            body: [
                [
                    {
                        content: `SMART TAILOR, Inc` + `\nLot E2a-7, Street D1, High-Tech Park` + `\nLong Thanh My Ward City` + `\nThu Duc` + `\nHo Chi Minh City.` + `\nViet Nam`,
                        styles: {
                            halign: 'right',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ], theme: 'plain',
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        // Add Material detail
        doc.setFontSize(12);
        autoTable(doc, {
            head: [['HS code', 'Name', 'Category', 'Unit', 'Quantity']],

            body: transactionSubOrder?.brandMaterialResponseList?.map((item: MaterialReportInterface) => {
                return [
                    item.hsCode,
                    item.materialName,
                    item.categoryName,
                    item.unit,
                    __handleGetQuantityMaterial(item.materialID)?.quantity || 'N/A'
                ];
            }) || [],
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        doc.setFontSize(12);
        autoTable(doc, {
            head: [['Part name', 'Min square (m²)', 'Max square (m²)', 'Min material price / m² (VND)', 'Max material price / m² (VND)']],

            body: referencePrice?.designMaterialDetailResponseList?.map((item: any) => {
                return [
                    item.detailName,
                    item.minMeterSquare,
                    item.maxMeterSquare,
                    __handleAddCommasToNumber(item.minPriceMaterial) || 'N/A',
                    __handleAddCommasToNumber(item.maxPriceMaterial) || 'N/A'
                ];
            }) || [],
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        // Original Design detail table
        autoTable(doc, {
            head: [['Design ID', 'Quantity', 'Size', 'Create Date']],
            body: transaction.detailList?.map((item: any) => [
                item.designDetailId,
                item.quantity,
                item.size?.sizeName,
                item.size?.createDate
            ]),
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            // startY: doc.lastAutoTable.finalY + 10,
            body: [
                [
                    {
                        content: 'Payment Information',
                        styles: {
                            halign: 'left',
                            fontSize: 14,
                            fontStyle: 'bold'
                        }
                    }
                ],
                [
                    {
                        content: `Deposit: ${__handleAddCommasToNumber(__handleGetStageBrandPrice(transactionSubOrder?.orderCustomResponse.orderID)?.brandPriceDeposit) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Labor Price: ${__handleAddCommasToNumber(transactionSubOrder?.brandLaborQuantity) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Total: ${__handleAddCommasToNumber(totalPrice) || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
            ],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `___________________________________________________________________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            head: [[{ content: "                          ", styles: { halign: 'right' } }, { content: "                         ", styles: { halign: 'center' } }, { content: "TOTAL", styles: { halign: 'center' } }, { content: `${__handleAddCommasToNumber(transaction.totalPrice)} VND`, styles: { halign: 'center' } }]],
            theme: 'plain'
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: `                                                                                                               __________________________________`,
                        styles: {
                            halign: 'left',
                            overflow: 'linebreak'
                        }
                    }
                ]
            ], theme: 'plain'
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: "Thank You!",
                        styles: {
                            halign: 'center',
                            fontSize: 20
                        }
                    }
                ]
            ],
            theme: "plain"
        })

        autoTable(doc, {
            body: [
                [
                    {
                        content: ` Lot E2a - 7, Street D1, High - Tech Park` + ` Long Thanh My Ward City` + ` Thu Duc` + ` Ho Chi Minh City` + ` Viet Nam`,
                        styles: {
                            halign: 'left',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ], theme: 'plain',
        })

        doc.save('Transaction_Invoice.pdf')
    };

    const __handleGetAllTotalPaymentSubOrder = (orderDetail: any) => {
        // Get the sub-orders for the given orderDetail
        const subOrders = orderChild[orderDetail.orderID];

        // Initialize the total amounts
        let totalAmount = 0;
        let totalPaidAmount = 0;
        let remainAmount = 0;

        // Iterate over each sub-order
        subOrders?.forEach((order) => {
            // Add the total price of the order to the totalAmount
            totalAmount += order.totalPrice || 0;

            // Check if the order has a payment list and iterate over it
            if (order.paymentList && Array.isArray(order.paymentList)) {
                // If any payment in the payment list has paymentStatus true, consider this order as paid
                const isPaid = order.paymentList.some(payment => payment.paymentStatus);
                if (isPaid) {
                    totalPaidAmount += order.totalPrice || 0;
                }
            }
        });

        // Calculate remaining amount
        remainAmount = totalAmount - totalPaidAmount;

        // Example usage of the totals
        console.log(`Paid Amount: ${totalPaidAmount}/${totalAmount}`);

        // You can return these values if needed
        return { totalAmount, totalPaidAmount, remainAmount };
    };




    // const __handleGetAllTotalPaymentPaidSubOrder = (item: any) => {

    // }

    return (
        <div>
            <LoadingComponent isLoading={isLoading}></LoadingComponent>
            {/* <ToastContainer></ToastContainer> */}
            <div className={`${style.orderHistory__container} `}>
                <div style={{ width: '100%' }} className="max-w-6xl mx-auto md:p-6 min-h-screen">
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
                                <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.59 14.59l-4.24-4.24 1.41-1.41L10.41 14l7.42-7.42 1.41 1.41-8.83 8.83z" />
                                        </svg>
                                    </div>
                                    <div className="p-4 text-right">
                                        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: primaryColor, fontWeight: 'bold' }}>COMPLETED</p>
                                        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{checkingSampleDataCount}</h4>
                                    </div>

                                </div>
                                <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                                    <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5 text-inherit">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 6.05a.75.75 0 010 1.06L13.06 12l3.89 3.89a.75.75 0 11-1.06 1.06L12 13.06l-3.89 3.89a.75.75 0 11-1.06-1.06L10.94 12 7.05 8.11a.75.75 0 011.06-1.06L12 10.94l3.89-3.89a.75.75 0 011.06 0z" />
                                        </svg>
                                    </div>
                                    <div className="p-4 text-right">
                                        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600" style={{ color: redColor, fontWeight: 'bold' }}>CANCEL</p>
                                        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{canceledCount}</h4>
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
                                    orderDetail={selectedTransaction}
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            {fulldataOrderResposne?.filter(applyFilters).map((orderDetail: AccountantOrderInterface) => (
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
                                                        <FaTag className="inline-block mr-1" />
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
                                                    <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                        <FaDollarSign className="inline-block mr-1" />
                                                        Paid:{" "}
                                                        <span className="text-md text-black-500 pb-2" style={{ fontWeight: 'bold' }}>
                                                            {__handleAddCommasToNumber(__handleGetAllTotalPaymentSubOrder(orderDetail).totalPaidAmount) || 0 + ' / ' + __handleAddCommasToNumber(__handleGetAllTotalPaymentSubOrder(orderDetail).totalAmount)} VND
                                                        </span>
                                                    </p>
                                                    {__handleGetAllTotalPaymentSubOrder(orderDetail).remainAmount > 0 && (

                                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                            <FaDollarSign className="inline-block mr-1" />
                                                            Remain:{" "}
                                                            <span className="text-md text-black-500 pb-2" style={{ fontWeight: 'bold', color: redColor }}>
                                                                {__handleAddCommasToNumber(__handleGetAllTotalPaymentSubOrder(orderDetail).remainAmount || 0)} VND
                                                            </span>
                                                        </p>
                                                    )}
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
                                                            Status:{" "}
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
                                                                                        : orderDetail?.orderStatus === "RECEIVED"
                                                                                            ? greenColor
                                                                                            : orderDetail?.orderStatus === "COMPLETED"
                                                                                                ? greenColor
                                                                                                : orderDetail?.orderStatus === "REFUND_REQUEST"
                                                                                                    ? redColor
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
                                        className={`${style.orderHistory__transactionLable} `}
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
                                    {
                                        isExtendTransaction[orderDetail?.orderID || '1'] && orderChild[orderDetail.orderID]?.map((order, itemIndex) => (
                                            <div
                                                key={itemIndex}
                                                className="flex flex-col md:flex-row items-start md:items-center mt-10 mb-4 md:mb-6 border-b pb-4 md:pb-6"
                                            >
                                                <div className="flex-shrink-0"></div>
                                                <div
                                                    className="ml-0 md:ml-6 mt-4 md:mt-0 flex-grow grid grid-cols-1 md:grid-cols-2 gap-4"
                                                    style={{ position: "relative" }}
                                                >
                                                    <div>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Sub ID:{" "}
                                                            <span className="text-sm text-gray-500 pb-2">
                                                                {order.orderID}
                                                            </span>
                                                        </p>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Type:{" "}
                                                            <span className="text-sm text-blue-700 pb-2">
                                                                {order.orderType}
                                                            </span>
                                                        </p>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Brand ID:{" "}
                                                            <span className="text-sm text-gray-500 pb-2">
                                                                {order.brand?.brandID}
                                                            </span>
                                                        </p>
                                                        <p
                                                            style={{ fontWeight: "500" }}
                                                            className="text-sm text-black flex content-center items-center"
                                                        >
                                                            <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2" >Brand:</p>
                                                            <p
                                                                style={{ fontWeight: "500" }}
                                                                className="text-sm text-black flex content-center items-center"
                                                            >
                                                                <img
                                                                    src={order.brand?.user.imageUrl}
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderRadius: 90,
                                                                        marginLeft: 5,
                                                                        marginRight: 5,
                                                                    }}
                                                                />
                                                                <p
                                                                    className={`${__handlegetRatingStyle(
                                                                        order.brand?.rating
                                                                    )
                                                                        } text - sm text - gray - 500`}
                                                                >
                                                                    {" "}
                                                                    {order.brand?.brandName}
                                                                </p>
                                                            </p>
                                                        </p>
                                                        <p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                                            <span className="text-sm text-black-500 pb-2" style={{ fontWeight: "bold" }}>Rating:</span>{" "}
                                                            <span className="text-sm text-gray-500 pb-2">
                                                                {order.brand?.rating?.toFixed(1)}
                                                            </span>{" "}
                                                            <span className="text-yellow-400 text-sm">★</span>
                                                        </p>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-4">
                                                            Details:
                                                            {order.detailList?.map((detail) => (
                                                                <div className="grid grid-cols-4 gap-1 pt-0">
                                                                    <p className="text-sm text-black-500 pb-2" style={{ fontWeight: "bold" }}>
                                                                        Size: {detail.size?.sizeName}
                                                                    </p>
                                                                    <p className="text-sm text-black-500 pb-2" style={{ fontWeight: "bold" }}>
                                                                        Quantity: {detail.quantity}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Payment ID:{" "}
                                                            <span className="text-sm text-gray-500 pb-2">
                                                                {order?.paymentList && order?.paymentList?.length > 0 ? order?.paymentList[0]?.paymentID : 'NaN'}
                                                            </span>
                                                        </p>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Total price:{" "}
                                                            <span className="text-sm text-gray-500 pb-2" style={{ color: redColor }}>
                                                                {__handleAddCommasToNumber(order.totalPrice)} VND
                                                            </span>
                                                        </p>
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            Expected start at:{" "}
                                                            <span className={`${__handleGetDateTimeColor(order.expectedStartDate)} text-sm pb-2`}>
                                                                {order.expectedStartDate}
                                                            </span>
                                                        </p>
                                                        {/* <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            <span className="text-sm text-black-500 pb-2">Status:</span>
                                                            <button
                                                                className="py-1 px-3 rounded-full ml-2"
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
                                                                    fontSize: 11,
                                                                }}
                                                            >
                                                                {orderDetail?.orderStatus}
                                                            </button>
                                                        </p> */}
                                                        <p style={{ fontWeight: "bolder" }} className="text-sm text-black pb-2">
                                                            <span className="text-sm text-black-500 pb-2">Payment status:</span>
                                                            <button
                                                                className="py-1 px-3 rounded-full ml-2"
                                                                style={__handlegetStatusBackgroundBoolean(
                                                                    order?.paymentList &&
                                                                        order?.paymentList[0].paymentStatus
                                                                        ? true
                                                                        : false
                                                                )}
                                                            >
                                                                {`${order?.paymentList &&
                                                                    order?.paymentList[0].paymentStatus
                                                                    ? "PAID"
                                                                    : "PENDING"
                                                                    } `}
                                                            </button>
                                                        </p>

                                                    </div>
                                                    <div
                                                        className={`${style.orderHistory__viewInvoice__buttonPayment} items-center justify-center`}
                                                        style={{ textAlign: "center" }}
                                                    >
                                                        <p
                                                            className={` px-5 text-sm font-medium`}
                                                        >
                                                            <p className='mb-32 cursor-pointer' onClick={() => handleViewTransaction(order)}>View transaction</p>
                                                            {order?.paymentList && !order?.paymentList[0].paymentStatus && (

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
                                                                    onClick={() => __handleOpenPaymentForBrandialog(order.orderID)}
                                                                >
                                                                    <span className="font-medium text-white">Payment</span>
                                                                </button>
                                                            )}

                                                        </p>
                                                    </div>

                                                    {isTransactionModalOpen && selectedTransactions && (
                                                        <TransactionModals
                                                            transaction={selectedTransactions}
                                                            onClose={handleCloseTransactionModal}
                                                            onDownloadPDF={(pdfData) => _handleOpenPDF(pdfData)}
                                                            parentOrderDetai={orderDetail}
                                                        />
                                                    )}

                                                    {selectedOrder === order.orderID && (
                                                        <PaymentFromAccountantToBranđialog
                                                            onClose={__handleClosePaymentForBrandialog}
                                                            isOpen={true}
                                                            paymentData={order.paymentList}
                                                        ></PaymentFromAccountantToBranđialog>
                                                    )}
                                                </div>
                                            </div>

                                        ))
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

export default AccountantManagePaymentForBrandComponent;

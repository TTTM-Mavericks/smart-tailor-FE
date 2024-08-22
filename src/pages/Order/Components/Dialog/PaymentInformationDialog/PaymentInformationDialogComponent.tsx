import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Box,
    Divider,
    Button,
    styled,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './PaymentInformationDialogStyle.module.scss';
import { redColor, whiteColor, greenColor, yellowColor, primaryColor } from '../../../../../root/ColorSystem';
import { PaymentInterface } from '../../../../../models/OrderModel';
import { PaymentOrderInterface } from '../../../../../models/PaymentModel';
import { __handleAddCommasToNumber } from '../../../../../utils/NumbericUtils';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { DesignInterface } from '../../../../../models/DesignModel';
import { __handlegetRatingStyle } from '../../../../../utils/ElementUtils';

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

type OrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onOrderProduct?: () => void;
    data?: {
        payment: PaymentInterface | PaymentOrderInterface,
        order: AccountantOrderInterface
    };
}
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

const PaymentInformationDialogComponent: React.FC<OrderPolicyDialogProps> = ({ isOpen, onClose, onOrderProduct, data }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [paymentData, setPaymentData] = useState<{
        payment: PaymentInterface | PaymentOrderInterface,
        order: AccountantOrderInterface
    } | undefined>();

    console.log("payment Data " + JSON.stringify(paymentData));

    useEffect(() => {
        console.log("Received data:", data);
        setPaymentData(data);
    }, [data]);

    const __handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const __handleButtonClick = () => {
        console.log('Button clicked');
    };

    const getStatusColor = (status: boolean) => {
        return status ? greenColor : yellowColor;
    };

    const handleDownloadPDF = () => {
        console.log("Download PDF with data:", paymentData);
        if (paymentData) {
            _handleOpenPDF(paymentData);
        } else {
            console.error("No payment data available for PDF generation");
        }
    };

    const _handleOpenPDF = (paymentData: { payment: PaymentInterface | PaymentOrderInterface, order: AccountantOrderInterface }) => {
        if (!paymentData) {
            console.error("No payment data available");
            return;
        }

        console.log("Generating PDF with data:", paymentData);

        const doc = new jsPDF();

        // Set background color
        doc.setFillColor(244, 245, 239);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        // Add logo
        const imgData = "https://res.cloudinary.com/dby2saqmn/image/upload/v1723989709/ncoktpbtvzzhjqktopjz.png";
        doc.addImage(imgData, 'PNG', 15, 10, 40, 40);

        // Add title
        doc.setFontSize(35);
        doc.setFont('Playfair Display', 'bold');
        doc.text("INVOICE", 140, 30);

        // Add invoice details
        autoTable(doc, {
            startY: 50,
            body: [
                [
                    {
                        content: `Invoice No. ${paymentData.payment.paymentID || 'N/A'}\nRefund Invoice`,
                        styles: {
                            halign: 'left',
                            valign: "middle",
                            fontSize: 10
                        }
                    },
                    {
                        content: `SMART TAILOR, Inc\nLot E2a-7, Street D1, High-Tech Park\nLong Thanh My Ward City\nThu Duc\nHo Chi Minh City.\nViet Nam`,
                        styles: {
                            halign: 'right',
                            valign: "middle",
                            fontSize: 10
                        }
                    }
                ]
            ],
            theme: 'plain',
        });

        // Add separator
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
            ],
            theme: 'plain'
        });

        // Add material details
        autoTable(doc, {
            head: [['Material ID', 'HS code', 'Category', 'Unit', 'Quantity', 'Price (VND)']],
            body: paymentData.order.designResponse?.materialDetail?.map(item => [
                item?.materialResponse?.materialID,
                item?.materialResponse?.hsCode,
                item?.materialResponse?.categoryName,
                item?.materialResponse?.unit,
                item.quantity,
                __handleAddCommasToNumber(item.minPrice)
            ]) || [],
            // foot: [[
            //     { content: 'Total:', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } },
            //     { content: __handleAddCommasToNumber(paymentData.order.totalPrice) + ' VND', styles: { fontStyle: 'bold' } }
            // ]],
            theme: 'striped',
            headStyles: { fillColor: primaryColor, textColor: whiteColor },
            footStyles: { fillColor: '#f0f0f0' },
        });

        // Add separator
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
            head: [[{ content: "                          ", styles: { halign: 'right' } }, { content: "                         ", styles: { halign: 'center' } }, { content: "TOTAL", styles: { halign: 'center' } }, { content: `${__handleAddCommasToNumber(paymentData.order.totalPrice || 0)} VND`, styles: { halign: 'center' } }]],
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

        // Add return information
        autoTable(doc, {
            // startY: doc.lastAutoTable.finalY + 10,
            body: [
                [
                    {
                        content: 'Return Information',
                        styles: {
                            halign: 'left',
                            fontSize: 14,
                            fontStyle: 'bold'
                        }
                    }
                ],
                [
                    {
                        content: `Sender: ${paymentData.payment.paymentSenderName || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Sender Bank Code: ${paymentData.payment.paymentSenderBankCode || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Sender Bank Number: ${paymentData.payment.paymentSenderBankNumber || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Recipient: Smart Tailor`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Amount: ${__handleAddCommasToNumber(paymentData.payment.paymentAmount || 0)} VND`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Method: ${paymentData.payment.paymentMethod || 'Banking'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Status: ${paymentData.payment.paymentStatus ? 'Completed' : 'Pending'}`,
                        styles: { fontSize: 10 }
                    }
                ],
                [
                    {
                        content: `Type: ${paymentData.payment.paymentType || 'N/A'}`,
                        styles: { fontSize: 10 }
                    }
                ]
            ],
            theme: 'plain'
        });

        // Add thank you message
        autoTable(doc, {
            // startY: doc.lastAutoTable.finalY + 10,
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
        });

        // Save the PDF
        doc.save('Refund_Invoice.pdf');
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
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
                                    <p
                                        className={`${__handlegetRatingStyle(
                                            paymentData?.order.rating
                                        )} text-sm text-gray-500`}
                                    >
                                        {" "}
                                        {paymentData?.order.designResponse?.user?.fullName}
                                    </p>
                                </p></Typography>
                                <Typography variant="body2"><p style={{ fontWeight: "500" }} className="text-sm text-black pb-2">
                                    Brand Rating:{" "}
                                    <span className="text-sm text-gray-500 pb-2">
                                        {paymentData?.order.rating}
                                    </span>{" "}
                                    <span className="text-yellow-400 text-sm">★</span>
                                </p></Typography>
                                <Typography variant="body2">{paymentData?.order.address}</Typography>
                            </InvoiceDetails>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">Invoice No. {paymentData?.payment.paymentID}</Typography>

                            <Typography variant="body1" align="right">{paymentData?.payment.createDate}</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" align="left">Material detail</Typography>
                    <Box sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, marginTop: 2, marginBottom: 2 }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: primaryColor }}>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Material ID</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>HS code</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Unit</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell align="left" sx={{ color: 'white', fontWeight: 'bold' }}>Price (VND)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paymentData ? paymentData?.order?.designResponse?.materialDetail?.map((item: any) => (
                                        <TableRow
                                            key={item.materialID}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="left">{item.materialResponse.materialID}</TableCell>
                                            <TableCell align="left">{item.materialResponse.hsCode}</TableCell>
                                            <TableCell align="left">{item.materialResponse.categoryName}</TableCell>
                                            <TableCell align="left">{item.materialResponse.unit}</TableCell>
                                            <TableCell align="left">{item.quantity}</TableCell>
                                            <TableCell align="left">{__handleAddCommasToNumber(item.maxPrice)}</TableCell>
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

                        <Box sx={{ padding: 2, backgroundColor: '#f0f0f0' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="right" sx={{ fontWeight: 'bold' }}>
                                        <p className="text-sm text-gray-600">
                                            Total: <span className="text-gray-800 font-semibold ml-1">
                                                {paymentData?.order.totalPrice}
                                            </span>
                                        </p>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box >

                    {/* <Typography variant="body2" align="left">Design detail</Typography>
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
                                    {paymentData?.order.designResponse?.materialDetail?.map((item: any) => (
                                        <TableRow
                                            key={item.id}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                        >
                                            <TableCell align="left">{item.designID}</TableCell>
                                            <TableCell align="left">{item.quantity}</TableCell>
                                            <TableCell align="left">{item.size?.sizeName}</TableCell>
                                            <TableCell align="left">{item.size?.createDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ padding: 2, backgroundColor: '#f0f0f0' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="right" sx={{ fontWeight: 'bold' }}>
                                        <p className="text-sm text-gray-600">
                                            {paymentData?.order.totalPrice}
                                        </p>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box> */}
                    <DialogContent className={styles.orderPolicyDialog__content}>
                        {paymentData ? (
                            <div style={{ padding: 2 }} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Sender Information
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Name:</strong> {paymentData.payment.paymentSenderName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Bank Code:</strong> {paymentData.payment.paymentSenderBankCode}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Bank Number:</strong> {paymentData.payment.paymentSenderBankNumber}</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Recipient Information
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Name:</strong> Smart Tailor</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Payment Details
                                        </Typography>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Amount:</strong> {__handleAddCommasToNumber(paymentData.payment.paymentAmount)} VND</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Method:</strong> {paymentData.payment.paymentMethod || ' Banking'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}>
                                            <strong>Status:</strong>
                                            <Box
                                                component="span"
                                                sx={{
                                                    backgroundColor: getStatusColor(paymentData.payment.paymentStatus),
                                                    color: whiteColor,
                                                    borderRadius: 1,
                                                    padding: '2px 4px',
                                                    marginLeft: '8px',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {paymentData.payment.paymentStatus ? 'Completed' : 'Pending'}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" style={{ fontSize: 14 }}><strong>Type:</strong> {paymentData.payment.paymentType}</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        ) : (
                            <Typography variant="body1">No payment data available</Typography>
                        )}
                    </DialogContent>
                </DialogContent>
            </ScrollFreeDialogContent >
            <DialogActions>
                <Button onClick={handleDownloadPDF} variant="contained" color="primary">Download PDF</Button>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog >
    );
};

export default PaymentInformationDialogComponent;
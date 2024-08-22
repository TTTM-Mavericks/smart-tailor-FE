import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    Button,
    FormControlLabel,
    Typography
} from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { primaryColor, redColor, whiteColor } from '../../../root/ColorSystem';
import styles from './PaymentOrderDialogComponentStyle.module.scss'
import { PaymentOrderInterface } from '../../../models/PaymentModel';
import { __handleAddCommasToNumber } from '../../../utils/NumbericUtils';
import QRCode from "react-qr-code";
import { mbBankLogo } from '../../../assets';

type CancelOrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
    paymentData?: any;
}

interface PaymentFormData {
    paymentID: string;
    paymentSenderID: string | null;
    paymentSenderName: string;
    paymentSenderBankCode: string;
    paymentSenderBankNumber: string;
}


const PaymentOrderDialogComponent: React.FC<CancelOrderPolicyDialogProps> = ({ isOpen, onClose, onClick, paymentData }) => {

    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [selectedTab, setSelectedTab] = useState<'QR Code' | 'Manual'>('QR Code');
    const [paymentInfor, setPaymentInfor] = useState<PaymentOrderInterface>();


    // ---------------Usable Variable---------------//


    // ---------------UseEffect---------------//

    useEffect(() => {
        // const result = paymentData?.find((item) => item.paymentType === 'DEPOSIT');
        if (paymentData) {
            setPaymentInfor(paymentData[0]);
        }
    },
        [paymentData])

    // ---------------FunctionHandler---------------//
    const __handleMoveToPayOSPaymentDetail = () => {
        if (paymentInfor) {
            window.location.href = paymentInfor?.payOSData?.checkoutUrl || ''
        }
    }


    return (
        <Dialog open={isOpen} style={{ zIndex: 90 }}>
            <DialogTitle>
                Payment information
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>

            <DialogContent className={styles.paymentOrderDialog__content} >
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 rounded-l ${selectedTab === 'QR Code' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSelectedTab('QR Code')}
                    >
                        QR Code
                    </button>
                    <button
                        className={`ml-0 px-4 py-2 rounded-r ${selectedTab === 'Manual' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setSelectedTab('Manual')}
                    >
                        Manual
                    </button>
                </div>
                {selectedTab === 'QR Code' ? (
                    <div className="flex justify-center items-center w-96 h-full px-32" style={{ width: 450 }}>
                        <div className="relative flex justify-center items-center w-80 h-80 transform transition-transform duration-300 hover:scale-110">
                            <QRCode value={paymentInfor?.payOSData?.qrCode || ''} />
                            <div
                                className="absolute flex items-center justify-center w-20 h-20 rounded-full transform transition-transform duration-300 hover:scale-110 cursor-pointer"
                                style={{ backgroundColor: primaryColor, color: whiteColor, fontWeight: 500, opacity: 0.9 }}
                                onClick={() => __handleMoveToPayOSPaymentDetail()}
                            >
                                <p>Click</p>
                            </div>
                        </div>
                    </div>

                ) : (
                    <div className="space-y-4 h-full p-4 bg-white rounded-lg shadow-md" style={{ width: 450 }}>
                        <div className="flex w-3/4 items-center space-x-2">
                            <img style={{ borderRadius: 90 }} src={mbBankLogo} alt="Bank Logo" className="w-8 h-8" />
                            <div>
                                <div className="text-sm font-medium">{paymentInfor?.paymentRecipientBankCode}</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-center border-b py-2">
                                <span style={{ fontSize: 13 }} className="font-semibold">Account Holder:</span>
                                <div className="flex items-center justify-end">
                                    <span style={{ fontSize: 14 }} className="text-right">{paymentInfor?.paymentRecipientName || 'N/A'}</span>
                                    <button className="ml-2 bg-gray-100 text-sm font-medium py-1 px-2 rounded">Copy</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b py-2">
                                <span style={{ fontSize: 13 }} className="font-semibold">Account Number:</span>
                                <div className="flex items-center justify-end">
                                    <span style={{ fontSize: 14 }} className="text-right">{paymentInfor?.paymentRecipientBankNumber || 'N/A'}</span>
                                    <button className="ml-2 bg-gray-100 text-sm font-medium py-1 px-2 rounded">Copy</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b py-2">
                                <span style={{ fontSize: 13 }} className="font-semibold">Amount:</span>
                                <div className="flex items-center justify-end">
                                    <span style={{ fontSize: 14 }} className="text-right">{__handleAddCommasToNumber(paymentInfor?.paymentAmount)} VND</span>
                                    <button className="ml-2 bg-gray-100 text-sm font-medium py-1 px-2 rounded">Copy</button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span style={{ fontSize: 13 }} className="font-semibold">Description:</span>
                                <div className="flex items-center justify-end">
                                    <span style={{ fontSize: 14 }} className="text-right">{paymentInfor?.paymentType || 'N/A'}</span>
                                    <button className="ml-2 bg-gray-100 text-sm font-medium py-1 px-2 rounded">Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>


                )}
            </DialogContent>


            <DialogActions>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white"
                    style={
                        {
                            border: `1px solid ${primaryColor}`,
                            borderRadius: 4,
                            color: whiteColor,
                            marginBottom: 10,
                            marginRight: 10,
                            backgroundColor: primaryColor
                        }
                    }
                    onClick={onClick}
                >
                    Confirm
                </button>
            </DialogActions>
        </Dialog >
    );
};

export default PaymentOrderDialogComponent;

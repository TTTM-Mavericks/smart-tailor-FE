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

type CancelOrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
    paymentData?: PaymentOrderInterface[];
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
            window.open(paymentInfor?.payOSResponse.data.checkoutUrl, '_blank');
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
                            <QRCode value={paymentInfor?.payOSResponse.data.qrCode || ''} />
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
                            <img style={{borderRadius: 90}} src="data:image/jpeg;base64,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                            " alt="Bank Logo" className="w-8 h-8" />
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

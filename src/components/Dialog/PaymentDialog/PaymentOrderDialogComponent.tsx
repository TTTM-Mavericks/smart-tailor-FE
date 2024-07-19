import React, { useState } from 'react';
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

type CancelOrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
    paymentData?: any;
}
const PaymentOrderDialogComponent: React.FC<CancelOrderPolicyDialogProps> = ({ isOpen, onClose, onClick, paymentData }) => {

    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//

    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

    // ---------------FunctionHandler---------------//


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
                <div >
                    sdj ksdfh jskdhfsdf sd
                    g dsfgodsf gd akdsjfhkjsdfhksjdhfsdf
                    sdf s
                    dfs
                    d
                </div>
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
        </Dialog>
    );
};

export default PaymentOrderDialogComponent;

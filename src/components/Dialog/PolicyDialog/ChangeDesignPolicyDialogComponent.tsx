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
import styles from './OrderPolicyDialogComponentStyle.module.scss'

type ChangeDesignPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onOrderProduct?: () => void;
}
const ChangeDesignPolicyDialogComponent: React.FC<ChangeDesignPolicyDialogProps> = ({ isOpen, onClose, onOrderProduct }) => {
    //TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [isChecked, setIsChecked] = useState(false);

    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//

    // ---------------FunctionHandler---------------//


    const __handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const __handleButtonClick = () => {
        if (isChecked) {
            // Handle the button click event
            console.log('Button clicked');
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogTitle>
                Order Change Policy
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
            <DialogContent className={styles.orderPolicyDialog__content}>
            <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>General Regulations</strong><br />
                    <li>This order change policy applies to all custom orders made through our platform.</li>
                    <li>By placing an order, customers agree to the terms and conditions of this order change policy.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Change Timeframe</strong><br />
                    <li>Customers can request an order change within A hours from the time they receive the order confirmation notice.</li>
                    <li>After A hours, the system will not allow any order changes.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Change Process</strong><br />
                    <li>Step 1: Customers submit an order change request through our website or contact our customer service directly.</li>
                    <li>Step 2: The system will check if the order change request is within A hours from the order confirmation.</li>
                    <ul>
                        <li>If the request is within A hours, the system will allow the change and verify the order with the customer's modified request.</li>
                        <li>If the request exceeds A hours, the system will not allow the order change and will notify the customer.</li>
                    </ul>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Change Costs</strong><br />
                    <li>Within A hours, there will be no additional cost for changing the order.</li>
                    <li>After A hours, customers will not be able to change their order and must follow the initial terms or the order cancellation policy if they wish to cancel.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Post-Change Handling</strong><br />
                    <li>After an order change request is accepted, we will update the order and notify the customer with the details, the estimated completion time, and any changes in cost (if any).</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Refunds and Additional Payments</strong><br />
                    <li>If the order change results in a cost change, customers will be notified and must make additional payments (if any) before the order processing continues.</li>
                    <li>If the new cost is lower than the original cost, we will refund the difference to the customer.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Contact</strong><br />
                    <li>For any questions or support related to the order change policy, please contact our customer service via email: support@yourplatform.com or phone: 0123-456-789.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Policy Changes</strong><br />
                    <li>We reserve the right to change this order change policy at any time. All changes will be updated on our website and notified to customers via email.</li>
                </Typography>
            </DialogContent>
            <FormControlLabel
                control={<Checkbox color={'error'} checked={isChecked} onChange={__handleCheckboxChange} />}
                label={(<span style={{ fontSize: 14 }}>I agree to the order cancellation policy</span>)}
                className='px-5 py-5'
                style={{ fontSize: '1px', fontWeight: 500 }}
                sx={{ fontSize: 12 }}


            />
            <DialogActions>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white"
                    style={
                        {
                            border: `1px solid ${primaryColor}`,
                            borderRadius: 4,
                            color: isChecked ? whiteColor : primaryColor,
                            marginBottom: 10,
                            marginRight: 10,
                            backgroundColor: isChecked ? primaryColor : whiteColor
                        }
                    }
                    onClick={__handleButtonClick}
                    disabled={!isChecked}
                >
                    Confirm
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeDesignPolicyDialogComponent;

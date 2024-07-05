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

type CancelOrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onClick?: () => void;
}
const CancelOrderPolicyDialogComponent: React.FC<CancelOrderPolicyDialogProps> = ({ isOpen, onClose, onClick }) => {

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
        <Dialog open={isOpen} style={{zIndex: 90}}>
            <DialogTitle>
                Order Cancellation Policy
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
                    <strong>General Provisions</strong><br />
                    <li>This order cancellation policy applies to all custom orders placed through our platform.</li>
                    <li>Customers must agree to the terms and conditions of this cancellation policy when placing an order.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Cancellation Period</strong><br />
                    <li>Customers can cancel their order within X hours from the time the order is created.</li>
                    <li>After X hours, the order will be considered non-cancellable without incurring compensation costs.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Cancellation Procedure</strong><br />
                    <li>To cancel an order, customers must submit a cancellation request through our website or contact our customer service directly.</li>
                    <li>The cancellation notice must include the order number and the reason for cancellation.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Compensation Costs</strong><br />
                    <li>If the cancellation request is submitted after the allowed period (X hours from the brand confirmation), customers will incur compensation costs.</li>
                    <li>Compensation costs include expenses incurred for fulfilling the order up to the time the cancellation request is received.</li>
                    <li>Specifically, compensation costs may include:</li>
                    <ul>
                        <p>- Material costs: Costs of materials that have been used for the order.</p>
                        <p>- Labor costs: Labor costs for work done on the order.</p>
                        <p>- Other costs: Other expenses related to the fulfillment of the order.</p>
                    </ul>
                    <li>The total compensation amount will be specifically notified to the customer after checking the order's progress with the brand.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Handling Cancellation Requests</strong><br />
                    <li>Upon receiving a cancellation request, we will check the progress of the order.</li>
                    <li>If the order has already started, we will inform the customer of the compensation costs to be incurred.</li>
                    <li>After the customer agrees to pay the compensation costs, the order will be canceled.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Contract Enforcement</strong><br />
                    <li>In the event that the customer does not pay the compensation costs as required, we reserve the right to take legal action to request payment.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Contact</strong><br />
                    <li>For any questions and support requests related to the order cancellation policy, please contact our customer service via email: zzz@zzzz.com or phone: 0123-456-789.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Policy Changes</strong><br />
                    <li>We reserve the right to change this order cancellation policy at any time. Any changes will be updated on our website and notified to customers via email.</li>
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
                    onClick={onClick}
                    disabled={!isChecked}
                >
                    Confirm
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default CancelOrderPolicyDialogComponent;

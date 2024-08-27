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

type OrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onOrderProduct?: () => void;
}
const OrderPolicyDialogComponent: React.FC<OrderPolicyDialogProps> = ({ isOpen, onClose, onOrderProduct }) => {

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
                Order Policy
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
                    <li>These order policies apply to all orders made through our platform.</li>
                    <li>By placing an order, customers agree to the terms and conditions of our order policies.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Ordering Process</strong><br />
                    <li>Step 1: Customers provide measurements and customization requests through our website.</li>
                    <li>Step 2: Our platform verifies and confirms the order details with the customer's request.</li>
                    <li>Step 3: After the order is confirmed, customers will receive an order confirmation notice, including the details of the order, estimated completion time, and costs.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Payment</strong><br />
                    <li>Payment Methods: Customers can pay online via credit card, bank transfer, or other accepted payment methods on our website.</li>
                    <li>Payment Stages:</li>
                    <ul>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> Deposit: Customers must pay a deposit before we begin processing the order. This deposit usually accounts for 40% of the total order value.</li>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> First Payment Stage: When the order is 30% complete, customers must pay an additional 30% of the total order value.</li>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> Second Payment Stage: When the order is 30% complete, customers must pay an additional 30% of the total order value.</li>
                    </ul>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Modification and Cancellation</strong><br />
                    <li>Order Modification: Customers can modify their order.</li>
                    <li>Order Cancellation: Customers can cancel their order.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Completion Time</strong><br />
                    <li>The estimated completion time for the order is N days from the date the order is confirmed and payment is received.</li>
                    <li>In case of delays or other issues, we will inform customers of the order status and the new estimated completion time.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Delivery</strong><br />
                    <li>Orders will be delivered to the address provided by customers during the ordering process.</li>
                    <li>Delivery costs and times will be calculated and informed to customers during the ordering process.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Return Policy</strong><br />
                    <li>Due to the customized nature of our orders, we do not accept returns unless the product is faulty or incorrectly made according to the customer's order.</li>
                    <li>In case of faults or incorrect orders, customers must notify us within K days from the date of receipt to receive support for returns.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Data Privacy</strong><br />
                    <li>Customer information provided during the order process will be kept confidential and only used for order processing purposes.</li>
                    <li>We commit not to share customer information with third parties unless necessary for order completion.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Contact</strong><br />
                    <li>For any questions or support regarding these order policies, please contact our customer service via email: support@smarttailor.com or phone: 0123-456-789.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Policy Changes</strong><br />
                    <li>We reserve the right to change these order policies at any time. Any changes will be updated on our website and notified to customers.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Cancellation Period</strong><br />
                    <li>Customers can cancel their order within 2 hours from the time the order is created.</li>
                    <li>After 2 hours, the order will be considered non-cancellable without incurring compensation costs.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Order Cancellation Procedure</strong><br />
                    <li>To cancel an order, customers must submit a cancellation request through our website or contact our customer service directly.</li>
                    <li>The cancellation notice must include the order number and the reason for cancellation.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Compensation Costs</strong><br />
                    <li>If the cancellation request is submitted after the allowed period (2 hours from the brand confirmation), customers will incur compensation costs.</li>
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
                    <li>For any questions and support requests related to the order cancellation policy, please contact our customer service via email: support@smarttailor.com or phone: 0123-456-789.</li>
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
                    onClick={onOrderProduct}
                    disabled={!isChecked}
                >
                    Confirm
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderPolicyDialogComponent;

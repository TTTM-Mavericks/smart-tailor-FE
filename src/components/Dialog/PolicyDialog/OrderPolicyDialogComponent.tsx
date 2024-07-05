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
                        <li><span style={{ fontWeight: 'bold' }}>+</span> Deposit: Customers must pay a deposit before we begin processing the order. This deposit usually accounts for A% of the total order value.</li>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> First Payment Stage: When the order is B% complete, customers must pay an additional C% of the total order value.</li>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> Second Payment Stage: When the order is D% complete, customers must pay an additional E% of the total order value.</li>
                        <li><span style={{ fontWeight: 'bold' }}>+</span> Final Payment: When the order is fully completed, customers must pay the remaining amount (F% of the total order value).</li>
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
                    <li>For any questions or support regarding these order policies, please contact our customer service via email: support@yourplatform.com or phone: 0123-456-789.</li>
                </Typography>
                <Typography variant="body1" className={styles.orderPolicyDialog__content__section}>
                    <strong>Policy Changes</strong><br />
                    <li>We reserve the right to change these order policies at any time. Any changes will be updated on our website and notified to customers.</li>
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

export default OrderPolicyDialogComponent;

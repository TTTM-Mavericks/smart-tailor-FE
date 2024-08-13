import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, Button, Divider } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import styles from './PaymentInformationDialogStyle.module.scss';
import { primaryColor, redColor, whiteColor, greenColor, yellowColor } from '../../../../../root/ColorSystem';
import { PaymentInterface } from '../../../../../models/OrderModel';
import { PaymentOrderInterface } from '../../../../../models/PaymentModel';
import { __handleAddCommasToNumber } from '../../../../../utils/NumbericUtils';

type OrderPolicyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onOrderProduct?: () => void;
    data?: PaymentInterface | PaymentOrderInterface;
}

const PaymentInformationDialogComponent: React.FC<OrderPolicyDialogProps> = ({ isOpen, onClose, onOrderProduct, data }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentInterface | PaymentOrderInterface>();

    useEffect(() => {
        setPaymentData(data);
    }, [data]);

    const __handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const __handleButtonClick = () => {
        // Handle the button click event
        console.log('Button clicked');
    };

    const getStatusColor = (status: boolean) => {
        return status ? greenColor : yellowColor;
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <p className='flex items-center'>
                    <span>Payment Information</span>

                </p>
                <IoMdCloseCircleOutline
                    cursor={'pointer'}
                    size={20}
                    color={redColor}
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
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
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Name:</strong> {paymentData.paymentSenderName}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Bank Code:</strong> {paymentData.paymentSenderBankCode}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Bank Number:</strong> {paymentData.paymentSenderBankNumber}</Typography>
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
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Amount:</strong> {__handleAddCommasToNumber(paymentData.paymentAmount)} VND</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Method:</strong> {paymentData.paymentMethod || ' Banking'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" style={{ fontSize: 14 }}>
                                    <strong>Status:</strong>
                                    <Box
                                        component="span"
                                        sx={{
                                            backgroundColor: getStatusColor(paymentData.paymentStatus),
                                            color: whiteColor,
                                            borderRadius: 1,
                                            padding: '2px 4px',
                                            marginLeft: '8px',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {paymentData.paymentStatus ? 'Completed' : 'Pending'}
                                    </Box>
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" style={{ fontSize: 14 }}><strong>Type:</strong> {paymentData.paymentType}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                {/* <Typography variant="body2" style={{ fontSize: 14 }}><strong>Created:</strong> {paymentData.createDate}</Typography> */}
                            </Grid>
                            <Grid item xs={6}>
                                {/* <Typography variant="body2" style={{ fontSize: 14 }}><strong>Last Modified:</strong> {paymentData.lastModifiedDate}</Typography> */}
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <Typography variant="body1">No payment data available</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={__handleButtonClick}
                    disabled={!isChecked}
                    style={{ marginRight: 10 }}
                >
                    Confirm
                </Button> */}
            </DialogActions>
        </Dialog>
    );
};

export default PaymentInformationDialogComponent;

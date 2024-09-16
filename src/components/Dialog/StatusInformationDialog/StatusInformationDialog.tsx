import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Typography, Button, DialogActions, Chip } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { redColor } from '../../../root/ColorSystem';

interface Step {
    label: string;
    description: string;
    value: string;
    color: string;
}

interface StatusInfoDialogProps {
    open: boolean;
    onClose?: () => void;
    steps: Step[];
}

const getBackgroundColor = (status: any) => {
    switch (status) {
        case 'NOT_VERIFY': return 'bg-gray-300 px-2 py-1 rounded-full';
        case 'PENDING': return 'bg-yellow-300 px-2 py-1 rounded-full';
        case 'DEPOSIT': return 'bg-blue-300 px-2 py-1 rounded-full';
        case 'PROCESSING': return 'bg-orange-300 px-2 py-1 rounded-full';
        case 'CANCEL': return 'bg-red-300 px-2 py-1 rounded-full';
        case 'COMPLETED': return 'bg-green-300 px-2 py-1 rounded-full';
        case 'DELIVERED': return 'bg-indigo-300 px-2 py-1 rounded-full';
        case 'RECEIVED': return 'bg-green-100 px-2 py-1 rounded-full';
        case 'REFUND_REQUEST': return 'bg-red-300 px-2 py-1 rounded-full';


        default: return 'bg-gray-300 px-2 py-1 rounded-full';
    }
}

const getStatusColor = (status: any) => {
    switch (status) {
        case 'NOT_VERIFY': return 'text-gray-600';
        case 'PENDING': return 'text-yellow-600';
        case 'DEPOSIT': return 'text-blue-600';
        case 'PROCESSING': return 'text-orange-600';
        case 'CANCEL': return 'text-red-600';
        case 'COMPLETED': return 'text-green-600';
        case 'DELIVERED': return 'text-indigo-600';
        default: return 'text-gray-600';
    }
};

const StatusInfoDialog: React.FC<StatusInfoDialogProps> = ({ open, onClose, steps }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Status Information</DialogTitle>
            <IoMdCloseCircleOutline
                cursor="pointer"
                size={20}
                color={redColor}
                onClick={onClose}
                style={{ position: 'absolute', right: 20, top: 20 }}
            />
            <DialogContent>
                <Grid container spacing={2}>
                    {steps.map((step, index) => (
                        <Grid item xs={6} key={index}>
                            <Chip
                                label={step.label}
                                style={{
                                    backgroundColor: step.color,
                                    color: 'white',
                                    padding: '10px 16px',
                                    fontSize: '12px',
                                    marginBottom: '8px'
                                }}

                                 className = {`${getBackgroundColor(step.color)} ${getStatusColor(step.color)}`}
                            />
                            <Typography variant="body2" color="textSecondary">
                                {step.description}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

        </Dialog>
    );
};

export default StatusInfoDialog;

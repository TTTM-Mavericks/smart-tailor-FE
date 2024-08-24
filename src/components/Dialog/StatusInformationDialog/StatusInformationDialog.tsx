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

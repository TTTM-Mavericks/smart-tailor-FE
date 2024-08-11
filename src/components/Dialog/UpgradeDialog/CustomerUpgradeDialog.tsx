import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpgradeIcon from '@mui/icons-material/Upgrade';

interface UpgradeCustomerRoleDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    onUpgrade?: (role: string) => void;
}

const CustomerUpgradeDialog: React.FC<UpgradeCustomerRoleDialogProps> = ({ isOpen, onClose, onUpgrade }) => {
    const [selectedRole, setSelectedRole] = useState<string>('Level 1');

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRole(event.target.value);
    };

    const handleUpgrade = () => {
        // onUpgrade(selectedRole);
        // onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" className="bg-opacity-80">
            <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-teal-400 text-white">
                <span className="text-lg font-bold">Upgrade Customer Role</span>
                <IconButton onClick={onClose} className="text-white">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className="flex flex-col items-center p-6">
                <UpgradeIcon className="text-blue-500 mb-4" style={{ fontSize: 40 }} />
                <p className="text-gray-700 text-center mb-6">
                    Select the role level to upgrade the customer to.
                </p>
                <RadioGroup value={selectedRole} onChange={handleRoleChange} className="flex flex-col">
                    <FormControlLabel
                        value="Level 1"
                        control={<Radio />}
                        label="Level 1 - Basic Privileges"
                        className="mb-2 text-gray-700"
                    />
                    <FormControlLabel
                        value="Level 2"
                        control={<Radio />}
                        label="Level 2 - Advanced Privileges"
                        className="mb-2 text-gray-700"
                    />
                </RadioGroup>
            </DialogContent>
            <DialogActions className="bg-gray-100 p-4">
                <Button onClick={onClose} className="text-gray-500">
                    Cancel
                </Button>
                <Button
                    onClick={handleUpgrade}
                    variant="contained"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Upgrade
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerUpgradeDialog;

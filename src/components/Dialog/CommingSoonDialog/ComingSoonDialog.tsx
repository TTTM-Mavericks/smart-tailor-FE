import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa'; // Optional icon

const ComingSoonDialog: React.FC<{ isOpen: boolean, onClose: () => void, onClickClose: () => void }> = ({ isOpen, onClose, onClickClose }) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="coming-soon-dialog-title"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="coming-soon-dialog-title" className="text-center">
                <div className="flex justify-center items-center text-orange-500">
                    <FaExclamationTriangle className="mr-2" />
                    <span>Coming Soon</span>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="text-center">
                    <p className="text-gray-600">
                        We're working hard to bring this feature to you soon! Stay tuned.
                    </p>
                </div>
            </DialogContent>
            <DialogActions className="justify-center">
                <Button
                    onClick={onClickClose}
                    variant="contained"
                    color="primary"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Reload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ComingSoonDialog;

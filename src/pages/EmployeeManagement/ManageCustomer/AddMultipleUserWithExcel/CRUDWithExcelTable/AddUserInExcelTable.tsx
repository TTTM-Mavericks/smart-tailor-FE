import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface AddUserModalInExcelTableProps {
    open: boolean;
    onClose: () => void;
    onAddUser: (userData: any) => void;
}

const AddUserModalInExcelTable: React.FC<AddUserModalInExcelTableProps> = ({ open, onClose, onAddUser }) => {
    const [userData, setUserData] = React.useState<any>({
        registrarId: '',
        name: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        error: false,
    });

    const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const _handleAddUser = () => {
        // Kiểm tra tính hợp lệ của dữ liệu nhập vào trước khi thêm người dùng mới
        if (userData.name && userData.age && userData.phone && userData.email) {
            // Thêm người dùng vào danh sách
            onAddUser(userData);
            // Đóng modal
            onClose();
        } else {
            alert('Please fill in all required fields.');
        }
    };

    const _handleClose = () => {
        // Đóng modal
        onClose();
    };

    return (
        <Dialog open={open} onClose={_handleClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="registrarId"
                    label="Registrar ID"
                    fullWidth
                    value={userData.registrarId}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    fullWidth
                    value={userData.name}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="age"
                    label="Age"
                    fullWidth
                    value={userData.age}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="phone"
                    label="Phone"
                    fullWidth
                    value={userData.phone}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    value={userData.email}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="address"
                    label="Address"
                    fullWidth
                    value={userData.address}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="city"
                    label="City"
                    fullWidth
                    value={userData.city}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="zipCode"
                    label="Zip Code"
                    fullWidth
                    value={userData.zipCode}
                    onChange={_handleInputChange}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={_handleClose}>Cancel</Button>
                <Button onClick={_handleAddUser} variant="contained" color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserModalInExcelTable;

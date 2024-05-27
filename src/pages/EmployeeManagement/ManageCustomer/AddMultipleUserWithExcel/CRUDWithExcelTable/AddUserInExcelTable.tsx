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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddUser = () => {
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

    const handleClose = () => {
        // Đóng modal
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="registrarId"
                    label="Registrar ID"
                    fullWidth
                    value={userData.registrarId}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    fullWidth
                    value={userData.name}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="age"
                    label="Age"
                    fullWidth
                    value={userData.age}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="phone"
                    label="Phone"
                    fullWidth
                    value={userData.phone}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    value={userData.email}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="address"
                    label="Address"
                    fullWidth
                    value={userData.address}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="city"
                    label="City"
                    fullWidth
                    value={userData.city}
                    onChange={handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="zipCode"
                    label="Zip Code"
                    fullWidth
                    value={userData.zipCode}
                    onChange={handleInputChange}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddUser} variant="contained" color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserModalInExcelTable;

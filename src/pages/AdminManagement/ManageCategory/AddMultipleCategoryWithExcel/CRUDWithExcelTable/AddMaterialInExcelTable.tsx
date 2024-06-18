import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface AddMaterialModalInExcelTableProps {
    open: boolean;
    onClose: () => void;
    onAddMaterial: (materialData: any) => void;
}

const AddMaterialModalInExcelTable: React.FC<AddMaterialModalInExcelTableProps> = ({ open, onClose, onAddMaterial }) => {
    const [materialData, setMaterialData] = React.useState<any>({
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
        setMaterialData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const _handleAddUser = () => {
        // Kiểm tra tính hợp lệ của dữ liệu nhập vào trước khi thêm người dùng mới
        if (materialData.name && materialData.age && materialData.phone && materialData.email) {
            // Thêm người dùng vào danh sách
            onAddMaterial(materialData);
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
                    value={materialData.registrarId}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    fullWidth
                    value={materialData.name}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="age"
                    label="Age"
                    fullWidth
                    value={materialData.age}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="phone"
                    label="Phone"
                    fullWidth
                    value={materialData.phone}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    value={materialData.email}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="address"
                    label="Address"
                    fullWidth
                    value={materialData.address}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="city"
                    label="City"
                    fullWidth
                    value={materialData.city}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="zipCode"
                    label="Zip Code"
                    fullWidth
                    value={materialData.zipCode}
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

export default AddMaterialModalInExcelTable;

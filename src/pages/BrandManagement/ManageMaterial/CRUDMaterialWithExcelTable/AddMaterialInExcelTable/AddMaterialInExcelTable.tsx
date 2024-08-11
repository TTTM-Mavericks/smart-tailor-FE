import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface AddMaterialModalInExcelTableProps {
    open: boolean;
    onClose: () => void;
    onAddMaterial: (materialData: any) => void;
}

const AddMaterialModalInExcelTable: React.FC<AddMaterialModalInExcelTableProps> = ({ open, onClose, onAddMaterial }) => {
    const [materialData, setMaterialData] = React.useState<any>({
        category_name: '',
        material_name: '',
        price: 1,
        unit: ''
    });

    const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMaterialData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const _handleAddMaterial = () => {
        // Kiểm tra tính hợp lệ của dữ liệu nhập vào trước khi thêm người dùng mới
        if (materialData.category_name && materialData.material_name && materialData.price && materialData.unit) {
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
            <DialogTitle>Add New Material</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="category_name"
                    label="Category Name"
                    fullWidth
                    value={materialData.category_name}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="material_name"
                    label="Material Name"
                    fullWidth
                    value={materialData.material_name}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="price"
                    label="Price"
                    fullWidth
                    value={materialData.price}
                    onChange={_handleInputChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="unit"
                    label="Unit"
                    fullWidth
                    value={materialData.unit}
                    onChange={_handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={_handleClose}>Cancel</Button>
                <Button onClick={_handleAddMaterial} variant="contained" color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMaterialModalInExcelTable;

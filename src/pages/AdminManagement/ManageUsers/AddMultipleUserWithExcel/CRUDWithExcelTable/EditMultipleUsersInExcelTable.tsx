import React, { useState } from 'react';
import { Modal, Button, TextField, Card, Box, Typography, IconButton, Grid } from '@mui/material'; // Import necessary components from Material-UI
import CloseIcon from '@mui/icons-material/Close';
interface ExcelData {
    id: number;
    registrarId: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string
}

interface EditMultipleUsersInExcelTableProps {
    open: boolean;
    onClose: () => void;
    data: ExcelData;
    index: number;
    updateData: (editedData: ExcelData, index: number) => void;
}

const EditMultipleUsersInExcelTable: React.FC<EditMultipleUsersInExcelTableProps> = ({ open, onClose, data, index, updateData }) => {
    const [editedData, setEditedData] = useState(data);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const handleSave = () => {
        updateData(editedData, index);
        onClose();
    };


    return (

        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit User
            </Typography>
            <IconButton
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={onClose}
            >
                <CloseIcon />
            </IconButton>
            <Box height={50} />
            <Grid container spacing={4}>
                <Grid item xs={11}>
                    <TextField name="name" label="Name" value={editedData.name} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="age" label="Age" value={editedData.age.toString()} onChange={handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="registrarId" label="registrarId" value={editedData.registrarId.toString()} onChange={handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="phone" label="phone" value={editedData.phone.toString()} onChange={handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="email" label="email" value={editedData.email.toString()} onChange={handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="address" label="city" value={editedData.address.toString()} onChange={handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField id="outline-basic" label="Role" variant="outlined" size="small" sx={{ minWidth: "100%" }} value={editedData.city.toString()} onChange={handleChange} />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="zipCode" label="zipCode" value={editedData.zipCode.toString()} onChange={handleChange} fullWidth />

                </Grid>
            </Grid>
            <div onClick={onClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={handleSave} style={{ backgroundColor: "#EC6208", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>Update</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>Cancel</Button>

            </div>
        </Box>
    );
};

export default EditMultipleUsersInExcelTable;

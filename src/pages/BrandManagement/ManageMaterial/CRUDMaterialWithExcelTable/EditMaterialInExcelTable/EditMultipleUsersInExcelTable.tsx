import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ExcelData {
    id: number,
    category_name: string,
    material_name: string,
    price: number,
    unit: string,
    error: boolean
}

interface EditMultipleMaterialInExcelTableProps {
    open: boolean;
    onClose: () => void;
    data: ExcelData;
    index: number;
    updateData: (editedData: ExcelData, index: number) => void;
}

const EditMultipleMaterialInExcelTable: React.FC<EditMultipleMaterialInExcelTableProps> = ({ open, onClose, data, index, updateData }) => {
    const [editedData, setEditedData] = useState(data);

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const _handleSave = () => {
        updateData(editedData, index);
        onClose();
    };


    return (

        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Material
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
                    <TextField name="category_name" label="Category Name" value={editedData?.category_name} onChange={_handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="material_name" label="Material Name" value={editedData?.material_name} onChange={_handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="price" label="Price" value={editedData?.price} onChange={_handleChange} fullWidth />

                </Grid>
                <Grid item xs={11}>
                    <TextField name="unit" label="Unit" value={editedData?.unit} onChange={_handleChange} fullWidth />

                </Grid>
            </Grid>
            <div onClick={onClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSave} style={{ backgroundColor: "#EC6208", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>Update</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>Cancel</Button>

            </div>
        </Box>
    );
};

export default EditMultipleMaterialInExcelTable;

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExcelData } from '../../../../../models/AdminMaterialExcelModel';

interface EditMultipleMaterialsInExcelTableProps {
    open: boolean;
    onClose: () => void;
    data: ExcelData;
    index: number;
    updateData: (editedData: ExcelData, index: number) => void;
}

const EditMultipleMaterialsInExcelTable: React.FC<EditMultipleMaterialsInExcelTableProps> = ({ open, onClose, data, index, updateData }) => {
    const [editedData, setEditedData] = useState(data);

    const _handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Parse numeric fields to numbers if necessary
        let parsedValue: string | number = value;
        if (name === 'HS_Code' || name === 'Base_Price') {
            parsedValue = parseFloat(value); // Use parseFloat or parseInt based on your needs
        }

        setEditedData({ ...editedData, [name]: parsedValue });
    };


    const _handleSave = () => {
        updateData(editedData, index);
        onClose();
    };


    return (
        <Box style={{ height: '500px', overflowY: 'auto' }}>
            <Typography variant="h5" align="left">
                Edit Category and Material
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
                    <TextField name="Category_Name" label="Category_Name" value={editedData?.Category_Name} type="text" onChange={_handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="Material_Name" label="Material_Name" value={editedData?.Material_Name} type="text" onChange={_handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="HS_Code" label="HS_Code" value={editedData?.HS_Code} type="number" onChange={_handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="Unit" label="Unit" value={editedData?.Unit} type="text" onChange={_handleChange} fullWidth />
                </Grid>
                <Grid item xs={11}>
                    <TextField name="Base_Price" label="Base_Price" value={editedData?.Base_Price} type="number" onChange={_handleChange} fullWidth />
                </Grid>
            </Grid>
            <div onClick={onClose} style={{ textAlign: "center", alignItems: "center", marginTop: "3rem" }}>
                <Button onClick={_handleSave} style={{ backgroundColor: "#EC6208", width: "60%", borderRadius: "8px", marginLeft: "-10%", marginRight: "10%", color: "#FFFFFF" }}>Update</Button>
                <Button style={{ borderRadius: "8px", border: "1px solid black", color: "black" }}>Cancel</Button>
            </div>
        </Box>
    );
};

export default EditMultipleMaterialsInExcelTable;
